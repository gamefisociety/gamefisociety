import useNostrEvent from "nostr/NostrEvent";
import { EventKind, NostrList } from "nostr/def";
import Tag from "nostr/Tag";
import { bech32ToHex, unwrap } from "nostr/Util";
import { HashtagRegex } from "nostr/Const";
import NostrEvent from 'nostr/NostrEvent';

const MetadataEvent = () => {
  const nostrEvent = useNostrEvent();
  return {
    get: (pubkey) => {
      if (pubkey) {
        const ev = nostrEvent.Create(pubkey);
        ev.Kind = EventKind.SetMetadata;
        return ev;
      }
    },
    send: async (pubKey, obj) => {
      if (pubKey) {
        const ev = nostrEvent.Create(pubKey);
        ev.Kind = EventKind.SetMetadata;
        ev.Content = JSON.stringify(obj);
        return await NostrEvent.signEvent(ev);
      }
    },
  }
}

export default MetadataEvent;