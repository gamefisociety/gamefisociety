import { System } from "nostr/NostrSystem";
import GlobalNoteCache from 'db/GlobalNoteCache';

export const fetch_user_metadata = (sub, curRelay, callback) => {
  // console.log('fetch_user_metadata', sub);
  const newInfo = new Map();
  System.BroadcastSub(sub, (tag, client, msg) => {
    if (tag === 'EOSE') {
      System.BroadcastClose(sub, client, null);
      if (callback) {
        callback(newInfo, client);
      }
    } else if (tag === 'EVENT') {
      // console.log('meta info', msg);
      let info = {};
      if (msg.content !== "") {
        info = JSON.parse(msg.content);
      }
      newInfo.set(msg.pubkey, info);
    }
  }, curRelay
  );

  return null;
}

export const fetch_global_notes = (sub, curRelay, callback) => {
  let globalNoteCache = GlobalNoteCache();
  System.BroadcastSub(sub, (tag, client, msg) => {
    if (tag === 'EOSE') {
      System.BroadcastClose(sub, client, null);
      if (callback) {
        let cache = globalNoteCache.get();
        callback(cache, client);
      }
    } else if (tag === 'EVENT') {
      console.log('global msg', msg);
      globalNoteCache.pushNote(msg)
    }
  },
    curRelay
  );
}

