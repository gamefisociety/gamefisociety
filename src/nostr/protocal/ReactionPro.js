import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind, NostrList } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useReactionPro = () => {

  const { privateKey, publicKey } = useSelector(s => s.login);

  const nostrEvent = useNostrEvent();

  return {
    get: (pubkey) => {
      const filter = NostrFactory.createFilter();
      filter.kinds = [EventKind.Reaction];
      filter.authors = [pubkey]
      return filter;
    },
    getByIds: (eventIds) => {
      const filter = NostrFactory.createFilter();
      filter.kinds = [EventKind.Reaction];
      filter['#e'] = eventIds?.concat();
      return filter;
    },
    like: async (targetNote) => {
      if (publicKey) {
        const ev = NostrFactory.createEvent(publicKey);
        ev.Kind = EventKind.Reaction;
        ev.Content = '+';
        let newTags = [];
        newTags.push(['e', targetNote.id]);
        newTags.push(['p', targetNote.pubkey]);
        ev.Tags = newTags.concat();
        return await nostrEvent.Sign(privateKey, ev);
      }
    },
  }
}
