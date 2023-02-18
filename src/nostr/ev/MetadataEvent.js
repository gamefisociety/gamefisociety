import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind, NostrList } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

const MetadataEvent = () => {

  const privKey = useSelector(s => s.login.privateKey);

  const nostrEvent = useNostrEvent();

  return {
    get: async (pubkey) => {
      if (pubkey) {
        const sub = NostrFactory.createSub();
        sub.Id = `profiles:${sub.Id.slice(0, 8)}`;
        sub.Kinds = [EventKind.SetMetadata];
        sub.Authors = [pubkey];
        return sub;
      }
    },
    send: async (pubKey, obj) => {
      if (pubKey) {
        const ev = NostrFactory.createEvent(pubKey);
        ev.Kind = EventKind.SetMetadata;
        ev.Content = JSON.stringify(obj);
        return await nostrEvent.Sign(privKey, ev);
      }
    },
  }
}

export default MetadataEvent;