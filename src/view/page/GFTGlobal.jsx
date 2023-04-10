import React, { useEffect, useState } from "react";
import "./GFTGlobal.scss";

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
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { setIsOpen } from "module/store/features/dialogSlice";
import { useTextNotePro } from "nostr/protocal/TextNotePro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { BuildSub } from "nostr/NostrUtils";
import GlobalNoteCache from "db/GlobalNoteCache";

const createNostrWorker = createWorkerFactory(() =>
  import("worker/nostrRequest")
);

const GFTGlobal = () => {
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
  const [newSujbect, setNewSubject] = React.useState("");
  const [dislogOpen, setDialogOpen] = React.useState(false);
  const [createSubjectState, setCreateSubjectState] = React.useState(0);
  const textNotePro = useTextNotePro();
  // const [inforData, setInforData] = useState(new Map());
  const metadataPro = useMetadataPro();

  const gNoteCache = GlobalNoteCache();
  let fetching = false;
  // useEffect(() => {
  //   window.addEventListener("scroll", loadMore);
  //   return () => {
  //     window.removeEventListener("scroll", loadMore);
  //   };
  // }, [data, isMore]);

  console.log('global label', label);

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
  }, [account]);

  //get subjects
  const getAllSubjects = () => {
    if (account) {
      if (fetching) {
        return;
      }
      fetching = true;
      GSTSubjectsBase.totalSupply(library)
        .then((res) => {
          console.log("totalSupply", res);
          if (res > 0) {
            fetchSubjects(0, Number(res));
          } else {
            fetching = false;
          }
        })
        .catch((err) => {
          fetching = false;
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
          fetching = false;
          if (res && res.length > 0) {
            subjectCache = subjectCache.concat(res);
            subjectCache.reverse();
            setSubjects(subjectCache);
            console.log(res);
          }
        })
        .catch((err) => {
          fetching = false;
          console.log(err, "err");
        });
    } else {
      fetching = false;
    }
  };

  const createSubject = () => {
    if (newSujbect.length === 0) {
      return;
    }
    if (account) {
      if (createSubjectState !== 0) {
        return;
      }
      setCreateSubjectState(1);
      GSTSubjectsBase.createSubject(library, account, newSujbect)
        .then((res) => {
          console.log("createSubject", res);
          setCreateSubjectState(2);
          if (res) {
          }
        })
        .catch((err) => {
          console.log(err, "err");
          setCreateSubjectState(3);
        });
    }
  };

  const createSubjectMsg = () => {
    if (createSubjectState === 0) {
      return "Create";
    } else if (createSubjectState === 1) {
      return "Creating";
    } else if (createSubjectState === 2) {
      return "Success";
    } else if (createSubjectState === 3) {
      return "Error";
    }
    return "";
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
    if (label != 'all') {
      filterTextNote['#t'] = [label];
    }
    let subTextNode = BuildSub("global-textnode-" + Date.now(), [filterTextNote])
    let targetAddr = curRelay ? curRelay.addr : null;
    targetAddr = null;
    console.log("fetch_global_notes post", tim,);
    setLoadOpen(true);
    nostrWorker.fetch_global_notes(subTextNode, targetAddr, (data, client) => {
      console.log("fetch_global_notes back", tim, data);
      setData(data.concat());
      setLoadOpen(false);
      // const pubkeys = [];
      // data.map((item) => {
      //   pubkeys.push(item.pubkey);
      // });
    });
  };

  // const getInfor = (pkeys, addr) => {
  //   const filterMetaData = metadataPro.get(Array.from(pkeys));
  //   let subTextNode = BuildSub("metadata", [filterMetaData]);
  //   nostrWorker.fetch_user_metadata(subTextNode, addr, (data, client) => {
  //     setInforData(data);
  //   });
  // };

  const handleClickOpen = () => {
    if (account) {
      setDialogOpen(true);
    } else {
      dispatch(setIsOpen(true));
    }
  };

  const handleClose = () => {
    if (createSubjectState === 1) {
      return;
    }
    setDialogOpen(false);
  };

  const renderLables = () => {
    console.log('renderLables', subjects);
    return (
      <Box className={"global_lables"}>
        <Button variant="contained" sx={{
          width: "80%"
        }} onClick={handleClickOpen}>
          {"Create"}
        </Button>
        <Button className={label == 'all' ? "lable_btn_selected" : "lable_btn"}
          onClick={() => {
            navigate('/global/all');
          }}>
          {"#ALL"}
        </Button>
        {subjects.map((item, index) => {
          let isSelect = (item.name == label);
          return (
            <Button
              key={"label-index-" + index}
              className={isSelect ? "lable_btn_selected" : "lable_btn"}
              onClick={() => {
                navigate('/global/' + item.name);
              }}
            >
              {"#" + item.name}
            </Button>
          );
        })}
      </Box>
    );
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
      <List
        sx={{ width: "100%", overflow: "auto", backgroundColor: "transparent" }}
      >
        {data.map((item, index) => {
          return <GCardNote key={"global-note-" + index} note={{ ...item }} />;
        })}
      </List>
    );
  };

  const renderSubjectDialog = () => {
    return (
      <Dialog open={dislogOpen} onClose={handleClose}>
        <Box
          sx={{
            width: "400px",
            // height: "463px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "#0F0F0F",
            padding: "24px",
          }}
        >
          <Typography
            sx={{
              fontSize: "24px",
              fontFamily: "Saira",
              fontWeight: "500",
              lineHeight: "29px",
              textAlign: "center",
              color: "#FFFFFF",
            }}
          >
            {"Create A Subject"}
          </Typography>
          <TextField
            disabled={createSubjectState === 1}
            sx={{
              marginTop: "40px",
              width: "80%",
              borderRadius: "5px",
              borderColor: "#323232",
              backgroundColor: "#202122",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            length={30}
            value={newSujbect}
            variant="outlined"
            onChange={(event) => {
              let name = event.target.value.trim();
              setNewSubject(name);
            }}
          />
          <LoadingButton
            variant="contained"
            loading={createSubjectState === 1}
            sx={{
              marginTop: "25px",
              width: "80%",
              height: "48px",
              backgroundColor: "#006CF9",
              borderRadius: "5px",
              fontSize: "16px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            onClick={createSubject}
          >
            {createSubjectMsg()}
          </LoadingButton>
        </Box>
      </Dialog>
    );
  };
  return (
    <Paper className={"global_bg"} elevation={0}>
      {renderLables()}
      {renderGlobalHead()}
      {renderContent()}
      <Typography className={'global_loadmore'} onClick={() => {
        loadMore();
      }}>
        {"LOAD MORE"}
      </Typography>
      {renderSubjectDialog()}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
