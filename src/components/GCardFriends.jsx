import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import PropTypes from "prop-types";

import "./GCardUser.scss";

import { useFollowPro } from "nostr/protocal/FollowPro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils";
//
import { setFollows } from "module/store/features/profileSlice";

import NormalCache from "db/NormalCache";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={"friend-pannel-" + index}
      {...other}
    >
      {value === index && (
        <Box sx={{ padding: "8px" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const GCardFriends = (props) => {
  const { callback } = props;

  const navigate = useNavigate();
  const followPro = useFollowPro();

  const NorCache = NormalCache();

  const MetadataPro = useMetadataPro();
  const { publicKey } = useSelector((s) => s.login);
  const { follows } = useSelector((s) => s.profile);
  const [tabIndex, setTabIndex] = useState(0);
  const [datas, setDatas] = useState([]);
  const [followers, setFollowers] = useState([]);
  const dispatch = useDispatch();

  let metadata_cache_flag = "metadata_cache";
  let followers_cache_flag = "followers_cache";
  //
  const fetchAllMeta = (pubkeys) => {
    let filteMeta = MetadataPro.get(pubkeys);
    let subMeta = BuildSub("follow_meta", [filteMeta]);
    System.BroadcastSub(subMeta, (tag, client, msg) => {
      if (tag === "EOSE") {
        System.BroadcastClose(subMeta, client, null);
        let metadatas = NorCache.get(metadata_cache_flag);
        // console.log('subMeta', metadatas);
        if (metadatas) {
          setDatas(metadatas.concat());
        }
      } else if (tag === "EVENT") {
        NorCache.pushMetadata(metadata_cache_flag, msg.pubkey, msg);
      }
    });
  };

  //
  const fetchFollowers = () => {
    NorCache.clear(followers_cache_flag);
    let filterFollowing = followPro.getFollowings(publicKey);
    let subFollowing = BuildSub("followings_metadata", [filterFollowing]);
    System.BroadcastSub(subFollowing, (tag, client, msg) => {
      if (tag === "EOSE") {
        System.BroadcastClose(subFollowing, client, null);
        let cache = NorCache.get(followers_cache_flag);
        setFollowers(cache.concat());
      } else if (tag === "EVENT") {
        NorCache.pushFollowers(followers_cache_flag, msg.pubkey, msg);
      }
    });
  };

  //
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

  //
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

  const isFollowYou = (pubkey) => {
    for (let i = 0; i < follows.length; i++) {
      if (pubkey === follows[i]) {
        return true;
      }
    }
    return false;
  };

  //
  useEffect(() => {
    if (tabIndex === 0) {
      fetchAllMeta(follows);
    } else if (tabIndex === 1) {
      console.log("change followers", followers);
      let pubkeys = [];
      followers.map((item) => {
        pubkeys.push(item.pubkey);
      });
      fetchAllMeta(pubkeys);
    }
    return () => {};
  }, [tabIndex]);

  useEffect(() => {
    if (followers.length === 0) {
      fetchFollowers();
    }
    return () => {};
  }, []);

  const renderFollowing = () => {
    if (follows.length === 0) {
      return null;
    }
    return (
      <List>
        {" "}
        {follows.map((pubkey, index) => {
          const { info } = NorCache.getMetadata(metadata_cache_flag, pubkey);
          console.log();
          if (info === null) {
            return null;
          }
          let cxt = JSON.parse(info.content);
          return (
            <ListItem
              sx={{ my: "2px", backgroundColor: "#202020" }}
              key={"following-list-" + index}
              secondaryAction={
                <Button
                  variant="outlined"
                  sx={{ width: "80px", height: "24px", fontSize: "12px" }}
                  onClick={() => {
                    removeFollow(pubkey);
                  }}
                >
                  {"unfollow"}
                </Button>
              }
              disablePadding
            >
              <ListItemButton>
                <ListItemAvatar
                  onClick={() => {
                    navigate("/profile", {
                      state: { info: { ...cxt }, pubkey: pubkey },
                    });
                    if (callback) {
                      callback();
                    }
                  }}
                >
                  <Avatar
                    alt={"GameFi Society"}
                    src={cxt.picture ? cxt.picture : ""}
                  />
                </ListItemAvatar>
                <ListItemText primary={cxt.name} color="text.secondary" />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    );
  };

  const renderFollowers = () => {
    if (followers.length === 0) {
      return null;
    }
    return (
      <List>
        {" "}
        {followers.map((item, index) => {
          const { info } = NorCache.getMetadata(
            metadata_cache_flag,
            item.pubkey
          );
          if (info === null) {
            return null;
          }
          let cxt = JSON.parse(info.content);
          return (
            <ListItem
              sx={{ my: "2px", backgroundColor: "#202020" }}
              key={"following-list-" + index}
              secondaryAction={
                <Button
                  variant="outlined"
                  sx={{ width: "80px", height: "24px", fontSize: "12px" }}
                  onClick={() => {
                    if (isFollowYou(item.pubkey) === true) {
                      removeFollow(item.pubkey);
                    } else {
                      addFollow(item.pubkey);
                    }
                    //
                  }}
                >
                  {isFollowYou(item.pubkey) === true ? "unfollow" : "follow"}
                </Button>
              }
              disablePadding
            >
              <ListItemButton>
                <ListItemAvatar
                  onClick={() => {
                    navigate("/profile", {
                      state: { info: { ...cxt }, pubkey: item.pubkey },
                    });
                    if (callback) {
                      callback();
                    }
                  }}
                >
                  <Avatar
                    alt={"GameFi Society"}
                    src={cxt.picture ? cxt.picture : ""}
                  />
                </ListItemAvatar>
                <ListItemText primary={cxt.name} color="text.secondary" />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: "#0F0F0F",
        width: "400px",
        minHeight: "100%",
        paddingLeft: "32px",
        paddingRight: "20px",
      }}
    >
      <Box
        sx={{
          marginTop: "84px",
          display: "flex",
          flexDierction: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          borderBottom: 1,
          borderColor: "#202122",
          paddingBottom: "25px",
        }}
      >
        <Button
          variant="contained"
          sx={{
            width: "136px",
            height: "36px",
            backgroundColor: tabIndex === 0 ? "#4900BD" : "#202122",
            borderRadius: "6px",
            fontSize: "14px",
            fontFamily: "Saira",
            fontWeight: "500",
          }}
          onClick={() => {
            if (tabIndex !== 0) {
              setTabIndex(0);
            }
          }}
        >
          {"Following " + follows.length}
        </Button>
        <Button
          variant="contained"
          sx={{
            width: "136px",
            height: "36px",
            backgroundColor: tabIndex === 1 ? "#4900BD" : "#202122",
            borderRadius: "6px",
            fontSize: "14px",
            fontFamily: "Saira",
            fontWeight: "500",
          }}
          onClick={() => {
            if (tabIndex !== 1) {
              setTabIndex(1);
            }
          }}
        >
          {"Followers " + followers.length}
        </Button>
      </Box>
      {tabIndex === 0 ? renderFollowing() : renderFollowers()}
    </Box>
  );
};

export default React.memo(GCardFriends);
