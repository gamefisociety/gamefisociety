import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDrawer } from "module/store/features/dialogSlice";
import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import "./GSociety.scss";

import { useFollowPro } from "nostr/protocal/FollowPro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils";
//
import { setFollows } from "module/store/features/profileSlice";
import icon_back_white from "../../asset/image/social/icon_back_white.png";
import UserDataCache from "db/UserDataCache";

const createNostrWorker = createWorkerFactory(() =>
  import("worker/nostrRequest")
);

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

const GFollowItem = (props) => {
  const UserCache = UserDataCache();
  const following = props.following;
  const pubkey = props.pubkey;
  const type = props.type;
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
    if (type === "follower") {
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
    } else if (type === "following") {
      return (
        <Button
          variant="contained"
          className={following === true ? "button_unfollow" : "button_follow"}
          onClick={() => {
            props.removeFollow(pubkey);
          }}
        >
          {"unfollow"}
        </Button>
      );
    }
    return null;
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
      console.log("followings_metadata", datas);
      setFollowers(datas.concat());
    });
  };

  //
  const addFollow = async (pubkey) => {
    let event = await followPro.addFollow(pubkey);
    let newFollows = follows.concat();
    newFollows.push(pubkey);
    System.BroadcastEvent(event, (tags, client, msg) => {
      console.log("addFollow", event, msg);
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
      console.log("removeFollow", event, msg);
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
      <Box className={"inner_list"}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={60}
              itemCount={follows.length}
              itemData={follows}
              overscanRowsCount={2}
            >
              {({ data, index, style }) => (
                <Box style={style}>
                  <GFollowItem
                    pubkey={follows[index]}
                    following={true}
                    type={"following"}
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

  const renderFollowers = () => {
    if (followers.length === 0) {
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
              itemCount={followers.length}
              itemData={followers}
            >
              {({ data, index, style }) => (
                <GFollowItem
                  pubkey={followers[index].pubkey}
                  following={isFollowYou(followers[index].pubkey)}
                  type={"follower"}
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
                cardDrawer: "society",
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
    <Box className={"society_bg"}>
      {renderHeader()}
      <Box className={"header_bg"}>
        <Button
          className={"header_btn"}
          variant="contained"
          sx={{
            backgroundColor: tabIndex === 0 ? "#1C6CF9" : "#272727",
            "&:hover": {
              backgroundColor: tabIndex === 0 ? "#368AF9" : "#383838",
            },
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
          className={"header_btn"}
          variant="contained"
          sx={{
            backgroundColor: tabIndex === 1 ? "#1C6CF9" : "#272727",
            "&:hover": {
              backgroundColor: tabIndex === 1 ? "#368AF9" : "#383838",
            },
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

export default GSociety;
