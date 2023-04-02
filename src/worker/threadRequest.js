import { System } from "nostr/NostrSystem";
import GlobalNoteCache from 'db/GlobalNoteCache';
import UserDataCache from 'db/UserDataCache';
import { EventKind } from "nostr/def";

export const fetch_thread_note = (sub, curRelay, callback) => {
  //
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


