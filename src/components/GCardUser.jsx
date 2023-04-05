import React, { useEffect, useState, useRef } from "react";
import "./GCardUser.scss";

import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, Link } from "@mui/material";
import copy from "copy-to-clipboard";
import { setChatDrawer } from "module/store/features/dialogSlice";
import { default_banner, default_avatar } from "module/utils/xdef";
import logo_chat from "../asset/image/social/logo_chat.png";
import logo_lighting from "../asset/image/social/logo_lighting.png";
import logo_key from "../asset/image/social/logo_key.png";
import logo_copy from "../asset/image/social/logo_copy.png";
import logo_link from "../asset/image/social/logo_link.png";

import { setDrawer } from "module/store/features/dialogSlice";
import { useFollowPro } from "nostr/protocal/FollowPro";
import { System } from "nostr/NostrSystem";
import { setRelays, setFollows } from "module/store/features/profileSlice";
//
const GCardUser = (props) => {
  const { follows } = useSelector((s) => s.profile);
  const { publicKey } = useSelector((s) => s.login);
  const { profile, pubkey, ownFollows, ownRelays } = props;
  const dispatch = useDispatch();
  //
  const followPro = useFollowPro();
  const addFollow = async (pubkey) => {
    let event = await followPro.addFollow(pubkey);
    let newFollows = follows.concat();
    newFollows.push(pubkey);
    System.BroadcastEvent(event, (tags, client, msg) => {
      if (tags === "OK" && msg.ret === true) {
        let followsInfo = {
          create_at: event.CreatedAt,
          follows: newFollows,
        };
        dispatch(setFollows(followsInfo));
      }
    });
  };

  const removeFollow = async (pubkey) => {
    let event = await followPro.removeFollow(pubkey);
    let newFollows = follows.concat();
    newFollows.splice(follows.indexOf(pubkey), 1);
    System.BroadcastEvent(event, (tags, client, msg) => {
      if (tags === "OK" && msg.ret === true) {
        let followsInfo = {
          create_at: event.CreatedAt,
          follows: newFollows,
        };
        dispatch(setFollows(followsInfo));
      }
    });
  };

  const isSelf = (key) => {
    return publicKey === key;
  };


  const isFollow = (key) => {
    return follows.includes(key);
  };

  const relayNum = () => {
    let num = 0;
    if (ownRelays !== null) {
      for (let key in ownRelays) {
        num = num + 1;
      }
    }
    return num;
  }

  useEffect(() => {
    console.log("GCardUser", ownRelays);
    return () => { };
  }, [props]);

  //#1F1F1F
  return (
    <Card className='carduser-bg'>
      <CardContent
        sx={{
          padding: "12px",
        }}
      >
        <CardMedia
          component="img"
          sx={{ height: "140px", borderRadius: "6px" }}
          src="localProfile.banner"
          image={
            profile.banner && profile.banner !== "default"
              ? profile.banner
              : default_banner
          }
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
              src={
                profile.picture && profile.picture !== "default"
                  ? profile.picture
                  : default_avatar
              }
            />
            <Button
              className="button"
              sx={{
                width: "40px",
                height: "40px",
              }}
              onClick={() => { }}
            >
              <img src={logo_lighting} width="40px" alt="lighting" />
            </Button>
            <Button
              className="button"
              sx={{
                width: "40px",
                height: "40px",
              }}
              onClick={() => {
                dispatch(
                  setChatDrawer({
                    chatDrawer: true,
                    chatPubKey: pubkey,
                    chatProfile: profile,
                  })
                );
              }}
            >
              <img src={logo_chat} width="40px" alt="chat" />
            </Button>
            {isSelf(pubkey) === false && <Button
              variant="contained"
              sx={{
                width: "96px",
                height: "36px",
                backgroundColor: "#006CF9",
                borderRadius: "18px",
                color: "text.primary",
              }}
              onClick={() => {
                if (isFollow(pubkey) === true) {
                  removeFollow(pubkey);
                } else {
                  addFollow(pubkey);
                }
              }}
            >
              {isFollow(pubkey) === true ? "Unfollow" : "Follow"}
            </Button>}
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
          {profile.website && profile.website !== "default" ? (
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
              <Typography className={'lable_1'} onClick={(event) => {
                event.stopPropagation();
                dispatch(
                  setDrawer({
                    isDrawer: true,
                    placeDrawer: "right",
                    cardDrawer: "follower-show",
                  })
                );
              }}>
                {ownFollows.length}
              </Typography>
              <Typography className={'lable_2'}>
                {"Following"}
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
              <Typography className={'lable_1'} onClick={(event) => {
                event.stopPropagation();
                dispatch(
                  setDrawer({
                    isDrawer: true,
                    placeDrawer: "right",
                    cardDrawer: "following-show",
                  })
                );
              }}>
                {'...'}
              </Typography>
              <Typography className={'lable_2'}>
                {"Followers"}
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
              <Typography className={'lable_1'} onClick={(event) => {
                event.stopPropagation();
                dispatch(
                  setDrawer({
                    isDrawer: true,
                    placeDrawer: "right",
                    cardDrawer: "relay-show",
                  })
                );
              }}>
                {relayNum()}
              </Typography>
              <Typography className={'lable_2'}>
                {"Relays"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default React.memo(GCardUser);
