import { React, useEffect, useState, useRef, useCallback } from "react";
import "./GFTChat.scss";

import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { VariableSizeList as List } from "react-window";
import closeImg from "./../../asset/image/social/close.png";
import dmLeftImg from "./../../asset/image/social/dm_left.png";
import { useChatPro } from "nostr/protocal/ChatPro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils";
import { EventKind } from "nostr/def";
import useNostrEvent from "nostr/NostrEvent";
import DMCache from "db/DMCache";
import { default_avatar } from "module/utils/xdef";
import UserDataCache from 'db/UserDataCache';

const ListRow = ({ data, index, setSize, chatPK }) => {
  const rowRef = useRef();
  const item = data[index];

  useEffect(() => {
    setSize(index, rowRef.current.getBoundingClientRect().height);
  }, [setSize, index]);

  return (
    <Box
      ref={rowRef}
      key={index}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        pt: "8px",
        px: "16px",
        // backgroundColor: '#FF0000',
        justifyContent: item.owner === chatPK ? "flex-start" : "flex-end",
      }}
    >
      <Typography
        sx={{
          width: "70%",
          padding: "12px",
          backgroundColor: item.owner === chatPK ? "#191A1B" : "#454FBF",
          borderRadius: "6px",
          fontFamily: "Saira",
          fontWeight: "500",
          fontSize: "12px",
          color: "#FFFFFF",
          whiteSpace: "pre-line",
          wordWrap: "break-word",
        }}
        align={"left"}
      >
        {item.content}
      </Typography>
    </Box>
  );
};

let subDM = null;

