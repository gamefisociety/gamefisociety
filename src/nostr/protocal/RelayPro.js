import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useRelayPro = () => {

  const { privateKey, publicKey } = useSelector(s => s.login);
  const { relays } = useSelector(s => s.profile);

  const nostrEvent = useNostrEvent();

  return {
    get: (pubkey) => {
      if (pubkey) {
        const filter = NostrFactory.createFilter();
        filter['kinds'] = [EventKind.ContactList];
        filter['#p'] = [pubkey];
        filter['authors'] = [pubkey];
        return filter;
      }
    },
    send: async (pubKey, obj, tmpPrivate) => {
      if (publicKey) {
        const ev = NostrFactory.createEvent(publicKey);
        ev.Kind = EventKind.ContactList;
        ev.Content = JSON.stringify(obj);
        if (tmpPrivate) {
          return await nostrEvent.Sign(tmpPrivate, ev);
        }
        return await nostrEvent.Sign(privateKey, ev);
      }
    },
    addRelay: async (newRelays) => {
      if (publicKey) {
        //relays
        const ev = NostrFactory.createEvent(publicKey);
        ev.Kind = EventKind.ContactList;
        ev.Content = JSON.stringify(relays);
        return await nostrEvent.Sign(privateKey, ev);
      }
    },
    removeRelay: async (delRelays) => {
      if (publicKey) {
        //relays
        const ev = NostrFactory.createEvent(publicKey);
        ev.Kind = EventKind.ContactList;
        ev.Content = JSON.stringify(relays);
        return await nostrEvent.Sign(privateKey, ev);
      }
    },
  }
}
