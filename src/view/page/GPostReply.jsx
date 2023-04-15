import React, { useEffect, useState } from "react";
import "./GPostReply.scss";

import { useSelector, useDispatch } from "react-redux";
import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import GCardNote from "components/GCardNote";
import GCardNoteRepost from "components/GCardNoteRepost";
import GCardAvatar from "components/GCardAvatar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { BuildSub } from "nostr/NostrUtils";
import { setPost } from "module/store/features/dialogSlice";
import { EventKind } from "nostr/def";

import GlobalNoteCache from "db/GlobalNoteCache";

const createNostrWorker = createWorkerFactory(() =>
  import("worker/nostrRequest")
);

const GPostReply = () => {
  //
  const nostrWorker = useWorker(createNostrWorker);
  const { publicKey, loggedOut } = useSelector((s) => s.login);
  //
  const dispatch = useDispatch();
  const { follows } = useSelector((s) => s.profile);
  const [curLabel, setCurLabel] = useState("Post");
  const [data, setData] = useState([]);
  const [listenData, setListenData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [sinceTime, setSinceTime] = useState(0);
  const [inforData, setInforData] = useState(new Map());
  const [fetching, setFetching] = useState(false);
  const textNotePro = useTextNotePro();
  const metadataPro = useMetadataPro();
  const gNoteCache = GlobalNoteCache();
  let listenSubNote = null;

  useEffect(() => {
    setData([]);
    fetchNotes(0);
    return () => {
      removeListenNotes();
    };
  }, [follows, curLabel]);

  useEffect(() => {
    if (listenData.length > 0) {
      let tempData = [];
      let i = 0;
      while (i < listenData.length) {
        const t_data = listenData[i];
        if (t_data.created_at > sinceTime) {
          tempData.push(t_data);
        } else {
          break;
        }
        i++;
      }
      setNewData(tempData.concat());
    }
  }, [listenData]);

  const fetchNotes = (time) => {
    if (fetching) {
      return;
    }
    setFetching(true);
    const filterTextNote = textNotePro.getNoteAndRepost();
    let tmpAuthors = follows.concat([publicKey]);
    filterTextNote.authors = tmpAuthors;
    if (time === 0) {
      gNoteCache.clear();
      filterTextNote.until = Date.now();
    } else {
      filterTextNote.until = time;
    }
    filterTextNote.limit = 15;
    let subTextNode = BuildSub("textnode-follows", [filterTextNote]);
    nostrWorker.fetch_follow_notes(subTextNode, null, (cacheData, client) => {
      setFetching(false);
      setData(cacheData.concat());
      // fetchInfo(cacheData);
      if (time === 0) {
        if (curLabel === "Post") {
          removeListenNotes();
        } else if (curLabel === "Post & Reply") removeListenNotes();
        setSinceTime(gNoteCache.maxTime());
        addListenNotes();
      }
    });
  };

  const loadMore = () => {
    fetchNotes(gNoteCache.minTime());
  };

  const getListenSubNote = (time) => {
    const filterTextNote = textNotePro.getNoteAndRepost();
    let tmpAuthors = follows.concat([publicKey]);
    filterTextNote.authors = tmpAuthors;
    filterTextNote.since = time;
    filterTextNote.limit = 15;
    let subTextNode = BuildSub("textnode-follows", [filterTextNote]);
    return subTextNode;
  };

  const removeListenNotes = () => {
    if (listenSubNote) {
      nostrWorker.unlisten_follow_notes(listenSubNote, null, null);
      listenSubNote = null;
    }
  };

  const addListenNotes = () => {
    if (listenSubNote) {
      return;
    }
    listenSubNote = getListenSubNote(sinceTime);
    nostrWorker.listen_follow_notes(
      listenSubNote,
      null,
      true,
      (cacheData, client) => {
        setListenData(cacheData.concat());
      }
    );
  };

  const fetchInfo = (cacheData) => {
    const pubkeys = [];
    cacheData.map((item) => {
      pubkeys.push(item.pubkey);
    });
    const pubkyes_filter = new Set(pubkeys);
    getInfor(pubkyes_filter, null);
  };

  const getInfor = (pkeys, curRelay) => {
    const filterMetaData = metadataPro.get(Array.from(pkeys));
    let subTextNode = BuildSub("metadata", [filterMetaData]);
    nostrWorker.fetch_user_metadata(subTextNode, curRelay, (data, client) => {
      setInforData(data);
    });
  };

  const postNote = (note) => {
    dispatch(setPost({ post: true, target: note }));
  };

  const parseNote = (target) => {
    let eNum = 0;
    let pNum = 0;
    let eArray = [];
    let pArray = [];

    target.tags.map((item) => {
      if (item[0] === "e") {
        eNum = eNum + 1;
        eArray.push(item[1]);
      } else if (item[0] === "p") {
        pNum = pNum + 1;
        pArray.push(item[1]);
      }
    });
    return {
      eNum: eNum,
      pNum: pNum,
      eArray: eArray.concat(),
      pArray: pArray.concat(),
    };
  };

  const renderMenu = () => {
    return (
      <Box className={"post_menu"}>
        <Button
          className={
            "post_menu_item" + (curLabel === "Post"
              ? " post_menu_item_selected"
              : " post_menu_item_unselected")
          }
          variant="contained"
          onClick={() => {
            setListenData([]);
            setNewData([]);
            setCurLabel("Post");
          }}
        >
          {"Post"}
        </Button>
        <Button
          className={"post_menu_item" + (curLabel === "Post & Reply"
            ? " post_menu_item_selected"
            : " post_menu_item_unselected")}
          variant="contained"
          onClick={() => {
            setListenData([]);
            setNewData([]);
            setCurLabel("Post & Reply");
          }}
        >
          {"Post & Reply"}
        </Button>
      </Box>
    );
  };

  const renderNewAvatar = () => {
    if (newData.length === 0) {
      return null;
    }
    let avatars = [];
    let count = Math.min(newData.length, 3);
    for (var i = 0; i < count; i++) {
      const item = newData[i];
      avatars.push(
        <GCardAvatar
          className={"avatar"}
          key={i}
          note={{ ...item }}
        ></GCardAvatar>
      );
    }
    return <Box className={"new_data_avatars"}>{avatars}</Box>;
  };

  const renderNewData = () => {
    if (newData.length === 0) {
      return null;
    }
    return (
      <Box
        className={"post_new_data"}
        onClick={() => {
          //
          setData(newData.concat(data));
          setListenData([]);
          setNewData([]);
          setSinceTime(gNoteCache.maxTime());
        }}
      >
        {renderNewAvatar()}
        <Typography className={"new_data_num"}>{newData.length}</Typography>
      </Box>
    );
  };

  const renderContent = () => {
    return (
      <List className={"list_bg"}>
        {data.map((item, index) => {
          if (curLabel === "Post") {
            let retInfo = parseNote(item);
            if (retInfo.eNum > 0) {
              return null;
            }
          }
          if (item.kind === EventKind.TextNote) {
            return (
              <GCardNote
                key={"post-reply-note" + index + "-" + item.pubkey}
                note={{ ...item }}
              />
            );
          } else if (item.kind === EventKind.Repost) {
            return (
              <GCardNoteRepost
                key={"post-reply-repost" + index + "-" + item.pubkey}
                note={{ ...item }}
              />
            );
          } else {
            return null;
          }
        })}
      </List>
    );
  };

  return (
    <Paper className={"post_reply_bg"} elevation={0}>
      {renderMenu()}
      <Button
        className={"post_button"}
        onClick={() => {
          postNote(null);
        }}
      />
      {renderNewData()}
      {renderContent()}
      <Typography
        className={"post_loadmore"}
        onClick={() => {
          loadMore();
        }}
      >
        {"LOAD MORE"}
      </Typography>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={fetching}
        onClick={() => { }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
};

export default GPostReply;
