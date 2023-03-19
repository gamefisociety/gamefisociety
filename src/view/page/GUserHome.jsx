import { React, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import GCardUser from "components/GCardUser";
import GCardNote from "components/GCardNote";
import Typography from "@mui/material/Typography";
import TimelineCache, { target_node_cache_flag } from "db/TimelineCache";
import { EventKind } from "nostr/def";
import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { useFollowPro } from "nostr/protocal/FollowPro";
import { BuildSub } from "nostr/NostrUtils";
import { System } from "nostr/NostrSystem";
import icon_back from "../../asset/image/social/icon_back.png";
import "./GUserHome.scss";

let lastPubKey = "";

const GUserHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const TLCache = TimelineCache();
  console.log("GProfile enter", location);
  const { info, pubkey } = location.state;
  //
  const [notes, setNotes] = useState([]);
  const [ownRelays, setOwnRelays] = useState({});
  const [ownFollows, setOwnFollows] = useState([]);
  //
  const textNotePro = useTextNotePro();
  const followPro = useFollowPro();
  const fetchTextNote = (pub) => {
    //
    // const curRelay = "wss://nos.lol";
    const filterTextNote = textNotePro.get();
    filterTextNote.authors = [pub];
    // filterTextNote['#p'] = [pub];
    filterTextNote.limit = 50;
    const filterFollowPro = followPro.getFollows(pub);
    let textNote = BuildSub("profile_note_follow", [
      filterTextNote,
      filterFollowPro,
    ]);
    let follow_create_at = 0;
    System.BroadcastSub(
      textNote,
      (tag, client, msg) => {
        if (tag === "EOSE") {
          let target_note_cache = TLCache.get(target_node_cache_flag);
          if (target_note_cache) {
            setNotes(target_note_cache.concat());
          }
          System.BroadcastClose(textNote, client, null);
        } else if (tag === "EVENT") {
          if (msg.kind === EventKind.TextNote) {
            console.log("BroadcastSub textNote", msg);
            TLCache.pushTargetNote(msg);
            // dataCaches.push(msg);
          } else if (msg.kind === EventKind.ContactList) {
            console.log("profile_note_follow", client.addr, msg);
            if (msg.created_at < follow_create_at) {
              return;
            }
            follow_create_at = msg.created_at;
            if (msg.content && msg.content !== "") {
              let relays = JSON.parse(msg.content);
              setOwnRelays(relays);
            }
            if (msg.tags && msg.tags.length > 0) {
              setOwnFollows(msg.tags.concat());
            }
          }
        }
      },
      null
    );
  };

  useEffect(() => {
    console.log("profile info", info);
    console.log("profile user", lastPubKey, "pub", pubkey);
    if (pubkey && lastPubKey !== pubkey) {
      lastPubKey = pubkey;
      fetchTextNote(pubkey);
    }
    return () => {};
  }, [pubkey]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "960px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        my: "24px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Box
          className={"goback"}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
          onClick={() => {
            navigate(-1);
          }}
        >
          <img src={icon_back} width="38px" alt="icon_back" />
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
      </Box>
      <GCardUser
        profile={{ ...info }}
        pubkey={pubkey}
        ownFollows={ownFollows.concat()}
        ownRelays={{ ...ownRelays }}
      />
      <List sx={{ width: "100%", minHeight: "800px", overflow: "auto" }}>
        {notes.map((item, index) => (
          <GCardNote
            key={"profile-note-index" + index}
            note={{ ...item.msg }}
            info={info}
          />
        ))}
      </List>
    </Box>
  );
};

export default GUserHome;
