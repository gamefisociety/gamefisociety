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
  }
}
