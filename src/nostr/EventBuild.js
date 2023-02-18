import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind, NostrList } from "nostr/def";
import Tag from "nostr/Tag";
import { bech32ToHex, unwrap } from "nostr/Util";
import { HashtagRegex } from "nostr/Const";
import useEventClient, { barrierNip07 } from "nostr/EventClient"

const useEventBuild = () => {

  const pubKey = useSelector(s => s.login.publicKey);
  const privKey = useSelector(s => s.login.privateKey);
  const follows = useSelector(s => s.login.follows);
  const relays = useSelector((s) => s.login.relays);
  const hasNip07 = "nostr" in window;
  //
  let EventClient = useEventClient();
  //
  function processContent(ev, msg) {

    const replaceNpub = (match) => {
      const npub = match.slice(1);
      try {
        const hex = bech32ToHex(npub);
        const idx = ev.Tags.length;
        ev.Tags.push(new Tag(["p", hex], idx));
        return `#[${idx}]`;
      } catch (error) {
        return match;
      }
    };
    const replaceNoteId = (match) => {
      try {
        const hex = bech32ToHex(match);
        const idx = ev.Tags.length;
        ev.Tags.push(new Tag(["e", hex, "", "mention"], idx));
        return `#[${idx}]`;
      } catch (error) {
        return match;
      }
    };

    const replaceHashtag = (match) => {
      const tag = match.slice(1);
      const idx = ev.Tags.length;
      ev.Tags.push(new Tag(["t", tag.toLowerCase()], idx));
      return match;
    };
    const content = msg
      .replace(/@npub[a-z0-9]+/g, replaceNpub)
      .replace(/note[a-z0-9]+/g, replaceNoteId)
      .replace(HashtagRegex, replaceHashtag);
    ev.Content = content;
  }

  return {
    nip42Auth: async (challenge, relay) => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.Auth;
        ev.Content = "";
        ev.Tags.push(new Tag(["relay", relay], 0));
        ev.Tags.push(new Tag(["challenge", challenge], 1));
        return await EventClient.signEvent(ev);
      }
    },
    muted: async (keys, priv) => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.PubkeyLists;
        ev.Tags.push(new Tag(["d", NostrList.Muted], ev.Tags.length));
        keys.forEach(p => {
          ev.Tags.push(new Tag(["p", p], ev.Tags.length));
        });
        let content = "";
        if (priv.length > 0) {
          const ps = priv.map(p => ["p", p]);
          const plaintext = JSON.stringify(ps);
          if (hasNip07 && !privKey) {
            content = await barrierNip07(() => window.nostr.nip04.encrypt(pubKey, plaintext));
          } else if (privKey) {
            content = await ev.EncryptData(plaintext, pubKey, privKey);
          }
        }
        ev.Content = content;
        return await EventClient.signEvent(ev);
      }
    },
    pinned: async (notes) => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.NoteLists;
        ev.Tags.push(new Tag(["d", NostrList.Pinned], ev.Tags.length));
        notes.forEach(n => {
          ev.Tags.push(new Tag(["e", n], ev.Tags.length));
        });
        ev.Content = "";
        return await EventClient.signEvent(ev);
      }
    },
    bookmarked: async (notes) => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.NoteLists;
        ev.Tags.push(new Tag(["d", NostrList.Bookmarked], ev.Tags.length));
        notes.forEach(n => {
          ev.Tags.push(new Tag(["e", n], ev.Tags.length));
        });
        ev.Content = "";
        return await EventClient.signEvent(ev);
      }
    },
    tags: async (tags) => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.TagLists;
        ev.Tags.push(new Tag(["d", NostrList.Followed], ev.Tags.length));
        tags.forEach(t => {
          ev.Tags.push(new Tag(["t", t], ev.Tags.length));
        });
        ev.Content = "";
        return await EventClient.signEvent(ev);
      }
    },
    metadata: async (obj) => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.SetMetadata;
        ev.Content = JSON.stringify(obj);
        // console.log('metadata ev', ev);
        return await EventClient.signEvent(ev);
      }
    },
    note: async (msg) => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.TextNote;
        processContent(ev, msg);
        return await EventClient.signEvent(ev);
      }
    },
    zap: async (author, note, msg) => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.ZapRequest;
        if (note) {
          ev.Tags.push(new Tag(["e", note], ev.Tags.length));
        }
        ev.Tags.push(new Tag(["p", author], ev.Tags.length));
        const relayTag = ["relays", ...Object.keys(relays).slice(0, 10)];
        ev.Tags.push(new Tag(relayTag, ev.Tags.length));
        processContent(ev, msg || "");
        return await EventClient.signEvent(ev);
      }
    },
    reply: async (replyTo, msg) => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.TextNote;

        const thread = replyTo.Thread;
        if (thread) {
          if (thread.Root || thread.ReplyTo) {
            ev.Tags.push(new Tag(["e", thread.Root?.Event ?? thread.ReplyTo?.Event ?? "", "", "root"], ev.Tags.length));
          }
          ev.Tags.push(new Tag(["e", replyTo.Id, "", "reply"], ev.Tags.length));

          // dont tag self in replies
          if (replyTo.PubKey !== pubKey) {
            ev.Tags.push(new Tag(["p", replyTo.PubKey], ev.Tags.length));
          }

          for (const pk of thread.PubKeys) {
            if (pk === pubKey) {
              continue; // dont tag self in replies
            }
            ev.Tags.push(new Tag(["p", pk], ev.Tags.length));
          }
        } else {
          ev.Tags.push(new Tag(["e", replyTo.Id, "", "reply"], 0));
          // dont tag self in replies
          if (replyTo.PubKey !== pubKey) {
            ev.Tags.push(new Tag(["p", replyTo.PubKey], ev.Tags.length));
          }
        }
        processContent(ev, msg);
        return await EventClient.signEvent(ev);
      }
    },
    react: async (evRef, content = "+") => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.Reaction;
        ev.Content = content;
        ev.Tags.push(new Tag(["e", evRef.Id], 0));
        ev.Tags.push(new Tag(["p", evRef.PubKey], 1));
        return await EventClient.signEvent(ev);
      }
    },
    saveRelays: async () => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.ContactList;
        ev.Content = JSON.stringify(relays);
        for (const pk of follows) {
          ev.Tags.push(new Tag(["p", pk], ev.Tags.length));
        }

        return await EventClient.signEvent(ev);
      }
    },
    saveRelaysSettings: async () => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.Relays;
        ev.Content = "";
        for (const [url, settings] of Object.entries(relays)) {
          const rTag = ["r", url];
          if (settings.read && !settings.write) {
            rTag.push("read");
          }
          if (settings.write && !settings.read) {
            rTag.push("write");
          }
          ev.Tags.push(new Tag(rTag, ev.Tags.length));
        }
        return await EventClient.signEvent(ev);
      }
    },
    addFollow: async (pkAdd, newRelays) => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.ContactList;
        ev.Content = JSON.stringify(newRelays ?? relays);
        const temp = new Set(follows);
        if (Array.isArray(pkAdd)) {
          pkAdd.forEach(a => temp.add(a));
        } else {
          temp.add(pkAdd);
        }
        for (const pk of temp) {
          if (pk.length !== 64) {
            continue;
          }
          ev.Tags.push(new Tag(["p", pk], ev.Tags.length));
        }

        return await EventClient.signEvent(ev);
      }
    },
    removeFollow: async (pkRemove) => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.ContactList;
        ev.Content = JSON.stringify(relays);
        for (const pk of follows) {
          if (pk === pkRemove || pk.length !== 64) {
            continue;
          }
          ev.Tags.push(new Tag(["p", pk], ev.Tags.length));
        }

        return await EventClient.signEvent(ev);
      }
    },
    /**
     * Delete an event (NIP-09)
     */
    delete: async (id) => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.Deletion;
        ev.Content = "";
        ev.Tags.push(new Tag(["e", id], 0));
        return await EventClient.signEvent(ev);
      }
    },
    /**
     * Repost a note (NIP-18)
     */
    repost: async (note) => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.Repost;
        ev.Content = JSON.stringify(note.Original);
        ev.Tags.push(new Tag(["e", note.Id], 0));
        ev.Tags.push(new Tag(["p", note.PubKey], 1));
        return await EventClient.signEvent(ev);
      }
    },
    decryptDm: async (note) => {
      if (pubKey) {
        if (note.PubKey !== pubKey && !note.Tags.some(a => a.PubKey === pubKey)) {
          return "<CANT DECRYPT>";
        }
        try {
          const otherPubKey =
            note.PubKey === pubKey ? unwrap(note.Tags.filter(a => a.Key === "p")[0].PubKey) : note.PubKey;
          if (hasNip07 && !privKey) {
            return await barrierNip07(() => window.nostr.nip04.decrypt(otherPubKey, note.Content));
          } else if (privKey) {
            await note.DecryptDm(privKey, otherPubKey);
            return note.Content;
          }
        } catch (e) {
          console.error("Decryption failed", e);
          return "<DECRYPTION FAILED>";
        }
      }
    },
    sendDm: async (content, to) => {
      if (pubKey) {
        const ev = useNostrEvent.Create(pubKey);
        ev.Kind = EventKind.DirectMessage;
        ev.Content = content;
        ev.Tags.push(new Tag(["p", to], 0));

        try {
          if (hasNip07 && !privKey) {
            const cx = await barrierNip07(() => window.nostr.nip04.encrypt(to, content));
            ev.Content = cx;
            return await EventClient.signEvent(ev);
          } else if (privKey) {
            await ev.EncryptDmForPubkey(to, privKey);
            return await EventClient.signEvent(ev);
          }
        } catch (e) {
          console.error("Encryption failed", e);
        }
      }
    },
  };
}


export default useEventBuild;