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
    getNoteAndRepost: () => {
      const filter = NostrFactory.createFilter();
      filter.kinds = [EventKind.TextNote, EventKind.Repost];
      return filter;
    },
    getTarget: (pubkey) => {
      const filter = NostrFactory.createFilter();
      filter.kinds = [EventKind.TextNote];
      filter.authors = [pubkey]
      return filter;
    },
    getEventsByIds: (eventIds) => {
      const filter = NostrFactory.createFilter();
      filter.ids = eventIds?.concat();
      filter.kinds = [EventKind.TextNote];
      return filter;
    },
    getEvents: (eventIds) => {
      const filter = NostrFactory.createFilter();
      filter.kinds = [EventKind.TextNote];
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
    sendReplyToRoot: async (cxt, targetEvId, targetPubkey) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.TextNote;
      ev.Content = cxt;
      ev.Tags.push(['e', targetEvId]);
      ev.Tags.push(['p', targetPubkey]);
      return await nostrEvent.Sign(privateKey, ev);
    },
    sendReplyToNoRoot: async (cxt, targetEvId, targetPubkey, replyEvId, replyPubkey) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.TextNote;
      ev.Content = cxt;
      ev.Tags.push(['e', targetEvId, '', 'root']);
      ev.Tags.push(['e', replyEvId, '', 'reply']);
      ev.Tags.push(['p', targetPubkey]);
      ev.Tags.push(['p', replyPubkey]);
      return await nostrEvent.Sign(privateKey, ev);
    },
    getRepostTarget: (pubkey) => {
      const filter = NostrFactory.createFilter();
      filter.kinds = [EventKind.Repost];
      filter.authors = [pubkey]
      return filter;
    },
  }
}
