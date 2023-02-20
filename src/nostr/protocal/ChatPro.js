import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useChatPro = () => {

  const privKey = useSelector(s => s.login.privateKey);

  const nostrEvent = useNostrEvent();

  return {
    get: async (pubkey, targetpubkey) => {
      if (pubkey) {
        const sub = NostrFactory.createSub();
        sub.Id = `chat:${sub.Id.slice(0, 8)}`;
        sub.Kinds = [EventKind.DirectMessage];
        sub.Authors = [pubkey, targetpubkey];
        sub.PTags = [pubkey, targetpubkey]
        return sub;
      }
    },
    send: async (pubKey, obj, tmpPrivate) => {
      if (pubKey) {
        const ev = NostrFactory.createEvent(pubKey);
        ev.Kind = EventKind.ContactList;
        ev.Content = JSON.stringify(obj);
        if (tmpPrivate) {
          return await nostrEvent.Sign(tmpPrivate, ev);
        }
        return await nostrEvent.Sign(privKey, ev);
      }
    },
  }
}
