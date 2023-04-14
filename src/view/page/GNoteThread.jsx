import React, { useEffect, useState } from "react";
import "./GNoteThread.scss";

import { useNavigate, useParams } from "react-router-dom";
import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";

import { BuildSub, ParseNote } from "nostr/NostrUtils";
import { useTextNotePro } from "nostr/protocal/TextNotePro";
import TimelineCache from "db/TimelineCache";
import GlobalNoteCache from 'db/GlobalNoteCache';
import UserDataCache from "db/UserDataCache";

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import GCardNote from "components/GCardNote";
import icon_back from "../../asset/image/social/icon_back.png";

const createThreadWorker = createWorkerFactory(() =>
  import("worker/threadRequest")
);

const GNoteThread = () => {
  const threadWorker = useWorker(createThreadWorker);
  const navigate = useNavigate();
  const { noteid } = useParams();
  const [curNote, setCurNote] = useState(null);
  const [noteRet, setNoteRet] = useState(null);
  const [notesRoot, setNotesRoot] = useState([]);
  const [notesReply, setNotesReply] = useState([]);
  const textnotePro = useTextNotePro();
  const TLCache = TimelineCache();

  const fetchTarget = (targetId) => {
    //
    let filterArray = [];
    let filterRoot = textnotePro.getEventsByIds([targetId]);
    filterArray.push(filterRoot);
    const subThread = BuildSub("thread_note_target", filterArray);
    threadWorker.fetch_thread_note(subThread, null, (datas, client) => {
      if (datas.length === 1) {
        setCurNote({ ...datas[0] });
      }
    });
  }

  const fetchMainNotes = (rootNodeId, replyNoteId) => {
    let filterArray = [];
    //fetch [main note] and [main note] reply
    if (rootNodeId !== 0) {
      let tmpMainNote = TLCache.getThreadNote(rootNodeId);
      if (!tmpMainNote) {
        let filterRoot = textnotePro.getEventsByIds([rootNodeId]);
        filterArray.push(filterRoot);
      }
      const filterTextNote = textnotePro.getEvents([rootNodeId]);
      filterArray.push(filterTextNote);
    }
    //fetch [reply note] and [reply note] reply
    if (replyNoteId !== 0) {
      let tmpReplyNote = TLCache.getThreadNote(replyNoteId);
      if (!tmpReplyNote) {
        let filterReply = textnotePro.getEventsByIds([replyNoteId]);
        filterArray.push(filterReply);
      }
    }
    const subThread = BuildSub("root_note", filterArray);
    threadWorker.fetch_thread_note(subThread, null, (datas, client) => {
      // console.log('fetchMainNotes', datas);
      let tmpNoteIds = [];
      datas.map((item) => {
        TLCache.pushThreadNote(item);
        if (item.id !== rootNodeId || item.id !== replyNoteId) {
          tmpNoteIds.push(item.id);
        }
      });
      let no_re_note_ids = new Set([...tmpNoteIds]);
      setNotesRoot(Array.from(no_re_note_ids));
    });
  };

  const fetchReplyNotesToLocal = (nodeId) => {
    if (nodeId === 0) {
      return;
    }
    const filterTextNote = textnotePro.getEvents([nodeId]);
    const subThread = BuildSub("reply_note", [filterTextNote]);
    threadWorker.fetch_thread_note(subThread, null, (datas, client) => {
      console.log("fetchReplyNotes", datas);
      let tmpNoteIds = [];
      datas.map((item) => {
        TLCache.pushThreadNote(item);
        tmpNoteIds.push(item.id);
      });
      let no_re_note_ids = new Set([...tmpNoteIds]);
      setNotesReply(Array.from(no_re_note_ids));
    });
  };

  //fetch target note rela
  useEffect(() => {
    if (!noteRet) {
      return;
    }
    fetchMainNotes(noteRet.root_note_id, noteRet.reply_note_id);
    fetchReplyNotesToLocal(noteRet.local_note);
    return () => { };
  }, [noteRet]);

  //parse target note
  useEffect(() => {
    if (!curNote) {
      return;
    }
    TLCache.clear();
    TLCache.pushThreadNote(curNote);
    let ret = ParseNote(curNote);
    setNoteRet({ ...ret });
    return () => { };
  }, [curNote]);

  //fetch target note
  useEffect(() => {
    let globalNoteCache = GlobalNoteCache();
    let note = globalNoteCache.getNote(noteid);
    if (note) {
      setCurNote({ ...note });
    } else {
      fetchTarget(noteid);
    }
    return () => { };
  }, [noteid]);

  const renderRootNote = () => {
    if (!noteRet || noteRet.root_note_id === 0) {
      return null;
    }
    let targetNote = TLCache.getThreadNote(noteRet.root_note_id);
    if (targetNote === null) {
      return null;
    }
    return (
      <Stack sx={{ width: "100%" }} direction={"column"}>
        <GCardNote note={{ ...targetNote }} />
      </Stack>
    );
  };

  const renderRootNotes = () => {
    if (!noteRet || noteRet.root_note_id === 0) {
      return null;
    }
    if (noteRet.reply_note_id !== 0) {
      return null;
    }
    if (notesRoot.length === 0) {
      return (
        <Typography sx={{ width: "100%" }} align={"center"} color={"#656565"}>
          {"No Replies"}
        </Typography>
      );
    }
    return (
      <Stack className={"note_in"}>
        <Divider sx={{ width: "100%", py: "6px", color: "white" }} light={true}>
          {"ROOT REPLIES"}
        </Divider>
        {notesRoot.map((item, index) => {
          let targetNote = TLCache.getThreadNote(item);
          if (targetNote === null) {
            return null;
          }
          return (
            <GCardNote key={"other_node_" + index} note={{ ...targetNote }} />
          );
        })}
      </Stack>
    );
  };

  const renderReplyNote = () => {
    if (!noteRet || noteRet.reply_note_id === 0) {
      return null;
    }
    if (noteRet.reply_note_id === noteRet.root_note_id) {
      return null;
    }
    let targetNote = TLCache.getThreadNote(noteRet.reply_note_id);
    if (targetNote === null) {
      return null;
    }
    return (
      <Stack
        className={
          noteRet.reply_note_id === noteRet.local_note ? "note_in" : "note_out"
        }
      >
        <GCardNote note={{ ...targetNote }} />
      </Stack>
    );
  };

  const renderLocalNote = () => {
    if (!noteRet || noteRet.local_note === 0) {
      return null;
    }
    if (noteRet.local_note === noteRet.root_note_id) {
      return null;
    }
    if (noteRet.local_note === noteRet.reply_note_id) {
      return null;
    }
    let targetNote = TLCache.getThreadNote(noteRet.local_note);
    if (targetNote === null) {
      return null;
    }
    return (
      <Stack className={"note_in"}>
        <GCardNote note={{ ...curNote }} />
      </Stack>
    );
  };

  const renderReplyNotes = () => {
    if (!noteRet || noteRet.reply_note_id === 0) {
      return null;
    }
    if (notesReply.length === 0) {
      return (
        <Typography sx={{ width: "100%" }} align={"center"} color={"#656565"}>
          {"No Replies"}
        </Typography>
      );
    }
    return (
      <Stack className={"note_out"}>
        <Divider sx={{ width: "100%", py: "6px", color: "white" }} light={true}>
          {"REPLY TO"}
        </Divider>
        {notesReply.map((item, index) => {
          let targetNote = TLCache.getThreadNote(item);
          if (targetNote === null) {
            return null;
          }
          return (
            <GCardNote key={"reply_node_" + index} note={{ ...targetNote }} />
          );
        })}
      </Stack>
    );
  };

  const renderContent = () => {
    console.log("GNoteThread renderContent", curNote, noteRet);
    if (!curNote) {
      return null;
    }
    return (
      <Stack sx={{ width: "100%" }} direction={"column"} alignItems={"center"}>
        {renderRootNote()}
        {renderRootNotes()}
        {renderReplyNote()}
        {renderLocalNote()}
        {renderReplyNotes()}
      </Stack>
    );
  };

  // console.log('GNoteThread', note, rootNote, replyNote, notesRoot, notesReply);
  return (
    <Paper className="node_thread_bg" elevation={1}>
      <Box className={'thread_header'}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            cursor: "pointer"
          }}
          onClick={() => {
            navigate(-1);
          }}
        >
          <Box component="img" src={icon_back} width="38px" alt="icon_back" />
          <Typography
            sx={{
              marginLeft: "5px",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
          >
            {"Global"}
          </Typography>
        </Box>
        <Typography
          align={"center"}
          variant="h5"
        >
          {"THREAD"}
        </Typography>
        <Box sx={{ width: '2px', height: '2px' }}></Box>
      </Box>
      {renderContent()}
    </Paper>
  );
};

export default GNoteThread;
