import * as secp from '@noble/secp256k1';
import * as base64 from "@protobufjs/base64";
import { EventKind } from "nostr/def";
import Tag from "nostr/Tag";

export default class NostrEvent {

  constructor(rewEv) {
    this.Original = rewEv ?? null;
    this.Id = rewEv?.id ?? "";
    this.PubKey = rewEv?.pubkey ?? "";
    this.CreatedAt = rewEv?.created_at ?? Math.floor(new Date().getTime() / 1000);
    this.Kind = rewEv?.kind ?? EventKind.Unknown;
    this.Tags = rewEv?.tags.map((a, i) => new Tag(a, i)) ?? [];
    this.Content = rewEv?.content ?? "";
    this.Signature = rewEv?.sig ?? "";
    // this.Thread = Thread.ExtractThread(this);
  }

  static Create(pubKey) {
    const ev = new NostrEvent();
    ev.PubKey = pubKey;
    return ev;
  }

  get RootPubKey() {
    const delegation = this.Tags.find(a => a.Key === "delegation");
    if (delegation?.PubKey) {
      return delegation.PubKey;
    }
    return this.PubKey;
  }

  ToObject() {
    //RawEvent
    return {
      id: this.Id,
      pubkey: this.PubKey,
      created_at: this.CreatedAt,
      kind: this.Kind,
      tags: this.Tags.sort((a, b) => a.Index - b.Index)
        .map(a => a.ToObject())
        .filter(a => a !== null), //<string[][] >
      content: this.Content,
      sig: this.Signature,
    };
  }

  async CreateId() {
    const payload = [
      0,
      this.PubKey,
      this.CreatedAt,
      this.Kind,
      this.Tags.map(a => a.ToObject()).filter(a => a !== null),
      this.Content,
    ];
    const payloadData = new TextEncoder().encode(JSON.stringify(payload));
    const data = await secp.utils.sha256(payloadData);
    const hash = secp.utils.bytesToHex(data);
    if (this.Id !== "" && hash !== this.Id) {
      console.debug(payload);
      throw "ID doesnt match!";
    }
    return hash;
  }

  /**
   * Check the signature of this message
   * @returns True if valid signature
   */
  async Verify(event) {
    const tmpId = await this.CreateId();
    const result = await secp.schnorr.verify(this.Signature, tmpId, this.PubKey);
    return result;
  }

  async Sign(key) {
    this.Id = await this.CreateId();
    const sig = await secp.schnorr.sign(this.Id, key);
    this.Signature = secp.utils.bytesToHex(sig);
    if (!(await this.Verify(this))) {
      throw "Signing failed";
    }
    // console.log('event self sign',this);
  }

  async EncryptData(content, pubkey, privkey) {
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
  }

  /**
   * Encrypt the message content in place
   */
  async EncryptDmForPubkey(ev, pubkey, privkey) {
    ev.Content = await this.EncryptData(ev.Content, pubkey, privkey);
  }

  async _GetDmSharedKey(pubkey, privkey) {
    const sharedPoint = secp.getSharedSecret(privkey, "02" + pubkey);
    const sharedX = sharedPoint.slice(1, 33);
    return await window.crypto.subtle.importKey("raw", sharedX, { name: "AES-CBC" }, false, ["encrypt", "decrypt"]);
  }

  /**
   * Decrypt the content of the message
   */
  async DecryptData(cyphertext, privkey, pubkey) {
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
  }

  /**
   * Decrypt the content of this message in place
   */
  async DecryptDm(ev, privkey, pubkey) {
    ev.Content = await this.DecryptData(ev.Content, privkey, pubkey);
  }

}