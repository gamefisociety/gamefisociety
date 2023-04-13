import React, { useEffect, useState, useRef } from "react";
import "./GCardNote.scss";
import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { default_avatar } from "module/utils/xdef";

import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { useRepostPro } from "nostr/protocal/RepostPro";
import { useReactionPro } from "nostr/protocal/ReactionPro";
import { useRelayPro } from "nostr/protocal/RelayPro";

import { BuildSub, ParseNote } from "nostr/NostrUtils";
import { EventKind } from "nostr/def";
import UserDataCache from "db/UserDataCache";

const createNostrWorker = createWorkerFactory(() =>
  import("worker/nostrRequest")
);

const GCardAvatar = (props) => {
  const nostrWorker = useWorker(createNostrWorker);
  const { note } = props;
  const [meta, setMeta] = useState(null);
  const UserCache = UserDataCache();

  const fetch_relative_info = () => {
    let ret = ParseNote(note);
    let metaInfo = UserCache.getMetadata(ret.local_p);
    if (metaInfo) {
      setMeta({ ...metaInfo });
    }
  };

  useEffect(() => {
    fetch_relative_info();
    return () => {};
  }, [note]);

  const avatar = () => {
    let pictrue = "";
    if (meta && meta.content !== "") {
      let metaCxt = JSON.parse(meta.content);
      pictrue = metaCxt.picture;
    }
    return pictrue;
  };

  const displayname = () => {
    let tmp_display_name = "anonymous";
    if (meta && meta.content !== "") {
      let metaCxt = JSON.parse(meta.content);
      tmp_display_name = metaCxt.display_name;
    }
    return tmp_display_name;
  };

  return (
    <Box className={"card_avatar_bg"} elevation={0}>
      <Avatar className="avatar" alt={displayname()} src={avatar()} />
    </Box>
  );
};

export default React.memo(GCardAvatar);
