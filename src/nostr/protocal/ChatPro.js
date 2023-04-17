import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useChatPro = () => {

  const { publicKey, privateKey } = useSelector(s => s.login);

  const nostrEvent = useNostrEvent();

  return {
    getMyDM: () => {
      const filter = NostrFactory.createFilter();
      filter['kinds'] = [EventKind.DirectMessage];
      filter['#p'] = [publicKey];
      return filter;
    },
    getMyOtherDM: () => {
      const filter = NostrFactory.createFilter();
      filter['kinds'] = [EventKind.DirectMessage];
      filter['authors'] = [publicKey];
      return filter;
    },
    getDM: (targetPubkey) => {
      const filter = NostrFactory.createFilter();
      filter['kinds'] = [EventKind.DirectMessage];
      filter['authors'] = [publicKey,targetPubkey];
      filter['#p'] = [publicKey, targetPubkey];
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
    getChannel: () => {
      const filter = NostrFactory.createFilter();
      filter['kinds'] = [EventKind.ChannelCreate];
      filter['authors'] = [publicKey];
      return filter;
    },
    getChannelById: (channelId) => {
      const filter = NostrFactory.createFilter();
      filter['ids'] = [channelId];
      filter['kinds'] = [EventKind.ChannelCreate];
      return filter;
    },
    getChannelMessage: (chanIds) => {
      const filter = NostrFactory.createFilter();
      filter['kinds'] = [EventKind.ChannelMessage];
      filter['#e'] = chanIds.concat();
      return filter;
    },
    createChannel: async (content) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.ChannelCreate;
      ev.PubKey = publicKey;
      ev.Content = content;
      return await nostrEvent.Sign(privateKey, ev);
    },
    sendChannelMetadata: async (content, rootEv) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.ChannelSet;
      ev.PubKey = publicKey;
      ev.Tags.push(['e', rootEv.id, '']);
      ev.Content = content;
      return await nostrEvent.Sign(privateKey, ev);
    },
    sendChannelMessge: async (content, rootEv) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.ChannelMessage;
      ev.PubKey = publicKey;
      ev.Content = content;
      ev.Tags.push(['e', rootEv.id, '', 'root']);
      // ev.Tags.push(['e', ev.Id, '', 'reply']);
      // ev.Tags.push(['p', publicKey]);
      return await nostrEvent.Sign(privateKey, ev);
    },
    sendReplyChannelMessge: async (content, rootEv, targetEv) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.ChannelMessage;
      ev.PubKey = publicKey;
      ev.Content = content;
      ev.Tags.push(['e', rootEv.id, '', 'root']);
      ev.Tags.push(['e', targetEv.Id, '', 'reply']);
      ev.Tags.push(['p', targetEv.publicKey]);
      return await nostrEvent.Sign(privateKey, ev);
    },
    hideChannelMessge: async (reason, evId) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.ChannelHideMessage;
      ev.PubKey = publicKey;
      ev.Tags.push(['e', evId]);
      ev.Content = JSON.stringify({ 'reason': reason });;
      // await nostrEvent.EncryptDm(ev, targetPubkey, privateKey);
      return await nostrEvent.Sign(privateKey, ev);
    },
    muteChannelUser: async (reason, targetPubkey) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.ChannelMuteUser;
      ev.PubKey = publicKey;
      ev.Tags.push(['p', targetPubkey]);
      ev.Content = JSON.stringify({ 'reason': reason });
      return await nostrEvent.Sign(privateKey, ev);
    },
  }
}
