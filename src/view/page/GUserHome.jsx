import { React, useEffect, useState } from "react";
import "./GUserHome.scss";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import GCardUser from "components/GCardUser";
import GCardNote from "components/GCardNote";
import GCardNoteRepost from "components/GCardNoteRepost";
import Typography from "@mui/material/Typography";
import UserNoteCache from "db/UserNoteCache";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { useFollowPro } from "nostr/protocal/FollowPro";
import { useRepostPro } from "nostr/protocal/RepostPro";
import { useReactionPro } from "nostr/protocal/ReactionPro";
import { BuildSub } from "nostr/NostrUtils";
import { EventKind } from "nostr/def";
import icon_back from "../../asset/image/social/icon_back.png";

const createNostrWorker = createWorkerFactory(() => import('worker/nostrRequest'));

const GUserHome = (props) => {

  const nostrWorker = useWorker(createNostrWorker);
  const { pubkey } = useParams();
  // console.log("GUserHome enter", pubkey);
  const navigate = useNavigate();
  const user_note_cache = UserNoteCache();
  const [info, setInfo] = useState(null);
  const [notes, setNotes] = useState([]);
  const [ownRelays, setOwnRelays] = useState(null);
  const [ownFollows, setOwnFollows] = useState([]);
  const textNotePro = useTextNotePro();
  const MetaPro = useMetadataPro();
  const followPro = useFollowPro();
  const repostPro = useRepostPro();
  const reactionPro = useReactionPro();
  //
  const fetchTextNote = (pub) => {
    const filterMeta = MetaPro.get(pubkey);
    const filterTextNote = textNotePro.get();
    filterTextNote.authors = [pub];
    filterTextNote.limit = 50;
    const filterFollowPro = followPro.getFollows(pub);
    const filterRepostPro = repostPro.get(pub);
    const filterReactionPro = reactionPro.get(pub);
    let profileNote = BuildSub("profile_note", [
      filterMeta,
      filterTextNote,
      filterFollowPro,
      filterRepostPro,
      filterReactionPro,
    ]);
    let metadata_time = 0;
    let contactlist = null;
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
        } else if (item.kind === EventKind.Repost) {
          //push in cache
          console.log('fetch_user_profile Repost', item);
          user_note_cache.pushNote(item.pubkey, item);
          //
        } else if (item.kind === EventKind.Reaction) {
          //push in cache
          console.log('fetch_user_profile Reaction', item);
          // user_note_cache.pushNote(item.pubkey, item);
          //
        } else if (item.kind === EventKind.ContactList) {
          if (contactlist === null || contactlist.created_at < item.created_at) {
            contactlist = { ...item };
            if (item.content && item.content !== "") {
              let relays = JSON.parse(item.content);
              setOwnRelays({ ...relays });
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
          sx={{
            cursor: "pointer",
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
        ownRelays={ownRelays}
      />
      <List sx={{ width: "100%", minHeight: "800px", overflow: "auto" }}>
        {notes.map((item, index) => {
          // console.log('userhome-note-index', item);
          if (item.kind === EventKind.TextNote) {
            return <GCardNote key={"userhome-note-index" + index + '-' + pubkey} note={{ ...item }} />;
          } else if (item.kind === EventKind.Repost) {
            return <GCardNoteRepost key={"userhome-note-index" + index + '-' + pubkey} note={{ ...item }} />;
          } else {
            return null;
          }
        })}
      </List>
    </Box>
  );
};

export default GUserHome;
