import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EventKind } from "nostr/def";
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
import { updateMetadata } from 'module/store/features/userSlice';

import { setUsersFlag } from "module/store/features/userSlice";
import { useFollowPro } from "nostr/protocal/FollowPro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { System } from "nostr/NostrSystem";

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
  const FollowPro = useFollowPro();
  const MetadataPro = useMetadataPro();
  const { publicKey } = useSelector((s) => s.login);
  const { followsData, follows } = useSelector((s) => s.user);
  const [tabIndex, setTabIndex] = React.useState(0);
  const dispatch = useDispatch();

  const fetchAllMeta = () => {
    let subMeta = MetadataPro.get(publicKey);
    follows.map((item) => {
      subMeta.Authors.push(item);
    });
    //
    System.Broadcast(subMeta, 0, (tag, client, msg) => {
      if (tag === 'EOSE') {
        System.BroadcastClose(subMeta.Id, client, null);
      } else if (tag === 'EVENT') {
        dispatch(updateMetadata(msg));
        let flag = db.updateMetaData(msg.pubkey, msg.created_at, msg.content);
      }
    });
  };

  const fetchFollowing = () => {
    if (followsData === 0) {
      fetchAllMeta();
    } else if (followsData === 1) {
      //update
    }
  };

  const fetchFollowers = () => {
    let subFollow = FollowPro.get(publicKey);
    // console.log('saveProfile', ev);
    System.Broadcast(subFollow, 0, (msgs) => {
      if (msgs) {
        //
      }
      // if (msg[0] === 'OK') {
      //     // setOpen(true)
      // }
      // console.log('fetchFollowers msg', msg);
    });
  };

  //
  useEffect(() => {
    fetchFollowing();
    return () => { };
  }, []);

  //
  useEffect(() => {
    return () => { };
  }, [follows]);

  const renderFollowing = () => {
    if (follows.length === 0) {
      return null;
    }
    return (
      <List>
        {" "}
        {follows.map((pubkey, index) => {
          const item = db.getMetaData(pubkey);
          // console.log('get metadata', item);
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

  // const renderSke = () => {
  //     return (
  //         <React.Fragment>
  //             <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
  //             <Skeleton animation="wave" height={10} width="80%" />
  //         </React.Fragment>
  //     )
  // }

  return (
    <Box
      sx={{
        backgroundColor: "#0F0F0F",
        width: "400px",
        height: "100%",
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
