import React, { useEffect } from 'react';
import { HashRouter } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Router from './module/router/router'

import ThemeCustomization from 'themes/ThemeCustomization';
import ScrollTop from 'components/ScrollTop';

import GFTConnectDialog from "view/dialog/GFTConnectDialog";
import GFTWalletMenu from "view/menu/GFTWalletMenu";
import GFTCheckInDialog from "view/dialog/GFTCheckInDialog";
import GFTMintAvatarDialog from "view/dialog/GFTMintAvatarDialog";
import GPostDialog from "view/dialog/GPostDialog";

import './App.css';

import { System } from 'nostr/NostrSystem';
import { init } from "module/store/features/loginSlice";
import { initRelays } from 'module/store/features/profileSlice';

console.log('gfs init!');

System.initRelays();

const App = () => {

  const dispatch = useDispatch();
  const { loggedOut } = useSelector((s) => s.login);
  const { isOpenConnect, isOpenMenu, isOpenCheckIn, isOpenMintAvatar, isOpenLogin, isPost } = useSelector(s => s.dialog);
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
    <ThemeCustomization>
      <HashRouter>
        <ScrollTop>
          <Router />
        </ScrollTop>
      </HashRouter>
      {isOpenConnect && <GFTConnectDialog />}
      {isOpenMenu && <GFTWalletMenu />}
      {isOpenCheckIn && <GFTCheckInDialog />}
      {isOpenMintAvatar && <GFTMintAvatarDialog />}
      {isPost && <GPostDialog />}
    </ThemeCustomization>
  );
}

export default App;
