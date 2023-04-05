import { React, useEffect, useState } from "react";
import "./GUserHome.scss";

import { useLocation, useNavigate } from "react-router-dom";
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import GCardUser from "components/GCardUser";
import GCardNote from "components/GCardNote";
import Typography from "@mui/material/Typography";
import UserNoteCache from "db/UserNoteCache";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { useFollowPro } from "nostr/protocal/FollowPro";
import { BuildSub } from "nostr/NostrUtils";
import { EventKind } from "nostr/def";
import icon_back from "../../asset/image/social/icon_back.png";

const createNostrWorker = createWorkerFactory(() => import('worker/nostrRequest'));

const GUserHome = () => {

  const nostrWorker = useWorker(createNostrWorker);

  const location = useLocation();
  const { pubkey } = location.state;
  console.log("GUserHome enter", pubkey);
  const navigate = useNavigate();
  const user_note_cache = UserNoteCache();
  const [info, setInfo] = useState(null);
  const [notes, setNotes] = useState([]);
  const [ownRelays, setOwnRelays] = useState({});
  const [ownFollows, setOwnFollows] = useState([]);
  const textNotePro = useTextNotePro();
  const MetaPro = useMetadataPro();
  const followPro = useFollowPro();
  //
  const fetchTextNote = (pub) => {
    const filterMeta = MetaPro.get(pubkey);
    const filterTextNote = textNotePro.get();
    filterTextNote.authors = [pub];
    filterTextNote.limit = 50;
    const filterFollowPro = followPro.getFollows(pub);
    let profileNote = BuildSub("profile_note", [
      filterMeta,
      filterTextNote,
      filterFollowPro,
    ]);
    //
    let metadata_time = 0;
    let contactlist_time = 0;
    nostrWorker.fetch_user_profile(profileNote, null, (data, client) => {
      console.log('fetch_user_profile data', data);
      data.map((item) => {
        if (item.kind === EventKind.SetMetadata) {
          console.log('fetch_user_profile data', item);
          if (info === null || item.created_at > metadata_time) {
            metadata_time = item.created_at;
            if (item.content !== "") {
              setInfo(JSON.parse(item.content));
            }
          }
        } else if (item.kind === EventKind.TextNote) {
          //push in cache
          user_note_cache.pushNote(item.pubkey, item);
          //
        } else if (item.kind === EventKind.ContactList) {
          let update_flag = false;
          if (contactlist_time === 0) {
            update_flag = true;
          } else if (item.created_at > contactlist_time) {
            update_flag = true;
          }
          if (update_flag) {
            contactlist_time = item.created_at;
            if (item.content && item.content !== "") {
              let relays = JSON.parse(item.content);
              setOwnRelays(relays);
            }
            if (item.tags && item.tags.length > 0) {
              setOwnFollows(item.tags.concat());
            }
          }
        }
      });
      //user_note_cache
      let target_note_cache = user_note_cache.get(pubkey);
      if (target_note_cache) {
        setNotes(target_note_cache.concat());
      }
      console.log('user home', target_note_cache);
    });
  };

  useEffect(() => {
    setNotes([]);
    setInfo(null);
    fetchTextNote(pubkey);
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
        {notes.map((item, index) => (<GCardNote key={"userhome-note-index" + index + '-' + pubkey} note={{ ...item }} />))}
      </List>
    </Box>
  );
};

export default GUserHome;
