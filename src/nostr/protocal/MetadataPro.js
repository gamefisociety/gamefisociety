import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind, NostrList } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useMetadataPro = () => {

  const privKey = useSelector(s => s.login.privateKey);

  const nostrEvent = useNostrEvent();

  return {
    get: (pubkey) => {
      if (pubkey) {
        const sub = NostrFactory.createSub();
        sub.Id = `profiles:${sub.Id.slice(0, 8)}`;
        sub.Kinds = [EventKind.SetMetadata];
        sub.Authors = [pubkey];
        return sub;
      }
    },
    send: async (pubKey, obj, tmpPrivate) => {
      if (pubKey) {
        const ev = NostrFactory.createEvent(pubKey);
        ev.Kind = EventKind.SetMetadata;
        ev.Content = JSON.stringify(obj);
        if (tmpPrivate) {
          return await nostrEvent.Sign(tmpPrivate, ev);
        }
        return await nostrEvent.Sign(privKey, ev);
      }
    },
  }
}
