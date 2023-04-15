import React, { useEffect, useState } from "react";
import "./GNFTStore.scss";

import { useSelector, useDispatch } from "react-redux";
import { styled } from '@mui/material/styles';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import { Button, Box, Paper, Stack, Divider } from "@mui/material";
import GCardNFT from 'components/GCardNFT';
import Helpers from "view/utils/Helpers";
import { logout } from "module/store/features/loginSlice";
import { hexToBech32 } from 'nostr/Util';

let nfts = [];
for (let i = 0; i < 50; i++) {
  nfts.push(i);
}

const GNFTStore = () => {
  const { publicKey, privateKey } = useSelector((s) => s.login);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const [isNip19, setNip19] = useState(true);

  useEffect(() => {
    return () => { };
  }, []);

  return (
    <Box className={'nft_store_bg'} >
      <Typography sx={{ width: '100%', py: '18px' }} align={'center'} variant="h5" >{'NFT MARKET'}</Typography>
      <Box className={'nft_list'}>
        {nfts.map((item, index) => {
          return (<GCardNFT />);
        })}
      </Box>
    </Box>
  );
};

export default GNFTStore;
