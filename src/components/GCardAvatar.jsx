import React, { useEffect, useState, useRef } from "react";
import "./GCardNote.scss";
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { default_avatar } from "module/utils/xdef";

import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { useRepostPro } from "nostr/protocal/RepostPro";
import { useReactionPro } from "nostr/protocal/ReactionPro";
import { useRelayPro } from "nostr/protocal/RelayPro";

import { BuildSub, ParseNote } from "nostr/NostrUtils"
import { EventKind } from "nostr/def";
import UserDataCache from 'db/UserDataCache';

const createNostrWorker = createWorkerFactory(() => import('worker/nostrRequest'));

const GCardAvatar = (props) => {
  const nostrWorker = useWorker(createNostrWorker);
  const { note } = props;
  const [meta, setMeta] = useState(null);
  const UserCache = UserDataCache();

  const fetch_relative_info = () => {

    let ret = ParseNote(note);
    let metaInfo = UserCache.getMetadata(ret.local_p);
    if(metaInfo){
      setMeta({ ...metaInfo });
    }
  }

  useEffect(() => {
    fetch_relative_info();
    // console.log('renderContent111', note);
    return () => { };
  }, [note]);

  let pictrue = default_avatar;
  if (meta && meta.content !== '') {
    let metaCxt = JSON.parse(meta.content);
    pictrue = metaCxt.picture;
  }

  return (
    <Box className={'card_avatar_bg'} elevation={0}>
      <Avatar
          className="avatar"
          alt="Avatar"
          src={pictrue}
        />
    </Box>
  );
};

export default React.memo(GCardAvatar);
