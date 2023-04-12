import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useDelPro = () => {

  const { publicKey, privateKey } = useSelector(s => s.login);

  const nostrEvent = useNostrEvent();

  return {
    getDel: (pubkey) => {
      if (pubkey) {
        const filter = NostrFactory.createFilter();
        filter['kinds'] = [EventKind.Deletion];
        filter['authors'] = [pubkey];
        return filter;
      }
    },
    sendDel: async (eventIds, reason) => {
      if (!eventIds || !Array.isArray(eventIds)) {
        return null
      }
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.Deletion;
      ev.PubKey = publicKey;
      eventIds.map((id) => {
        ev.Tags.push(['e', id]);
      });
      ev.Content = reason;
      return await nostrEvent.Sign(privateKey, ev);
    },
  }
}
