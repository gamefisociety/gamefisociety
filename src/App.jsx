import React, { useEffect, useState } from 'react';
import { HashRouter } from "react-router-dom";
import { Web3ReactProvider } from '@web3-react/core'
import { SnackbarProvider, useSnackbar } from "notistack";
import Router from './module/router/router'
import Web3 from 'web3'
import { useSelector, useDispatch } from 'react-redux';
//
import GFTConnectDialog from "view/dialog/GFTConnectDialog";
import GFTWalletMenu from "view/menu/GFTWalletMenu";
import GFTCheckInDialog from "view/dialog/GFTCheckInDialog";
import GFTMintAvatarDialog from "view/dialog/GFTMintAvatarDialog";
import GLoginDialog from "view/dialog/GLoginDialog";

import './App.css';
function getLibrary(provider, connector) {
  const web3 = new Web3(provider);
  return web3 // this will vary according to whether you use e.g. ethers or web3.js
}

function App() {
  const { isOpenConnect, isOpenMenu, isOpenCheckIn, isOpenMintAvatar, isOpenLogin } = useSelector(s => s.dialog);

  return (
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
  );
}

export default App;
