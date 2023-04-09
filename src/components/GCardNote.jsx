import React, { useEffect, useState, useRef } from "react";
import "./GCardNote.scss";
import { useSelector, useDispatch } from "react-redux";
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { setPost } from 'module/store/features/dialogSlice';
import { default_avatar } from "module/utils/xdef";
import xhelp from "module/utils/xhelp";
import Helpers from "../../src/view/utils/Helpers";

import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { useRepostPro } from "nostr/protocal/RepostPro";
import { BuildSub } from "nostr/NostrUtils"
import { EventKind } from "nostr/def";
import UserDataCache from 'db/UserDataCache';
import { System } from 'nostr/NostrSystem';

const createNostrWorker = createWorkerFactory(() => import('worker/nostrRequest'));

const GCardNote = (props) => {
  const nostrWorker = useWorker(createNostrWorker);
  const { note } = props;
  const [meta, setMeta] = useState(null);
  const [replyMeta, setReplyMeta] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserCache = UserDataCache();
  const MetaPro = useMetadataPro();
  const repostPro = useRepostPro();

  const fetch_relative_info = () => {

    let reply_pubkey = null;
    let self_pubkey = note.pubkey;
    let eNum = 0;
    let pNum = 0;
    let eArray = [];
    let pArray = [];
    note.tags.map(item => {
      if (item[0] === 'e') {
        eNum = eNum + 1;
        eArray.push(item[1]);
      } else if (item[0] === 'p') {
        pNum = pNum + 1;
        pArray.push(item[1]);
      }
    });
    if (eNum === 1 && pNum === 1 && pArray.length > 0) {
      reply_pubkey = pArray[0];
    } else if (eNum === 2 && pNum === 2 && pArray.length > 1) {
      reply_pubkey = pArray[1];
    }
    //
    let filter = [];
    let metaKeys = [];
    let metaInfo = UserCache.getMetadata(self_pubkey);
    if (!metaInfo) {
      metaKeys.push(self_pubkey);
    } else {
      setMeta({ ...metaInfo });
    }
    if (reply_pubkey !== null) {
      let replyInfo = UserCache.getMetadata(reply_pubkey);
      if (!replyInfo) {
        metaKeys.push(reply_pubkey);
      } else {
        setReplyMeta({ ...replyInfo });
      }
    }
    if (metaKeys.length > 0) {
      let filterMeta = MetaPro.get(metaKeys);
      filter.push(filterMeta)
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
          if (msg.pubkey === self_pubkey) {
            //process reply meta
            if (meta === null || meta.created_at < msg.created_at) {
              setMeta({ ...msg });
            }
          }
          // console.log('GCardNote fetch_user_info', msg, reply_pubkey);
          if (msg.pubkey === reply_pubkey) {
            if (replyMeta === null || replyMeta.created_at < msg.created_at) {
              setReplyMeta({ ...msg });
            }
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

  const repostNote = async (targetNote) => {
    
    let ev = await repostPro.repost(targetNote);
    // console.log('repostNote ev', ev);
    System.BroadcastEvent(ev, (tag, client, msg) => {
      console.log('repostNote tag', tag, msg);
    });
  }

  useEffect(() => {
    fetch_relative_info();
    return () => { };
  }, [note]);

  const renderContent = (str) => {
    return (
      <Box
        className={'content'}
        onClick={() => { navigate("/notethread", { state: { note: { ...note } }, }) }}
      >
        {Helpers.highlightEverything(str.trim(), null, { showMentionedMessages: true })}
      </Box>
    );
  };

  const displayname = () => {
    let tmp_display_name = 'anonymous';
    if (meta && meta.content !== '') {
      let metaCxt = JSON.parse(meta.content);
      tmp_display_name = metaCxt.display_name;
    } else {
      if (note && note.pubkey) {
        tmp_display_name = "Nostr#" + note.pubkey.substring(note.pubkey.length - 4, note.pubkey.length);
      }
    }
    return tmp_display_name;
  };

  const username = () => {
    let tmp_user_name = '@anonymous';
    if (meta && meta.content !== '') {
      let metaCxt = JSON.parse(meta.content);
      tmp_user_name = '@' + metaCxt.name;
    } else {
      if (note && note.pubkey) {
        tmp_user_name = "@Nostr#" + note.pubkey.substring(note.pubkey.length - 4, note.pubkey.length);
      }
    }
    return tmp_user_name;
  };

  const renderReplyLable = () => {
    if (replyMeta === null) {
      return null;
    }
    let showName = 'default';
    if (replyMeta && replyMeta.content && replyMeta.content !== '') {
      let replyMetaCxt = JSON.parse(replyMeta.content);
      showName = replyMetaCxt.name;
    }
    console.log('renderReplyLable', showName);
    return (
      <Stack direction={'row'} alignItems={'center'}>
        <Typography className="level2_lable" sx={{ ml: "12px" }}>
          {'reply to '}
        </Typography>
        <Typography className="level3_lable" sx={{ ml: "12px" }} onClick={(event) => {
          console.log('navigate userhome', replyMeta.pubkey);
          navigate("/userhome/" + replyMeta.pubkey);
          event.stopPropagation();
        }}>
          {'@' + showName}
        </Typography>
      </Stack>

    );
  }

  let pictrue = default_avatar;
  if (meta && meta.content !== '') {
    let metaCxt = JSON.parse(meta.content);
    pictrue = metaCxt.picture;
  }

  return (
    <Card className={'card_note_bg'} elevation={0}>
      <Box className={'base_info'}
        onClick={() => {
          navigate("/userhome/" + note.pubkey);
        }}>
        <Avatar
          className="avatar"
          alt="Avatar"
          src={pictrue}
        />
        <Box className={'base_ext'}>
          <Stack sx={{ width: '100%' }} direction='row' alignItems={'center'}>
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
            <Typography className="level2_lable_unhover" sx={{ ml: "12px" }}>
              {xhelp.formateSinceTime(note.created_at * 1000)}
            </Typography>
          </Stack>
          {renderReplyLable()}
        </Box>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Box className="icon_more" onClick={(event) => {
          event.stopPropagation();
          // if (openMenu === false) {
          //   handleMenuOpen(event, cfg);
          // } else {
          //   handleMenuClose(event);
          // }
        }} />
      </Box>
      {renderContent(note.content)}
      <Box className={'bottom'}>
        <Box className="icon_chat" onClick={() => {
          dispatch(setPost({
            post: true,
            target: note,
          }));
        }} />
        <Box className="icon_chain_push" />
        <Box className="icon_pay" />
        <Box className="icon_trans" onClick={(event) => {
          event.stopPropagation();
          repostNote(note);
        }} />
        <Box className="icon_right" />
      </Box>
    </Card>
  );
};

export default React.memo(GCardNote);
