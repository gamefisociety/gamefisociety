import React, { useEffect, useState, useRef } from "react";
import "./GCardNoteRepost.scss";
import { useSelector, useDispatch } from "react-redux";
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import { useNavigate } from "react-router-dom";
import GCardNote from "components/GCardNote";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { BuildSub } from "nostr/NostrUtils"
import { EventKind } from "nostr/def";
import UserDataCache from 'db/UserDataCache';

const createNostrWorker = createWorkerFactory(() => import('worker/nostrRequest'));

const GCardNoteRepost = (props) => {
  const nostrWorker = useWorker(createNostrWorker);
  const { note } = props;
  const [relaNote, setRelaNote] = useState(null);
  const [meta, setMeta] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserCache = UserDataCache();
  const MetaPro = useMetadataPro();

  const fetch_relative_info = (target) => {
    try {
      if (target.content && target.content !== '') {
        let t_note = JSON.parse(target.content);
        setRelaNote({ ...t_note });
      }
    } catch (e) {
      console.log('err fetch_relative_info', target);
    }
    let metaKeys = [];
    let metaInfo = UserCache.getMetadata(target.pubkey);
    if (!metaInfo) {
      metaKeys.push(target.pubkey);
    } else {
      setMeta({ ...metaInfo });
    }
    let filter = [];
    if (metaKeys.length > 0) {
      let filterMeta = MetaPro.get(metaKeys);
      filter.push(filterMeta)
    }
    if (filter.length === 0) {
      return;
    }
    let subMeta = BuildSub("note_relat_info", filter.concat());
    nostrWorker.fetch_user_info(subMeta, null, (datas, client) => {
      // console.log('GCardNote fetch_user_info', datas);
      datas.map((msg) => {
        if (msg.kind === EventKind.SetMetadata) {
          if (msg.pubkey === target.pubkey) {
            //process reply meta
            if (meta === null || meta.created_at < msg.created_at) {
              setMeta({ ...msg });
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

  useEffect(() => {
    console.log('GCardNoteRepost', note);
    fetch_relative_info(note);
    return () => { };
  }, [note]);

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

  return (
    <Card className={'card_note_repost_bg'} elevation={0}>
      <Box className={'repost_header'}
        onClick={() => {
          navigate("/userhome/" + meta.pubkey);
        }}>
        <Box className="icon_trans" />
        <Typography className="level2_lable" sx={{ ml: "12px" }}>
          {username()}
        </Typography>
        <Typography className="level2_lable" sx={{ ml: "12px" }}>
          {'Reposted'}
        </Typography>
        {/* <Box className={'base_ext'}>
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
            <Typography className="level2_lable_unhover" sx={{ ml: "12px" }}>
              {xhelp.formateSinceTime(note.created_at * 1000)}
            </Typography>
          </Stack>
          {renderReplyLable()}
        </Box> */}
      </Box>
      {relaNote && <GCardNote note={{ ...relaNote }} />}
    </Card>
  );
};

export default React.memo(GCardNoteRepost);
