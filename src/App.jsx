import React, { useEffect, useState } from 'react';
import { HashRouter } from "react-router-dom";
import { Web3ReactProvider } from '@web3-react/core'
import { SnackbarProvider, useSnackbar } from "notistack";
import Router from './module/router/router'
import Web3 from 'web3'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { gfstheme } from 'view/theme/gfstheme';
import { useSelector, useDispatch } from 'react-redux';
//
import GFTConnectDialog from "view/dialog/GFTConnectDialog";
import GFTWalletMenu from "view/menu/GFTWalletMenu";
import GFTCheckInDialog from "view/dialog/GFTCheckInDialog";
import GFTMintAvatarDialog from "view/dialog/GFTMintAvatarDialog";
import GLoginDialog from "view/dialog/GLoginDialog";

import './App.css';

import { System } from 'nostr/NostrSystem';
import { init } from "module/store/features/loginSlice";
import { initRelays } from 'module/store/features/profileSlice';

//
function getLibrary(provider, connector) {
  const web3 = new Web3(provider);
  return web3 // this will vary according to whether you use e.g. ethers or web3.js
}

const theme1 = gfstheme();

const theme = createTheme(theme1);

console.log('gfs init!');

System.initRelays();

function App() {

  const dispatch = useDispatch();
  const { isOpenConnect, isOpenMenu, isOpenCheckIn, isOpenMintAvatar, isOpenLogin } = useSelector(s => s.dialog);
  const { relays } = useSelector((s) => s.profile);
  useEffect(() => {
    if (relays) {
      for (const [addr, v] of Object.entries(relays)) {
        System.ConnectRelay(addr, v.read, v.write);
      }
    }
  }, [relays]);
  //init param form db or others
  useEffect(() => {
    // console.log('use db from reduce');
    dispatch(init('redux'));
    dispatch(initRelays())
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <SnackbarProvider maxSnack={3}>
          <div className="App">
            <HashRouter>
              <Router />
            </HashRouter>
            {isOpenConnect && <GFTConnectDialog />}
            {isOpenMenu && <GFTWalletMenu />}
            {isOpenCheckIn && <GFTCheckInDialog />}
            {isOpenMintAvatar && <GFTMintAvatarDialog />}
            {isOpenLogin && <GLoginDialog />}
          </div>
        </SnackbarProvider>
      </Web3ReactProvider>
    </ThemeProvider>
  );
}

export default App;
