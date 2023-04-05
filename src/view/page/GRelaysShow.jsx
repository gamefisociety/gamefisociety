import React, { useState } from "react";
import "./GRelaysShow.scss";

import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import { setRelays } from "module/store/features/profileSlice";
import { useRelayPro } from "nostr/protocal/RelayPro";
import { System } from "nostr/NostrSystem";

const GRelaysShow = () => {
  const { relays } = useSelector((s) => s.profile);
  const { relayDrawer } = useSelector((s) => s.dialog);
  const dispatch = useDispatch();
  const relayPro = useRelayPro();

  const saveRelays = async (tmpRelays) => {
    //sync to users
    let event = await relayPro.syncRelayKind3(tmpRelays);
    System.BroadcastEvent(event, (tags, client, msg) => {
      if (tags === "OK" && msg.ret === true) {
        console.log('saveRelays', event, msg);
      }
    });
  };

  const addRelays = async (addr) => {
    let tmps = relays.concat();
    tmps.push(addr);
    dispatch(setRelays(tmps));
    saveRelays(tmps);
  };

  const hasRelay = (addr) => {
    let ret = relays.findIndex((relay) => {
      return relay.addr === addr;
    });
    console.log('hasRelay', addr, ret);
    return ret !== -1;
  }

  const renderRelays = () => {
    if (relayDrawer === null) {
      return null;
    }
    let show_relays = [];
    for (let key in relayDrawer) {
      show_relays.push({ addr: key, read: relayDrawer[key].read, write: relayDrawer[key].write })
    }
    return (
      <List className="list_bg">
        {
          show_relays.map((cfg, index) => {
            return (
              <ListItem key={'relay-' + index}>
                <Box className={'relay_item'}>
                  <Typography className={'lable_relay'}>
                    {cfg.addr}
                  </Typography>
                  <Box className={'circle_button'}
                    sx={{
                      backgroundColor: cfg.read ? "#4B8B1F" : "#D9D9D9",
                    }}
                  />
                  <Box className={'circle_button'}
                    sx={{
                      backgroundColor: cfg.write ? "#F5A900" : "#D9D9D9",
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }} />
                  {hasRelay(cfg.addr) === false && <Button className={'add_button'} variant="contained"
                    onClick={(event) => {
                      event.stopPropagation();
                      addRelays(cfg);
                    }}
                  >
                    {'ADD'}
                  </Button>}
                </Box>
              </ListItem>
            )
          })
        }
      </List>
    );
  };

  let relay_num = 0;
  for (let [] in relayDrawer) {
    relay_num = relay_num + 1;
  }

  return (
    <Box className={'relay_show_bg'}>
      <Typography className={'tips_relay'}>
        {'Relays ' + relay_num}
      </Typography>
      {renderRelays()}
    </Box>
  );
};

export default GRelaysShow;
