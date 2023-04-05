import React, { useState } from "react";
import "./GRelaysShow.scss";

import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import { alpha, styled } from "@mui/material/styles";
import { setRelays, setFollows } from "module/store/features/profileSlice";
import { useRelayPro } from "nostr/protocal/RelayPro";
import logo_delete from "asset/image/social/icon_delete.png";
import icon_detail from "asset/image/social/icon_detail.png";
import icon_save from "asset/image/social/icon_save.png";
import icon_back_white from "../../asset/image/social/icon_back_white.png";
import { System } from "nostr/NostrSystem";

const GRelaysShow = () => {
  const { relays, curRelay } = useSelector((s) => s.profile);
  const { loggedOut } = useSelector((s) => s.login);
  const dispatch = useDispatch();
  const relayPro = useRelayPro();
  const [newRelay, setNewRelay] = useState(null);
  const [module, setModule] = useState({ isDetail: false, curRelay: {} });

  const saveRelays = async (tmpRelays) => {
    //sync to users
    let event = await relayPro.syncRelayKind3(tmpRelays);
    System.BroadcastEvent(event, (tags, client, msg) => {
      if (tags === "OK" && msg.ret === true) {
        console.log('remove relay', event, msg);
      }
    });
  };

  const addRelays = async (addr) => {
    let tmps = relays.concat();
    let flagIndex = tmps.findIndex((item) => {
      return item.addr === addr;
    });
    if (flagIndex < 0) {
      tmps.push({ addr: addr, read: true, write: false });
    }
    dispatch(setRelays(tmps));
    if (loggedOut === false) {
      saveRelays(tmps);
    }
    return null;
  };

  const renderCacheRelays = () => {
    return (
      <List className="list_bg">
        {
          relays.map((cfg, index) => {
            return (
              <ListItem key={'relay-' + index}>
                <Box
                  className={'relay_item'}
                  onClick={(event) => {
                    console.log('new event', event);
                    module.isDetail = true;
                    module.curRelay = cfg;
                    setModule({ ...module });
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontFamily: "Saira",
                      fontWeight: "500",
                      color: "#FFFFFF",
                    }}
                  >
                    {cfg.addr}
                  </Typography>
                  <Box
                    sx={{
                      ml: "10px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "8px",
                      backgroundColor: cfg.read ? "#4B8B1F" : "#D9D9D9",
                    }}
                  />
                  <Box
                    sx={{
                      ml: "10px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "8px",
                      backgroundColor: cfg.write ? "#F5A900" : "#D9D9D9",
                    }}
                  />
                  <Button
                    className="button"
                    variant="contained"
                    sx={{
                      position: "absolute",
                      right: "-30px",
                      width: "40px",
                      backgroundColor: "transparent",
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <img src={logo_delete} width="40px" alt="logo_delete" />
                  </Button>
                </Box>
              </ListItem>
            )
          })
        }
      </List>
    );
    // relays.map((cfg, index) => {
    //   // console.log("relay", item);
    //   return (

    //   );
    // });
  };

  //
  const renderNewRelay = () => {
    if (newRelay === null) {
      return null;
    }
    return (
      <Box key={"add-new-relay-"}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <TextField
          sx={{ width: "60%" }}
          value={newRelay}
          margin="dense"
          size="small"
          // focus={true}
          onChange={(event) => {
            setNewRelay(event.target.value);
          }}
        />
        <Box
          sx={{
            position: "absolute",
            right: "-20px",
          }}
        >
          <Button
            variant="contained"
            sx={{
              width: "30px",
              backgroundColor: "transparent",
            }}
            onClick={() => {
              addRelays(newRelay);
            }}
          >
            <img src={icon_save} width="30px" alt="icon_save" />
          </Button>

          <Button
            variant="contained"
            sx={{
              width: "40px",
              backgroundColor: "transparent",
            }}
            onClick={() => {
              setNewRelay(null);
            }}
          >
            <img src={logo_delete} width="40px" alt="logo_delete" />
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Box className={'relay_show_bg'}>
      {renderNewRelay()}
      {renderCacheRelays()}
    </Box>
  );
};

export default GRelaysShow;
