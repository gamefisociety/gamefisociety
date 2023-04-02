import { System } from "nostr/NostrSystem";
import GlobalNoteCache from 'db/GlobalNoteCache';

export const fetch_user_profile = (sub, curRelay, callback) => {
  // console.log('fetch_user_profile', sub);
  const newMsg = [];
  System.BroadcastSub(sub, (tag, client, msg) => {
    if (tag === 'EOSE') {
      System.BroadcastClose(sub, client, null);
      if (callback) {
        callback(newMsg, client);
      }
    } else if (tag === 'EVENT') {
      newMsg.push(msg);
    }
  }, curRelay
  );

  return null;
}

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
      // console.log('global msg', msg);
      globalNoteCache.pushNote(msg)
    }
  },
    curRelay
  );
}

//
export const listen_follow_notes = (sub, curRelay, goon, callback) => {
  let globalNoteCache = GlobalNoteCache();
  System.BroadcastSub(sub, (tag, client, msg) => {
    if (tag === 'EOSE') {
      if (goon === false) {
        System.BroadcastClose(sub, curRelay, null);
      }
    } else if (tag === 'EVENT') {
      console.log('listen global msg', msg);
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
export const unlisten_follow_notes = (sub, curRelay, callback) => {
  System.BroadcastClose(sub, curRelay, null);
}

