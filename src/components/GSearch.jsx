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
  });
  //
  const navigate = useNavigate();
  const [searchProp, setSearchProp] = React.useState({
    value: "",
    nip19: false,
    open: false,
    anchorEl: null,
  });

  // const dispatch = useDispatch();
  // const { profile, relays } = useSelector((s) => s.profile);
  // const MetaPro = useMetadataPro();
  // const followPro = useFollowPro();
  // const fetchMeta = (pubkey, callback) => {
  //   let filterMeta = MetaPro.get(pubkey);
  //   let filterFollow = followPro.getFollows(pubkey);
  //   let subMeta = BuildSub("profile_contact_search", [filterMeta, filterFollow]);
  //   let SetMetadata_create_at = 0;
  //   let ContactList_create_at = 0;
  //   System.BroadcastSub(subMeta, (tag, client, msg) => {
  //     if (!msg) return;
  //     if (tag === "EOSE") {
  //       System.BroadcastClose(subMeta, client, null);
  //     } else if (tag === "EVENT") {
  //       if (msg.pubkey !== pubkey) {
  //         return;
  //       }
  //       if (
  //         msg.kind === EventKind.SetMetadata &&
  //         msg.created_at > SetMetadata_create_at
  //       ) {
  //         SetMetadata_create_at = msg.created_at;
  //         if (callback) {
  //           callback(msg);
  //         }
  //       } else if (
  //         msg.kind === EventKind.ContactList &&
  //         msg.created_at > ContactList_create_at
  //       ) {
  //         ContactList_create_at = msg.created_at;
  //         if (callback) {
  //           callback(msg);
  //         }
  //       }
  //     }
  //   });
  // };

  // const searchMetadata = (msg) => {
  //   if (msg.kind === EventKind.SetMetadata && msg.content !== "") {
  //     let tmpInfo = JSON.parse(msg.content);
  //     navigate("/userhome", { state: { pubkey: msg.pubkey } });
  //   }
  // };

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
      //
      tips.showEvent = false;
      tips.showUser = true;
      setTips({ ...tips });
    } else if (value.length === 64) {
      searchProp.nip19 = false;
      searchProp.open = true;
      searchProp.anchorEl = e.currentTarget;
      //
      tips.showEvent = true;
      tips.showUser = true;
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
      </Popover>
    </Stack>
  );
};

export default React.memo(GSearch);
