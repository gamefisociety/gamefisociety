import {
  System
} from "nostr/NostrSystem";
import ChannelCache from 'db/ChannelCache';
import UserDataCache from 'db/UserDataCache';
import DMCache from 'db/DMCache';
import useNostrEvent from "nostr/NostrEvent";
import { EventKind } from "nostr/def";

export const listen_chatgroup = (sub, channelId, curRelay, goon, callback) => {
  let channelCache = ChannelCache();
  // console.log('listen_chatgroup', channelId);
  System.BroadcastSub(sub, (tag, client, msg) => {
    if (tag === 'EOSE') {
      if (goon === false) {
        System.BroadcastClose(sub, curRelay, null);
      }
    } else if (tag === 'EVENT') {
      channelCache.pushChannelMsg(channelId, msg);
      if (callback) {
        let cache = channelCache.get(channelId);
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