import { React, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import "./GFTChat.scss";

import { bech32 } from "bech32";
import * as secp from "@noble/secp256k1";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
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
const GFTChat = (props) => {
  const { chatPK } = props;
  const nostrEvent = useNostrEvent();
  const publicKey = useSelector((s) => s.login.publicKey);
  const privateKey = useSelector((s) => s.login.privateKey);
  const chatPro = useChatPro();
  const [chatData, setChatData] = useState([]);
  const [inValue, setInValue] = useState("");
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
    System.BroadcastSub(chatNode, 1, (msgs) => {
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
        }
      },
      curRelays
    );
  };

  const onChangeHandle = (e) => {
    setInValue(e.target.value);
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
      <Stack spacing={2} sx={{ width: "100%" }}>
        {Array.from(chatData).map((item, index) => (
          <Box
            key={index}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent:
                item.pubkey === chatPK ? "flex-start" : "flex-end",
            }}
          >
            <Typography
              sx={{
                width: "70%",
                padding: "10px",
                backgroundColor: item.pubkey === chatPK ? "#191A1B" : "#454FBF",
                borderRadius: "6px",
              }}
              variant="body2"
              color="white"
              align={"left"}
            >
              {item.decontent}
            </Typography>
          </Box>
        ))}
      </Stack>

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
          variant="outlined"
          value={inValue}
          onChange={(e) => onChangeHandle(e)}
        />
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            // onClickSend();
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
