import React, { useEffect } from "react";
import "./MainLayout.scss";
import useMediaQuery from '@mui/material/useMediaQuery';

import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import GFTHead from "view/head/GFTHead";
// import GBottomMenu from "view/head/GBottomMenu";
import GFTLeftMenu from "view/head/GFTLeftMenu";
import GSociety from "view/page/GSociety";
import GSocietyDM from "view/page/GSocietyDM";
import GChatGroup from "view/page/GChatGroup";
import GRelays from "view/page/GRelays";
import GRelaysShow from "view/page/GRelaysShow";
import GSocietyShow from "view/page/GSocietyShow";
import GFTChat from "view/page/GFTChat";

import GLoginDialog from "view/dialog/GLoginDialog";

import { setDrawer, setOpenMenuLeft } from "module/store/features/dialogSlice";

const MainLayout = () => {
  const match_mobile = useMediaQuery('(max-width:768px)');
  const dispatch = useDispatch();
  const { loggedOut } = useSelector((s) => s.login);
  const {
    isDrawer,
    placeDrawer,
    cardDrawer,
    isBottomDrawer,
    isOpenMenuLeft,
    chatPubKey,
    bottomPage,
    isRightDrawer,
    rightPage,
  } = useSelector((s) => s.dialog);

  const getRightDrawVarient = () => {
    let right_draw_method = 'temporary';
    if (cardDrawer === "society-chat-group") {
      right_draw_method = 'persistent';
    }
    return right_draw_method;
  }

  const renderLeftMenu = () => {
    return (
      <Box className={'main_menu'} >
        <GFTLeftMenu />
      </Box>
    );
  }

  const rednerRightDrawer = () => {
    return (
      <Drawer elevation={0}
        PaperProps={{
          style: {
            marginTop: "64px",
            borderRadius: "12px",
            backgroundColor: "#0F0F0F",
          },
        }}
        variant={getRightDrawVarient()}
        anchor={placeDrawer}
        open={isDrawer}
        onClose={() => {
          dispatch(
            setDrawer({
              isDrawer: false,
              placeDrawer: "right",
              cardDrawer: "default",
            })
          );
        }}
      >
        {cardDrawer === "society" && <GSociety />}
        {cardDrawer === "society-dm" && <GSocietyDM />}
        {cardDrawer === "society-chat" && <GFTChat chatPK={chatPubKey} />}
        {cardDrawer === "society-chat-group" && <GChatGroup />}
        {cardDrawer === "relays" && <GRelays />}
        {cardDrawer === "relay-show" && <GRelaysShow />}
        {cardDrawer === "society-show" && <GSocietyShow />}
      </Drawer>
    );
  }

  const renderLeftDrawer = () => {
    return (
      <Drawer
        PaperProps={{
          sx: {
            marginTop: "64px",
            backgroundColor: "#0F0F0F",
            borderWidth: 0,
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
        variant={'temporary'}
        anchor={"left"}
        open={isOpenMenuLeft}
        onClose={() => {
          //
          dispatch(setOpenMenuLeft(false));
        }}
      >
        {renderLeftMenu()}
      </Drawer>
    );
  }

  const renderBottomDrawer = () => {
    return (
      <Drawer
        className="main_bottom_drawer"
        variant="persistent"
        ModalProps={{
          keepMounted: true,
        }}
        anchor={"bottom"}
        open={isBottomDrawer}
        onClose={() => {
          //
        }}
      ></Drawer>
    );
  }

  //
  return (
    <Box className="main_bg">
      <GFTHead />
      <Box className={'main_frame'}>
        {!match_mobile && isOpenMenuLeft && renderLeftMenu()}
        <Box className="main_content">
          <Outlet />
        </Box>
      </Box>
      {rednerRightDrawer()}
      {match_mobile && renderLeftDrawer()}
      {renderBottomDrawer()}
      <GLoginDialog />
      {/* {loggedOut === true && <GLoginDialog />} */}
    </Box>
  );
};

export default MainLayout;
