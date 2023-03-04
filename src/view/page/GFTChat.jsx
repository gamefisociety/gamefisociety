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
import {
  nip05,
  nip04,
  SimplePool,
  relayInit,
  generatePrivateKey,
  getPublicKey,
  getEventHash,
  signEvent,
  validateEvent,
  verifySignature,
} from "nostr-tools";
import { alpha, styled } from "@mui/material/styles";
import { useChatPro } from "nostr/protocal/ChatPro";
import { System } from "nostr/NostrSystem";
import useNostrEvent from "nostr/NostrEvent";

const relay = relayInit("wss://relay.damus.io");

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
        {item.decontent}
      </Typography>
    </Box>
  );
};

const GFTChat = (props) => {
  const listRef = useRef();
  const { chatPK } = props;
  const nostrEvent = useNostrEvent();
  const publicKey = useSelector((s) => s.login.publicKey);
  const privateKey = useSelector((s) => s.login.privateKey);
  const chatPro = useChatPro();
  const [chatData, setChatData] = useState([]);
  const [inValue, setInValue] = useState("");
  const sizeMap = useRef({});
  const setSize = useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current.resetAfterIndex(index);
  }, []);
  const getSize = (index) => sizeMap.current[index] || 50;
  useEffect(() => {
    getDMs();
    return () => {
      chatData.splice(0, chatData.length);
      setChatData([...chatData]);
    };
  }, []);

  const decodeContent = (sk, pk, content) => {
    return nip04.decrypt(sk, pk, content);
  };

  const getDataList = (key, key1) => {
    let sub = relay.sub([
      {
        kinds: [4],
        authors: [key, key1],
        "#p": [key1, key],
      },
    ]);
    let data = [...chatData];
    sub.on("event", (event) => {
      decodeContent(privateKey, key1, event.content).then((res) => {
        event.contentObj = res;
        data.push(event);
        data.sort((a, b) => {
          return a.created_at - b.created_at;
        });
        setChatData([...data]);
      });
      console.log("getDataList", event);
    });
    sub.on("eose", () => {
      console.log("sub list eose event", data);
      // sub.unsub()
    });

    sub.off("event", () => {
      console.log("off event");
    });

    sub.off("eose", () => {
      console.log("off eose event");
    });
  };

  const getDMs = () => {
    const chatNode = chatPro.get(publicKey, chatPK);
    console.log("chatNode", chatNode);
    System.BroadcastSub(chatNode, 0, (msgs) => {
      console.log("getDMs user chat sub", msgs);
      if (msgs && msgs.length > 0) {
        let t_chatData = [];
        msgs.map((item, index) => {
          decodeContent(privateKey, publicKey, item.content).then((demsg) => {
            item.decontent = demsg;
            t_chatData.push(item);
            t_chatData.sort((a, b) => {
              return a.created_at - b.created_at;
            });
            console.log(demsg);
            setChatData([...t_chatData]);
          });
        });
      }
    });
  };

  const sendDM = async () => {
    if (inValue.length === 0) {
      return;
    }
    const chatNode = await chatPro.send(publicKey, chatPK, undefined, inValue);
    const curRelays = [];
    curRelays.push("wss://nos.lol");
    //
    console.log("chatnode", chatNode);
    System.Broadcast(
      chatNode,
      1,
      (msgs) => {
        console.log("sendDM user chat sub", msgs);
        if (msgs && msgs.length > 0) {
          setInValue("");
        }
      },
      curRelays
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
