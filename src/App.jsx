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
  const { isOpenConnect, isOpenMenu, isOpenCheckIn, isOpenMintAvatar, isPost } = useSelector(s => s.dialog);
  const { relays } = useSelector((s) => s.profile);

  useEffect(() => {
    dispatch(init('redux'));
    dispatch(initRelays())
  }, []);

  useEffect(() => {
    //
    console.log('app relays', relays);
    relays?.map((cfg) => {
      System.ConnectRelay(cfg.addr, cfg.read, cfg.write);
    });
  }, [relays]);

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
