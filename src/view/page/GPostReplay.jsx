import React, { useEffect, useState } from "react";
import "./GPostReplay.scss";

import { useSelector, useDispatch } from 'react-redux';

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import GCardNote from "components/GCardNote";
import List from "@mui/material/List";

import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils";
import { setPost } from 'module/store/features/dialogSlice';

import TimelineCache from 'db/TimelineCache';

const GPostReplay = () => {
  const dispatch = useDispatch();
  const { follows } = useSelector((s) => s.profile);

  const [curCreateAt, setCurCreateAt] = useState(0);
  const [subNote, setSubNote] = useState([]);
  //
  const [data, setData] = useState([]);
  const [isMore, setMore] = useState(false);
  const [inforData, setInforData] = useState(new Map());
  const textNotePro = useTextNotePro();
  const metadataPro = useMetadataPro();

  const TLCache = TimelineCache();
  let post_replay_note_cache_flag = 'post_replay_note_cache';

  const getSubNote = () => {
    const filterTextNote = textNotePro.get();
    if (curCreateAt === 0) {
      TLCache.clear(post_replay_note_cache_flag);
      filterTextNote.until = Date.now();
    } else {
      setMore(true);
      if (curCreateAt !== 0) {
        filterTextNote.since = curCreateAt;
      }
    }
    filterTextNote.limit = 10;
    filterTextNote.authors = follows.concat();
    // console.log('follows', filterTextNote);
    let subTextNode = BuildSub('textnode-follows', [filterTextNote]);
    return subTextNode;
  }

  const loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >
      document.scrollingElement.scrollHeight - 50
    ) {
      let textNote = getSubNote();
      getNoteList(textNote);
    }
  };

  //
  useEffect(() => {
    let textNote = getSubNote();
    setSubNote(textNote.concat());
    //
    getNoteList(textNote);
    return () => {
      System.BroadcastClose(textNote, null, null);
    };
  }, [follows, subNote]);

  useEffect(() => {
    window.addEventListener("scroll", loadMore);
    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  }, [data, isMore]);

  const getNoteList = (subTextNode) => {
    //
    System.BroadcastSub(subTextNode, (tag, client, msg) => {
      if (tag === 'EOSE') {
        //
      } else if (tag === 'EVENT') {
        // console.log('post and replay post and replay', msg);
        let ret = TLCache.pushGlobalNote(post_replay_note_cache_flag, msg);
        if (ret) {
          const noteCache = TLCache.get(post_replay_note_cache_flag);
          if (!noteCache) {
            return;
          }
          setData(noteCache.concat());
          // save created_at
          if (msg.created_at < curCreateAt || curCreateAt === 0) {
            setCurCreateAt(msg.created_at);
          }
          // fetch user info ,note info
          const pubkeys = [msg.pubkey];
          const pubkyes_filter = new Set(pubkeys);
          getInfor(pubkyes_filter, null);
        }
      }
    },
      null
    );
  };

  const getInfor = (pkeys, curRelay) => {
    const filterMetaData = metadataPro.get(Array.from(pkeys));
    let subTextNode = BuildSub('metadata', [filterMetaData]);
    const newInfo = new Map();
    System.BroadcastSub(subTextNode, (tag, client, msg) => {
      if (tag === 'EOSE') {
        setInforData(newInfo);
        System.BroadcastClose(subTextNode, client, null);
      } else if (tag === 'EVENT') {
        // console.log('info', msg);
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
            // setCurCreateAt(99999999999999);
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
