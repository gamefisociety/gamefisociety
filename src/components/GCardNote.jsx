import React, { useEffect, useState, useRef } from "react";
import "./GCardNote.scss";
import { useSelector, useDispatch } from "react-redux";
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { setPost } from 'module/store/features/dialogSlice';
import { default_avatar } from "module/utils/xdef";
import xhelp from "module/utils/xhelp";
import Helpers from "../../src/view/utils/Helpers";

import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { useRepostPro } from "nostr/protocal/RepostPro";
import { useReactionPro } from "nostr/protocal/ReactionPro";
import { BuildSub, ParseNote } from "nostr/NostrUtils"
import { EventKind } from "nostr/def";
import UserDataCache from 'db/UserDataCache';
import { System } from 'nostr/NostrSystem';

const createNostrWorker = createWorkerFactory(() => import('worker/nostrRequest'));

const GCardNote = (props) => {
  const nostrWorker = useWorker(createNostrWorker);
  const { note } = props;
  const [meta, setMeta] = useState(null);
  const [replyMeta, setReplyMeta] = useState(null);
  const [repostOpen, setRepostOpen] = useState({
    open: false,
    note: null,
  });
  const [repostData, setRepostData] = useState([]);
  const [reactData, setReactData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserCache = UserDataCache();
  const MetaPro = useMetadataPro();
  const repostPro = useRepostPro();
  const reactionPro = useReactionPro();

  const fetch_relative_info = () => {

    let ret = ParseNote(note);
    let filter = [];
    let metaKeys = [];
    let metaInfo = UserCache.getMetadata(ret.local_p);
    if (!metaInfo) {
      metaKeys.push(ret.local_p);
    } else {
      setMeta({ ...metaInfo });
    }
    if (ret.reply_note_p !== null) {
      let replyInfo = UserCache.getMetadata(ret.reply_note_p);
      if (!replyInfo) {
        metaKeys.push(ret.reply_note_p);
      } else {
        setReplyMeta({ ...replyInfo });
      }
    }
    if (metaKeys.length > 0) {
      let filterMeta = MetaPro.get(metaKeys);
      filter.push(filterMeta);
    }

    //get reaction
    let filterReact = reactionPro.getByIds([ret.local_note]);
    filter.push(filterReact);

    //get repost
    let filterRepost = repostPro.getByIds([ret.local_note]);
    filter.push(filterRepost);

    //get relative
    let filterMeta = MetaPro.get(metaKeys);
    filter.push(filterMeta)

    //request
    if (filter.length === 0) {
      return;
    }
    let tmp_repost_arr = [];
    let tmp_react_arr = [];
    let subMeta = BuildSub("note_relat_info", filter.concat());
    nostrWorker.fetch_user_info(subMeta, null, (datas, client) => {
      // console.log('GCardNote fetch_user_info', datas);
      datas.map((msg) => {
        if (msg.kind === EventKind.SetMetadata) {
          if (msg.pubkey === ret.local_p) {
            //process reply meta
            if (meta === null || meta.created_at < msg.created_at) {
              setMeta({ ...msg });
            }
          }
          // console.log('GCardNote fetch_user_info', msg, reply_pubkey);
          if (msg.pubkey === ret.reply_note_p) {
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
        } else if (msg.kind === EventKind.Repost) {
          tmp_repost_arr.push(msg);
          // console.log('GCardNote fetch_user_info repost', msg);
        } else if (msg.kind === EventKind.Reaction) {
          tmp_react_arr.push(msg);
          // console.log('GCardNote fetch_user_info reaction', msg);
        }
      });
      setRepostData(tmp_repost_arr.concat());
      setReactData(tmp_react_arr.concat());
    })
  }

  const repostNote = async (targetNote) => {
    if (targetNote === null) {
      return;
    }
    let ev = await repostPro.repost(targetNote);
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
        onClick={() => { navigate("/notethread/" + note.id) }}
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
    // console.log('renderReplyLable', showName);
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

  const renderRepostDlg = () => {
    // onClose={handleDialogClose}
    return (
      <Dialog open={repostOpen.open}>
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "#656565",
            padding: '24px',
          }}
        >
          <Typography
            color={"#919191"}
            sx={{
              mt: '24px',
              fontSize: "24px",
              fontFamily: "Saira",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {"Are you want to repost this?"}
          </Typography>
          <Button
            variant="contained"
            sx={{
              marginTop: "42px",
              width: "100%",
              height: "48px",
              fontSize: "16px",
              fontFamily: "Saira",
              fontWeight: "500",
              // backgroundColor: "#FF0000",
              borderRadius: "5px",
              color: "#FFFFFF",
            }}
            onClick={(event) => {
              event.stopPropagation();
              repostNote(repostOpen.note);
              repostOpen.open = false;
              repostOpen.note = null;
              setRepostOpen({ ...repostOpen });
            }}
          >
            {"Confirm"}
          </Button>
          <Button
            variant="text"
            sx={{
              marginTop: "32px",
              width: "100%",
              height: "48px",
              fontSize: "16px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            onClick={(event) => {
              event.stopPropagation();
              repostOpen.open = false;
              repostOpen.note = null;
              setRepostOpen({ ...repostOpen });
            }}
          >
            {"Cancel"}
          </Button>
        </Box>
      </Dialog>
    );
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
          repostOpen.open = true;
          repostOpen.note = { ...note }
          setRepostOpen({ ...repostOpen });
        }} />
        <Typography className="level2_lable" sx={{ ml: "12px" }}>
          {repostData.length}
        </Typography>
        <Box className="icon_right" />
        <Typography className="level2_lable" sx={{ ml: "12px" }}>
          {reactData.length}
        </Typography>
      </Box>
      {renderRepostDlg()}
    </Card>
  );
};

export default React.memo(GCardNote);
