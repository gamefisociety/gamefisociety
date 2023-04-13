import React, { useEffect, useState } from "react";
import "./GGlobal.scss";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";
import { setCurRelay } from "module/store/features/profileSlice";
import { useWeb3React } from "@web3-react/core";
import GSTSubjectsBase from "web3/GSTSubjects";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import GCardNote from "components/GCardNote";
import List from "@mui/material/List";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Backdrop from "@mui/material/Backdrop";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { setIsOpen } from "module/store/features/dialogSlice";
import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { BuildSub } from "nostr/NostrUtils";
import GlobalNoteCache from "db/GlobalNoteCache";

const createNostrWorker = createWorkerFactory(() =>
  import("worker/nostrRequest")
);

const GGlobal = () => {
  //
  const { activate, account, chainId, active, library, deactivate } =
    useWeb3React();
  const nostrWorker = useWorker(createNostrWorker);
  //
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { relays, curRelay } = useSelector((s) => s.profile);
  const { label } = useParams();
  const [loadOpen, setLoadOpen] = React.useState(false);
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [fetchingSubjects, setFetchingSubjects] = useState(false);
  const [createSubjectState, setCreateSubjectState] = React.useState(0);
  const textNotePro = useTextNotePro();
  const gNoteCache = GlobalNoteCache();
  
  // console.log('global label', label);
  useEffect(() => {
    gNoteCache.clear();
    getNoteList(0);
    return () => { };
  }, [label]);

  useEffect(() => {
    if (account) {
      getAllSubjects();
    }
    return () => { };
  }, [account, createSubjectState]);

  //get subjects
  const getAllSubjects = () => {
    if (account) {
      if (fetchingSubjects) {
        return;
      }
      setFetchingSubjects(true);
      GSTSubjectsBase.totalSupply(library)
        .then((res) => {
          console.log("totalSupply", res);
          if (res > 0) {
            fetchSubjects(0, Number(res));
          } else {
            setFetchingSubjects(false);
          }
        })
        .catch((err) => {
          setFetchingSubjects(false);
          console.log(err, "err");
        });
    } else {
      return 0;
    }
  };

  //
  const fetchSubjects = (index, count) => {
    if (account) {
      let subjectCache = [];
      GSTSubjectsBase.getSubjects(library, index, count)
        .then((res) => {
          setFetchingSubjects(false);
          if (res && res.length > 0) {
            subjectCache = subjectCache.concat(res);
            subjectCache.reverse();
            setSubjects(subjectCache);
            console.log(res);
          }
        })
        .catch((err) => {
          setFetchingSubjects(false);
          console.log(err, "err");
        });
    } else {
      setFetchingSubjects(false);
    }
  };

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
    if (label && label != "all") {
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
      <Box className={'global_content'}>
        <List
          sx={{ width: "100%", overflow: "auto", backgroundColor: "transparent" }}
        >
          {data.map((item, index) => {
            return <GCardNote key={"global-note-" + index} note={{ ...item }} />;
          })}
        </List>
      </Box>
    );
  };

  return (
    <Paper className={"g_global_bg"} elevation={0}>
      {renderGlobalHead()}
      {renderContent()}
      <Typography
        className={"global_loadmore"}
        onClick={() => {
          loadMore();
        }}
      >
        {"LOAD MORE"}
      </Typography>
    </Paper>
  );
};

export default React.memo(GGlobal);
