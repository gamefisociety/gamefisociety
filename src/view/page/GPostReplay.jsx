import React, { useEffect, useState } from "react";
import "./GPostReplay.scss";

import { useSelector, useDispatch } from 'react-redux';

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import GCardNote from "components/GCardNote";
import List from "@mui/material/List";

import SearchIcon from "@mui/icons-material/Search";

import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils";
import { setPost } from 'module/store/features/dialogSlice';

import TimelineCache from 'db/TimelineCache';

import {
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "../../../node_modules/@mui/material/index";

const GPostReplay = () => {
  const dispatch = useDispatch();
  const [curCreateAt, setCurCreateAt] = useState(0);
  //
  const [data, setData] = useState([]);
  const [isMore, setMore] = useState(false);
  const [inforData, setInforData] = useState(new Map());
  const textNotePro = useTextNotePro();
  const metadataPro = useMetadataPro();

  const TLCache = TimelineCache();
  let global_note_cache_flag = 'global_not_cache';

  useEffect(() => {
    window.addEventListener("scroll", loadMore);
    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  }, [data, isMore]);

  //
  useEffect(() => {
    if (curCreateAt === 0) {
      getNoteList();
    }
    return () => { };
  }, [curCreateAt]);

  const loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >
      document.scrollingElement.scrollHeight - 50
    ) {
      // console.log('loadMore', curCreateAt);
      getNoteList();
    }
  };

  const getNoteList = () => {
    const filterTextNote = textNotePro.get();
    if (curCreateAt === 0) {
      TLCache.clear(global_note_cache_flag);
      filterTextNote.until = Date.now();
    } else {
      setMore(true);
      filterTextNote.since = curCreateAt;
    }
    filterTextNote.limit = 50;
    let subTextNode = BuildSub('textnode', [filterTextNote]);
    System.BroadcastSub(subTextNode, (tag, client, msg) => {
      if (tag === 'EOSE') {
        System.BroadcastClose(subTextNode, client, null);
        const noteCache = TLCache.get(global_note_cache_flag);
        setData(noteCache.concat());

        let timeFlag = 100000000000000;
        const pubkeys = [];
        noteCache.map((item) => {
          pubkeys.push(item.msg.pubkey);
          if (item.create < timeFlag) {
            timeFlag = item.create;
          }
        });
        console.log('loadMore', timeFlag);
        setCurCreateAt(timeFlag);
        //
        const pubkyes_filter = new Set(pubkeys);
        getInfor(pubkyes_filter, null);
      } else if (tag === 'EVENT') {
        // console.log('text note', msg);
        TLCache.pushGlobalNote(global_note_cache_flag, msg)
      }
    },
      null
    );
  };

  const getInfor = (pkeys, curRelay) => {
    const filterMetaData = metadataPro.get(Array.from(pkeys));
    let subTextNode = BuildSub('metadata', [filterMetaData]);
    //
    const newInfo = new Map();
    System.BroadcastSub(subTextNode, (tag, client, msg) => {
      if (tag === 'EOSE') {
        setInforData(newInfo);
        System.BroadcastClose(subTextNode, client, null);
      } else if (tag === 'EVENT') {
        console.log('info', msg);
        let info = {};
        if (msg.content !== "") {
          info = JSON.parse(msg.content);
        }
        newInfo.set(msg.pubkey, info);
      }
    }, curRelay
    );
  };

  const renderPartment = () => {
    return (
      <Box
        sx={{
          // backgroundColor: 'red',
          padding: "24px",
          display: "flex",
          flexDirection: "row",
          alighItems: "center",
          justifyContent: "space-between",
          backgroundColor: 'background.paper'
        }}
      >
        <Button
          className={'top_button'}
          sx={{ px: "18px", py: "6px", backgroundColor: 'background.default' }}
          variant="contained"
          backgroundColor={"background.default"}
          onClick={() => {
            dispatch(setPost({
              post: true,
              target: null,
            }));
          }}
        >
          {"Post"}
        </Button>
        <Button
          className={'top_button'}
          sx={{ px: "18px", py: "6px", backgroundColor: 'background.default' }}
          variant="contained"
          onClick={() => {
            setCurCreateAt(0);
            // setCurLable(item);
          }}
        >
          {"Refresh"}
        </Button>
      </Box>
    );
  };

  const renderContent = () => {
    return (
      <List sx={{ width: "100%", overflow: "auto", backgroundColor: "transparent" }}>
        {data.map((item, index) => {
          const info = inforData.get(item.msg.pubkey);
          // console.log("renderContent", info, item.msg);
          return (
            <GCardNote
              key={"global-note-" + index}
              note={{ ...item.msg }}
              info={info}
            />
          );
        })}
      </List>
    );
  };

  return (
    <Paper className={'post_replay_bg'} sx={{ backgroundColor: 'background.paper' }} elevation={0}>
      {renderPartment()}
      <Divider />
      {renderContent()}
    </Paper>
  );
};

export default GPostReplay;
