import { React, useEffect, useState, useRef } from "react";
import "./GFTChat.scss";

import { bech32 } from "bech32";
import * as secp from "@noble/secp256k1";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {Button} from "@mui/material";
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
import { setPrivateKey } from "module/store/features/loginSlice";
import ic_gfs_coin from "../../asset/image/logo/ic_gfs_coin.png";
import { Sync } from "../../../node_modules/@mui/icons-material/index";

export const EmailRegex =
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#272727",
  //   ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  width: "100%",
}));

const RedditTextField = styled((props) => (
  <TextField InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({
  "& label": {
    fontFamily: ["Saira"],
    fontWeight: 500,
    fontSize: 18,
    color: "#666666",
    "&.Mui-focused": {
      color: "#666666",
    },
  },
  "& .MuiFilledInput-root": {
    border: "1px solid #333333",
    overflow: "hidden",
    borderRadius: 4,
    fontFamily: ["Saira"],
    fontWeight: 500,
    color: "#333",
    fontSize: 20,
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&.Mui-focused": {
      backgroundColor: "transparent",
      boxShadow: `${alpha("#fff", 0.25)} 0 0 0 1px`,
      borderColor: `#333`,
      color: `#fff`,
    },
  },
}));
const relay = relayInit("wss://relay.damus.io");
let privateKey = "";
let pubKey = "";

const GFTChat = (props) => {
  const { chatPK } = props;
  const [chatData, setChatData] = useState([]);
  const [inforData, setInforData] = useState(new Map());
  const [inValue, setInValue] = useState("");
  useEffect(() => {
    initConnect();
    return () => {};
  }, []);

  const initConnect = async () => {
    await relay.connect();
    relay.on("connect", () => {
      console.log(`connected to ${relay.url}`);
    });
    relay.on("error", () => {
      console.log(`failed to connect to ${relay.url}`);
    });
    login();
  };

  const login = async () => {
    privateKey = await doLogin(
      "nsec1e6vl3t2dpqh6hh5q8vxjuyqaxg0apjk6fmqazythdtd487d0p0wq94pkwp"
    );
    pubKey = getPublicKey(privateKey);
    getDataList(pubKey, chatPK);
    // getDataList(chatAddress,pubKey);
  };

  const getDecode = (sk, pk, data) => {
    return nip04.decrypt(sk, pk, data);
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
      getDecode(privateKey, key1, event.content).then((res) => {
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

  //login
  async function getNip05PubKey(addr) {
    const [username, domain] = addr.split("@");
    const rsp = await fetch(
      `https://${domain}/.well-known/nostr.json?name=${encodeURIComponent(
        username
      )}`
    );
    if (rsp.ok) {
      const data = await rsp.json();
      const pKey = data.names[username];
      if (pKey) {
        return pKey;
      }
    }
    throw new Error("User key not found");
  }

  async function doLogin(key) {
    try {
      if (key.startsWith("nsec")) {
        const hexKey = bech32ToHex(key);
        console.log(hexKey);
        return hexKey;
        // if (secp.utils.isValidPrivateKey(hexKey)) {
        //     console.log("ccccc");
        //     return hexKey;
        // } else {
        //   throw new Error("INVALID PRIVATE KEY");
        // }
      } else if (key.startsWith("npub")) {
        const hexKey = bech32ToHex(key);
        return hexKey;
      } else if (key.match(EmailRegex)) {
        const hexKey = await getNip05PubKey(key);
        if (secp.utils.isValidPrivateKey(hexKey)) {
          return hexKey;
        } else {
          throw new Error("INVALID PRIVATE KEY");
        }
      } else {
        if (secp.utils.isValidPrivateKey(key)) {
          return key;
        } else {
          throw new Error("INVALID PRIVATE KEY");
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  const getInfor = (pkey) => {
    let sub = relay.sub([
      {
        kinds: [0],
        authors: pkey,
      },
    ]);
    sub.on("event", (event) => {
      console.log("event", event);
      event.contentObj = JSON.parse(event.content);
      setInforData(new Map(inforData.set(event.pubkey, event)));
      // sub.unsub()
    });
    sub.on("eose", () => {
      console.log("eose event");
      sub.unsub();
    });

    sub.off("event", () => {
      console.log("off event");
    });

    sub.off("eose", () => {
      console.log("off eose event");
    });
  };
  function bech32ToHex(str) {
    const nKey = bech32.decode(str);
    const buff = bech32.fromWords(nKey.words);
    return secp.utils.bytesToHex(Uint8Array.from(buff));
  }

  function bech32ToText(str) {
    const decoded = bech32.decode(str, 1000);
    const buf = bech32.fromWords(decoded.words);
    return new TextDecoder().decode(Uint8Array.from(buf)).to;
  }

  const onValueEdite = (e) => {
    setInValue(e.target.value);
  };

  const sendEvent = (event) => {
    event.id = getEventHash(event);
    event.sig = signEvent(event, privateKey);
    console.log(privateKey, "privateKey");
    let pub = relay.publish(event);
    pub.on("ok", () => {
      console.log(`${relay.url} has accepted our event ok`);
    });
    pub.on("failed", (reason) => {
      console.log(`failed to publish to ${relay.url}: ${reason}`);
    });
  };
  const onClickSend = async () => {
    // privateKey = await doLogin("nsec1e6vl3t2dpqh6hh5q8vxjuyqaxg0apjk6fmqazythdtd487d0p0wq94pkwp");
    // pubKey = getPublicKey(privateKey);
    let ciphertext = await nip04.encrypt(privateKey, chatPK, inValue);

    let event = {
      kind: 4,
      pubkey: pubKey,
      created_at: Math.floor(Date.now() / 1000),
      tags: [["p", chatPK]],
      content: ciphertext,
    };
    sendEvent(event);
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
              {item.contentObj}
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
        <TextField variant="outlined" value={inValue} onChange={(e) => onValueEdite(e)} />
        <Button variant="contained" color="info" onClick={()=>{
            onClickSend()
        }}>
          send
        </Button>
      </Box>
    </Container>
  );
  // return (
  //     <div className='chat_bg'>

  //         {Array.from(chatData).map((item, index) => (
  //             <div key={"chat" + index} className='item_list'>
  //                 {
  //                     item.pubkey == chatPK ?
  //                         <div className='chat_left'>{item.contentObj}</div> :
  //                         <div className='chat_right'>{item.contentObj}</div>
  //                 }
  //             </div>
  //         ))}

  //         <div className='edit' >
  //             <RedditTextField
  //                 hiddenLabel
  //                 placeholder="chat value"
  //                 variant="filled"
  //                 rows={1}
  //                 onChange={(e) => onValueEdite(e)}
  //                 style={{ marginTop: 0, marginLeft: 13 }}
  //             />
  //             <div className='send' onClick={() => onClickSend()}>send</div>
  //         </div>

  //     </div >
  // );
};

export default GFTChat;
