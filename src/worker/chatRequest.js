import {
  System
} from "nostr/NostrSystem";
import GlobalNoteCache from 'db/GlobalNoteCache';
import UserDataCache from 'db/UserDataCache';
import DMCache from 'db/DMCache';
import useNostrEvent from "nostr/NostrEvent";
import { EventKind } from "nostr/def";

export const listen_chatgroup = (sub, curRelay, goon, callback) => {
  let globalNoteCache = GlobalNoteCache();
  System.BroadcastSub(sub, (tag, client, msg) => {
      if (tag === 'EOSE') {
        if (goon === false) {
          System.BroadcastClose(sub, curRelay, null);
        }
      } else if (tag === 'EVENT') {
        globalNoteCache.pushNote(msg);
        if (callback) {
          let cache = globalNoteCache.get();
          callback(cache, client);
        }
      }
    },
    curRelay
  );
}

//
export const unlisten_chatgroup = (sub, curRelay, callback) => {
  System.BroadcastClose(sub, curRelay, null);
}