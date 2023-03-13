import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind, NostrList } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useTextNotePro = () => {

  const privKey = useSelector(s => s.login.privateKey);

  const nostrEvent = useNostrEvent();

  return {
    get: () => {
      const filter = NostrFactory.createFilter();
      filter.kinds = [EventKind.TextNote];
      return filter;
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
    getEvents: (eventIds) => {
      const filter = NostrFactory.createFilter();
      filter.kinds = [EventKind.TextNote];
      // filter.ids = eventIds.concat();
      filter['#e'] = eventIds.concat();
      return filter;
    },
  }
}
