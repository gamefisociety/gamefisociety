import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind, ReportingType } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useReportPro = () => {

  const { privateKey, publicKey } = useSelector(s => s.login);
  const nostrEvent = useNostrEvent();

  return {

    reportUser: async (pubkey, type, content, victimPubkey="") => {
      if(type === ReportingType.IMPERSONATION && victimPubkey.length === 0){
        return;
      }
      if (pubkey && publicKey && type) {
        const ev = NostrFactory.createEvent(publicKey);
        ev.Kind = EventKind.Reporting;
        ev.Content = content;
        let newTags = [];
        newTags.push(['p', pubkey, type]);
        if(type === ReportingType.IMPERSONATION){
          newTags.push(['p', victimPubkey]);
        }
        ev.Tags = newTags.concat();
        return await nostrEvent.Sign(privateKey, ev);
      }
    },
    reportNote: async (pubkey, eventId, type, content) => {
      if (pubkey && eventId && publicKey && type) {
        const ev = NostrFactory.createEvent(publicKey);
        ev.Kind = EventKind.Reporting;
        ev.Content = content;
        let newTags = [];
        newTags.push(['e', eventId, type]);
        newTags.push(['p', pubkey]);
        ev.Tags = newTags.concat();
        return await nostrEvent.Sign(privateKey, ev);
      }
    },
  }
}
