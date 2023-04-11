import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import "./GChatItem.scss";

import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Button, Link } from "@mui/material";
import { default_banner, default_avatar } from "module/utils/xdef";
import { useFollowPro } from "nostr/protocal/FollowPro";
import { System } from "nostr/NostrSystem";
import { setRelays, setFollows } from "module/store/features/profileSlice";
import UserDataCache from 'db/UserDataCache';
//
const GChatItem = forwardRef((props, ref) => {
  const bgRef = useRef(null);
  const { content, pubkey } = props;
  const { publicKey } = useSelector((s) => s.login);
  const dispatch = useDispatch();
  const followPro = useFollowPro();
  const [metaInfo, setMetaInfo] = useState(null);

  const userCache = UserDataCache();

  useImperativeHandle(ref, () => (
    {
      getSize: () => {
        console.log('bgRef getSize', bgRef);
        return 0;
      },
      getHeight: () => {
        console.log('bgRef getHeight', bgRef);
        return bgRef.current.getBoundingClientRect().height;
      }
    }
  ));

  const isSelf = (key) => {
    return publicKey === key;
  };

  useEffect(() => {
    let metaInfo = userCache.getMetadata(pubkey);
    if (metaInfo) {
      console.log("GCardUser", metaInfo);
      setMetaInfo({ ...metaInfo });
    }
    return () => { };
  }, [props]);

  const renderContent = () => {
    return (<Box className={'msg_bg'}>
      <Typography className={'label_cxt'}>
        {content}
      </Typography>
    </Box>);
  }

  let tmpInfo = null;
  if (metaInfo && metaInfo.content !== '') {
    tmpInfo = JSON.parse(metaInfo.content);
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: isSelf(pubkey) ? 'flex-end' : 'flex-start'
    }}
      className={'chatitem_bg'}
      ref={bgRef}
    >
      <Avatar
        sx={{ width: "40px", height: "40px" }}
        alt="GameFi Society"
        src={metaInfo ? tmpInfo.picture : default_avatar}
      />
      <Box className={'cxt_bg'}>
        <Typography className={'label_name'}>
          {metaInfo ? tmpInfo.name : 'default'}
        </Typography>
        {renderContent()}
      </Box>
    </Box>
  );
});

export default React.memo(GChatItem);
