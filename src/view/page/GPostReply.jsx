import React, { useEffect, useState } from "react";
import "./GPostReply.scss";

import { useSelector, useDispatch } from 'react-redux';
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import GCardNote from "components/GCardNote";
import GCardNoteRepost from "components/GCardNoteRepost";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";

import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { BuildSub } from "nostr/NostrUtils";
import { setPost } from 'module/store/features/dialogSlice';
import { EventKind } from "nostr/def";

import GlobalNoteCache from 'db/GlobalNoteCache';

const createNostrWorker = createWorkerFactory(() => import('worker/nostrRequest'));

const GPostReply = () => {
  //
  const nostrWorker = useWorker(createNostrWorker);
  const { publicKey, loggedOut } = useSelector((s) => s.login);
  //
  const dispatch = useDispatch();
  const { follows } = useSelector((s) => s.profile);
  const [curLabel, setCurLabel] = useState('Post');
  const [curCreateAt, setCurCreateAt] = useState(0);
  const [data, setData] = useState([]);
  const [inforData, setInforData] = useState(new Map());
  const textNotePro = useTextNotePro();
  const metadataPro = useMetadataPro();
  const gNoteCache = GlobalNoteCache();

  const getSubNote = (tim) => {
    const filterTextNote = textNotePro.getNoteAndRepost();
    let tmpAuthors = follows.concat([publicKey]);
    filterTextNote.authors = tmpAuthors;
    if (tim === 0) {
      gNoteCache.clear();
      filterTextNote.until = Date.now();
    } else {
      filterTextNote.until = tim;
    }
    filterTextNote.limit = 50;
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
    dispatch(setPost({ post: true, target: note, }));
  }

  useEffect(() => {
    setData([]);
    let textNote = getSubNote(0);
    getNoteList(textNote, true);
    return () => {
      nostrWorker.unlisten_follow_notes(textNote, null, null);
    };
  }, [follows, curLabel]);

  // useEffect(() => {
  //   window.addEventListener("scroll", loadMore);
  //   return () => {
  //     window.removeEventListener("scroll", loadMore);
  //   };
  // }, [moreTimes, data, curCreateAt]);

  const renderMenu = () => {
    return (
      <Box className={'post_menu'}>
        <Button
          className={'post_menu_item'}
          sx={{
            backgroundColor: curLabel === 'Post' ? '#006CF9' : '#272727'
          }}
          variant="contained"
          onClick={() => {
            setCurLabel('Post');
          }}
        >
          {"Post"}
        </Button>
        <Button className={'post_menu_item'}
          sx={{
            backgroundColor: curLabel === 'Post & Reply' ? '#006CF9' : '#272727'
          }}
          variant="contained"
          onClick={() => {
            setCurLabel('Post & Reply');
          }}
        >
          {"Post & Reply"}
        </Button>
      </Box>
    );
  };

  const parseNote = (target) => {
    let eNum = 0;
    let pNum = 0;
    let eArray = [];
    let pArray = [];

    target.tags.map(item => {
      if (item[0] === 'e') {
        eNum = eNum + 1;
        eArray.push(item[1]);
      } else if (item[0] === 'p') {
        pNum = pNum + 1;
        pArray.push(item[1]);
      }
    });
    return {
      eNum: eNum,
      pNum: pNum,
      eArray: eArray.concat(),
      pArray: pArray.concat()
    }
  }

  const renderContent = () => {
    return (
      <List className={'list_bg'}>
        {data.map((item, index) => {
          if (curLabel === 'Post') {
            let retInfo = parseNote(item);
            if (retInfo.eNum > 0) {
              return null;
            }
          }
          if (item.kind === EventKind.TextNote) {
            return <GCardNote key={"post-reply-note" + index + '-' + item.pubkey} note={{ ...item }} />;
          } else if (item.kind === EventKind.Repost) {
            return <GCardNoteRepost key={"post-reply-repost" + index + '-' + item.pubkey} note={{ ...item }} />;
          } else {
            return null;
          }
        })}
      </List>
    );
  };

  return (
    <Paper className={'post_reply_bg'} elevation={0}>
      {renderMenu()}
      <Button className={'post_button'} onClick={() => { postNote(null); }} />
      {renderContent()}
      <Typography className={'post_loadmore'} onClick={() => {
        loadMore();
      }}>
        {"LOAD MORE"}
      </Typography>
    </Paper>
  );
};

export default GPostReply;
