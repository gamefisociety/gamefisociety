
import React, { useEffect, useState } from "react";
import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { BuildSub } from "nostr/NostrUtils";
import { System } from "nostr/NostrSystem";

export const fetch_user_metadata = (sub, curRelay) => {
  console.log('fetch_user_metadata', sub);
  const newInfo = new Map();
  System.BroadcastSub(sub, (tag, client, msg) => {
    if (tag === 'EOSE') {
      System.BroadcastClose(sub, client, null);
    } else if (tag === 'EVENT') {
      console.log('meta info', msg);
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