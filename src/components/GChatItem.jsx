import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import "./GChatItem.scss";

import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
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
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { BuildSub } from "nostr/NostrUtils"
import { EventKind } from "nostr/def";
//

const createNostrWorker = createWorkerFactory(() => import('worker/nostrRequest'));

const GChatItem = forwardRef((props, ref) => {
  const bgRef = useRef(null);
  const { content, pubkey, callback } = props;
  const nostrWorker = useWorker(createNostrWorker);

  const { publicKey } = useSelector((s) => s.login);
  const dispatch = useDispatch();
  const followPro = useFollowPro();
  const [metaInfo, setMetaInfo] = useState(null);

  const metadataPro = useMetadataPro();
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

  const fetchMetadata = (targetPK) => {
    let filterMeta = metadataPro.get(pubkey);
    let subMeta = BuildSub("profile_contact", [filterMeta]);
    let SetMetadata_create_at = 0;
    nostrWorker.fetch_user_info(subMeta, null, (datas, client) => {
      // console.log('fetch_user_info', datas);
      datas.map((msg) => {
        if (msg.kind === EventKind.SetMetadata && msg.created_at > SetMetadata_create_at && msg.pubkey === targetPK) {
          SetMetadata_create_at = msg.created_at;
          setMetaInfo({ ...msg })
        }
      });
    })
  }

  const isSelf = (key) => {
    return publicKey === key;
  };

  useEffect(() => {
    let metaInfo = userCache.getMetadata(pubkey);
    if (metaInfo) {
      console.log("GCardUser", metaInfo);
      setMetaInfo({ ...metaInfo });
    } else {
      fetchMetadata(pubkey);
    }
    return () => { };
  }, [props]);

  const renderContent = () => {
    return (<Box className={'msg_bg'} sx={{
      backgroundColor: isSelf(pubkey) ? "#454FBF" : "#191A1B",
    }}>
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
      flexDirection: isSelf(pubkey) ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    }}
      className={'chatitem_bg'}
      ref={bgRef}
    >
      <Avatar
        sx={{ width: "40px", height: "40px", cursor: 'pointer' }}
        alt="GameFi Society"
        src={metaInfo ? tmpInfo.picture : default_avatar}
        onClick={(event) => {
          event.stopPropagation();
          if (callback) {
            callback('msg-user', pubkey, metaInfo);
          }
        }}
      />
      <Box className={'cxt_bg'} sx={{
        alignItems: isSelf(pubkey) ? 'flex-end' : 'flex-start',
      }}>
        <Typography className={'label_name'}>
          {metaInfo ? tmpInfo.name : 'default'}
        </Typography>
        {renderContent()}
      </Box>
    </Box>
  );
});

export default React.memo(GChatItem);
