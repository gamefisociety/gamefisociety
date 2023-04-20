import { React, useEffect, useState } from "react";
import "./GUserHome.scss";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";
import { useSelector } from "react-redux";
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

const createNostrWorker = createWorkerFactory(() =>
  import("worker/nostrRequest")
);

const GUserHome = (props) => {
  const nostrWorker = useWorker(createNostrWorker);
  const { pubkey } = useParams();
  // console.log("GUserHome enter", pubkey);
  const navigate = useNavigate();
  const { publicKey } = useSelector((s) => s.login);
  const user_note_cache = UserNoteCache();
  const [info, setInfo] = useState(null);
  const [notes, setNotes] = useState([]);
  const [ownRelays, setOwnRelays] = useState(null);
  const [ownFollows, setOwnFollows] = useState([]);
  const textNotePro = useTextNotePro();
  const MetaPro = useMetadataPro();
  const followPro = useFollowPro();
  const reactionPro = useReactionPro();
  //
  const fetchTextNote = (pub) => {
    const filterTextNote = textNotePro.getNoteAndRepost();
    filterTextNote.authors = [pub];
    filterTextNote.limit = 50;
    const filterReactionPro = reactionPro.get(pub);
    let profileTextNote = BuildSub("profile_textnote", [
      filterTextNote,
      filterReactionPro,
    ]);
    nostrWorker.fetch_user_profile(profileTextNote, null, (data, client) => {
      // console.log('fetch_user_textnote data', data);
      data.map((item) => {
        if (item.kind === EventKind.TextNote) {
          user_note_cache.pushNote(item.pubkey, item);
        } else if (item.kind === EventKind.Repost) {
          // console.log('fetch_user_profile Repost', item);
          user_note_cache.pushNote(item.pubkey, item);
        }
      });
      //user_note_cache
      let target_note_cache = user_note_cache.get(pubkey);
      if (target_note_cache) {
        setNotes(target_note_cache.concat());
      }
      // console.log('user home', target_note_cache);
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

  const isSelf = (key) => {
    return publicKey === key;
  };

  const renderBack = () => {
    return (
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
    );
  };

  return (
    <Box className="userhome-bg">
      {isSelf(pubkey) === false ? renderBack() : null}
      <GCardUser pubkey={pubkey} />
      <List sx={{ width: "100%", minHeight: "800px", overflow: "auto" }}>
        {notes.map((item, index) => {
          // console.log('userhome-note-index', item);
          if (item.kind === EventKind.TextNote) {
            return (
              <GCardNote
                key={"userhome-note-index" + index + "-" + pubkey}
                note={{ ...item }}
              />
            );
          } else if (item.kind === EventKind.Repost) {
            return (
              <GCardNoteRepost
                key={"userhome-note-index" + index + "-" + pubkey}
                note={{ ...item }}
              />
            );
          } else {
            return null;
          }
        })}
      </List>
    </Box>
  );
};

export default GUserHome;
