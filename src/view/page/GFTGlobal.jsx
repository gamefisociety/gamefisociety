import React, { useEffect, useState } from "react";
import "./GFTGlobal.scss";

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
import TimelineCache from 'db/TimelineCache';

import {
  Button,
  IconButton,
  TextField,
  Typography,
} from "../../../node_modules/@mui/material/index";

const labelS = [
  "All",
  "ETH",
  "BTC",
  "DOT",
  "GAME",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
  "SPORTS",
];

const GFTGlobal = () => {
  //
  const [curLable, setCurLable] = useState("All");
  //
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
    // console.log('enter global note');
    TLCache.clear(global_note_cache_flag);
    getNoteList();
    return () => { };
  }, []);

  const loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >
      document.scrollingElement.scrollHeight - 50
    ) {
      getNoteList();
    }
  };

  const getNoteList = () => {
    const filterTextNote = textNotePro.get();
    if (curCreateAt === 0) {
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
        //
        setCurCreateAt();
        //
        const pubkeys = [];
        noteCache.map((item) => {
          pubkeys.push(item.msg.pubkey);
        });
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
          padding: "24px",
          display: "flex",
          flexDirection: "row",
          alighItems: "center",
          justifyContent: "space-around",
          backgroundColor: 'background.paper'
        }}
      >
        <Typography
          className={'top_button'}
          sx={{ px: "18px", py: "6px" }}
          variant="subtitle2"
          color="text.primary"
          backgroundColor={"background.default"}
          align={"center"}
          borderRadius={"4px"}
          onClick={() => {
            // setCurLable(item);
          }}
        >
          {"Post & Replay"}
        </Typography>
        <Typography
          className={'top_button'}
          sx={{ px: "18px", py: "6px" }}
          variant="subtitle2"
          color="text.primary"
          backgroundColor={"background.default"}
          align={"center"}
          borderRadius={"4px"}
          onClick={() => {
            // setCurLable(item);
          }}
        >
          {"Global"}
        </Typography>
        <Typography
          className={'top_button'}
          sx={{ px: "18px", py: "6px" }}
          variant="subtitle2"
          color="text.primary"
          backgroundColor={"background.default"}
          align={"center"}
          borderRadius={"4px"}
          onClick={() => {
            // setCurLable(item);
          }}
        >
          {"DMs"}
        </Typography>
        <Typography
          className={'top_button'}
          sx={{ px: "18px", py: "6px" }}
          variant="subtitle2"
          color="text.primary"
          backgroundColor={"background.default"}
          align={"center"}
          borderRadius={"4px"}
          onClick={() => {
            // setCurLable(item);
          }}
        >
          {"Notificatons"}
        </Typography>
      </Box>
    );
  };

  const renderLables = () => {
    return (
      <Paper>
        <Box
          sx={{
            width: "100%",
            padding: "24px",
            display: "flex",
            flexDirection: "row",
            alighItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton>
            <SearchIcon sx={{ height: "46px" }} />
          </IconButton>
          <TextField
            sx={{ width: "360px", height: "46px" }}
            label="Search"
          ></TextField>
        </Box>
        <Grid
          container
          spacing={2}
          sx={{
            px: "24px",
            maxHeight: "92px",
            // backgroundColor: 'blue',
            overflow: "hidden",
          }}
        // expanded={true}
        >
          {labelS.map((item, index) => (
            <Grid item key={"label-index-" + index}>
              {
                <Typography
                  sx={{ px: "18px", py: "2px" }}
                  variant="body2"
                  color="primary"
                  backgroundColor={curLable === item ? "green" : "gray"}
                  align={"center"}
                  borderRadius={"4px"}
                  onClick={() => {
                    setCurLable(item);
                  }}
                >
                  {item}
                </Typography>
              }
            </Grid>
          ))}
        </Grid>
        <Button>{"more"}</Button>
      </Paper>
    );
  };

  const renderContent = () => {
    return (
      <List sx={{ width: "100%", overflow: "auto", backgroundColor: "transparent" }}>
        {data.map((item, index) => {
          const info = inforData.get(item.msg.pubkey);
          console.log("renderContent", info, item.msg);
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
    <Paper className={'global_bg'} sx={{ backgroundColor: 'background.paper' }} elevation={0}>
      {renderPartment()}
      {/* {renderLables()} */}
      {renderContent()}
    </Paper>
  );
};

export default GFTGlobal;
