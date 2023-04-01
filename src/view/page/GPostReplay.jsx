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
  const [data, setData] = useState([]);
  const [moreTimes, setMoreTimes] = useState(0);
  const [inforData, setInforData] = useState(new Map());
  const textNotePro = useTextNotePro();
  const metadataPro = useMetadataPro();

  const TLCache = TimelineCache();
  let post_replay_note_cache_flag = 'post_replay_note_cache';

  const getSubNote = (tim) => {
    const filterTextNote = textNotePro.get();
    if (tim === 0) {
      TLCache.clear(post_replay_note_cache_flag);
      filterTextNote.until = Date.now();
    } else {
      setMoreTimes(moreTimes + 1);
      if (tim !== 0) {
        filterTextNote.until = tim;
      }
    }
    filterTextNote.limit = 5;
    filterTextNote.authors = follows.concat();
    let subTextNode = BuildSub('textnode-follows', [filterTextNote]);
    return subTextNode;
  }

  const loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >
      document.scrollingElement.scrollHeight - 50
    ) {
      let min_created_at = 0;
      data.map(item => {
        if (min_created_at === 0) {
          min_created_at = item.msg.created_at
        } else {
          if (item.msg.created_at < min_created_at) {
            min_created_at = item.msg.created_at;
          }
        }
      });
      if (min_created_at <= curCreateAt || curCreateAt === 0) {
        setCurCreateAt(min_created_at - 1);
      }

    }
  };

  useEffect(() => {
    let textNote = getSubNote(curCreateAt);
    getNoteList(textNote);
    return () => {
      System.BroadcastClose(textNote, null, null);
    };
  }, [follows, curCreateAt]);

  useEffect(() => {
    window.addEventListener("scroll", loadMore);
    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  }, [moreTimes, data, curCreateAt]);

  const getNoteList = (subTextNode) => {
    //
    System.BroadcastSub(subTextNode, (tag, client, msg) => {
      if (tag === 'EOSE') {
        const noteCache = TLCache.get(post_replay_note_cache_flag);
        if (!noteCache) {
          return;
        }
        setData(noteCache.concat());
        const pubkeys = [msg.pubkey];
        const pubkyes_filter = new Set(pubkeys);
        getInfor(pubkyes_filter, null);
      } else if (tag === 'EVENT') {
        TLCache.pushGlobalNote(post_replay_note_cache_flag, msg);
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
        let info = {};
        if (msg.content !== "") {
          info = JSON.parse(msg.content);
        }
        newInfo.set(msg.pubkey, info);
      }
    }, curRelay
    );
  };

  const postNote = (note) => {
    dispatch(setPost({
      post: true,
      target: note,
    }));
  }

  const renderMenu = () => {
    return (
      <Box className={'post_menu'}>
        <Button
          className={'post_menu_item'}
          sx={{ width: '110px', height: '36px', backgroundColor: 'background.default' }}
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
          className={'post_menu_item'}
          sx={{ width: '110px', height: '36px', backgroundColor: 'background.default' }}
          variant="contained"
          onClick={() => {
            // setCurCreateAt(99999999999999);
          }}
        >
          {"Replay"}
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
    <Paper className={'post_replay_bg'} elevation={0}>
      {renderMenu()}
      <Button className={'post_button'} onClick={() => {
        postNote(null);
      }}></Button>
      {renderContent()}
    </Paper>
  );
};

export default GPostReplay;
