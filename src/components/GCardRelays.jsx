import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Divider } from "@mui/material/index";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Button, CardActions } from "@mui/material";
import { setRelays, removeRelay } from "module/store/features/profileSlice";
import { useRelayPro } from "nostr/protocal/RelayPro";
import { System } from "nostr/NostrSystem";
import { EventKind } from "nostr/def";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import { DefaultRelays } from "nostr/Const";

import "./GCardRelays.scss";
let deletingRealy = "";
const GCardRelays = () => {
  const { relays } = useSelector((s) => s.profile);
  const { publicKey, loggedOut } = useSelector((s) => s.login);
  const dispatch = useDispatch();
  const relayPro = useRelayPro();
  const [newRelays, setNewRelays] = useState([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const handleClickDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const fetchRelays = () => {
    // console.log('fetchRelays', Object.entries(relays), sub);
    // let sub = relayPro.get(publicKey);
    // System.Broadcast(sub, 0, (msgs) => {
    //     if (msgs) {
    //         msgs.map(msg => {
    //             // console.log('fetchRelays msgs', msg);
    //             if (msg.kind === EventKind.ContactList && msg.pubkey === publicKey && msg.content !== '') {
    //                 let content = JSON.parse(msg.content);
    //                 let tmpRelays = {
    //                     relays: {
    //                         ...content,
    //                         ...Object.fromEntries(DefaultRelays.entries()),
    //                     },
    //                     createdAt: 1,
    //                 };
    //                 dispatch(setRelays(tmpRelays));
    //             }
    //         });
    //     }
    // });
  };

  const saveRelays = async () => {
    let tmp_new_relays = [];
    newRelays.map((newitem) => {
      if (newitem !== "") {
        let tmp = [];
        tmp.push(newitem);
        tmp.push({
          read: true,
          write: true,
        });
        tmp_new_relays.push(tmp);
      }
    });
    let tmpRelays = {
      relays: {
        ...relays,
        ...Object.fromEntries(tmp_new_relays),
      },
      createdAt: new Date().getTime(),
    };
    setNewRelays([]);
    dispatch(setRelays(tmpRelays));
    if (loggedOut === false) {
      //sync to users
    }
    return null;
  };

  const deleteRelays = async (addr) => {
    const relayArray = Object.entries(relays);
    const retArray = relayArray.filter((value) => {
      return value[0] !== addr;
    });
    let tmpRelays = {
      relays: {
        ...Object.fromEntries(retArray),
      },
      createdAt: new Date().getTime(),
    };
    dispatch(setRelays(tmpRelays));
    //need disconnect relays
    if (loggedOut === false) {
      //sync to users
    }
    return null;
  };

  const renderCacheRelays = () => {
    return Object.entries(relays).map((item, index) => {
      console.log("relay", item);
      return (
        <Box
          key={"relaycard-index-" + index}
          sx={{
            width: "100%",
            height: "36px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              fontColor: "#FFFFFF",
            }}
          >
            {item[0]}
          </Typography>
          <Chip
            sx={{ ml: "6px", width: "12px", height: "12px" }}
            color={item[1].read ? "success" : "error"}
          />
          <Chip
            sx={{ ml: "6px", width: "12px", height: "12px" }}
            color={item[1].write ? "success" : "error"}
          />
          <IconButton
            sx={{
              ml: "6px",
              position: "absolute",
              right: "32px",
              width: "24px",
              height: "24px",
            }}
            onClick={() => {
              //   deleteRelays(item[0]);
              deletingRealy = item[0];
              handleClickDialogOpen();
            }}
          >
            <RemoveCircleOutlineIcon
              sx={{
                width: "24px",
                height: "24px",
              }}
            />
          </IconButton>
        </Box>
      );
    });
  };

  //
  const renderNewRelays = () => {
    return newRelays.map((item, index) => {
      return (
        <Box
          key={"add-new-relay-" + index}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <TextField
            sx={{ width: "80%" }}
            value={item}
            margin="dense"
            size="small"
            onChange={(event) => {
              newRelays[index] = event.target.value;
              setNewRelays(newRelays.concat());
            }}
          />
          <IconButton
            sx={{
              ml: "6px",
              position: "absolute",
              right: "32px",
              width: "24px",
              height: "24px",
            }}
            onClick={() => {
              newRelays.splice(index, 1);
              setNewRelays(newRelays.concat());
            }}
          >
            <RemoveCircleOutlineIcon sx={{ width: "24px", height: "24px" }} />
          </IconButton>
        </Box>
      );
    });
  };

  return (
    <Box
      sx={{
        width: "400px",
        minHeight: "100%",
        backgroundColor: "#0F0F0F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingLeft: "32px",
        paddingRight: "32px",
      }}
    >
      <Typography
        sx={{
          marginTop: "88px",
          width: "100%",
          height: "50px",
          fontSize: "18px",
          fontFamily: "Saira",
          fontWeight: "500",
          align: "left",
          borderBottom: 1,
          borderColor: "#202122",
        }}
        align={"left"}
      >
        {"Your Relays " + Object.entries(relays).length}
      </Typography>
      <Button
        variant="contained"
        sx={{
          marginTop: "23px",
          width: "100%",
          height: "36px",
          backgroundColor: "#454FBF",
          borderRadius: "6px",
          fontSize: "28px",
          fontFamily: "Saira",
          fontWeight: "500",
          color: "white",
        }}
        onClick={() => {
          newRelays.push("");
          setNewRelays(newRelays.concat());
        }}
      >
        {"+"}
      </Button>
      <CardActions
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        {newRelays.length > 0 && (
          <Button
            variant="text"
            sx={{
              width: "80px",
              fontSize: "20px",
              fontFamily: "Saira",
              fontWeight: "500",
              fontColor: "#454FBF",
            }}
            onClick={saveRelays}
          >
            {"Save"}
          </Button>
        )}
        {loggedOut === false && (
          <Button
            variant="text"
            sx={{
              width: "80px",
              fontSize: "20px",
              fontFamily: "Saira",
              fontWeight: "500",
              fontColor: "#454FBF",
            }}
            onClick={fetchRelays}
          >
            {"Sync"}
          </Button>
        )}
      </CardActions>
      <Stack
        sx={{
          width: "100%",
          marginTop: "20px",
        }}
      >
        {renderNewRelays()}
      </Stack>
      <Stack
        sx={{
          width: "100%",
          marginTop: "20px",
        }}
        spacing={3}
      >
        {renderCacheRelays()}
      </Stack>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this relay?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={() => {
            deleteRelays(deletingRealy);
            handleDialogClose();
          }} autoFocus>
            Sure
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default React.memo(GCardRelays);
