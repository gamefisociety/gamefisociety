import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useChatPro = () => {

  const privKey = useSelector(s => s.login.privateKey);

  const nostrEvent = useNostrEvent();

  return {
    get: (pubkey, targetpubkey) => {
      if (pubkey) {
        const sub = NostrFactory.createSub();
        sub.Id = `chat:${sub.Id.slice(0, 8)}`;
        sub.Kinds = [EventKind.DirectMessage];
        sub.Authors = [pubkey, targetpubkey];
        sub.PTags = [targetpubkey, pubkey]
        return sub;
      }
    },
    send: async (pubkey, targetpubkey, tmpPrivate, content) => {
      if (pubkey) {
        const ev = NostrFactory.createEvent(pubkey);
        ev.Kind = EventKind.DirectMessage;
        ev.PubKey = pubkey;
        ev.Tags = [["p", targetpubkey]];
        ev.Content = content;
        if (tmpPrivate) {
          await nostrEvent.EncryptDm(ev, pubkey, tmpPrivate);
          return await nostrEvent.Sign(tmpPrivate, ev);
        }
        await nostrEvent.EncryptDm(ev, pubkey, privKey);
        return await nostrEvent.Sign(privKey, ev);
      }
    },
  }
}
