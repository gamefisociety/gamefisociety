import React, { useEffect, useState } from "react";
import "./GFTGlobal.scss";

import { useSelector, useDispatch } from 'react-redux';
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import GCardNote from "components/GCardNote";
import List from "@mui/material/List";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material/index";

import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { BuildSub } from "nostr/NostrUtils";
import GlobalNoteCache from 'db/GlobalNoteCache';

const labels = [
  "ALL",
  "#ETH",
  "#BTC",
  "#DOT",
  "#GAMES",
  "#SPORTS",
  '#GPT-4'
];

const createNostrWorker = createWorkerFactory(() => import('worker/nostrRequest'));

const GFTGlobal = () => {
  //
  const nostrWorker = useWorker(createNostrWorker);
  //
  const dispatch = useDispatch();
  const { relays } = useSelector((s) => s.profile);
  //
  const [curLable, setCurLable] = useState("ALL");
  const [curRelay, setCurRelay] = useState('');
  const [curCreateAt, setCurCreateAt] = useState(0);
  //
  const [data, setData] = useState([]);
  const [isMore, setMore] = useState(false);
  const [inforData, setInforData] = useState(new Map());
  const textNotePro = useTextNotePro();
  const metadataPro = useMetadataPro();

  const gNoteCache = GlobalNoteCache();

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
      getNoteList();
    }
  };

  const getNoteList = () => {
    //build sub
    const filterTextNote = textNotePro.get();
    if (curCreateAt === 0) {
      gNoteCache.clear();
      filterTextNote.until = Date.now();
    } else {
      setMore(true);
      filterTextNote.until = curCreateAt;
    }
    filterTextNote.limit = 50;
    //request
    let subTextNode = BuildSub('global-textnode', [filterTextNote]);
    nostrWorker.fetch_global_notes(subTextNode, curRelay, (data, client) => {
      setData(data.concat());
      const pubkeys = [];
      data.map((item) => {
        pubkeys.push(item.pubkey);
      });
      const pubkyes_filter = new Set(pubkeys);
      getInfor(pubkyes_filter, null);
      //
      setCurCreateAt(gNoteCache.minTime());
    });

  };

  const getInfor = (pkeys, curRelay) => {
    const filterMetaData = metadataPro.get(Array.from(pkeys));
    let subTextNode = BuildSub('metadata', [filterMetaData]);
    nostrWorker.fetch_user_metadata(subTextNode, curRelay, (data, client) => {
      setInforData(data);
    });
  };

  const renderLables = () => {
    return (
      <Box className={'global_lables'}>
        {labels.map((item, index) => (
          <Box className={'lable_bg'} key={"label-index-" + index}>
            {
              <Typography className={'lable_text'}
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
          <Select
            className={'select0'}
            value={curRelay}
            onChange={({ target }) => {
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
          </Select>
        </FormControl>
      </Box>
    );
  }

  const renderContent = () => {
    return (
      <List sx={{ width: "100%", overflow: "auto", backgroundColor: "transparent" }}>
        {data.map((item, index) => {
          const info = inforData.get(item.pubkey);
          return (
            <GCardNote
              key={"global-note-" + index}
              note={{ ...item }}
              info={info}
            />
          );
        })}
      </List>
    );
  };

  return (
    <Paper className={'global_bg'} elevation={0}>
      {renderLables()}
      {renderGlobalHead()}
      {renderContent()}
    </Paper>
  );
};

export default GFTGlobal;
