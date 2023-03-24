import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import { setDrawer, setChatDrawer } from "module/store/features/dialogSlice";

import GFTHead from "view/head/GFTHead";
import GBottomMenu from "view/head/GBottomMenu";
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
  const { isDrawer, placeDrawer, cardDrawer } = useSelector((s) => s.dialog);
  const { chatDrawer, chatPubKey, chatProfile } = useSelector((s) => s.dialog);
  return (
    <Box className="main_bg">
      <GFTHead />
      <GBottomMenu />
            {/* <Box
        sx={{
          width: "280px",
          position: "fixed",
          top: "60px",
          zIndex: "999",
        }}
      >
        <GFTLeftMenu />
      </Box> */}
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
            <Outlet />
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
      <Drawer
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
    </Box>
  );
};

export default MainLayout;
