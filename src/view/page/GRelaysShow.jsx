import React, { useEffect, useState } from "react";
import "./GRelaysShow.scss";
import { useSelector, useDispatch } from "react-redux";
import { setDrawer } from "module/store/features/dialogSlice";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { setRelays } from "module/store/features/profileSlice";
import { useRelayPro } from "nostr/protocal/RelayPro";
import { System } from "nostr/NostrSystem";

const GRelayItem = (props) => {
  const relayInfo = props.relay;
  const has = props.has;
  const renderItem = () => {
    if (!relayInfo) return null;
    return (
      <Box className={"relay_item"}>
        <Typography
          className={"lable_relay"}
          onClick={(event) => {
            event.stopPropagation();
            props.openDetail();
          }}
        >
          {relayInfo.addr}
        </Typography>
        <Box
          sx={{
            ml: "10px",
            width: "10px",
            height: "10px",
            borderRadius: "5px",
            backgroundColor: relayInfo.read === true ? "#4B8B1F" : "#D9D9D9",
          }}
        />
        <Box
          sx={{
            ml: "5px",
            width: "10px",
            height: "10px",
            borderRadius: "5px",
            backgroundColor:
              relayInfo.write === true ? "#F5A900" : "#D9D9D9",
          }}
        />
        {has === false && (
          <Button
            className={"button_add"}
            variant="contained"
            onClick={(event) => {
              event.stopPropagation();
              props.addRelay(relayInfo);
            }}
          >
            {"ADD"}
          </Button>
        )}
      </Box>
    );
  };
  return renderItem();
};

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
        console.log("saveRelays", event, msg);
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
    console.log("hasRelay", addr, ret);
    return ret !== -1;
  };

  const renderHeader = () => {
    return (
      <Box className={"header"}>
        <Box
          className="goback"
          onClick={() => {
            dispatch(
              setDrawer({
                isDrawer: false,
                placeDrawer: "right",
                cardDrawer: "relay-show",
              })
            );
          }}
        >
          <Box className="icon_back" />
          <Typography className="text_back">{"Back"}</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }}></Box>
      </Box>
    );
  };

  const renderRelays = () => {
    if (relayDrawer === null) {
      return null;
    }
    let show_relays = [];
    for (let key in relayDrawer) {
      show_relays.push({
        addr: key,
        read: relayDrawer[key].read,
        write: relayDrawer[key].write,
      });
    }
    let relay_num = 0;
    for (let [] in relayDrawer) {
      relay_num = relay_num + 1;
    }
    return (
      <Box className={"inner_relays"}>
        <Typography className={"tips_relay"}>
          {"Relays " + relay_num}
        </Typography>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={50}
              itemCount={show_relays.length}
              itemData={show_relays}
            >
              {({ data, index, style }) => (
                <Box style={style}>
                  <GRelayItem
                    style={style}
                    relay={data[index]}
                    has={hasRelay(data[index].addr)}
                    addRelay={(cfg) => {
                      addRelays(cfg);
                    }}
                  />
                </Box>
              )}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
    );
  };

  return (
    <Box className={"relay_show_bg"}>
      {renderHeader()}
      {renderRelays()}
    </Box>
  );
};

export default GRelaysShow;
