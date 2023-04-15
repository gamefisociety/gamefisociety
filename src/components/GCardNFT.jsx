import React, { useEffect, useState, useRef } from "react";
import "./GCardNFT.scss";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
    // fetch_relative_info();
    return () => { };
  }, [note]);

  // const avatar = () => {
  //   let pictrue = "";
  //   if (meta && meta.content !== "") {
  //     let metaCxt = JSON.parse(meta.content);
  //     pictrue = metaCxt.picture;
  //   }
  //   return pictrue;
  // };

  // const displayname = () => {
  //   let tmp_display_name = "anonymous";
  //   if (meta && meta.content !== "") {
  //     let metaCxt = JSON.parse(meta.content);
  //     tmp_display_name = metaCxt.display_name;
  //   }
  //   return tmp_display_name;
  // };

  return (
    <Card className={"card_nft_bg"}>
      <CardMedia
        sx={{ height: 140 }}
        image={''}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {'NFT Name'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default React.memo(GCardNFT);
