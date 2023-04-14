import React, { useEffect, useState } from "react";
import "./GLForms.scss";

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
import { useLongFormPro } from "nostr/protocal/LongFormPro";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { BuildSub } from "nostr/NostrUtils";
import GlobalNoteCache from "db/GlobalNoteCache";

const createNostrWorker = createWorkerFactory(() =>
  import("worker/nostrRequest")
);

const GLForms = () => {
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
  const [newSujbect, setNewSubject] = React.useState("");
  const [dislogOpen, setDialogOpen] = React.useState(false);
  const [createSubjectState, setCreateSubjectState] = React.useState(0);
  const longFormPro = useLongFormPro();
  const gNoteCache = GlobalNoteCache();
  const waittingSubjects = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12];
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
    const filterTextNote = longFormPro.getGlobal();
    if (tim === 0) {
      filterTextNote.until = Date.now();
    } else {
      filterTextNote.until = tim;
    }
    filterTextNote.limit = 30;
    //add t tag
    if (label && label != "all") {
      filterTextNote["#t"] = [label];
    }
    let subLongForm = BuildSub("g-longform-" + Date.now(), [
      filterTextNote,
    ]);
    let targetAddr = curRelay ? curRelay.addr : null;
    targetAddr = null;
    setLoadOpen(true);
    nostrWorker.fetch_global_longform(subLongForm, targetAddr, (data, client) => {
      // console.log();
      setData(data.concat());
      setLoadOpen(false);
    });
  };

  const handleClickOpen = () => {
    if (account) {
      setCreateSubjectState(0);
      setNewSubject("");
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

  const renderSujbects = () => {
    return fetchingSubjects ? renderWaittingLables() : renderLables();
  };

  const renderWaittingLables = () => {
    return (
      <Box className={"global_lables"}>
        {waittingSubjects.map((index) => {
          return (
            <Stack
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
                marginTop: "20px",
              }}
              key={"label_waitting_" + index}
              spacing={1}
            >
              <Skeleton variant="rectangular" width={"80%"} height={8} />
              <Skeleton variant="rectangular" width={"90%"} height={12} />
            </Stack>
          );
        })}
      </Box>
    );
  };

  const renderLables = () => {
    console.log("renderLables", subjects);
    return (
      <Box className={"global_lables"}>
        <Button
          variant="contained"
          sx={{
            width: "80%",
            marginBottom: "10px",
          }}
          onClick={handleClickOpen}
        >
          {"Create"}
        </Button>
        <Button
          className={label == "all" ? "lable_btn_selected" : "lable_btn"}
          onClick={() => {
            navigate("/global/all");
          }}
        >
          {"#ALL"}
        </Button>
        {subjects.map((item, index) => {
          let isSelect = item.name == label;
          const title = "#" + item.name;
          return (
            <Tooltip
              title={title}
              placement="right"
              key={"label-index-" + index}
            >
              <Button
                className={isSelect ? "lable_btn_selected" : "lable_btn"}
                onClick={() => {
                  navigate("/global/" + item.name);
                }}
              >
                {title}
              </Button>
            </Tooltip>
          );
        })}
      </Box>
    );
  };

  const renderLoadSubjects = () => {
    return (
      <Box className={"global_lables"}>
        <Button
          variant="contained"
          sx={{
            width: "80%",
            marginBottom: "10px",
          }}
          onClick={() => {
            dispatch(setIsOpen(true));
          }}
        >
          {"Load Subjects"}
        </Button>
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
      <Box className={'global_content'}>
        {renderGlobalHead()}
        <List
          sx={{ width: "100%", overflow: "auto", backgroundColor: "transparent" }}
        >
          {data.map((item, index) => {
            return <GCardNote key={"global-note-" + index} note={{ ...item }} />;
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

  const renderSubjectDialog = () => {
    return (
      <Dialog open={dislogOpen} onClose={handleClose}>
        <Box
          sx={{
            width: "400px",
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
          <Box
            sx={{
              marginTop: "30px",
              width: "80%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                height: "28px",
                fontSize: "24px",
                fontFamily: "Saira",
                fontWeight: "500",
                lineHeight: "28px",
                textAlign: "center",
                color: "#FFFFFF",
              }}
            >
              {"#"}
            </Typography>
            <TextField
              disabled={createSubjectState === 1}
              sx={{
                width: "100%",
                borderRadius: "5px",
                borderColor: "#323232",
                backgroundColor: "#202122",
                fontSize: "14px",
                fontFamily: "Saira",
                fontWeight: "500",
                color: "#FFFFFF",
              }}
              inputProps={{ maxLength: 20 }}
              value={newSujbect}
              variant="outlined"
              onChange={(event) => {
                let name = event.target.value.trim();
                const scReg = /[!@#$%^&*()_+\{\}:“<>?,.\/;'\[\]\\|`~]+/g;
                const newName = name.replace(scReg, "");
                setNewSubject(newName);
              }}
            />
          </Box>
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
            onClick={() => {
              if (createSubjectState === 1) {
                return;
              }
              if (createSubjectState === 0) {
                createSubject();
              } else {
                handleClose();
              }
            }}
          >
            {createSubjectMsg()}
          </LoadingButton>
        </Box>
      </Dialog>
    );
  };

  return (
    <Paper className={"g_longforms_bg"} elevation={0}>
      {/* {account ? renderSujbects() : renderLoadSubjects()} */}
      {renderContent()}
      {renderSubjectDialog()}
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

export default GLForms;
