import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, Link } from "@mui/material";
import copy from "copy-to-clipboard";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import logo_chat from "../asset/image/social/logo_chat.png";
import logo_lighting from "../asset/image/social/logo_lighting.png";
import logo_key from "../asset/image/social/logo_key.png";
import logo_copy from "../asset/image/social/logo_copy.png";
import logo_link from "../asset/image/social/logo_link.png";
import "./GCardUser.scss";

import { useFollowPro } from "nostr/protocal/FollowPro";
import { System } from "nostr/NostrSystem";
import { setRelays, setFollows } from "module/store/features/profileSlice";
//
const default_banner =
  "https://gateway.pinata.cloud/ipfs/QmSif6VWuJ9X7phY8wPMwxR8xPQdDq3ABE93Yo7BUwj68C";
const default_avatar =
  "https://gateway.pinata.cloud/ipfs/Qmd7rgbD9sLRQiMHZRYw1QD4j9WVgBZ3uzdtYehQuXHZq4";


const GCardUser = (props) => {
  const { follows } = useSelector(s => s.profile);
  const { profile, pubkey, ownFollows, ownRelays } = props;
  const dispatch = useDispatch();
  //
  const relayMap = new Map();
  for (const [k, v] of Object.entries(ownRelays)) {
    if (k.startsWith("wss://") || k.startsWith("ws://")) {
      relayMap.set(k, v);
    }
  }
  const followPro = useFollowPro();
  const addFollow = async (pubkey) => {
    let event = await followPro.addFollow(pubkey);
    let newFollows = follows.concat();
    newFollows.push(pubkey);
    System.BroadcastEvent(event, (tags, client, msg) => {
      if (tags === 'OK' && msg.ret === true) {
        let followsInfo = {
          create_at: event.CreatedAt,
          follows: newFollows,
        };
        dispatch(setFollows(followsInfo));
      }
    });
  }

  const removeFollow = async (pubkey) => {
    let event = await followPro.removeFollow(pubkey);
    let newFollows = follows.concat();
    newFollows.splice(follows.indexOf(pubkey), 1);
    System.BroadcastEvent(event, (tags, client, msg) => {
      if (tags === 'OK' && msg.ret === true) {
        let followsInfo = {
          create_at: event.CreatedAt,
          follows: newFollows,
        };
        dispatch(setFollows(followsInfo));
      }
    })
  }

  const isFollow = (key) => {
    // console.log('isFollow', key, follows.includes(key), follows);
    return follows.includes(key);
  }

  useEffect(() => {
    // console.log("profile", profile);
    return () => { };
  }, [props]);

  //#1F1F1F
  return (
    <Card sx={{ width: "100%", backgroundColor: "transparent" }}>
      <CardContent
        sx={{
          padding: "12px",
        }}
      >
        <CardMedia
          component="img"
          sx={{ height: "140px", borderRadius: "6px" }}
          src="localProfile.banner"
          image={profile.banner ? profile.banner : default_banner}
          alt="no banner"
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: "52px",
            paddingRight: "52px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-end",
              paddingTop: "5px",
            }}
          >
            <Avatar
              sx={{ width: "86px", height: "86px", mt: "-43px" }}
              edge="end"
              alt="GameFi Society"
              src={profile.picture ? profile.picture : default_avatar}
            />
            <Button
              sx={{
                width: "40px",
                height: "40px",
              }}
              onClick={() => { }}
            >
              <img src={logo_lighting} width="40px" alt="lighting" />
            </Button>
            <Button
              sx={{
                width: "40px",
                height: "40px",
              }}
              onClick={() => {
                props.chatOnClick(pubkey);
              }}
            >
              <img src={logo_chat} width="40px" alt="chat" />
            </Button>
            <Button
              variant="contained"
              sx={{
                width: "96px",
                height: "36px",
                backgroundColor: "#006CF9",
                borderRadius: "18px",
                color: "text.primary"
              }}
              onClick={() => {
                if (isFollow(pubkey) === true) {
                  removeFollow(pubkey);
                } else {
                  addFollow(pubkey);
                }
              }}
            >
              {isFollow(pubkey) === true ? 'Unfollow' : 'Follow'}
            </Button>
          </Box>
          <Box
            sx={{
              marginTop: "15px",
              paddingBottom: "25px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              borderBottom: 1,
              borderColor: "#191A1B",
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                fontFamily: "Saira",
                fontWeight: "500",
              }}
              color="#FFFFFF"
              align={"left"}
            >
              {profile.display_name
                ? profile.display_name
                : "Nostr#" + pubkey.substring(pubkey.length - 4, pubkey.length)}
            </Typography>
            {profile.name ? (
              <Typography
                sx={{
                  fontSize: "14px",
                  fontFamily: "Saira",
                  fontWeight: "500",
                }}
                color="#919191"
                align={"left"}
              >
                {"@" + profile.name}
              </Typography>
            ) : null}
            <Box
              sx={{
                marginTop: "30px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  borderRadius: "15px",
                  backgroundColor: "#272727",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  paddingTop: "6px",
                  paddingBottom: "6px",
                }}
              >
                <img src={logo_key} width="20px" alt="key" />
                <Typography
                  sx={{
                    marginLeft: "6px",
                    fontSize: "12px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color="#919191"
                  align={"left"}
                >
                  {pubkey}
                </Typography>
              </Box>
              <Button
                sx={{
                  width: "36px",
                  height: "36px",
                }}
                onClick={() => {
                  if (copy(pubkey)) {
                    console.log("copy success");
                  } else {
                    console.log("copy failed");
                  }
                }}
              >
                <img src={logo_copy} width="36px" alt="copy" />
              </Button>
            </Box>
          </Box>
          {profile.about ? (
            <Typography
              sx={{
                marginTop: "24px",
                width: "100%",
                fontSize: "14px",
                fontFamily: "Saira",
                fontWeight: "500",
                wordWrap: "break-word",
              }}
              color="#FFFFFF"
              align={"left"}
            >
              {profile.about}
            </Typography>
          ) : null}
          {profile.website ? (
            <Box
              sx={{
                marginTop: "12px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <img src={logo_link} width="20px" alt="link" />
              <Link
                href={profile.website}
                underline="always"
                sx={{
                  marginLeft: "4px",
                  fontSize: "14px",
                  fontFamily: "Saira",
                  fontWeight: "500",
                  fontColor: "#00B7FF",
                }}
              >
                {profile.website}
              </Link>
            </Box>
          ) : null}
          <Box
            sx={{
              paddingTop: "25px",
              paddingBottom: "25px",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              borderBottom: 1,
              borderColor: "#191A1B",
            }}
          >
            <Box
              sx={{
                marginRight: "28px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  marginRight: "8px",
                }}
                variant={'body'}
                color="text.primary"
                align={"center"}
              >
                {ownFollows.length}
              </Typography>
              <Typography
                variant={'body'}
                color="text.disabled"
                align={"center"}
              >
                {'Following'}
              </Typography>
            </Box>
            <Box
              sx={{
                marginRight: "28px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  marginRight: "8px",
                }}
                variant={'body'}
                color="text.primary"
                align={"center"}
              >
                {11}
              </Typography>
              <Typography
                variant={'body'}
                color="text.disabled"
                align={"center"}
              >
                {'Followers'}
              </Typography>
            </Box>
            <Box
              sx={{
                marginRight: "28px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  mr: "8px",
                }}
                variant={'body'}
                color="text.primary"
                align={"center"}
              >
                {relayMap.size}
              </Typography>
              <Typography
                variant={'body'}
                color="text.disabled"
                align={"center"}
              >
                {'Relays'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default React.memo(GCardUser);
