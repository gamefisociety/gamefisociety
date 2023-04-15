import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';


export const useZapPro = () => {

  const { publicKey, privateKey } = useSelector(s => s.login);

  const nostrEvent = useNostrEvent();

  return {
    sendZap: async (content, rootEv) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.ZapNode;
      ev.PubKey = publicKey;
      ev.Content = content;
      ev.Tags.push(['e', rootEv.id]);
      ev.Tags.push(['p', rootEv.pubKey]);
      ev.Tags.push(['relays', ...rootEv.relays]);
      return await nostrEvent.Sign(privateKey, ev);
    },


  }
}
