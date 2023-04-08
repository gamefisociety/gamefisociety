import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind, NostrList } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useRepostPro = () => {

  const { privateKey, publicKey } = useSelector(s => s.login);

  const nostrEvent = useNostrEvent();

  return {
    get: (pubkey) => {
      const filter = NostrFactory.createFilter();
      filter.kinds = [EventKind.Repost];
      filter.authors = [pubkey]
      return filter;
    },
    // create: async (pubKey, priKey, obj) => {
    //   if (pubKey) {
    //     const ev = NostrFactory.createEvent(pubKey);
    //     ev.Kind = EventKind.SetMetadata;
    //     ev.Content = JSON.stringify(obj);
    //     return await nostrEvent.Sign(priKey, ev);
    //   }
    // },
    // modify: async (obj) => {
    //   const ev = NostrFactory.createEvent(publicKey);
    //   ev.Kind = EventKind.SetMetadata;
    //   ev.Content = JSON.stringify(obj);
    //   return await nostrEvent.Sign(privateKey, ev);
    // },
  }
}
