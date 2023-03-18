import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFollowPro } from "nostr/protocal/FollowPro";
import { System } from "nostr/NostrSystem";
import { setRelays, setFollows } from "module/store/features/profileSlice";
//
const GListenDM = (props) => {
  const { follows } = useSelector((s) => s.profile);
  const { profile, pubkey, ownFollows, ownRelays } = props;
  const dispatch = useDispatch();
  //
  const relayMap = new Map();
  for (const [k, v] of Object.entries(ownRelays)) {
    if (k.startsWith("wss://") || k.startsWith("ws://")) {
      relayMap.set(k, v);
    }
  }
  const followPro = useFollowPro();
  const addFollow = async (pubkey) => {
    let event = await followPro.addFollow(pubkey);
    let newFollows = follows.concat();
    newFollows.push(pubkey);
    System.BroadcastEvent(event, (tags, client, msg) => {
      if (tags === "OK" && msg.ret === true) {
        let followsInfo = {
          create_at: event.CreatedAt,
          follows: newFollows,
        };
        dispatch(setFollows(followsInfo));
      }
    });
  };

  const removeFollow = async (pubkey) => {
    let event = await followPro.removeFollow(pubkey);
    let newFollows = follows.concat();
    newFollows.splice(follows.indexOf(pubkey), 1);
    System.BroadcastEvent(event, (tags, client, msg) => {
      if (tags === "OK" && msg.ret === true) {
        let followsInfo = {
          create_at: event.CreatedAt,
          follows: newFollows,
        };
        dispatch(setFollows(followsInfo));
      }
    });
  };

  const isFollow = (key) => {
    // console.log('isFollow', key, follows.includes(key), follows);
    return follows.includes(key);
  };

  useEffect(() => {
    console.log("profile", profile);
    return () => { };
  }, [props]);

  //#1F1F1F
  return null;
};

export default React.memo(GListenDM);
