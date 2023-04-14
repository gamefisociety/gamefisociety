import React, { useEffect, useState } from "react";
import "./GMyNFT.scss";

import { useSelector, useDispatch } from "react-redux";
import { styled } from '@mui/material/styles';
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
        backgroundColor: theme.palette.mode === 'dark' ? '#32dce8' : '#65C466', //'#2ECA45',#65C466
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

const GMyNFT = () => {
  const { publicKey, privateKey } = useSelector((s) => s.login);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const [isNip19, setNip19] = useState(true);

  useEffect(() => {
    return () => { };
  }, []);

  return (
    <Paper className={'user_nft_bg'} elevation={0}>
      <Typography sx={{ width: '100%', py: '18px' }} align={'center'} variant="h5" >{'MY NFT'}</Typography>
    </Paper>
  );
};

export default GMyNFT;
