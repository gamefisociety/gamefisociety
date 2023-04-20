import { System } from "nostr/NostrSystem";
import GlobalNoteCache from "db/GlobalNoteCache";
import GlobalLongFormCache from "db/GlobalLongFormCache";
import UserDataCache from "db/UserDataCache";
import DMCache from "db/DMCache";
import useNostrEvent from "nostr/NostrEvent";
import { EventKind } from "nostr/def";

export const fetch_user_profile = (sub, curRelay, callback) => {
  let userDataCache = UserDataCache();
  const newMsg = new Map();
  System.BroadcastSub(
    sub,
    (tag, client, msg) => {
      if (tag === "EOSE") {
        System.BroadcastClose(sub, client, null);
        if (callback) {
          callback(Array.from(newMsg.values()), client);
        }
      } else if (tag === "EVENT") {
        // console.log("fetch_user_profile", msg);
        const ret = newMsg.get(msg.id);
        if (ret) {
          if (ret.created_at < msg.created_at) {
            newMsg.set(msg.id, msg);
          }
        } else {
          newMsg.set(msg.id, msg);
        }
        if (msg.kind === EventKind.SetMetadata) {
          userDataCache.pushMetadata(msg);
        }
      }
    },
    curRelay
  );
  return null;
};

export const fetch_user_info = (sub, curRelay, callback) => {
  let userDataCache = UserDataCache();
  const msgs = [];
  System.BroadcastSub(
    sub,
    (tag, client, msg) => {
      if (tag === "EOSE") {
        System.BroadcastClose(sub, client, null);
        if (callback) {
          callback(msgs, client);
        }
      } else if (tag === "EVENT") {
        if (msg.kind === EventKind.SetMetadata) {
          userDataCache.pushMetadata(msg);
        }
        msgs.push(msg);
      } else if (tag === "COUNT") {
        msgs.push(msg);
      }
    },
    curRelay
  );

  return null;
};

export const fetch_textnote_rela = (sub, curRelay, callback) => {
  let userDataCache = UserDataCache();
  const msgs = [];
  System.BroadcastSub(
    sub,
    (tag, client, msg) => {
      if (tag === "EOSE") {
        System.BroadcastClose(sub, client, null);
        if (callback) {
          callback(msgs, client);
        }
      } else if (tag === "EVENT") {
        if (msg.kind === EventKind.SetMetadata) {
          userDataCache.pushMetadata(msg);
        }
        msgs.push(msg);
      }
    },
    curRelay
  );

  return null;
};

export const fetch_user_metadata = (sub, curRelay, callback) => {
  let userDataCache = UserDataCache();
  const newInfo = new Map();
  System.BroadcastSub(
    sub,
    (tag, client, msg) => {
      if (tag === "EOSE") {
        System.BroadcastClose(sub, client, null);
        if (callback) {
          callback(newInfo, client);
        }
      } else if (tag === "EVENT") {
        if (msg.kind === EventKind.SetMetadata) {
          userDataCache.pushMetadata(msg);
          let info = {};
          if (msg.content !== "") {
            info = JSON.parse(msg.content);
          }
          newInfo.set(msg.pubkey, info);
        }
      }
    },
    curRelay
  );
  return null;
};

export const fetch_global_notes = (sub, curRelay, callback) => {
  // console.log('fetch_global_notes111', curRelay);
  let globalNoteCache = GlobalNoteCache();
  System.BroadcastSub(
    sub,
    (tag, client, msg) => {
      if (tag === "EOSE") {
        System.BroadcastClose(sub, client, null);
        if (callback) {
          let cache = globalNoteCache.get();
          callback(cache, client);
        }
      } else if (tag === "EVENT" && msg.kind === EventKind.TextNote) {
        globalNoteCache.pushNote(msg);
      }
    },
    curRelay
  );
};

export const fetch_global_longform = (sub, curRelay, callback) => {
  // console.log('fetch_global_notes111', curRelay);
  let globalLongFormCache = GlobalLongFormCache();
  System.BroadcastSub(
    sub,
    (tag, client, msg) => {
      // console.log('fetch_global_longform', tag, msg);
      if (tag === "EOSE") {
        System.BroadcastClose(sub, client, null);
        if (callback) {
          let cache = globalLongFormCache.get();
          callback(cache, client);
        }
      } else if (tag === "EVENT" && msg.kind === EventKind.LongForm) {
        console.log("fetch_global_longform", tag, msg);
        globalLongFormCache.pushMsg(msg);
      }
    },
    curRelay
  );
};

//
export const fetch_follow_notes = (sub, curRelay, callback) => {
  let globalNoteCache = GlobalNoteCache();
  System.BroadcastSub(
    sub,
    (tag, client, msg) => {
      if (tag === "EOSE") {
        System.BroadcastClose(sub, curRelay, null);
        if (callback) {
          let cache = globalNoteCache.get();
          callback(cache, client);
        }
      } else if (tag === "EVENT") {
        globalNoteCache.pushNote(msg);
      }
    },
    curRelay
  );
};

//
export const listen_follow_notes = (sub, curRelay, goon, callback) => {
  let globalNoteCache = GlobalNoteCache();
  System.BroadcastSub(
    sub,
    (tag, client, msg) => {
      if (tag === "EOSE") {
        if (goon === false) {
          System.BroadcastClose(sub, curRelay, null);
        }
      } else if (tag === "EVENT") {
        let result = globalNoteCache.pushNote(msg);
        if (callback && result) {
          let cache = globalNoteCache.get();
          callback(cache, client);
        }
      }
    },
    curRelay
  );
};

export const fetch_chatCache_notes = (
  privateKey,
  pubkey,
  sub,
  curRelay,
  callback
) => {
  let chatCache = DMCache();

  System.BroadcastSub(
    sub,
    (tag, client, msg) => {
      if (tag === "EOSE") {
        System.BroadcastClose(sub, client, null);
        if (callback) {
          let cache = chatCache.get();
          // callback(cache, client);
        }
      } else if (tag === "EVENT") {
        // globalNoteCache.pushNote(msg)
        let nostrEvent = useNostrEvent();
        try {
          let keyp = msg.pubkey;
          if(msg.pubkey===pubkey){
            keyp = msg.tags[0][1]
          }
          nostrEvent
            .DecryptData(msg.content, privateKey, keyp)
            .then((dmsg) => {
              console.log(dmsg);
              if (dmsg) {
                let flag = chatCache.pushChat(
                  keyp,
                  msg.id,
                  msg.pubkey,
                  msg.created_at,
                  dmsg
                );
                let msgObj = {
                  msg: msg,
                  dmsg: dmsg,
                };
                callback(msgObj, client);
              }
            });
        } catch (e) {
          //
        }
      }
    },
    curRelay
  );
};

//
export const unlisten_follow_notes = (sub, curRelay, callback) => {
  System.BroadcastClose(sub, curRelay, null);
};
