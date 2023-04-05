import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

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

import "./GSociety.scss";

import { useFollowPro } from "nostr/protocal/FollowPro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils";
//
import { setFollows } from "module/store/features/profileSlice";
import { setMainContent } from 'module/store/features/dialogSlice';

import UserDataCache from 'db/UserDataCache';

const createNostrWorker = createWorkerFactory(() => import('worker/nostrRequest'));

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

const GSociety = (props) => {
  const { callback } = props;

  const nostrWorker = useWorker(createNostrWorker);
  const UserCache = UserDataCache();

  const navigate = useNavigate();
  const followPro = useFollowPro();

  const MetadataPro = useMetadataPro();
  const { publicKey } = useSelector((s) => s.login);
  const { follows } = useSelector((s) => s.profile);
  //
  const [tabIndex, setTabIndex] = useState(0);
  const [datas, setDatas] = useState([]);
  const [followers, setFollowers] = useState([]);
  const dispatch = useDispatch();
  //
  const fetchAllMeta = (pubkeys) => {
    let filteMeta = MetadataPro.get(pubkeys);
    let subMeta = BuildSub("followers_meta", [filteMeta]);
    nostrWorker.fetch_user_profile(subMeta, null, (datas, client) => {
      setDatas(datas.concat());
    });
  };

  //
  const fetchFollowers = () => {
    let filterFollowing = followPro.getFollowings(publicKey);
    let subFollowing = BuildSub("followings_metadata", [filterFollowing]);
    nostrWorker.fetch_user_profile(subFollowing, null, (datas, client) => {
      // console.log('followings_metadata', datas);
      setFollowers(datas.concat());
    });
  };

  //
  const addFollow = async (pubkey) => {
    let event = await followPro.addFollow(pubkey);
    let newFollows = follows.concat();
    newFollows.push(pubkey);
    System.BroadcastEvent(event, (tags, client, msg) => {
      console.log('addFollow', event, msg);
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
      console.log('removeFollow', event, msg);
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
      // console.log("change followers", followers);
      let pubkeys = [];
      followers.map((item) => {
        pubkeys.push(item.pubkey);
      });
      fetchAllMeta(pubkeys);
    }
    return () => { };
  }, [tabIndex]);

  useEffect(() => {
    if (followers.length === 0) {
      fetchFollowers();
    }
    return () => { };
  }, []);

  const renderFollowing = () => {
    if (follows.length === 0) {
      return null;
    }
    return (
      <List className="list_bg">
        {follows.map((pubkey, index) => {
          const info = UserCache.getMetadata(pubkey);
          // console.log('info111', pubkey, info);
          if (!info) {
            return null;
          }
          let cxt = JSON.parse(info.content);
          return (
            <ListItem
              sx={{ my: "2px" }}
              key={"following-list-" + index}
              secondaryAction={
                <Button
                  variant="contained"
                  sx={{ width: "80px", height: "24px", fontSize: "12px", backgroundColor: "#202122" }}
                  onClick={() => {
                    removeFollow(pubkey);
                  }}
                >
                  {"unfollow"}
                </Button>
              }
              disablePadding
            >
              <ListItemButton
                sx={{ my: "2px", alignItems: "start" }}
              >
                <ListItemAvatar
                  onClick={() => {
                    dispatch(setMainContent(true));
                    navigate("/userhome:" + pubkey, { state: { pubkey: pubkey } });
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
                <div className="gsociety_text_item">
                  <span className="txt">{cxt.name} </span>
                  <span className="txt_about">{cxt.about} </span>
                </div>
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
      <List className="list_bg">
        {followers.map((item, index) => {
          const info = UserCache.getMetadata(item.pubkey);
          if (!info) {
            return null;
          }
          let cxt = JSON.parse(info.content);
          return (
            <ListItem
              sx={{ my: "2px" }}
              key={"followers-list-" + index}
              secondaryAction={
                <Button
                  variant="contained"
                  sx={{ width: "80px", height: "24px", fontSize: "12px", backgroundColor: "#202122" }}
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
              <ListItemButton sx={{ my: "2px", alignItems: "start" }}>
                <ListItemAvatar
                  onClick={() => {
                    dispatch(setMainContent(true));
                    navigate("/userhome:" + item.pubkey, { state: { pubkey: item.pubkey } });
                    if (callback) {
                      callback();
                    }
                  }}>
                  <Avatar
                    alt={"GameFi Society"}
                    src={cxt.picture ? cxt.picture : ""}
                  />
                </ListItemAvatar>
                <div className="gsociety_text_item">
                  <span className="txt">{cxt.name} </span>
                  <span className="txt_about">{cxt.about} </span>
                </div>

              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Box className={'gsociety_box_bg'}>
      <Box className={'header_bg'}>
        <Button className={'header_btn'} variant="contained" sx={{ backgroundColor: tabIndex === 0 ? "#4900BD" : "#202122", }}
          onClick={() => {
            if (tabIndex !== 0) {
              setTabIndex(0);
            }
          }}
        >
          {"Following " + follows.length}
        </Button>
        <Button className={'header_btn'} variant="contained" sx={{ backgroundColor: tabIndex === 1 ? "#4900BD" : "#202122", }}
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

export default GSociety;
