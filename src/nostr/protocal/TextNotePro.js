import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind, NostrList } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useTextNotePro = () => {

  const { publicKey, privateKey } = useSelector(s => s.login);

  const nostrEvent = useNostrEvent();

  return {
    get: () => {
      const filter = NostrFactory.createFilter();
      filter.kinds = [EventKind.TextNote];
      return filter;
    },
    getEvents: (eventIds) => {
      const filter = NostrFactory.createFilter();
      filter.kinds = [EventKind.TextNote];
      // filter.ids = eventIds.concat();
      filter['#e'] = eventIds?.concat();
      return filter;
    },
    sendPost: async (cxt) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.TextNote;
      ev.Content = cxt;
      console.log('send post env', ev);
      return await nostrEvent.Sign(privateKey, ev);

    },
    sendReplay: async (cxt, targetEvId, targetPubkey) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.TextNote;
      ev.Content = cxt;
      ev.Tags.push(['e', targetEvId]);
      ev.Tags.push(['p', targetPubkey]);
      return await nostrEvent.Sign(privateKey, ev);

    },
  }
}
