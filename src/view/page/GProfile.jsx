import { React, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Drawer from "@mui/material/Drawer";
import GCardUser from "components/GCardUser";
import GCardNote from "components/GCardNote";
import GFTChat from "./GFTChat";

import { EventKind } from "nostr/def";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { useFollowPro } from "nostr/protocal/FollowPro";
import { BuildSub } from "nostr/NostrUtils";
import { System } from "nostr/NostrSystem";

import "./GProfile.scss";

let lastPubKey = "";

const GProfile = () => {
  const location = useLocation();
  console.log("GProfile enter", location);
  const { info, pubkey } = location.state;
  //
  const [chatDrawer, setChatDrawer] = useState(false);
  const [notes, setNotes] = useState([]);
  const [ownRelays, setOwnRelays] = useState({});
  const [ownFollows, setOwnFollows] = useState([]);
  //
  const TextNotePro = useTextNotePro();
  const FollowPro = useFollowPro();
  const fetchTextNote = (pub) => {
    //
    const curRelay = "wss://nos.lol";
    const filterTextNote = TextNotePro.get();
    filterTextNote.authors = [pub];
    const filterFollowPro = FollowPro.get(pubkey);
    let textNote = BuildSub('profile_note_follow', [filterTextNote, filterFollowPro]);
    let dataCaches = [];
    let follow_create_at = 0;
    console.log('BroadcastSub', textNote);
    System.BroadcastSub(textNote, (tag, client, msg) => {
      if (tag === 'EOSE') {
        setNotes(dataCaches.concat());
        System.BroadcastClose(textNote, client, null);
      } else if (tag === 'EVENT') {
        if (msg.kind === EventKind.TextNote) {
          dataCaches.push(msg);
        } else if (msg.kind === EventKind.ContactList) {
          console.log('profile_note_follow', msg);
          if (msg.created_at < follow_create_at) {
            return;
          }
          follow_create_at = msg.created_at;
          if (msg.content && msg.content !== '') {
            let relays = JSON.parse(msg.content);
            setOwnRelays(relays);
          }
          if (msg.tags && msg.tags.length > 0) {
            setOwnFollows(msg.tags.concat());
          }
        }
      }
    },
      curRelay
    );
  };

  useEffect(() => {
    console.log("profile user", lastPubKey, "pub", pubkey);
    if (pubkey && lastPubKey !== pubkey) {
      lastPubKey = pubkey;
      fetchTextNote(pubkey);
    }
    return () => { };
  }, [pubkey]);

  //
  useEffect(() => {
    return () => {
      //
    };
  }, []);

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
      <GCardUser
        profile={{ ...info }}
        pubkey={pubkey}
        follows={ownFollows.concat()}
        relays={{ ...ownRelays }}
        chatOnClick={(param) => {
          setChatDrawer(true);
        }}
      />
      <List sx={{ width: "100%", minHeight: "800px", overflow: "auto" }}>
        {notes.map((item, index) => (
          <GCardNote
            key={"profile-note-index" + index}
            pubkey={item.pubkey}
            content={item.content}
            time={item.created_at}
            info={info}
          />
        ))}
      </List>
      <Drawer
        anchor={"right"}
        open={chatDrawer}
        onClose={() => {
          setChatDrawer(false);
        }}
      >
        <GFTChat
          chatPK={pubkey}
          closeHandle={() => {
            setChatDrawer(false);
          }}
        />
      </Drawer>
      {/* <Box sx={{ height: '12px' }}></Box> */}
    </Box>
  );
};

export default GProfile;
