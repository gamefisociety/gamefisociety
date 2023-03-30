import { React, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import GCardUser from "components/GCardUser";
import GCardNote from "components/GCardNote";
import Typography from "@mui/material/Typography";
import UserNoteCache from "db/UserNoteCache";
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
  const { info, pubkey } = location.state;
  console.log("GProfile enter", location);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user_note_cache = UserNoteCache();
  const [notes, setNotes] = useState([]);
  const [ownRelays, setOwnRelays] = useState({});
  const [ownFollows, setOwnFollows] = useState([]);
  const textNotePro = useTextNotePro();
  const followPro = useFollowPro();
  let follow_create_at = 0;
  //
  const fetchTextNote = (pub) => {
    const filterTextNote = textNotePro.get();
    filterTextNote.authors = [pub];
    filterTextNote.limit = 50;
    const filterFollowPro = followPro.getFollows(pub);
    let textNote = BuildSub("profile_note_follow", [
      filterTextNote,
      filterFollowPro,
    ]);
    System.BroadcastSub(
      textNote,
      (tag, client, msg) => {
        if (tag === "EOSE") {
          let target_note_cache = user_note_cache.get(pubkey);
          if (target_note_cache) {
            console.log("target_note_cache", target_note_cache);
            setNotes(target_note_cache.concat());
          }
          System.BroadcastClose(textNote, client, null);
        } else if (tag === "EVENT") {
          if (msg.kind === EventKind.TextNote) {
            // console.log("BroadcastSub textNote", msg);
            user_note_cache.pushNote(pubkey, msg);
          } else if (msg.kind === EventKind.ContactList) {
            // console.log("profile_note_follow", client.addr, msg);
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
    if (pubkey && lastPubKey !== pubkey) {
      setNotes([]);
      lastPubKey = pubkey;
      fetchTextNote(pubkey);
    }
    return () => {
      //
    };
  }, [pubkey]);

  return (
    <Box className='userhome-bg'>
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
            key={"profile-note-index" + index + '-' + pubkey}
            note={{ ...item }}
            info={info}
          />
        ))}
      </List>
    </Box>
  );
};

export default GUserHome;
