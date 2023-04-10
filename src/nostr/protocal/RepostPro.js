import { useSelector } from "react-redux";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind, NostrList } from "nostr/def";
import NostrFactory from 'nostr/NostrFactory';

export const useRepostPro = () => {

  const { privateKey, publicKey } = useSelector(s => s.login);

  const nostrEvent = useNostrEvent();

  return {
    get: (pubkey) => {
      const filter = NostrFactory.createFilter();
      filter.kinds = [EventKind.Repost];
      filter.authors = [pubkey]
      return filter;
    },
    getByIds: (eventIds) => {
      const filter = NostrFactory.createFilter();
      filter.kinds = [EventKind.Repost];
      filter['#e'] = eventIds?.concat();
      return filter;
    },
    repost: async (targetNote) => {
      if (publicKey) {
        const ev = NostrFactory.createEvent(publicKey);
        ev.Kind = EventKind.Repost;
        ev.Content = JSON.stringify(targetNote);
        //
        const hasTag = (tags, tag, v) => {
          for (let i = 0; i < tags.length; i++) {
            let item = tags[i];
            if (item[0] && item[0] === tag && item[1] && item[1] === v) {
              return true;
            }
          }
          return false;
        }
        //
        let newTags = [];
        targetNote.tags.map((tag) => {
          if (tag[0]) {
            if (tag[0] === 'p' && tag[1] && hasTag(newTags, tag[0], tag[1]) === false) {
              newTags.push(['p', tag[1]]);
            } else if (tag[0] === 'e' && tag[1] && hasTag(newTags, tag[0], tag[1]) === false) {
              newTags.push(['e', tag[1]]);
            }
          }
        });
        newTags.push(['e', targetNote.id, '', 'root']);
        if (hasTag(newTags, 'p', targetNote.pubkey) === false) {
          newTags.push(['p', targetNote.pubkey]);
        }
        ev.Tags = newTags.concat();
        return await nostrEvent.Sign(privateKey, ev);
      }
    },
  }
}
