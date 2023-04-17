import React, { useEffect, useState } from "react";
import "./GFTGlobal.scss";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";
import { setCurRelay } from "module/store/features/profileSlice";
import GNoteTags from "components/GNoteTags";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import GCardNote from "components/GCardNote";
import List from "@mui/material/List";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { BuildSub } from "nostr/NostrUtils";
import GlobalNoteCache from "db/GlobalNoteCache";

const createNostrWorker = createWorkerFactory(() =>
  import("worker/nostrRequest")
);

const GFTGlobal = () => {
  const nostrWorker = useWorker(createNostrWorker);
  //
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { relays, curRelay } = useSelector((s) => s.profile);
  const { label } = useParams();
  const [loadOpen, setLoadOpen] = React.useState(false);
  const [data, setData] = useState([]);
  const textNotePro = useTextNotePro();
  const gNoteCache = GlobalNoteCache();
  useEffect(() => {
    gNoteCache.clear();
    getNoteList(0);
    return () => {};
  }, [label]);

  const loadMore = () => {
    getNoteList(gNoteCache.minTime());
  };

  const getNoteList = (tim) => {
    //build sub
    const filterTextNote = textNotePro.get();
    if (tim === 0) {
      filterTextNote.until = Date.now();
    } else {
      filterTextNote.until = tim;
    }
    filterTextNote.limit = 15;
    //add t tag
    if (label != "all") {
      filterTextNote["#t"] = [label];
    }
    let subTextNode = BuildSub("global-textnode-" + Date.now(), [
      filterTextNote,
    ]);
    let targetAddr = curRelay ? curRelay.addr : null;
    targetAddr = null;
    setLoadOpen(true);
    nostrWorker.fetch_global_notes(subTextNode, targetAddr, (data, client) => {
      setData(data.concat());
      setLoadOpen(false);
    });
  };

  const renderGlobalHead = () => {
    // console.log('renderGlobalHead', curRelay);
    return (
      <Box className={"global_head"}>
        <Typography className={"tip0"}>{"Global reads from"}</Typography>
        <FormControl>
          <Select
            className={"select0"}
            value={curRelay?.addr}
            onChange={({ target }) => {
              if (target && target.value) {
                let ret_relay = relays.find((item) => {
                  return item.addr === target.value;
                });
                if (ret_relay) {
                  dispatch(setCurRelay(ret_relay));
                }
              }
            }}
          >
            {relays.map((item, index) => (
              <MenuItem key={"relay-index-" + index} value={item.addr}>
                {item.addr}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  };

  const renderContent = () => {
    return (
      <Box className={"global_content"}>
        {renderGlobalHead()}
        <List
          sx={{
            width: "100%",
            overflow: "auto",
            backgroundColor: "transparent",
          }}
        >
          {data.map((item, index) => {
            return (
              <GCardNote key={"global-note-" + index} note={{ ...item }} />
            );
          })}
        </List>
        <Typography
          className={"global_loadmore"}
          onClick={() => {
            loadMore();
          }}
        >
          {"LOAD MORE"}
        </Typography>
      </Box>
    );
  };

  return (
    <Paper className={"global_bg"} elevation={0}>
      {<GNoteTags label={label} clickCallback={(tag)=>{
        if(label !== tag){
          navigate("/global/" + tag);
        }
      }}/>}
      {renderContent()}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadOpen}
        onClick={() => {
          setLoadOpen(false);
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
};

export default GFTGlobal;
