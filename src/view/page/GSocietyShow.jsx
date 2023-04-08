import React, { useEffect, useState } from "react";
import "./GSocietyShow.scss";

import { useSelector, useDispatch } from "react-redux";
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";

import { useFollowPro } from "nostr/protocal/FollowPro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils";
//
import { setFollows } from "module/store/features/profileSlice";

import UserDataCache from 'db/UserDataCache';

const createNostrWorker = createWorkerFactory(() => import('worker/nostrRequest'));

const GSocietyShow = (props) => {
  const { callback } = props;

  const { followerDrawer } = useSelector((s) => s.dialog);

  const nostrWorker = useWorker(createNostrWorker);
  const UserCache = UserDataCache();

  const navigate = useNavigate();
  const followPro = useFollowPro();

  const MetadataPro = useMetadataPro();
  const { publicKey } = useSelector((s) => s.login);
  const { follows } = useSelector((s) => s.profile);
  //
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

  const isFollows = (pubkey) => {
    for (let i = 0; i < follows.length; i++) {
      if (pubkey === follows[i]) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    console.log('GSocietyShow', followerDrawer);
    if (followerDrawer.length !== 0) {
      let pubkeys = [];
      followerDrawer.map((item) => {
        if (item[0] && item[0] === 'p' && item[1]) {
          pubkeys.push(item[1]);
        }
      });
      fetchAllMeta(pubkeys);
    }
    return () => { };
  }, [followerDrawer]);

  const renderFollowing = () => {
    if (followerDrawer.length === 0) {
      return null;
    }
    return (
      <List className="list_bg">
        {followerDrawer.map((item, index) => {
          let tmp_pubkey = item[1];
          const info = UserCache.getMetadata(tmp_pubkey);
          if (!info) {
            return null;
          }
          let cxt = JSON.parse(info.content);
          let follow_flag = isFollows(tmp_pubkey);
          return (
            <ListItem
              sx={{ my: "2px" }}
              key={"following-list-" + index}
              secondaryAction={
                <Button
                  variant="contained"
                  sx={{ width: "80px", height: "24px", fontSize: "12px", backgroundColor: "#202122" }}
                  onClick={() => {
                    // removeFollow(tmp_pubkey);
                  }}
                >
                  {follow_flag === true ? "Unfollow" : 'Follow'}
                </Button>
              }
              disablePadding
            >
              <ListItemButton sx={{ my: "2px", alignItems: "start" }}>
                <ListItemAvatar
                  onClick={() => {
                    navigate("/userhome/" + tmp_pubkey);
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

  return (
    <Box className={'society_show_bg'}>
      <Box className={'header_bg'}>
      </Box>
      {renderFollowing()}
    </Box>
  );
};

export default GSocietyShow;
