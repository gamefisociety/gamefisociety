import React, { useEffect, useState } from "react";
import "./GPostReplay.scss";

import { useSelector, useDispatch } from 'react-redux';
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import GCardNote from "components/GCardNote";
import List from "@mui/material/List";

import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils";
import { setPost } from 'module/store/features/dialogSlice';

import GlobalNoteCache from 'db/GlobalNoteCache';

const createNostrWorker = createWorkerFactory(() => import('worker/nostrRequest'));

const GPostReplay = () => {
  //
  const nostrWorker = useWorker(createNostrWorker);
  const { publicKey, loggedOut } = useSelector((s) => s.login);
  //
  const dispatch = useDispatch();
  const { follows } = useSelector((s) => s.profile);
  const [curCreateAt, setCurCreateAt] = useState(0);
  const [data, setData] = useState([]);
  const [moreTimes, setMoreTimes] = useState(0);
  const [inforData, setInforData] = useState(new Map());
  const textNotePro = useTextNotePro();
  const metadataPro = useMetadataPro();
  const gNoteCache = GlobalNoteCache();

  const getSubNote = (tim) => {
    const filterTextNote = textNotePro.get();
    if (tim === 0) {
      gNoteCache.clear();
      filterTextNote.until = Date.now();
    } else {
      filterTextNote.until = tim;
    }
    filterTextNote.limit = 5;
    let tmpAuthors = follows.concat([publicKey]);
    filterTextNote.authors = tmpAuthors;
    let subTextNode = BuildSub('textnode-follows', [filterTextNote]);
    return subTextNode;
  }

  const getNoteList = (subTextNode, goon) => {
    nostrWorker.listen_follow_notes(subTextNode, null, goon, (data, client) => {
      setData(data.concat());
      const pubkeys = [];
      data.map((item) => {
        pubkeys.push(item.pubkey);
      });
      const pubkyes_filter = new Set(pubkeys);
      getInfor(pubkyes_filter, null);
    });
  };

  const getInfor = (pkeys, curRelay) => {
    const filterMetaData = metadataPro.get(Array.from(pkeys));
    let subTextNode = BuildSub('metadata', [filterMetaData]);
    nostrWorker.fetch_user_metadata(subTextNode, curRelay, (data, client) => {
      setInforData(data);
    });
  };

  const loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >
      document.scrollingElement.scrollHeight - 50
    ) {
      let minTime = gNoteCache.minTime();
      setCurCreateAt(minTime);
      //
      let moreNote = getSubNote(minTime);
      getNoteList(moreNote, false);
    }
  };

  const postNote = (note) => {
    dispatch(setPost({
      post: true,
      target: note,
    }));
  }

  useEffect(() => {
    let textNote = getSubNote(0);
    getNoteList(textNote, true);
    return () => {
      nostrWorker.unlisten_follow_notes(textNote, null, null);
    };
  }, [follows]);

  useEffect(() => {
    window.addEventListener("scroll", loadMore);
    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  }, [moreTimes, data, curCreateAt]);

  const renderMenu = () => {
    return (
      <Box className={'post_menu'}>
        <Button
          className={'post_menu_item'}
          sx={{ backgroundColor: 'background.default' }}
          variant="contained"
          onClick={() => {
            //
          }}
        >
          {"Post"}
        </Button>
        <Button
          className={'post_menu_item'}
          sx={{ backgroundColor: 'background.default' }}
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
      <List className={'list_bg'}>
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
    <Paper className={'post_replay_bg'} elevation={0}>
      {renderMenu()}
      <Button className={'post_button'} onClick={() => {
        postNote(null);
      }} />
      {renderContent()}
    </Paper>
  );
};

export default GPostReplay;
