import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useChatPro } from "nostr/protocal/ChatPro";
import { BuildSub } from "nostr/NostrUtils"
import { System } from "nostr/NostrSystem";
import { setRelays, setFollows } from "module/store/features/profileSlice";
//
const GListenDM = (props) => {
  const { logout, pubkey } = props;
  const chatPro = useChatPro();

  const createSub = () => {

    const filterDM = chatPro.get(pubkey);
    let subListenDM = BuildSub("listen_chat_dm", [filterDM]);
    return subListenDM;
  }

  const listenSub = (sub) => {
    System.BroadcastSub(sub, (tag, client, msg) => {
      console.log('dm msg', msg);
    })
  }

  useEffect(() => {
    let sub = createSub();
    if (logout === false && pubkey) {
      listenSub(sub);
    }
    return () => {
      if (logout === false && pubkey) {
        System.BroadcastClose(sub, null, null);
      }
    };
  }, [props]);

  //#1F1F1F
  return null;
};

export default React.memo(GListenDM);
