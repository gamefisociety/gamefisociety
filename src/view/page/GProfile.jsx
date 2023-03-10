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
  // console.log('GCardUser profile', profile);

  const TextNotePro = useTextNotePro();
  const FollowPro = useFollowPro();

  const fetchTextNote = (pub) => {
    //
    const curRelays = [];
    curRelays.push("wss://nos.lol");
    //
    const textNote = TextNotePro.get();
    textNote.Authors = [pub];
    const followPro = FollowPro.get(pubkey);
    textNote.childs.push(followPro);
    //
    let dataCaches = [];
    System.Broadcast(textNote, 1, (tag, client, msg) => {
      if (tag === 'EOSE') {
        setNotes(dataCaches.concat());
        System.BroadcastClose(textNote.Id, client, null);
      } else if (tag === 'EVENT') {
        if (msg.kind === EventKind.TextNote) {
          dataCaches.push(msg);
        } else if (msg.kind === EventKind.ContactList) {
          let relays = JSON.parse(msg.content);
          setOwnRelays(relays);
          if (msg.tags.length > 0) {
            setOwnFollows(msg.tags.concat());
          }
          console.log('textNote msgs relays', relays);
        }
      }
    },
      curRelays
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
