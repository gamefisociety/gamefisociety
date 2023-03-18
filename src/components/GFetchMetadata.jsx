import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { useFollowPro } from "nostr/protocal/FollowPro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils"

import { EventKind } from "nostr/def";
import { setProfile } from "module/store/features/profileSlice";
import { setRelays, setFollows } from "module/store/features/profileSlice";
//
const GFetchMetadata = (props) => {
  const { pubkey, logout } = props;
  const { follows } = useSelector((s) => s.profile);
  const { profile, relays } = useSelector((s) => s.profile);
  const dispatch = useDispatch();

  const MetaPro = useMetadataPro();
  const followPro = useFollowPro();

  const selfMetadata = (msg) => {
    if (msg.kind === EventKind.SetMetadata) {
      let contentMeta = JSON.parse(msg.content);
      contentMeta.created_at = msg.created_at;
      dispatch(setProfile(contentMeta));
    } else if (msg.kind === EventKind.ContactList) {
      //relays
      if (msg.content !== "") {
        let content = JSON.parse(msg.content);
        let tmpRelays = {
          relays: {
            ...content,
            ...relays,
          },
          createdAt: 1,
        };
        dispatch(setRelays(tmpRelays));
      }
      //follows
      if (msg.tags.length > 0) {
        let follow_pubkes = [];
        msg.tags.map((item) => {
          if (item.length >= 2 && item[0] === "p") {
            follow_pubkes.push(item[1]);
          }
        });
        let followsInfo = {
          create_at: msg.created_at,
          follows: follow_pubkes.concat(),
        };
        dispatch(setFollows(followsInfo));
      }
    }
  };

  const fetchMeta = (pubkey, callback) => {
    let filterMeta = MetaPro.get(pubkey);
    let filterFollow = followPro.getFollows(pubkey);
    let subMeta = BuildSub("profile_contact", [filterMeta, filterFollow]);
    let SetMetadata_create_at = 0;
    let ContactList_create_at = 0;
    System.BroadcastSub(subMeta, (tag, client, msg) => {
      if (!msg) return;
      if (tag === "EOSE") {
        System.BroadcastClose(subMeta, client, null);
      } else if (tag === "EVENT") {
        if (msg.pubkey !== pubkey) {
          return;
        }
        if (
          msg.kind === EventKind.SetMetadata &&
          msg.created_at > SetMetadata_create_at
        ) {
          SetMetadata_create_at = msg.created_at;
          if (callback) {
            callback(msg);
          }
        } else if (
          msg.kind === EventKind.ContactList &&
          msg.created_at > ContactList_create_at
        ) {
          ContactList_create_at = msg.created_at;
          if (callback) {
            callback(msg);
          }
        }
      }
    });
  };

  useEffect(() => {
    if (logout && logout === false) {
      fetchMeta(pubkey, selfMetadata);
    }
    return () => { };
  }, [props]);

  //#1F1F1F
  return null;
};

export default React.memo(GFetchMetadata);
