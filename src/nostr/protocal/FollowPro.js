import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useFollowPro = () => {

  const { privateKey, publicKey } = useSelector(s => s.login);
  const { follows, relays } = useSelector(s => s.profile);


  const nostrEvent = useNostrEvent();

  return {
    get: (pubkey) => {
      if (pubkey) {
        const sub = NostrFactory.createSub();
        sub.Id = `follow:${sub.Id.slice(0, 8)}`;
        sub.Kinds = [EventKind.ContactList];
        sub.PTags = [pubkey];
        sub.Authors = [pubkey];
        return sub;
      }
    },
    addFollow: async (newFollows) => {
      if (Array.isArray(newFollows) === false) {
        return;
      }
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.ContactList
      ev.Content = JSON.stringify({ ...relays });
      let newTags = follows.concat(newFollows);
      newTags.map(item => {
        ev.Tags.push(['p', item]);
      });
      return await nostrEvent.Sign(privateKey, ev);
    },
    removeFollow: async (newFollows) => {
      if (Array.isArray(newFollows) === false) {
        return;
      }
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.ContactList
      ev.Content = JSON.stringify({ ...relays });
      newFollows.map((item) => {
        follows.remove(item);
      });
      return await nostrEvent.Sign(privateKey, ev);
    },
  }
}
