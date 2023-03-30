import React, { useEffect, useState } from "react";
import "./GFTGlobal.scss";

import { useSelector, useDispatch } from 'react-redux';

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import GCardNote from "components/GCardNote";
import List from "@mui/material/List";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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
  const dispatch = useDispatch();
  const { relays } = useSelector((s) => s.profile);
  //
  const [curLable, setCurLable] = useState("All");
  const [curRelay, setCurRelay] = useState('');
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
      filterTextNote.until = curCreateAt;
    }
    filterTextNote.limit = 50;
    let subTextNode = BuildSub('textnode', [filterTextNote]);
    System.BroadcastSub(subTextNode, (tag, client, msg) => {
      if (tag === 'EOSE') {
        System.BroadcastClose(subTextNode, client, null);
        const noteCache = TLCache.get(global_note_cache_flag);
        if (!noteCache) {
          return;
        }
        setData(noteCache.concat());

        let timeFlag = 100000000000000;
        const pubkeys = [];
        noteCache.map((item) => {
          pubkeys.push(item.msg.pubkey);
          if (item.create < timeFlag) {
            timeFlag = item.create;
          }
        });
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
      <Box class={'op'}>
        <Button
          className={'top_button'}
          sx={{ px: "18px", py: "6px", backgroundColor: 'background.default' }}
          variant="contained"
          //   backgroundColor={"background.default"}
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

  const renderLables = () => {
    return (
      <Box className={'global_lables'}>
        {labelS.map((item, index) => (
          <Box className={'lable_bg'} key={"label-index-" + index}>
            {
              <Typography className={'lable_text'}
                // sx={{ px: "18px", py: "2px" }}
                // // variant="body2"
                // // color="primary"
                // backgroundColor={curLable === item ? "green" : "gray"}
                // align={"center"}
                // borderRadius={"4px"}
                onClick={() => {
                  setCurLable(item);
                }}
              >
                {item}
              </Typography>
            }
          </Box>
        ))}
      </Box>
    );
  };

  const renderGlobalHead = () => {
    return (
      <Box className={'global_head'}>
        <Typography className={'tip0'}>
          {'Global reads from'}
        </Typography>
        <FormControl >
          {/* <InputLabel id="demo-simple-select-standard-label">Age</InputLabel> */}
          <Select
            className={'select0'}
            value={curRelay}
            onChange={({ target }) => {
              // console.log('global relays item', target);
              if (target && target.value) {
                setCurRelay(target.value);
              }
            }}
          >
            {
              Object.entries(relays).map((item, index) => {
                // console.log('global relays item', item);
                return (<MenuItem key={'relay-index-' + index} value={index} >{item[0]}</MenuItem>);
              })
            }
            {/* <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem> */}
          </Select>
        </FormControl>
      </Box>

    );
  }

  const renderContent = () => {
    return (
      <List sx={{ width: "100%", overflow: "auto", backgroundColor: "transparent" }}>
        {data.map((item, index) => {
          const info = inforData.get(item.msg.pubkey);
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
    <Paper className={'global_bg'} elevation={0}>
      {renderGlobalHead()}
      {renderLables()}
      {/* {renderPartment()}
      <Divider /> */}
      {renderContent()}
    </Paper>
  );
};

export default GFTGlobal;
