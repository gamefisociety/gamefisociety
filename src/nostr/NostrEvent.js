import * as secp from '@noble/secp256k1';
import * as base64 from "@protobufjs/base64";
import NostrFactory from 'nostr/NostrFactory';

const useNostrEvent = () => {

  return {
    Create: (pubKey) => {
      return NostrFactory.createEvent(pubKey);
    },

    CreateId: async (ev) => {
      const payload = [
        0,
        ev.PubKey,
        ev.CreatedAt,
        ev.Kind,
        ev.Tags.map(a => a.ToObject()).filter(a => a !== null),
        ev.Content,
      ];
      const payloadData = new TextEncoder().encode(JSON.stringify(payload));
      const data = await secp.utils.sha256(payloadData);
      const hash = secp.utils.bytesToHex(data);
      if (ev.Id !== "" && hash !== ev.Id) {
        console.debug(payload);
        throw "ID doesnt match!";
      }
      return hash;
    },

    Verify: async (ev) => {
      const tmpId = await this.CreateId(ev);
      const result = await secp.schnorr.verify(ev.Signature, tmpId, ev.PubKey);
      return result;
    },

    Sign: async (key, ev) => {
      ev.Id = await this.CreateId(ev);
      const sig = await secp.schnorr.sign(ev.Id, key);
      ev.Signature = secp.utils.bytesToHex(sig);
      if (!(await this.Verify(ev))) {
        throw "Signing failed";
      }
      console.log('event self sign',this);
    },

    EncryptData: async (content, pubkey, privkey) => {
      const key = await this._GetDmSharedKey(pubkey, privkey);
      const iv = window.crypto.getRandomValues(new Uint8Array(16));
      const data = new TextEncoder().encode(content);
      const result = await window.crypto.subtle.encrypt(
        {
          name: "AES-CBC",
          iv: iv,
        },
        key,
        data
      );
      const uData = new Uint8Array(result);
      return `${base64.encode(uData, 0, result.byteLength)}?iv=${base64.encode(iv, 0, 16)}`;
    },

    EncryptDmForPubkey: async (ev, pubkey, privkey) => {
      ev.Content = await this.EncryptData(ev.Content, pubkey, privkey);
    },

    _GetDmSharedKey: async (pubkey, privkey) => {
      const sharedPoint = secp.getSharedSecret(privkey, "02" + pubkey);
      const sharedX = sharedPoint.slice(1, 33);
      return await window.crypto.subtle.importKey("raw", sharedX, { name: "AES-CBC" }, false, ["encrypt", "decrypt"]);
    },

    DecryptData: async (cyphertext, privkey, pubkey) => {
      const key = await this._GetDmSharedKey(pubkey, privkey);
      const cSplit = cyphertext.split("?iv=");
      const data = new Uint8Array(base64.length(cSplit[0]));
      base64.decode(cSplit[0], data, 0);
      const iv = new Uint8Array(base64.length(cSplit[1]));
      base64.decode(cSplit[1], iv, 0);
      const result = await window.crypto.subtle.decrypt(
        {
          name: "AES-CBC",
          iv: iv,
        },
        key,
        data
      );
      return new TextDecoder().decode(result);
    },

    /**
     * Decrypt the content of this message in place
     */
    DecryptDm: async (ev, privkey, pubkey) => {
      ev.Content = await this.DecryptData(ev.Content, privkey, pubkey);
    },

    //
    parse: (rawEv) => {
      return {
        id: rawEv.Id,
        pubkey: rawEv.PubKey,
        created_at: rawEv.CreatedAt,
        kind: rawEv.Kind,
        tags: rawEv.Tags.sort((a, b) => a.Index - b.Index)
          .map(a => a.ToObject())
          .filter(a => a !== null), //<string[][] >
        content: rawEv.Content,
        sig: rawEv.Signature,
      };
    }
  }

};

export default useNostrEvent;

  // constructor(rewEv) {
  //   this.Original = rewEv ?? null;
  //   this.Id = rewEv?.id ?? "";
  //   this.PubKey = rewEv?.pubkey ?? "";
  //   this.CreatedAt = rewEv?.created_at ?? Math.floor(new Date().getTime() / 1000);
  //   this.Kind = rewEv?.kind ?? EventKind.Unknown;
  //   this.Tags = rewEv?.tags.map((a, i) => new Tag(a, i)) ?? [];
  //   this.Content = rewEv?.content ?? "";
  //   this.Signature = rewEv?.sig ?? "";
  // }

  // static Create(pubKey) {
  //   const ev = new NostrEvent();
  //   ev.PubKey = pubKey;
  //   return ev;
  // }

  // get RootPubKey() {
  //   const delegation = this.Tags.find(a => a.Key === "delegation");
  //   if (delegation?.PubKey) {
  //     return delegation.PubKey;
  //   }
  //   return this.PubKey;
  // }