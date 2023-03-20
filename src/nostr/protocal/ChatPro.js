import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useChatPro = () => {

  const { publicKey, privateKey } = useSelector(s => s.login);

  const nostrEvent = useNostrEvent();

  return {
    getDM: (targetPubkey) => {
      const filter = NostrFactory.createFilter();
      filter['kinds'] = [EventKind.DirectMessage];
      filter['#p'] = [publicKey, targetPubkey];
      // filter['authors'] = [publicKey, targetPubkey];
      return filter;
    },
    sendDM: async (targetPubkey, content) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.DirectMessage;
      ev.PubKey = publicKey;
      ev.Tags.push(['p', targetPubkey]);
      ev.Content = content;
      await nostrEvent.EncryptDm(ev, targetPubkey, privateKey);
      return await nostrEvent.Sign(privateKey, ev);
    },
    createChannel: async (content) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.DirectMessage;
      ev.PubKey = publicKey;
      // ev.Tags.push(['p', targetPubkey]);
      ev.Content = content;
      // await nostrEvent.EncryptDm(ev, targetPubkey, privateKey);
      return await nostrEvent.Sign(privateKey, ev);
    },
  }
}
