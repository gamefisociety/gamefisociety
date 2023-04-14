import React, { useEffect, useState } from "react";
import "./GSetting.scss";

import { useSelector, useDispatch } from "react-redux";
import { alpha, styled } from '@mui/material/styles';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import { Button, Box, Paper, Stack, Divider } from "@mui/material";
import Helpers from "view/utils/Helpers";
import { logout } from "module/store/features/loginSlice";
import { hexToBech32 } from 'nostr/Util';

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 22,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#1C6CF9' : '#65C466', //'#2ECA45',#65C466
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 18,
    height: 18,
  },
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

// const ReadSwitch = styled(Switch)(({ theme }) => ({
//   "& .MuiSwitch-switchBase.Mui-checked": {
//     color: "#1C6CF9",
//     "&:hover": {
//       backgroundColor: alpha("#1C6CF9", theme.palette.action.hoverOpacity),
//     },
//   },
//   "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
//     backgroundColor: "#1C6CF9",
//   },
// }));

const GSetting = () => {
  const { publicKey, privateKey } = useSelector((s) => s.login);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const [isNip19, setNip19] = useState(true);

  useEffect(() => {
    return () => { };
  }, []);

  return (
    <Paper className={'user_setting_bg'} elevation={0}>
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
          {isNip19 ? hexToBech32('npub', publicKey) : publicKey}
        </Typography>
        <Box className={'icon_copy'} onClick={() => {
          let tmp_pub_key = isNip19 ? hexToBech32('npub', publicKey) : publicKey;
          Helpers.copyToClipboard(tmp_pub_key);
        }} />
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
        <Typography className={'setting_context'} type="password">
          {show ? (isNip19 ? hexToBech32('nsec', privateKey) : privateKey) : "*********************************************************************"}
        </Typography>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Box className={'icon_show'} onClick={() => {
          setShow(!show);
        }} />
        <Box className={'icon_copy'} onClick={() => {
          let tmp_pri_key = isNip19 ? hexToBech32('nsec', privateKey) : privateKey;
          Helpers.copyToClipboard(tmp_pri_key);
        }} />
      </Stack>
      <FormGroup sx={{ width: '100%', mt: '36px' }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ px: '24px' }}>
          <IOSSwitch checked={isNip19}
          size="small"
            onChange={(ev) => {
              setNip19(ev.target.checked);
            }} />
          <Typography>{'NIP19'}</Typography>
        </Stack>
        {/* <FormControlLabel control={ } /> */}
      </FormGroup>
      <Divider sx={{
        width: '100%',
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
          py: '24px',
          width: '100%'
        }}>
        <Typography className={'setting_title'}>
          {'CLEAR CACHE'}
        </Typography>
        <Button
          variant="contained"
          className={'bt_out'}
        // onClick={saveProfile}
        >
          {'Clear Cache'}
        </Button>
      </Stack>
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
          onClick={() => {
            dispatch(logout());
          }}
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
