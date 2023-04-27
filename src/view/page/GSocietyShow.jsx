import React, { useEffect, useState } from "react";
import "./GSocietyShow.scss";
import { setDrawer } from "module/store/features/dialogSlice";
import { useSelector, useDispatch } from "react-redux";
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useFollowPro } from "nostr/protocal/FollowPro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils";
//
import { setFollows } from "module/store/features/profileSlice";

import UserDataCache from 'db/UserDataCache';

const createNostrWorker = createWorkerFactory(() => import('worker/nostrRequest'));

const GFollowItem = (props) => {
  const UserCache = UserDataCache();
  const following = props.following;
  const pubkey = props.pubkey;
  const info = UserCache.getMetadata(pubkey);

  const avatar = () => {
    let pictrue = "";
    if (info && info.content !== "") {
      let infoCxt = JSON.parse(info.content);
      pictrue = infoCxt.picture;
    }
    return pictrue;
  };

  const displayname = () => {
    let tmp_display_name = "N";
    if (info && info.content !== "") {
      let infoCxt = JSON.parse(info.content);
      tmp_display_name = infoCxt.display_name;
    }
    return tmp_display_name;
  };

  const about = () => {
    let t_about = "no about";
    if (info && info.content !== "") {
      let infoCxt = JSON.parse(info.content);
      if (infoCxt.about && infoCxt.about.length > 0) {
        t_about = infoCxt.about;
      }
    }
    return t_about;
  };

  const renderButton = () => {
    return (
      <Button
        variant="contained"
        className={following === true ? "button_unfollow" : "button_follow"}
        onClick={() => {
          if (following === true) {
            props.removeFollow(pubkey);
          } else {
            props.addFollow(pubkey);
          }
        }}
      >
        {following === true ? "unfollow" : "follow"}
      </Button>
    );
  };

  const renderItem = () => {
    console.log("renderItem", info);
    // if (!info) return null;
    return (
      <Box className={"follow_item"}>
        <Avatar
          className={"avatar"}
          alt={displayname()}
          src={avatar()}
          onClick={() => {
            props.navCallback(pubkey);
          }}
        />
        <Box className="text_item">
          <Typography className={"txt"}>{displayname()}</Typography>
          <Typography className={"txt_about"}>{about()}</Typography>
        </Box>
        {renderButton()}
      </Box>
    );
  };
  return renderItem();
};

const GSocietyShow = (props) => {
  const { callback } = props;
  const { followDrawer, followType } = useSelector((s) => s.dialog);
  const nostrWorker = useWorker(createNostrWorker);
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

  const isFollowing = (pubkey) => {
    for (let i = 0; i < follows.length; i++) {
      if (pubkey === follows[i]) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    console.log('GSocietyShow', followDrawer);
    if (followDrawer.length !== 0) {
      let pubkeys = [];
      followDrawer.map((item) => {
        if (item[0] && item[0] === 'p' && item[1]) {
          pubkeys.push(item[1]);
        }
      });
      fetchAllMeta(pubkeys);
    }
    return () => { };
  }, [followDrawer]);

  const getFollowPubKey = (index) => {
    if(followDrawer.length > 0 && index < followDrawer.length){
      if(followType === "following"){
        return followDrawer[index][1];
      }else if(followType === "follower"){
        return followDrawer[index].pubkey;
      }
    }
    return "";
  }

  const renderFollows = () => {
    if (followDrawer.length === 0) {
      return null;
    }
    return (
      <Box className={"inner_list"}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={60}
              itemCount={followDrawer.length}
              itemData={followDrawer}
              overscanRowsCount={2}
            >
              {({ data, index, style }) => (
                <Box style={style}>
                  <GFollowItem
                    pubkey={getFollowPubKey(index)}
                    following={isFollowing(getFollowPubKey(index))}
                    removeFollow={(pubkey) => {
                      removeFollow(pubkey);
                    }}
                    addFollow={(pubkey) => {
                      addFollow(pubkey);
                    }}
                    navCallback={(pubkey) => {
                      navigate("/userhome/" + pubkey);
                      if (callback) {
                        callback();
                      }
                    }}
                  />
                </Box>
              )}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
    );
  };

  const renderHeader = () => {
    return (
      <Box className={"header"}>
        <Box
          className="goback"
          onClick={() => {
            dispatch(
              setDrawer({
                isDrawer: false,
                placeDrawer: "right",
                cardDrawer: "society-show",
              })
            );
          }}
        >
          <Box className="icon_back" />
          <Typography className="text_back">{"Back"}</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }}></Box>
      </Box>
    );
  };

  return (
    <Box className={'society_show_bg'}>
      {renderHeader()}
      {renderFollows()}
    </Box>
  );
};

export default GSocietyShow;
