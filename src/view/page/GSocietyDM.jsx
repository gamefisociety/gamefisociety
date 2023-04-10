import React, { useEffect, useState } from "react";
import "./GSocietyDM.scss";

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
import PropTypes from "prop-types";

import { useFollowPro } from "nostr/protocal/FollowPro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { BuildSub } from "nostr/NostrUtils";
//
import { useChatPro } from "nostr/protocal/ChatPro";
import UserDataCache from 'db/UserDataCache';
import { setChatDrawer } from "module/store/features/dialogSlice";

import logo_chat from "../../asset/image/social/logo_chat.png";

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

const GSocietyDM = (props) => {
  const { callback } = props;

  const nostrWorker = useWorker(createNostrWorker);
  const UserCache = UserDataCache();
  const chatPro = useChatPro();
  const navigate = useNavigate();
  const MetadataPro = useMetadataPro();
  const { publicKey, privateKey } = useSelector((s) => s.login);
  const [datas, setDatas] = useState([]);

  const dispatch = useDispatch();
  //
  const fetchAllChats = (pubkeys) => {
    let array = [];
    const filterDM = chatPro.getMyDM();
    let subDM = BuildSub("dm_chat_meta", [filterDM]);
    nostrWorker.fetch_chatCache_notes(privateKey, publicKey, subDM, null, (info, client) => {
      chatArrayInfo(array, info);
    });
  };
  const chatArrayInfo = (array, info) => {
    let forData = [];
    array.push(info);
    array.sort((a, b) => {
      return b.msg.create - a.msg.create;
    })
    array.forEach(item => {
      if (!forData.some(e => e.msg.pubkey == item.msg.pubkey)) {
        forData.push(item);
      }
    })

    let metaArray = [];
    forData.forEach(item => {
      metaArray.push(item.msg.pubkey);
    })
    fetchAllMeta(metaArray);
    setDatas(forData);
  }
  const fetchAllMeta = (pubkeys) => {
    let filteMeta = MetadataPro.get(pubkeys);
    let subMeta = BuildSub("chats_meta", [filteMeta]);
    nostrWorker.fetch_user_profile(subMeta, null, (datas, client) => {
      // setDatas([...datas]);
    });
  };

  //
  useEffect(() => {

    fetchAllChats(publicKey);

    return () => { };
  }, []);

  useEffect(() => {

    return () => { };
  }, []);

  const renderFollowing = () => {

    return (
      <List className="list_bg">
        {datas.map((item, index) => {
          const info = UserCache.getMetadata(item.msg.pubkey);
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
                  className="button"
                  sx={{
                    width: "40px",
                    height: "40px",
                  }}
                  onClick={() => {
                    dispatch(
                      setChatDrawer({
                        chatDrawer: true,
                        chatPubKey: item.msg.pubkey,
                        chatProfile: info,
                      })
                    );
                  }}
                >
                  <img src={logo_chat} width="40px" alt="chat" />
                </Button>
              }
              disablePadding
            >
              <ListItemButton
                sx={{ my: "2px", alignItems: "start" }}
              >
                <ListItemAvatar
                  onClick={() => {
                    navigate("/userhome/" + item.msg.pubkey);
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
                  <span className="txt_about">{item.dmsg} </span>
                </div>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Box className={'society_dm_box_bg'}>
      {renderFollowing()}
    </Box>
  );
};

export default GSocietyDM;
