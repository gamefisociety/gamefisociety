import React, { useEffect, useState, useRef } from "react";
import "./GCardNFT.scss";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { BuildSub, ParseNote } from "nostr/NostrUtils";
import UserDataCache from "db/UserDataCache";

const GCardNFT = (props) => {
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
    <Box className={"card_nft_bg"} elevation={0}>
      <Avatar className="avatar" alt={displayname()} src={avatar()} />
    </Box>
  );
};

export default React.memo(GCardNFT);
