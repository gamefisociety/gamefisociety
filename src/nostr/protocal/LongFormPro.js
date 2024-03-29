import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useLongFormPro = () => {

  const { privateKey, publicKey } = useSelector(s => s.login);
  const nostrEvent = useNostrEvent();

  return {
    getGlobal: () => {
      const filter = NostrFactory.createFilter();
      filter['kinds'] = [EventKind.LongForm];
      return filter;
    },
    getLongForm: (pubkey) => {
      if (pubkey) {
        const filter = NostrFactory.createFilter();
        filter['kinds'] = [EventKind.LongForm];
        filter['authors'] = [pubkey];
        return filter;
      }
    },
    sendLongForm: async (tags, content) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.LongForm;
      ev.Content = content;
      for (let [key, v] of tags) {
        ev.Tags.push([key, v]);
      }
      return await nostrEvent.Sign(privateKey, ev);
    },
    getNFT: (pubkey, subject) => {
      if (pubkey) {
        const filter = NostrFactory.createFilter();
        filter['kinds'] = [EventKind.LongForm];
        if (subject && subject !== '') {
          filter['#d'] = [subject];
        }
        filter['app'] = ['gfs-nft'];
        return filter;
      }
    },
    sendNFT: async (tags, content) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.LongForm;
      ev.Content = content;
      for (let [key, v] of tags) {
        ev.Tags.push([key, v]);
      }
      ev.Tags.push(['app', 'gfs-nft']);
      return await nostrEvent.Sign(privateKey, ev);
    },
  }
}
