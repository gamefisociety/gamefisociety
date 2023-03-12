import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import PropTypes from "prop-types";

import "./GCardUser.scss";

import { dbCache } from "db/DbCache";
import { useFollowPro } from "nostr/protocal/FollowPro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils";
//
import { setFollows } from "module/store/features/profileSlice";

const db = dbCache();

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

  const MetadataPro = useMetadataPro();
  const { publicKey } = useSelector((s) => s.login);
  const { followsData, follows } = useSelector((s) => s.profile);
  const [tabIndex, setTabIndex] = useState(0);
  const [datas, setDatas] = useState([]);
  const dispatch = useDispatch();

  const fetchAllMeta = () => {
    let pubkeys = [];
    follows.map((item) => {
      pubkeys.push(item);
    });
    let filteMeta = MetadataPro.get(pubkeys);
    let subMeta = BuildSub('follow_meta', [filteMeta]);
    //
    System.BroadcastSub(subMeta, (tag, client, msg) => {
      if (tag === 'EOSE') {
        System.BroadcastClose(subMeta, client, null);
        let dataArrays = db.getAllArray();
        setDatas(...dataArrays);
      } else if (tag === 'EVENT') {
        db.updateMetaData(msg.pubkey, msg.created_at, msg.content);
      }
    });
  };

  const fetchFollowers = () => {
    let filterFollowing = followPro.getFollowing(publicKey);
    let subFollowing = BuildSub('following_meta', [filterFollowing]);
    System.BroadcastSub(subFollowing, (tag, client, msg) => {
      console.log('following_meta', tag, msg);
    });
  };


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

  //
  useEffect(() => {
    if (tabIndex === 0) {
      fetchAllMeta();
    } else if (tabIndex === 1) {
      fetchFollowers();
    }
    return () => { };
  }, [tabIndex]);


  const renderFollowing = () => {
    if (follows.length === 0) {
      return null;
    }
    return (
      <List>
        {" "}
        {follows.map((pubkey, index) => {
          const item = db.getMetaData(pubkey);
          if (!item) {
            return null;
          }
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
                      state: { info: { ...item.content }, pubkey: pubkey },
                    });
                    if (callback) {
                      callback();
                    }
                  }}
                >
                  <Avatar
                    alt={"GameFi Society"}
                    src={item.content.picture ? item.content.picture : ""}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.content.name}
                  color="text.secondary"
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    );
  };

  const renderFollowers = () => {
    return null;
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
          {"Followers"}
        </Button>
      </Box>
      {tabIndex === 0 ? renderFollowing() : renderFollowers()}
    </Box>
  );
};

export default React.memo(GCardFriends);
