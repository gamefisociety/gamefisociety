import React, { useEffect, useState, useRef } from "react";
import "./GCardNote.scss";
import { useSelector, useDispatch } from "react-redux";
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { setPost } from 'module/store/features/dialogSlice';
import { default_avatar } from "module/utils/xdef";
import xhelp from "module/utils/xhelp";
import Helpers from "../../src/view/utils/Helpers";

import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { useFollowPro } from "nostr/protocal/FollowPro";
import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils"
import { EventKind } from "nostr/def";
import UserDataCache from 'db/UserDataCache';

const createNostrWorker = createWorkerFactory(() => import('worker/nostrRequest'));

const GCardNote = (props) => {
  const nostrWorker = useWorker(createNostrWorker);
  const { note } = props;
  const [replyInfo, setReplyInfo] = useState(null);
  const [meta, setMeta] = useState(null);
  const [metaCxt, setMetaCxt] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserCache = UserDataCache();
  const MetaPro = useMetadataPro();

  const fetch_rela_info = () => {
    let filter = [];
    console.log('GCardNote', note);
    //get meta info
    let metaInfo = UserCache.getMetadata(note.pubkey);
    if (!metaInfo) {
      let filterMeta = MetaPro.get(note.pubkey);
      filter.push(filterMeta)
    } else {
      if (metaInfo.content && metaInfo.content !== '') {
        setMetaCxt({ ...JSON.parse(metaInfo.content) });
      }
      setMeta({ ...metaInfo });
    }
    //get reaction

    //get relative

    //request
    if (filter.length === 0) {
      return;
    }
    let subMeta = BuildSub("note_relat_info", filter.concat());
    nostrWorker.fetch_user_info(subMeta, null, (datas, client) => {
      // console.log('GCardNote fetch_user_info', datas);
      datas.map((msg) => {
        if (msg.kind === EventKind.SetMetadata) {
          let update_meta = false;
          if (meta === null || meta.created_at < msg.created_at) {
            update_meta = true;
          }
          if (update_meta) {
            if (msg.content && msg.content !== '') {
              setMetaCxt({ ...JSON.parse(msg.content) });
            }
            setMeta(msg);
          }
        } else if (msg.kind === EventKind.ContactList) {
          //
        } else if (msg.kind === EventKind.Relays) {
          //
        } else if (msg.kind === EventKind.TextNote) {
          //
        }
      });
    })
  }

  useEffect(() => {
    let eNum = 0;
    let pNum = 0;
    let eArray = [];
    let pArray = [];
    if (note.tags.length === 0) {
      setReplyInfo(null);
      return;
    } else {
      note.tags.map(item => {
        if (item[0] === 'e') {
          eNum = eNum + 1;
          eArray.push(item[1]);
        } else if (item[0] === 'p') {
          pNum = pNum + 1;
          pArray.push(item[1]);
        }
      });
    }
    //
    if (eNum === 0) {
      setReplyInfo(null);
    } else if (eNum === 1 && pNum === 1) {
      if (pArray.length > 0) {
        setReplyInfo(pArray[0]);
      }
    } else if (eNum === 2 && pNum === 2) {
      if (pArray.length > 0) {
        setReplyInfo(pArray[1]);
      }
    }
    //
    fetch_rela_info();
    //
    return () => { };
  }, [note]);

  const renderContent = (str) => {
    const strArray = str.split("\n");
    return (
      <Box
        className={'content'}
        onClick={() => {
          navigate("/notethread", {
            state: {
              note: { ...note },
              info: { ...metaCxt },
            },
          });
        }}
      >
        {Helpers.highlightEverything(str.trim(), null, { showMentionedMessages: true })}
        {strArray.map((stritem, index) => {
          try {
            if (stritem === "") {
              return null;
            } else if (
              (stritem.startsWith("http://") ||
                stritem.startsWith("https://")) &&
              (stritem.endsWith(".png") ||
                stritem.endsWith(".jpg") ||
                stritem.endsWith(".jpeg") ||
                stritem.endsWith(".gif"))
            ) {
              // console.log('render image', stritem);
              return (
                <CardMedia
                  component="img"
                  key={"cxt-" + index + "-" + stritem}
                  className={'inner_img'}
                  src={stritem}
                />
              );
            } else if (
              (stritem.startsWith("http://") ||
                stritem.startsWith("https://")) &&
              stritem.endsWith(".mp4")
            ) {
              console.log("render video", stritem);
              return null;
            } else {
              return null;
              //   return (

              //     <Typography
              //       sx={{
              //         width: "100%",
              //         // backgroundColor: 'red',
              //         wordWrap: "break-word",
              //         whiteSpace: "pre-wrap",
              //         fontSize: "14px",
              //       }}
              //       color="#FFFFFF"
              //       align="left"
              //     >
              //       {stritem}
              //     </Typography>
              //   );
            }
          } catch (error) {
            // console.log('strArray error', error, stritem);
            return null;
          }
        })}
      </Box>
    );
  };

  const displayname = () => {
    if (metaCxt && metaCxt.display_name) {
      return metaCxt.display_name;
    } else {
      if (note.pubkey) {
        return (
          "Nostr#" +
          note.pubkey.substring(note.pubkey.length - 4, note.pubkey.length)
        );
      }
    }
    return "anonymous";
  };

  const username = () => {
    if (metaCxt && metaCxt.name) {
      return '@' + metaCxt.name;
    } else {
      if (note.pubkey) {
        return (
          "@Nostr#" +
          note.pubkey.substring(note.pubkey.length - 4, note.pubkey.length)
        );
      }
    }
    return "@anonymous";
  };

  const renderReplyLable = () => {
    if (!note) {
      return null;
    }
    if (replyInfo === null) {
      return null;
    }
    let showName = '@default';
    if (replyInfo) {
      showName = replyInfo.substr(0, 4) + '...' + replyInfo.substr(-4, 4);
    }
    return (
      <Typography className="level2_lable" sx={{ ml: "12px" }}>
        {'reply to @' + showName}
      </Typography>
    );
  }

  return (
    <Card className={'card_note_bg'} elevation={0}>
      <Box className={'base_info'}
        onClick={() => {
          navigate("/userhome", { state: { pubkey: note.pubkey } });
        }}>
        <Avatar
          className="avatar"
          alt="Avatar"
          src={metaCxt && metaCxt.picture ? metaCxt.picture : default_avatar}
        />
        <Box className={'base_ext'}>
          <Stack direction='row'>
            <Typography className="level1_lable"
              sx={{
                ml: "8px",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              noWrap={true}
            >
              {displayname()}
            </Typography>
            <Typography className="level2_lable" sx={{ ml: "12px" }}>
              {username()}
            </Typography>
            <Typography className="level2_lable" sx={{ ml: "12px" }}>
              {xhelp.formateSinceTime(note.created_at * 1000)}
            </Typography>
          </Stack>
          {renderReplyLable()}
        </Box>
      </Box>
      {renderContent(note.content)}
      <Box className={'bottom'}>
        <img className={'icon_chat'} onClick={() => {
          dispatch(setPost({
            post: true,
            target: note,
          }));
        }} />
        <img className={'icon_right'} />
        <img className={'icon_trans'} />
        <img className={'icon_pay'} />
      </Box>
    </Card>
  );
};

export default React.memo(GCardNote);
