import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { useFollowPro } from "nostr/protocal/FollowPro";
import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils"

import { EventKind } from "nostr/def";
import { setProfile } from "module/store/features/profileSlice";
import { setRelays, setFollows } from "module/store/features/profileSlice";


const createNostrWorker = createWorkerFactory(() => import('worker/nostrRequest'));
//
const GFetchMetadata = (props) => {
  const { pubkey, logout } = props;
  const nostrWorker = useWorker(createNostrWorker);

  const { relays } = useSelector((s) => s.profile);
  const dispatch = useDispatch();

  const MetaPro = useMetadataPro();
  const followPro = useFollowPro();

  const selfMetadata = (msg) => {
    if (msg.kind === EventKind.SetMetadata) {
      let contentMeta = JSON.parse(msg.content);
      contentMeta.created_at = msg.created_at;
      dispatch(setProfile(contentMeta));
      console.log('setProfile', contentMeta);
    } else if (msg.kind === EventKind.ContactList) {
      //relays
      if (msg.content !== "") {
        let content = JSON.parse(msg.content);
        let tmp_relays = relays.concat();
        for (let key in content) {
          let target = { addr: key, read: content[key].read, write: content[key].write };
          let flag = tmp_relays.find((item) => {
            return item.addr === key;
          });
          // console.log('relay content includes', flag);
          if (!flag) {
            tmp_relays.push(target);
          }
        }
        dispatch(setRelays(tmp_relays));
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
    // let fillterTextNote = textNotePro.getTarget(pubkey);
    let subMeta = BuildSub("profile_contact", [filterMeta, filterFollow]);
    let SetMetadata_create_at = 0;
    let ContactList_create_at = 0;
    nostrWorker.fetch_user_info(subMeta, null, (datas, client) => {
      console.log('fetch_user_info', datas);
      datas.map((msg) => {
        if (msg.pubkey === pubkey) {
          // console.log('fetchmetadata msg', msg);
          if (msg.kind === EventKind.SetMetadata && msg.created_at > SetMetadata_create_at && callback) {
            SetMetadata_create_at = msg.created_at;
            callback(msg);
          } else if (msg.kind === EventKind.ContactList && msg.created_at > ContactList_create_at && callback) {
            ContactList_create_at = msg.created_at;
            callback(msg);
          } else if (msg.kind === EventKind.Relays && callback) {
            // ContactList_create_at = msg.created_at;
            callback(msg);
          } else if (msg.kind === EventKind.TextNote && callback) {
            // ContactList_create_at = msg.created_at;
            callback(msg);
          }
        }
      });
    })
  };

  useEffect(() => {
    if (logout === false) {
      fetchMeta(pubkey, selfMetadata);
    }
    return () => { };
  }, [props]);

  return null;
};

export default React.memo(GFetchMetadata);
