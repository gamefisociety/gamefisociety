import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useFollowPro = () => {

  const { privateKey, publicKey } = useSelector(s => s.login);
  const { follows, relays } = useSelector(s => s.profile);
  const nostrEvent = useNostrEvent();

  return {
    getFollows: (pubkey) => {
      if (pubkey) {
        const filter = NostrFactory.createFilter();
        filter['kinds'] = [EventKind.ContactList];
        filter['authors'] = [pubkey];
        return filter;
      }
    },
    getFollowings: (pubkey) => {
      if (pubkey) {
        const filter = NostrFactory.createFilter();
        filter['kinds'] = [EventKind.ContactList];
        filter['#p'] = [pubkey];
        return filter;
      }
    },
    addFollow: async (newFollow) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.ContactList
      ev.Content = JSON.stringify({ ...relays });
      let newTags = follows.concat();
      newTags.push(newFollow);
      newTags.map(item => {
        ev.Tags.push(['p', item]);
      });
      return await nostrEvent.Sign(privateKey, ev);
    },
    removeFollow: async (newFollow) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.ContactList
      ev.Content = JSON.stringify({ ...relays });
      follows.map(item => {
        if (item !== newFollow) {
          ev.Tags.push(['p', item]);
        }
      });
      return await nostrEvent.Sign(privateKey, ev);
    },
  }
}
