import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import { setDrawer, setChatDrawer, setRightDrawer } from "module/store/features/dialogSlice";

import GFTHead from "view/head/GFTHead";
import GBottomMenu from "view/head/GBottomMenu";
import GFTHomeMeta from 'view/home/GFTHomeMeta';
import GSociety from "view/page/GSociety";
import GRelays from "view/page/GRelays";
import GFTChat from "view/page/GFTChat";
import { System } from "nostr/NostrSystem";
import { init } from "module/store/features/loginSlice";
import { initRelays } from "module/store/features/profileSlice";

import "./MainLayout.scss";

// const win_h = window.client

const MainLayout = () => {
  const dispatch = useDispatch();
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
      <GBottomMenu />
      <Grid sx={{ flexGrow: 1 }} container>
        <Stack
          sx={{
            backgroundColor: "background.paper",
          }}
          className="main_content"
          direction="row"
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
        >
          <Stack
            className={"scroll_content"}
            direction="column"
            alignItems={"center"}
            justifyContent={"flex-start"}
          >
            <GFTHomeMeta></GFTHomeMeta>
          </Stack>
        </Stack>
      </Grid>
      <Drawer
        PaperProps={{
          style: {
            borderRadius: "12px",
            backgroundColor: "background.paper",
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
      </Drawer>
      {/* <Drawer
        PaperProps={{
          sx: {
            marginTop: "70px",
            // height: "80%",
            // marginBottom: "50px",
            backgroundColor: "transparent",
            borderWidth: 0,
          },
        }}
        variant="persistent"
        anchor={"bottom"}
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
      </Drawer> */}
      <Drawer
        className='main_right_drawer'
        // swipeAreaWidth='80%'
        PaperProps={{
          // className: 'main_bottom_drawer_inner',
          sx: {
            height: '88vh',
            maxWidth: '940px',
            mt: '6vh',
            backgroundColor: 'rgba(0,0,0,0.85)',
            borderWidth: 0,
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
        <Outlet />
      </Drawer>
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
        <Box sx={{
          height: '500px',
          width: '80%',
        }}></Box>
      </Drawer>
    </Box>
  );
};

export default MainLayout;
