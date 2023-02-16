import * as secp from "@noble/secp256k1";
import { sha256 as hash } from "@noble/hashes/sha256";
import { bech32 } from "bech32";
import { EventKind } from "nostr/def";

export const sha256 = (str) => {
  return secp.utils.bytesToHex(hash(str));
};

export async function openFile() {
  return new Promise(resolve => {
    const elm = document.createElement("input");
    elm.type = "file";
    elm.onchange = (e) => {
      const elm = e.target;// as HTMLInputElement;
      if (elm.files) {
        resolve(elm.files[0]);
      } else {
        resolve(undefined);
      }
    };
    elm.click();
  });
}


export function parseId(id) {
  const hrp = ["note", "npub", "nsec"];
  try {
    if (hrp.some(a => id.startsWith(a))) {
      return bech32ToHex(id);
    }
  } catch (e) {
    // Ignore the error.
  }
  return id;
}

export function bech32ToHex(str) {
  const nKey = bech32.decode(str);
  const buff = bech32.fromWords(nKey.words);
  return secp.utils.bytesToHex(Uint8Array.from(buff));
}

export function bech32ToText(str) {
  const decoded = bech32.decode(str, 1000);
  const buf = bech32.fromWords(decoded.words);
  return new TextDecoder().decode(Uint8Array.from(buf));
}

export function eventLink(hex) {
  return `/e/${hexToBech32("note", hex)}`;
}

export function hexToBech32(hrp, hex) {
  if (typeof hex !== "string" || hex.length === 0 || hex.length % 2 !== 0) {
    return "";
  }

  try {
    const buf = secp.utils.hexToBytes(hex);
    return bech32.encode(hrp, bech32.toWords(buf));
  } catch (e) {
    console.warn("Invalid hex", hex, e);
    return "";
  }
}

/**
 * Convert hex pubkey to bech32 link url
 * @param {string} hex
 * @returns
 */
export function profileLink(hex) {
  return `/p/${hexToBech32("npub", hex)}`;
}

/**
 * Reaction types
 */
export const Reaction = {
  Positive: "+",
  Negative: "-",
};

/**
 * Return normalized reaction content
 * @param {string} content
 * @returns
 */
export function normalizeReaction(content) {
  switch (content) {
    case "-":
      return Reaction.Negative;
    case "👎":
      return Reaction.Negative;
    default:
      return Reaction.Positive;
  }
}

export function getReactions(notes, id, kind = EventKind.Reaction) {
  return notes?.filter(a => a.kind === kind && a.tags.some(a => a[0] === "e" && a[1] === id)) || [];
}

export function extractLnAddress(lnurl) {
  // some clients incorrectly set this to LNURL service, patch this
  if (lnurl.toLowerCase().startsWith("lnurl")) {
    const url = bech32ToText(lnurl);
    if (url.startsWith("http")) {
      const parsedUri = new URL(url);
      // is lightning address
      if (parsedUri.pathname.startsWith("/.well-known/lnurlp/")) {
        const pathParts = parsedUri.pathname.split("/");
        const username = pathParts[pathParts.length - 1];
        return `${username}@${parsedUri.hostname}`;
      }
    }
  }
  return lnurl;
}

export function unixNow() {
  return Math.floor(new Date().getTime() / 1000);
}

export function debounce(timeout, fn) {
  const t = setTimeout(fn, timeout);
  return () => clearTimeout(t);
}

export function dedupeByPubkey(events) {
  const deduped = events.reduce(
    ({ list, seen }, ev) => {
      if (seen.has(ev.pubkey)) {
        return { list, seen };
      }
      seen.add(ev.pubkey);
      return {
        seen,
        list: [...list, ev],
      };
    },
    { list: [], seen: new Set([]) }
  );
  return deduped.list;
}

export function unwrap(v) {
  if (v === undefined || v === null) {
    throw new Error("missing value");
  }
  return v;
}

export function randomSample(coll, size) {
  const random = [...coll];
  return random.sort(() => (Math.random() >= 0.5 ? 1 : -1)).slice(0, size);
}

export function getNewest(rawNotes) {
  const notes = [...rawNotes];
  notes.sort((a, b) => a.created_at - b.created_at);
  if (notes.length > 0) {
    return notes[0];
  }
}
