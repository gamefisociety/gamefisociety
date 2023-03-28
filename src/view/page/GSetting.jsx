import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Button, Box, Paper, Stack, Divider } from "@mui/material";
import "./GSetting.scss";

import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { System } from "nostr/NostrSystem";
import { setProfile } from "module/store/features/profileSlice";

import icon_praise from "asset/image/social/icon_praise.png";

const GSetting = () => {
  const profile = useSelector((s) => s.profile);
  const { publicKey, privateKey } = useSelector((s) => s.login);

  const [localProfile, setLocalProfile] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    return () => { };
  }, []);

  return (
    <Paper className={'user_setting_bg'} >
      <Typography sx={{ width: '100%', py: '18px' }} align={'center'} variant="h5" >{'SETTING'}</Typography>
      <Typography className={'setting_title'}>
        {"PUBLIC ACCOUNT ID"}
      </Typography>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        sx={{
          width: '100%'
        }}>
        <Typography className={'setting_context'}>
          {publicKey}
        </Typography>
        <img className={'icon_copy'} />
      </Stack>
      <Typography className={'setting_title'} sx={{ mt: '36px' }}>
        {"SECRET ACCOUNT LOGIN"}
      </Typography>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        sx={{
          width: '100%'
        }}>
        <Typography className={'setting_context'}>
          {privateKey}
        </Typography>
        <Box sx={{ flexGrow: 1 }}></Box>
        <img className={'icon_show'} />
        <img className={'icon_copy'} />
      </Stack>
      <Divider sx={{
        my: '24px',
      }} />
      <Typography className={'setting_title'}>
        {'DEFAULT SHOCK AMOUNT'}
      </Typography>
      <TextField
        sx={{
          ml: '26px',
          mt: '12px',
          width: "92%",
          borderRadius: "5px",
          borderColor: "#323232",
          backgroundColor: "#202122",
          fontSize: "14px",
          fontFamily: "Saira",
          fontWeight: "500",
          color: "#FFFFFF",
        }}
        value={1000}
        variant="outlined"
        onChange={(event) => {
          // localProfile.display_name = event.target.value;
          // setLocalProfile({ ...localProfile });
        }}
      />
      <Divider sx={{
        my: '24px',
      }} />
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        sx={{
          width: '100%'
        }}>
        <Typography className={'setting_title'}>
          {'SIGN OUT'}
        </Typography>
        <Button
          variant="contained"
          className={'bt_out'}
        // onClick={saveProfile}
        >
          {'Sign Out'}
        </Button>
      </Stack>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        sx={{
          py: '24px',
          width: '100%'
        }}>
        <Typography className={'setting_title'}>
          {'DELETE ACCOUNT'}
        </Typography>
        <Button
          variant="contained"
          className={'bt_del'}
        // onClick={saveProfile}
        >
          {'Delete Account'}
        </Button>
      </Stack>

    </Paper>
  );
};

export default GSetting;
