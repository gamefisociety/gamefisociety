import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind, NostrList } from "nostr/def";

const MetadataEvent = () => {

  const privKey = useSelector(s => s.login.privateKey);

  const nostrEvent = useNostrEvent();

  return {
    get: async (pubkey) => {
      if (pubkey) {
        const ev = nostrEvent.Create(pubkey);
        ev.Kind = EventKind.SetMetadata;
        return await nostrEvent.Sign(privKey, ev);
      }
    },
    send: async (pubKey, obj) => {
      if (pubKey) {
        const ev = nostrEvent.Create(pubKey);
        ev.Kind = EventKind.SetMetadata;
        ev.Content = JSON.stringify(obj);
        return await nostrEvent.Sign(privKey, ev);
      }
    },
  }
}

export default MetadataEvent;