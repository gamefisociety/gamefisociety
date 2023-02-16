import * as secp from '@noble/secp256k1';
import * as base64 from "@protobufjs/base64";
import { EventKind } from "nostr/def";
import Tag from "nostr/Tag";

export default class Event {

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
}

/**
 * Create a new event for a specific pubkey
 */
const ForPubKey = (pubKey) => {
  const ev = new Event();
  ev.PubKey = pubKey;
  return ev;
}

const CreateId = async (ev) => {
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
const Verify = async (event) => {
  event.id = await CreateId(event);
  const result = await secp.schnorr.verify(this.Signature, id, this.PubKey);
  return result;
}

/**
 * key : HexKey string
 * Sign this message with a private key
 */
const Sign = async (key, event) => {
  event.Id = await this.CreateId();
  const sig = await secp.schnorr.sign(this.Id, key);
  event.Signature = secp.utils.bytesToHex(sig);
  if (!(await Verify(event))) {
    throw "Signing failed";
  }
}

/**
 * Encrypt the given message content
 * content : string
 * pubkey : string
 * privkey : string
 */
const EncryptData = async (content, pubkey, privkey) => {
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
const EncryptDmForPubkey = async (ev, pubkey, privkey) => {
  ev.Content = await this.EncryptData(ev.Content, pubkey, privkey);
}

const _GetDmSharedKey = async (pubkey, privkey) => {
  const sharedPoint = secp.getSharedSecret(privkey, "02" + pubkey);
  const sharedX = sharedPoint.slice(1, 33);
  return await window.crypto.subtle.importKey("raw", sharedX, { name: "AES-CBC" }, false, ["encrypt", "decrypt"]);
}

/**
 * Decrypt the content of the message
 */
const DecryptData = async (cyphertext, privkey, pubkey) => {
  const key = await _GetDmSharedKey(pubkey, privkey);
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
const DecryptDm = async (ev, privkey, pubkey) => {
  ev.Content = await DecryptData(ev.Content, privkey, pubkey);
}