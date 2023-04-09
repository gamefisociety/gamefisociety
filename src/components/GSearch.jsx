import React, { useEffect, useState } from "react";
import "./GSearch.scss";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils";
//
import Stack from "@mui/material/Stack";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { parseId } from "nostr/Util";
import { EventKind } from "nostr/def";

const GSearch = () => {
  //
  const [tips, setTips] = useState({
    showUser: false,
    showEvent: false,
    showTag: false,
  });
  //
  const navigate = useNavigate();
  const [searchProp, setSearchProp] = React.useState({
    value: "",
    nip19: false,
    open: false,
    anchorEl: null,
  });

  const TextNotePro = useTextNotePro();
  const fetchNoteEvent = (eventId, callback) => {
    let filterTextNote = TextNotePro.getEvents([eventId]);
    let subMeta = BuildSub("textnote_search", [filterTextNote]);
    System.BroadcastSub(subMeta, (tag, client, msg) => {
      if (!msg) return;
      if (tag === "EOSE") {
        System.BroadcastClose(subMeta, client, null);
      } else if (tag === "EVENT") {
        console.log('event textnote', msg);
        if (msg.id !== eventId || msg.kind !== EventKind.TextNote) {
          return;
        }
        if (callback) {
          callback(msg);
        }
      }
    });
  };

  const searchNote = (msg) => {
    if (msg.kind === EventKind.TextNote) {
      // navigate("/notethread", {
      //   state: {
      //     note: { ...msg },
      //     info: null,
      //   },
      // });
    }
  };

  const handleSearch = (e, value) => {
    searchProp.value = value;
    if (value.startsWith("npub") && value.length === 63) {
      searchProp.nip19 = true;
      searchProp.open = true;
      searchProp.anchorEl = e.currentTarget;
      tips.showTag = false;
      tips.showEvent = false;
      tips.showUser = true;
      setTips({ ...tips });
    } else if (value.length === 64) {
      searchProp.nip19 = false;
      searchProp.open = true;
      searchProp.anchorEl = e.currentTarget;
      tips.showEvent = true;
      tips.showUser = true;
      tips.showTag = false;
      setTips({ ...tips });
    } else if (value.startsWith("#")) {
      searchProp.nip19 = false;
      searchProp.open = true;
      searchProp.anchorEl = e.currentTarget;
      tips.showEvent = false;
      tips.showUser = false;
      tips.showTag = true;
      setTips({ ...tips });
    }
    setSearchProp({ ...searchProp });
  };

  // loggedOut, publicKey 
  return (
    <Stack flexDirection="row" alignItems={'center'}>
      <TextField
        sx={{
          width: "450px",
          // borderColor: 'white',
        }}
        placeholder="Search input"
        value={searchProp.value}
        onChange={(e) => {
          if (e.target) {
            handleSearch(e, e.target.value);
          }
        }}
        InputProps={{
          sx: {
            height: "42px",
            borderRadius: "24px",
            backgroundColor: 'rgba(0,0,0,0.65)'
          },
          type: "search",
        }}
        SelectProps={{
          sx: { borderColor: "red" },
        }}
      />
      <Popover
        open={searchProp.open}
        anchorEl={searchProp.anchorEl}
        onClose={() => {
          searchProp.open = false;
          searchProp.anchorEl = null;
          setSearchProp({ ...searchProp });
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {
          tips.showUser && <Typography
            sx={{
              p: "18px",
              cursor: "pointer",
            }}
            color={"text.primary"}
            onClick={() => {
              tips.showEvent = false;
              tips.showUser = false;
              tips.showTag = false;
              setTips({ ...tips });
              //
              let pub = searchProp.value;
              if (searchProp.nip19 === true) {
                pub = parseId(searchProp.value);
              }
              navigate("/userhome/" + pub);
              //
              searchProp.value = "";
              searchProp.open = false;
              searchProp.anchorEl = null;
              setSearchProp({ ...searchProp });
            }}
          >
            {"Get Profile: " + searchProp.value}
          </Typography>
        }
        {
          tips.showEvent && <Typography
            sx={{
              p: "18px",
              cursor: "pointer",
            }}
            color={"text.primary"}
            onClick={() => {
              //
              tips.showEvent = false;
              tips.showUser = false;
              tips.showTag = false;
              setTips({ ...tips });
              //
              fetchNoteEvent(searchProp.value, searchNote);
              //
              searchProp.value = "";
              searchProp.open = false;
              searchProp.anchorEl = null;
              setSearchProp({ ...searchProp });
            }}
          >
            {"Get Event: " + searchProp.value}
          </Typography>
        }
        {
          tips.showTag && <Typography
            sx={{
              p: "18px",
              cursor: "pointer",
            }}
            color={"text.primary"}
            onClick={() => {
              //
              tips.showEvent = false;
              tips.showUser = false;
              tips.showTag = false;
              setTips({ ...tips });
              //
              // fetchNoteEvent(searchProp.value, searchNote);
              let tmp_tag = searchProp.value.substring(1);
              navigate('/global/' + tmp_tag);
              //
              searchProp.value = "";
              searchProp.open = false;
              searchProp.anchorEl = null;
              setSearchProp({ ...searchProp });
            }}
          >
            {"Get Note Tag: " + searchProp.value}
          </Typography>
        }
      </Popover>
    </Stack>
  );
};

export default React.memo(GSearch);
