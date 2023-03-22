import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useChatPro } from "nostr/protocal/ChatPro";
import { BuildSub } from "nostr/NostrUtils"
import { System } from "nostr/NostrSystem";
import { addDirectMessage } from 'module/store/features/societySlice';
//
const GListenGroup = (props) => {
  const { logout, pubkey } = props;
  const { dms } = useSelector((s) => s.society);
  const dispatch = useDispatch();
  const chatPro = useChatPro();

  const createSub = () => {

    const filterDM = chatPro.getDM(pubkey);
    let subListenDM = BuildSub("listen_chat_dm", [filterDM]);
    return subListenDM;
  }

  console.log('dm msg', dms);

  const listenSub = (sub) => {
    System.BroadcastSub(sub, (tag, client, msg) => {
      dispatch(addDirectMessage(msg));
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

export default React.memo(GListenGroup);
