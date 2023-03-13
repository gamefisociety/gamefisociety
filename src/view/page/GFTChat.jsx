import { React, useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import "./GFTChat.scss";

import { bech32 } from "bech32";
import * as secp from "@noble/secp256k1";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import { VariableSizeList as List } from "react-window";
import closeImg from "./../../asset/image/social/close.png";
import dmLeftImg from "./../../asset/image/social/dm_left.png";
import { useChatPro } from "nostr/protocal/ChatPro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils";
import TimelineCache from 'db/TimelineCache';
import useNostrEvent from 'nostr/NostrEvent';

const ListRow = ({ data, index, setSize, chatPK }) => {
  //
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
        padding: "10px",
        justifyContent: item.pubkey === chatPK ? "flex-start" : "flex-end",
      }}
    >
      <Typography
        sx={{
          width: "70%",
          padding: "10px",
          backgroundColor: item.pubkey === chatPK ? "#191A1B" : "#454FBF",
          borderRadius: "6px",
          fontFamily: "Saira",
          fontWeight: "500",
        }}
        variant="body2"
        color="#FFFFFF"
        align={"left"}
      >
        {item.content}
      </Typography>
    </Box>
  );
};

const GFTChat = (props) => {
  const listRef = useRef();
  const { chatPK, chatProfile } = props;
  const { publicKey, privateKey } = useSelector((s) => s.login);
  const chatPro = useChatPro();
  const [chatData, setChatData] = useState([]);
  const [inValue, setInValue] = useState("");
  const [subChat, setSubChat] = useState([]);

  const nostrEvent = useNostrEvent();

  const TLCache = TimelineCache();

  const sizeMap = useRef({});

  const setSize = useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current.resetAfterIndex(index);
  }, []);
  const getSize = (index) => sizeMap.current[index] || 50;
  //
  const listenDM = (targetPubkey) => {
    const filterDM = chatPro.get(targetPubkey);
    let subDM = BuildSub('chat_with', [filterDM]);
    TLCache.create(subChat[1]);
    //
    setSubChat(subDM.concat());
    System.BroadcastSub(subDM, (tag, client, msg) => {
      if (tag === 'EVENT') {
        try {
          nostrEvent.DecryptData(msg.content, privateKey, targetPubkey).then((dmsg) => {
            if (dmsg) {
              let flag = TLCache.pushChat(subChat[1], msg.pubkey, msg.created_at, dmsg);
              if (flag === false) {
                return;
              }
              let chat_datas = TLCache.get(subChat[1]);
              if (chat_datas) {
                setChatData(chat_datas.concat());
              }
              // console.log('dm targetPubkey', chat_datas);
            }
          });
        } catch (e) {
          //
        }
      }
    });
  }

  const unlistenDM = (chatPK) => {
    console.log('unlistenDM', unlistenDM);
    TLCache.clear(subChat[1]);
    System.BroadcastClose(subChat, null, null);
  }
  //
  useEffect(() => {
    listenDM(chatPK);
    return () => {
      unlistenDM()
    };
  }, [chatPK]);

  const sendDM = async () => {
    if (inValue.length === 0) {
      return;
    }
    const chatEv = await chatPro.send(chatPK, inValue);
    System.BroadcastEvent(chatEv, (tag, client, msg) => {
      if (tag === 'OK' && msg.ret && msg.ret === true) {
        let flag = TLCache.pushChat(subChat[1], publicKey, chatEv.CreatedAt, inValue);
        if (flag === false) {
          return;
        }
        let chat_datas = TLCache.get(subChat[1]);
        if (chat_datas) {
          setChatData(chat_datas.concat());
        }
      }
    }
    );
  };

  return (
    <Container
      sx={{
        width: "392px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#272727",
        padding: "30px",
      }}
    >
      <Box
        sx={{
          marginTop: "30px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Icon
          sx={{
            width: "100px",
            height: "50px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontSize: "20px",
            fontFamily: "Saira",
            fontWeight: "500",
          }}
        >
          <img src={dmLeftImg} width="50px" alt="dmleft" />
          DMs
        </Icon>
        <Button
          sx={{
            width: "60px",
            height: "60px",
          }}
          onClick={() => {
            props.closeHandle();
          }}
        >
          <img src={closeImg} width="60px" alt="close" />
        </Button>
      </Box>
      <List
        ref={listRef}
        height={400}
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
      <Box
        sx={{
          marginTop: "30px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TextField
          vlabel="Multiline"
          multiline
          maxRows={4}
          value={inValue}
          sx={{
            "& .MuiInputBase-root": {
              color: "white",
              width: "250px",
              //   height: "40px",
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
          sx={{
            width: "80px",
            height: "60px",
            backgroundColor: "#454FBF",
          }}
          onClick={() => {
            sendDM();
          }}
        >
          send
        </Button>
      </Box>
    </Container>
  );
};

export default GFTChat;
