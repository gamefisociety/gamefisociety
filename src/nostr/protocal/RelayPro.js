import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useRelayPro = () => {

  const { privateKey, publicKey } = useSelector(s => s.login);
  const { follows, relays } = useSelector(s => s.profile);

  const nostrEvent = useNostrEvent();

  return {
    get: (pubkey) => {
      if (pubkey) {
        const filter = NostrFactory.createFilter();
        filter['kinds'] = [EventKind.Relays];
        // filter['#p'] = [pubkey];
        // filter['authors'] = [pubkey];
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
    syncRelayKind3: async (paramRelays) => {
      const ev = NostrFactory.createEvent(publicKey);
      ev.Kind = EventKind.ContactList;
      let tmp_relays = {};
      paramRelays.map((relayInfo) => {
        if (relayInfo.addr.startsWith('wss://')) {
          tmp_relays[relayInfo.addr] = {
            read: relayInfo.read,
            write: relayInfo.write,
          }
        }
      });
      ev.Content = JSON.stringify(tmp_relays);
      follows.map(item => {
        ev.Tags.push(['p', item]);
      });
      return await nostrEvent.Sign(privateKey, ev);
    },
  }
}
