import React, { useEffect, useState, useRef } from "react";
import "./GChatGroupInfo.scss";

import { useSelector, useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Button, Box, Paper } from "@mui/material";
import Helpers from "view/utils/Helpers";
import { useChatPro } from "nostr/protocal/ChatPro";
import { System } from "nostr/NostrSystem";

const GChatGroupInfo = (props) => {
  const { ginfo, callback } = props;
  const [localProfile, setLocalProfile] = useState({
    name: '',
    about: '',
    picture: ''
  });
  const chatPro = useChatPro();

  const modifyChatGroup = async () => {
    let cxt = JSON.stringify(localProfile);
    let event = await chatPro.sendChannelMetadata(cxt, ginfo);
    System.BroadcastEvent(event, (tags, client, msg) => {
      if (tags === "OK" && msg.ret === true) {
        console.log('sendChannelMetadata', event, msg);
        if (callback) {
          callback();
        }
      }
    });
  };

  useEffect(() => {
    if (ginfo && ginfo.content !== '') {
      let tmp_info = JSON.parse(ginfo.content);
      setLocalProfile({ ...tmp_info });
    }
  }, [ginfo]);

  return (
    <Paper className={'chat_group_info_bg'} elevation={0}>
      <Typography sx={{ width: '100%', py: '18px' }} align={'center'} variant="h5" >{'CHANNEL INFO.'}</Typography>
      <Box className={'lable_part'}>
        <Typography className={'lable_flag'}>
          {"CHANNEL ID"}
        </Typography>
        <Box className={'id_bg'}>
          <Typography className={'lable_id'}>
            {ginfo.id}
          </Typography>
          <Box className={'icon_copy'} onClick={() => {
            Helpers.copyToClipboard(ginfo.id);
          }} />
        </Box>
      </Box>
      <Box className={'lable_part'}>
        <Typography className={'lable_flag'}>
          {"CHANNEL NAME"}
        </Typography>
        <TextField className={'label_text'}
          placeholder={'channel name'}
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
          placeholder={'channel about'}
          value={localProfile.about}
          onChange={(event) => {
            localProfile.about = event.target.value;
            setLocalProfile({ ...localProfile });
          }}
        />
      </Box>
      <Button className={'bt_modify'}
        onClick={() => {
          modifyChatGroup();
        }}
      >
        {'MODIFY'}
      </Button>
      <Box className={'bt_back'}
        onClick={() => {
          if (callback) {
            callback();
          }
        }}
      />
    </Paper>
  );
};

export default React.memo(GChatGroupInfo);
