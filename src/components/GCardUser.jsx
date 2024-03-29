import React, { useEffect, useState, useRef } from "react";
import "./GCardUser.scss";

import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";
import { hexToBech32 } from "nostr/Util";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, Link } from "@mui/material";
import copy from "copy-to-clipboard";
import { default_banner, default_avatar } from "module/utils/xdef";
import logo_key from "../asset/image/social/logo_key.png";
import logo_copy from "../asset/image/social/logo_copy.png";
import logo_link from "../asset/image/social/logo_link.png";

import { setOpenLogin, setDrawer } from "module/store/features/dialogSlice";
import { useFollowPro } from "nostr/protocal/FollowPro";
import { System } from "nostr/NostrSystem";
import { setFollows } from "module/store/features/profileSlice";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { BuildSub, BuildCount } from "nostr/NostrUtils";
import { EventKind } from "nostr/def";
//
const createNostrWorker = createWorkerFactory(() =>
  import("worker/nostrRequest")
);

const GCardUser = (props) => {
  const nostrWorker = useWorker(createNostrWorker);
  const { follows } = useSelector((s) => s.profile);
  const { loggedOut, publicKey } = useSelector((s) => s.login);
  const { pubkey } = props;
  const dispatch = useDispatch();
  //
  const [metadata, SetMetadata] = useState(null);
  const [followings, setFollowings] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [profile, setProfile] = useState(null);
  const MetaPro = useMetadataPro();
  const followPro = useFollowPro();
  //
  const fetchUserInfo = (pub) => {
    const filterMeta = MetaPro.get(pubkey);
    const filterFollowPro = followPro.getFollows(pub);
    let userInfoNote = BuildSub("userinfo", [filterMeta, filterFollowPro]);
    let tmp_contactlist = null;
    let tmp_meta = null;
    nostrWorker.fetch_user_info(userInfoNote, null, (data, client) => {
      data.map((item) => {
        if (
          item.kind === EventKind.SetMetadata &&
          (tmp_meta === null || tmp_meta.created_at < item.created_at)
        ) {
          tmp_meta = { ...item };
          SetMetadata({ ...item });
        } else if (
          item.kind === EventKind.ContactList &&
          (tmp_contactlist === null ||
            tmp_contactlist.created_at < item.created_at)
        ) {
          tmp_contactlist = { ...item };
          setFollowings({ ...item });
        }
      });
    });
  };
  //
  const fetchFollowers = (pub) => {
    let filterFollowing = followPro.getFollowings(pub);
    let subFollowing = BuildSub("followings_metadata", [filterFollowing]);
    nostrWorker.fetch_user_profile(subFollowing, null, (datas, client) => {
      console.log("followings_metadata", datas);
      setFollowers(datas.concat());
    });
    // const filterFollowingPro = followPro.getFollowings(pub);
    // let userFollowing = BuildCount("userinfo", [filterFollowingPro]);
    // nostrWorker.fetch_user_info(userFollowing, null, (data, client) => {
    //   console.log("data count", data);
    //   data.map((item) => {
    //     // if (item.kind === EventKind.ContactList && (tmp_contactlist === null || tmp_contactlist.created_at < item.created_at)) {
    //     //   setContact({ ...item });
    //     // }
    //   });
    // });
  };

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

  useEffect(() => {
    if (metadata && metadata.content !== "") {
      try {
        let tmp_profile = JSON.parse(metadata.content);
        setProfile({ ...tmp_profile });
      } catch (e) {
        console.log("parse user profile error!", metadata.content);
      }
    }
    return () => {};
  }, [metadata]);

  useEffect(() => {
    fetchUserInfo(pubkey);
    fetchFollowers(pubkey);
    return () => {};
  }, [props]);

  const getBanner = () => {
    if (profile && profile.banner && profile.banner !== "") {
      return profile.banner;
    }
    return default_banner;
  };

  const getPictrue = () => {
    if (profile && profile.picture && profile.picture !== "") {
      return profile.picture;
    }
    return "";
  };

  const getName = () => {
    if (profile && profile.name && profile.name !== "") {
      return "@" + profile.name;
    }
    if (profile && profile.username && profile.username !== "") {
      return "@" + profile.username;
    }
    return "@default";
  };

  const getDisplayName = () => {
    if (profile && profile.displayName && profile.displayName !== "") {
      return profile.displayName;
    }
    if (profile && profile.display_name && profile.display_name !== "") {
      return profile.display_name;
    }
    if (metadata) {
      return (
        "Nostr#" +
        metadata.pubkey.substring(
          metadata.pubkey.length - 4,
          metadata.pubkey.length
        )
      );
    }
    return "default";
  };

  const getAbout = () => {
    if (profile && profile.about && profile.about !== "") {
      return profile.about;
    }
    return "no about";
  };

  const getWebsite = () => {
    if (profile && profile.website && profile.website !== "") {
      return profile.website;
    }
    return "no website";
  };

  const getFollowings = () => {
    if (followings) {
      return followings.tags.length;
    }
    return 0;
  };

  const getFollowers = () => {
    if (followers) {
      return followers.length;
    }
    return 0;
  };

  const getRelayNum = () => {
    if (followings && followings.content && followings.content !== "") {
      try {
        let tmp_relays = JSON.parse(followings.content);
        let num = 0;
        for (let key in tmp_relays) {
          num = num + 1;
          // let target = { addr: key, read: content[key].read, write: content[key].write };
          // let flag = tmp_relays.find((item) => {
          //   return item.addr === key;
          // });
          // if (!flag) {
          //   tmp_relays.push(target);
          // }
        }
        return num;
      } catch (e) {
        console.log("parse user relay num error!", followings.content);
        return 0;
      }
    }
    return 0;
  };

  const isSelf = (key) => {
    return publicKey === key;
  };

  const isFollow = (key) => {
    return follows.includes(key);
  };

  return (
    <Card className="carduser-bg">
      <CardContent
        sx={{
          padding: "12px",
        }}
      >
        <CardMedia
          component="img"
          sx={{ height: "140px", borderRadius: "6px" }}
          src="localProfile.banner"
          image={getBanner()}
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
              alt={getDisplayName()}
              src={getPictrue()}
            />
            <Box
              className="btn_Lighting"
              onClick={() => {
                if (loggedOut) {
                  dispatch(setOpenLogin(true));
                  return;
                }
              }}
            />
            <Box
              className="btn_dm"
              onClick={(event) => {
                event.stopPropagation();
                if (loggedOut) {
                  dispatch(setOpenLogin(true));
                  return;
                }
                if (profile) {
                  dispatch(
                    setDrawer({
                      isDrawer: true,
                      placeDrawer: "right",
                      cardDrawer: "society-chat",
                      chatPubKey: pubkey,
                    })
                  );
                }
              }}
            />
            {isSelf(pubkey) === false && (
              <Button
                variant="contained"
                className={
                  isFollow(pubkey) === true
                    ? "button_unfollow"
                    : "button_follow"
                }
                onClick={() => {
                  if (loggedOut) {
                    dispatch(setOpenLogin(true));
                    return;
                  }

                  if (isFollow(pubkey) === true) {
                    removeFollow(pubkey);
                  } else {
                    addFollow(pubkey);
                  }
                }}
              >
                {isFollow(pubkey) === true ? "Unfollow" : "Follow"}
              </Button>
            )}
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
              {getDisplayName()}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontFamily: "Saira",
                fontWeight: "500",
              }}
              color="#919191"
              align={"left"}
            >
              {getName()}
            </Typography>
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
                  {hexToBech32("npub", pubkey)}
                </Typography>
              </Box>
              <Button
                sx={{
                  width: "36px",
                  height: "36px",
                }}
                onClick={() => {
                  if (copy(hexToBech32("npub", pubkey))) {
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
            {getAbout()}
          </Typography>
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
              href={getWebsite()}
              underline="always"
              sx={{
                marginLeft: "4px",
                fontSize: "14px",
                fontFamily: "Saira",
                fontWeight: "500",
                fontColor: "#0694fa",
                "&:hover": {
                  color: "#00a6ff",
                },
              }}
            >
              {getWebsite()}
            </Link>
          </Box>
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
              className={"labelBox"}
              onClick={(event) => {
                event.stopPropagation();
                if (followings && Array.isArray(followings.tags)) {
                  dispatch(
                    setDrawer({
                      isDrawer: true,
                      placeDrawer: "right",
                      cardDrawer: "society-show",
                      followDrawer: followings.tags.concat(),
                      followType: "following",
                    })
                  );
                }
              }}
            >
              <Typography className={"lable_1"}>{getFollowings()}</Typography>
              <Typography className={"lable_2"}>{"Following"}</Typography>
            </Box>
            <Box
              className={"labelBox"}
              onClick={(event) => {
                event.stopPropagation();
                dispatch(
                  setDrawer({
                    isDrawer: true,
                    placeDrawer: "right",
                    cardDrawer: "society-show",
                    followDrawer: followers.concat(),
                    followType: "follower",
                  })
                );
              }}
            >
              <Typography className={"lable_1"}>{getFollowers()}</Typography>
              <Typography className={"lable_2"}>{"Followers"}</Typography>
            </Box>
            <Box
              className={"labelBox"}
              onClick={(event) => {
                event.stopPropagation();
                if (
                  followings &&
                  followings.content &&
                  followings.content !== ""
                ) {
                  try {
                    let tmp_relays = JSON.parse(followings.content);
                    dispatch(
                      setDrawer({
                        isDrawer: true,
                        placeDrawer: "right",
                        cardDrawer: "relay-show",
                        relayDrawer: { ...tmp_relays },
                      })
                    );
                  } catch (e) {
                    console.log(
                      "parse user relay num error!",
                      followings.content
                    );
                  }
                }
              }}
            >
              <Typography className={"lable_1"}>{getRelayNum()}</Typography>
              <Typography className={"lable_2"}>{"Relays"}</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default React.memo(GCardUser);
