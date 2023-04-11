import React, { useEffect, useState, useRef } from "react";
import "./GChatGroupInner.scss";

import { useSelector, useDispatch } from "react-redux";
import { Button, Box, Paper, Stack, Divider } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import { useChatPro } from "nostr/protocal/ChatPro";

import { System } from "nostr/NostrSystem";

const GChatGroupInner = (props) => {
  const { callback, ginfo } = props;
  const [inValue, setInValue] = useState("");
  const [localProfile, setLocalProfile] = useState({
    name: '',
    about: '',
    picture: ''
  });
  const chatPro = useChatPro();

  const sendMsg = async () => {
    if (inValue.length === 0) {
      return;
    }
    // const chatEv = await chatPro.sendDM(chatPK, inValue);
    // System.BroadcastEvent(chatEv, (tag, client, msg) => {
    //   if (tag === "OK" && msg.ret && msg.ret === true) {
    //     let flag = dm_cache.pushChat(chatPK, chatEv.Id, chatEv.PubKey, chatEv.CreatedAt, inValue);
    //     if (flag === false) {
    //       return;
    //     }
    //     let chat_datas = dm_cache.get(chatPK);
    //     if (chat_datas) {
    //       setChatData(chat_datas.concat());
    //       setInValue("");
    //     }
    //   }
    // });
  };
  // const creatChatGroup = async () => {
  //   let cxt = JSON.stringify(localProfile);
  //   let event = await chatPro.createChannel(cxt);
  //   System.BroadcastEvent(event, (tags, client, msg) => {
  //     if (tags === "OK" && msg.ret === true) {
  //       console.log('creatChatGroup', event, msg);
  //     }
  //   });
  // };

  useEffect(() => {
    //
  }, []);

  const getGroupName = () => {
    if (ginfo === null || !ginfo.content || ginfo.content === '') {
      return 'default';
    }
    let profile = JSON.parse(ginfo.content);
    return profile.name;
  }

  const renderHeader = () => {
    return (
      <Box className={'chat_group_header'}>
        <Box className={'bt_back'}
          onClick={() => {
            if (callback) {
              callback();
            }
          }}
        />
        <Typography className={'lable_head'}>
          {getGroupName()}
        </Typography>
        <Box className="icon_more" onClick={(event) => {
          // if (openMenu === false) {
          //   handleMenuOpen(event, cfg);
          // } else {
          //   handleMenuClose(event);
          // }
        }} />
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
  }

  const renderContent = () => {
    return (
      <Box className={'chat_group_content'}>
        {/* <List
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
        </List> */}
      </Box>
    );
  }

  const renderInput = () => {
    return <Box className={'chat_group_input'}>
      <TextField
        vlabel="Multiline"
        multiline
        maxRows={4}
        value={inValue}
        className={'input_text'}
        onChange={(e) => {
          setInValue(e.target.value);
        }}
      />
      <Button
        variant="contained"
        className={'dm_send_bt'}
        onClick={() => {
          sendMsg();
        }}
      >
        {'send'}
      </Button>
    </Box>;
  }

  return (
    <Paper className={'chat_group_inner_bg'} >
      {renderHeader()}
      <Divider sx={{ width: '100%', py: '4px' }} />
      {renderContent()}
      <Divider sx={{ width: '100%', py: '4px' }} />
      {renderInput()}
    </Paper>
  );
};

export default GChatGroupInner;
