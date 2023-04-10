import React, { useEffect, useState, useRef } from "react";
import "./GChatGroupInner.scss";

import { useSelector, useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Button, Box, Paper, Stack, Divider } from "@mui/material";

import { useChatPro } from "nostr/protocal/ChatPro";

import { System } from "nostr/NostrSystem";

const GChatGroupInner = (props) => {
  const { callback } = props;
  const [localProfile, setLocalProfile] = useState({
    name: '',
    about: '',
    picture: ''
  });
  const chatPro = useChatPro();

  const creatChatGroup = async () => {
    let cxt = JSON.stringify(localProfile);
    let event = await chatPro.createChannel(cxt);
    System.BroadcastEvent(event, (tags, client, msg) => {
      if (tags === "OK" && msg.ret === true) {
        console.log('creatChatGroup', event, msg);
      }
    });
  };

  return (
    <Paper className={'chat_group_create_bg'} >
      <Typography sx={{ width: '100%', py: '18px' }} align={'center'} variant="h5" >{'CREATE GROUP'}</Typography>
      <Box className={'lable_part'}>
        <Typography className={'lable_flag'}>
          {"GROUP NAME"}
        </Typography>
        <TextField className={'label_text'}
          placeholder={'group name'}
          value={localProfile.name}
          onChange={(event) => {
            localProfile.name = event.target.value;
            setLocalProfile({ ...localProfile });
          }}
        />
      </Box>
      <Box className={'lable_part'}>
        <Typography className={'lable_flag'}>
          {"PICTURE"}
        </Typography>
        <TextField className={'label_text'}
          placeholder={'picture'}
          value={localProfile.picture}
          onChange={(event) => {
            localProfile.picture = event.target.value;
            setLocalProfile({ ...localProfile });
          }}
        />
        <Button className={'bt_add'}
          onClick={() => {
            // dispatch(logout());
          }}
        >
          {'ADD'}
        </Button>
      </Box>
      <Box className={'lable_part'}>
        <Typography className={'lable_flag'}>
          {"ABOUT"}
        </Typography>
        <TextField className={'label_text'}
          placeholder={'group about'}
          value={localProfile.about}
          onChange={(event) => {
            localProfile.about = event.target.value;
            setLocalProfile({ ...localProfile });
          }}
        />
      </Box>
      <Button className={'bt_create'}
        onClick={() => {
          creatChatGroup();
        }}
      >
        {'CREATE'}
      </Button>
      <Button className={'bt_back'}
        onClick={() => {
          if (callback) {
            callback();
          }
        }}
      >
        {'BACK'}
      </Button>
    </Paper>
  );
};

export default GChatGroupInner;
