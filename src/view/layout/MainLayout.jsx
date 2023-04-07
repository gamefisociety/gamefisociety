import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { setDrawer, setChatDrawer } from "module/store/features/dialogSlice";

import GFTHead from "view/head/GFTHead";
// import GBottomMenu from "view/head/GBottomMenu";
import GFTLeftMenu from "view/head/GFTLeftMenu";
import GFTHomeMeta from 'view/meta/GFTHomeMeta';
import GSociety from "view/page/GSociety";
import GRelays from "view/page/GRelays";
import GRelaysShow from "view/page/GRelaysShow";
import GSocietyShow from "view/page/GSocietyShow";
import GFTChat from "view/page/GFTChat";

import GLoginDialog from "view/dialog/GLoginDialog";

import { System } from "nostr/NostrSystem";
import { init } from "module/store/features/loginSlice";
import { initRelays } from "module/store/features/profileSlice";

import "./MainLayout.scss";

const MainLayout = () => {
  const dispatch = useDispatch();
  const { loggedOut } = useSelector((s) => s.login);
  const {
    isDrawer,
    placeDrawer,
    cardDrawer,
    chatDrawer,
    chatPubKey,
    chatProfile,
    isBottomDrawer,
    bottomPage,
    isRightDrawer,
    rightPage,
  } = useSelector((s) => s.dialog);

  return (
    <Box className="main_bg">
      <GFTHead />
      {loggedOut === false && <GFTLeftMenu />}
      <GFTHomeMeta />
      {
        <Box className="main_content">
          <Outlet />
        </Box>
      }
      <Drawer
        PaperProps={{
          style: {
            marginTop: "64px",
            borderRadius: "12px",
            backgroundColor: "rgba(17,17,17,0.95)",
            // backgroundColor: "rgba(17,17,17,0.95)",
          },
        }}
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
        {cardDrawer === "follow" && (
          <GSociety
            callback={() => {
              dispatch(
                setDrawer({
                  isDrawer: false,
                  placeDrawer: "right",
                  cardDrawer: "default",
                })
              );
            }}
          />
        )}
        {cardDrawer === "relays" && <GRelays />}
        {cardDrawer === "relay-show" && <GRelaysShow />}
        {cardDrawer === "follower-show" && <GSocietyShow />}
      </Drawer>
      <Drawer
        PaperProps={{
          sx: {
            marginTop: "64px",
            backgroundColor: "transparent",
            borderWidth: 0,
          },
        }}
        variant="persistent"
        anchor={"right"}
        open={chatDrawer}
        onClose={() => {
          dispatch(
            setChatDrawer({
              chatDrawer: false,
              chatPubKey: chatPubKey,
              chatProfile: chatProfile,
            })
          );
        }}
      >
        <GFTChat
          chatPK={chatPubKey}
          chatProfile={chatProfile}
          closeHandle={() => {
            dispatch(
              setChatDrawer({
                chatDrawer: false,
                chatPubKey: chatPubKey,
                chatProfile: chatProfile,
              })
            );
          }}
        />
      </Drawer>
      {/* <Drawer
        className='main_right_drawer'
        // swipeAreaWidth='80%'
        PaperProps={{
          // className: 'main_bottom_drawer_inner',
          sx: {
            height: '82vh',
            maxWidth: '36.5vw',
            mt: '66px',
            mb: '66px',
            // right: '12px',
            backgroundColor: 'rgba(0,0,0,0.85)',
            borderWidth: 0,
            borderRadius: '12px',
          },
        }}
        // variant="temporary"
        variant="persistent"
        ModalProps={{
          keepMounted: true,
        }}
        anchor={"right"}
        open={isRightDrawer}
        onClose={() => {
          dispatch(
            setRightDrawer({
              rightDrawer: false,
              rightPage: null,
            })
          );
        }}
      >
      </Drawer> */}
      <Drawer
        className='main_bottom_drawer'
        // swipeAreaWidth='80%'
        // PaperProps={{
        //   className: 'main_bottom_drawer_inner',
        //   sx: {

        //     height: '80vh',
        //     maxWidth: '940px',
        //     mb: "50px",
        //     backgroundColor: 'rgba(0,0,0,0.2)',
        //     borderWidth: 0,
        //   },
        // }}
        // variant="temporary"
        variant="persistent"
        ModalProps={{
          keepMounted: true,
        }}
        anchor={"bottom"}
        open={isBottomDrawer}
        onClose={() => {
          // dispatch(
          //   setChatDrawer({
          //     chatDrawer: false,
          //     chatPubKey: chatPubKey,
          //     chatProfile: chatProfile,
          //   })
          // );
        }}
      >
      </Drawer>
      {loggedOut === true && <GLoginDialog />}
    </Box>
  );
};

export default MainLayout;
