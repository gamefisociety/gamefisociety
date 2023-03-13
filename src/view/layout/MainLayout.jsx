import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import GCardFriends from "components/GCardFriends";
import GCardRelays from "components/GCardRelays";
import { setDrawer } from "module/store/features/dialogSlice";

import GFTHead from "view/head/GFTHead";
import GFTLeftMenu from "view/head/GFTLeftMenu";

import { System } from "nostr/NostrSystem";
import { init } from "module/store/features/loginSlice";
import { initRelays } from "module/store/features/profileSlice";

import "./MainLayout.scss";

// const win_h = window.client

const MainLayout = () => {
  const dispatch = useDispatch();
  const { isDrawer, placeDrawer, cardDrawer } = useSelector((s) => s.dialog);

  return (
    <Box className="main_bg">
      <GFTHead />
      <Box
        sx={{
          width: "280px",
          position: "fixed",
          top: "60px",
          zIndex: "999",
        }}
      >
        <GFTLeftMenu />
      </Box>
      <Grid sx={{ flexGrow: 1 }} container>
        <Stack
          sx={{
            backgroundColor: 'background.paper'
          }}
          className="main_content"
          direction="row"
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
        >
          <Box sx={{ width: "280px" }} />
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
          <GCardFriends
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
        {cardDrawer === "relays" && <GCardRelays />}
      </Drawer>
    </Box>
  );
};

export default MainLayout;
