import React, { useEffect, useState, useRef } from "react";
import "./GChatGroupCreate.scss";

import { useSelector, useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Button, Box, Paper, Stack, Divider } from "@mui/material";
import { useRelayPro } from "nostr/protocal/RelayPro";

import { System } from "nostr/NostrSystem";

const GChatGroupCreate = (props) => {
  const { callback } = props;
  const [localProfile, setLocalProfile] = useState({
    name: '',
    about: '',
    picture: ''
  });

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
          // dispatch(logout());
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

export default GChatGroupCreate;