const GFTChat = (props) => {
  const listRef = useRef();
  const { chatPK, callback } = props;
  const { publicKey, privateKey } = useSelector((s) => s.login);
  const chatPro = useChatPro();
  const [chatProfile, setChatProfile] = useState(null);
  const [chatData, setChatData] = useState([]);
  const [inValue, setInValue] = useState("");

  const nostrEvent = useNostrEvent();
  const user_cache = UserDataCache();
  const dm_cache = DMCache();

  const sizeMap = useRef({});

  const setSize = useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current.resetAfterIndex(index);
  }, []);
  const getSize = (index) => sizeMap.current[index] || 50;
  //
  const listenDM = (targetPubkey) => {
    const filterDM = chatPro.getDM(targetPubkey);
    let subDM = BuildSub("chat_with", [filterDM]);
    System.BroadcastSub(subDM, (tag, client, msg) => {
      if (tag === "EVENT" && msg && msg.kind === EventKind.DirectMessage) {
        console.log("direct message", msg);
        try {
          nostrEvent
            .DecryptData(msg.content, privateKey, targetPubkey)
            .then((dmsg) => {
              if (dmsg) {
                let flag = dm_cache.pushChat(
                  targetPubkey,
                  msg.id,
                  msg.pubkey,
                  msg.created_at,
                  dmsg
                );
                if (flag === false) {
                  return;
                }
                let chat_datas = dm_cache.get(targetPubkey);
                if (chat_datas) {
                  setChatData(chat_datas.concat());
                }
              }
            });
        } catch (e) {
          //
        }
      }
    });
    return subDM;
  };

  const unlistenDM = (subDM) => {
    // console.log("unlistenDM", unlistenDM);
    dm_cache.clear(subDM[1]);
    System.BroadcastClose(subDM, null, null);
  };

  const sendDM = async () => {
    if (inValue.length === 0) {
      return;
    }
    const chatEv = await chatPro.sendDM(chatPK, inValue);
    System.BroadcastEvent(chatEv, (tag, client, msg) => {
      if (tag === "OK" && msg.ret && msg.ret === true) {
        let flag = dm_cache.pushChat(
          chatPK,
          chatEv.Id,
          chatEv.PubKey,
          chatEv.CreatedAt,
          inValue
        );
        if (flag === false) {
          return;
        }
        let chat_datas = dm_cache.get(chatPK);
        if (chat_datas) {
          setChatData(chat_datas.concat());
          setInValue("");
        }
      }
    });
  };

  const scrollToBottom = () => {
    listRef.current.scrollToItem(chatData.length, "smart");
  };

  const avatar = () => {
    if (chatProfile && chatProfile.content && chatProfile.content !== '') {
      try {
        let cxt = JSON.parse(chatProfile.content);
        if (cxt.picture) {
          return cxt.picture;
        }
        return default_avatar;
      } catch (e) {
        return default_avatar;
      }
    }
    return default_avatar;
  };

  const displayName = () => {
    if (chatProfile && chatProfile.content && chatProfile.content !== '') {
      try {
        let cxt = JSON.parse(chatProfile.content);
        // console.log("displayName", cxt);
        if (cxt.display_name) {
          return cxt.display_name;
        }
        if (cxt.displayName) {
          return cxt.displayName;
        }
        return "Nostr#" + chatPK.substring(chatPK.length - 4, chatPK.length);
      } catch (e) {
        return "Nostr#" + chatPK.substring(chatPK.length - 4, chatPK.length);
      }
    }
    return "Nostr#" + chatPK.substring(chatPK.length - 4, chatPK.length);
  };

  useEffect(() => {
    let profile = user_cache.getMetadata(chatPK);
    console.log('chat111', profile);
    if (profile) {
      setChatProfile({ ...profile });
    } else {
      //
    }
    //
    let chat_datas = dm_cache.get(chatPK);
    if (chat_datas) {
      setChatData(chat_datas.concat());
    } else {
      setChatData([]);
    }
    subDM = listenDM(chatPK);
    return () => {
      unlistenDM(subDM);
    };
  }, [chatPK]);

  //
  useEffect(() => {
    if (chatData.length > 0) {
      scrollToBottom();
    }
    return () => { };
  }, [chatData]);

  const renderHeader = () => {
    return (
      <Box className={"dm_header"}>
        <Icon
          className="goback"
          onClick={() => {
            if (callback) {
              callback('msg_back');
            }
          }}
        >
          <img src={dmLeftImg} width="38px" alt="dmleft" />
          {"DMs"}
        </Icon>
        <Box sx={{ flexGrow: 1 }}></Box>
        {/* <Button
        className="button"
        sx={{
          width: "38px",
          height: "38px",
        }}
        onClick={() => {
          props.closeHandle();
        }}
      >
        <img src={closeImg} width="38px" alt="close" />
      </Button> */}
      </Box>
    );
  };

  const renderMeta = () => {
    return (
      <Box className="dm_meta">
        <Avatar
          sx={{ width: "40px", height: "40px" }}
          edge="end"
          alt={displayName()}
          src={avatar()}
        />
        <Typography
          sx={{
            marginLeft: "8px",
            fontSize: "14px",
            fontFamily: "Saira",
            fontWeight: "500",
            color: "#FFFFFF",
          }}
        >
          {displayName()}
        </Typography>
      </Box>
    );
  };

  const renderContent = () => {
    return (
      <Box className={"dm_content"}>
        <List
          ref={listRef}
          height={500}
          width={"100%"}
          itemSize={getSize}
          itemCount={chatData.length}
          itemData={chatData}
        >
          {({ data, index, style }) => (
            <div style={style}>
              <ListRow
                data={data}
                index={index}
                setSize={setSize}
                chatPK={chatPK}
              />
            </div>
          )}
        </List>
      </Box>
    );
  };

  const renderInput = () => {
    return (
      <Box className={"dm_input"}>
        <TextField
          vlabel="Multiline"
          multiline
          maxRows={4}
          value={inValue}
          sx={{
            ml: "12px",
            "& .MuiInputBase-root": {
              color: "white",
              width: "250px",
              // height: "40px",
              fontSize: "18px",
              fontFamily: "Saira",
              fontWeight: "500",
            },
          }}
          onChange={(e) => {
            setInValue(e.target.value);
          }}
        />
        <Button
          variant="contained"
          className={"dm_send_bt"}
          onClick={() => {
            sendDM();
          }}
        >
          send
        </Button>
      </Box>
    );
  };

  return (
    <Box className={"chat_dm_bg"}>
      {renderHeader()}
      {renderMeta()}
      <Divider sx={{ width: "100%", py: "4px" }} />
      {renderContent()}
      <Divider sx={{ width: "100%", py: "4px" }} />
      {renderInput()}
    </Box>
  );
};

export default GFTChat;
