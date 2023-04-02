
import { System } from "nostr/NostrSystem";

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