import React, { useEffect, useState, useRef } from "react";
import "./GRelays.scss";

import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";

import { alpha, styled } from "@mui/material/styles";
import { setRelays, setFollows } from "module/store/features/profileSlice";
import { useRelayPro } from "nostr/protocal/RelayPro";
import logo_delete from "asset/image/social/icon_delete.png";
import icon_detail from "asset/image/social/icon_detail.png";
import icon_save from "asset/image/social/icon_save.png";
import icon_back_white from "../../asset/image/social/icon_back_white.png";

import { useFollowPro } from "nostr/protocal/FollowPro";
import { System } from "nostr/NostrSystem";

let deletingRealy = "";

const RSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#4B8B1F",
    "&:hover": {
      backgroundColor: alpha("#4B8B1F", theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#565656",
  },
}));
const WSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#F5A900",
    "&:hover": {
      backgroundColor: alpha("#F5A900", theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#565656",
  },
}));

const GRelays = () => {
  const { relays, curRelay } = useSelector((s) => s.profile);
  const { loggedOut } = useSelector((s) => s.login);
  const dispatch = useDispatch();
  const relayPro = useRelayPro();
  const [newRelay, setNewRelay] = useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [module, setModule] = useState({ isDetail: false, curRelay: {} });

  const handleClickDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

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

  const deleteRelays = async (addr) => {
    let tmps = relays.concat();
    let flagIndex = tmps.findIndex((item) => {
      return item.addr === addr;
    });
    tmps.splice(flagIndex, 1);
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
                      //
                      deletingRealy = cfg.addr;
                      handleClickDialogOpen();
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

  const renderRelays = () => {
    return (
      <Box className={'inner_relays'}>
        <Typography
          sx={{
            marginTop: "24px",
            width: "100%",
            fontSize: "18px",
            fontFamily: "Saira",
            fontWeight: "500",
            align: "left",
          }}
          align={"left"}
        >
          {"Your Relays " + relays.length}
        </Typography>
        <Stack sx={{ py: '12px' }} direction={'row'} alignItems={'center'} justifyContent={'center'}>
          <Button
            variant="contained"
            sx={{
              width: "80%",
              height: "36px",
              backgroundColor: "#454FBF",
              borderRadius: "6px",
              fontSize: "28px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "white",
            }}
            disabled={newRelay !== null}
            onClick={() => {
              if (newRelay === null) {
                setNewRelay('');
              }
            }}
          >
            {"+"}
          </Button>
          {/* <Button
            variant="contained"
            sx={{
              width: "15%",
              height: "36px",
              ml: '16px',
              backgroundColor: "#454FBF",
              borderRadius: "6px",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "white",
            }}
            onClick={() => {
              saveRelays();
            }}
          >
            {'sync'}
          </Button> */}
        </Stack>
        {renderNewRelay()}
        {renderCacheRelays()}
      </Box>
    );
  };

  const renderCurRelay = () => {
    return (
      <Box className={'relay_detail_bg'}>
        <Box className={'relay_detail_header'}>
          <Box
            className={"goback"}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
            onClick={() => {
              module.isDetail = false;
              setModule({ ...module });
            }}
          >
            <img src={icon_back_white} width="38px" alt="icon_back_white" />
            <Typography
              sx={{
                marginLeft: "5px",
                fontSize: "18px",
                fontFamily: "Saira",
                fontWeight: "500",
                color: "#FFFFFF",
              }}
            >
              {"Relays"}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: "18px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
          >
            {"Current Relay"}
          </Typography>
        </Box>
        <Typography
          sx={{
            marginTop: "34px",
            width: "100%",
            fontSize: "14px",
            fontFamily: "Saira",
            fontWeight: "500",
            textAlign: "left",
            color: "#919191",
          }}
        >
          {"Administrator"}
        </Typography>
        <Box
          sx={{
            marginTop: "12px",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Avatar
              sx={{ width: "48px", height: "48px" }}
              edge="end"
              alt="GameFi Society"
            // src={}
            />
            <Typography
              sx={{
                marginLeft: "16px",
                fontSize: "14px",
                fontFamily: "Saira",
                fontWeight: "500",
                color: "#FFFFFF",
              }}
            >
              {"Administrator Name"}
            </Typography>
          </Box>
          <Button
            className="button"
            variant="contained"
            sx={{
              width: "36px",
              backgroundColor: "transparent",
            }}
            onClick={() => { }}
          >
            <img src={icon_detail} width="36px" alt="icon_detail" />
          </Button>
        </Box>
        <Box
          sx={{
            marginTop: "34px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              width: "100%",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#919191",
              textAlign: "left",
            }}
          >
            {"Repeater"}
          </Typography>
          <TextField
            sx={{
              marginTop: "12px",
              width: "100%",
              borderRadius: "5px",
              borderColor: "#323232",
              backgroundColor: "#202122",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            value={"Repeater Content"}
            variant="outlined"
            onChange={(event) => {
            }}
          />
        </Box>
        <Box
          sx={{
            marginTop: "34px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              width: "100%",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#919191",
              textAlign: "left",
            }}
          >
            {"Describe"}
          </Typography>
          <TextField
            sx={{
              marginTop: "12px",
              width: "100%",
              borderRadius: "5px",
              borderColor: "#323232",
              backgroundColor: "#202122",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            value={"Describe Content"}
            variant="outlined"
            onChange={(event) => {
            }}
          />
        </Box>
        <Box
          sx={{
            marginTop: "34px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              width: "100%",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#919191",
              textAlign: "left",
            }}
          >
            {"Contact Person"}
          </Typography>
          <TextField
            sx={{
              marginTop: "12px",
              width: "100%",
              borderRadius: "5px",
              borderColor: "#323232",
              backgroundColor: "#202122",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            value={"Contact Person Content"}
            variant="outlined"
            onChange={(event) => {
            }}
          />
        </Box>
        <Box
          sx={{
            marginTop: "34px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              width: "100%",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#919191",
              textAlign: "left",
            }}
          >
            {"Software"}
          </Typography>
          <TextField
            sx={{
              marginTop: "12px",
              width: "100%",
              borderRadius: "5px",
              borderColor: "#323232",
              backgroundColor: "#202122",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            value={"Software Content"}
            variant="outlined"
            onChange={(event) => {
            }}
          />
        </Box>
        <Box
          sx={{
            marginTop: "34px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              width: "100%",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#919191",
              textAlign: "left",
            }}
          >
            {"Version"}
          </Typography>
          <TextField
            sx={{
              marginTop: "12px",
              width: "100%",
              borderRadius: "5px",
              borderColor: "#323232",
              backgroundColor: "#202122",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            value={"Version Content"}
            variant="outlined"
            onChange={(event) => {
            }}
          />
        </Box>
        <Box
          sx={{
            marginTop: "34px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              width: "100%",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#919191",
              textAlign: "left",
            }}
          >
            {"Supported NIPs"}
          </Typography>
          <TextField
            sx={{
              marginTop: "12px",
              width: "100%",
              borderRadius: "5px",
              borderColor: "#323232",
              backgroundColor: "#202122",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            value={"Supported NIPs Content"}
            variant="outlined"
            onChange={(event) => {
            }}
          />
        </Box>
      </Box>
    );
  };

  const renderDlg = () => {
    return (
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <Box
          sx={{
            width: "400px",
            height: "463px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "#0F0F0F",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          <Typography
            color={"#919191"}
            sx={{
              marginTop: "75px",
              fontSize: "24px",
              fontFamily: "Saira",
              fontWeight: "500",
              lineHeight: "29px",
              textAlign: "center",
            }}
          >
            {"Are you sure to delete this repeater"}
          </Typography>
          <Typography
            color={"#919191"}
            sx={{
              marginTop: "25px",
              fontSize: "24px",
              fontFamily: "Saira",
              fontWeight: "500",
              lineHeight: "29px",
              textAlign: "center",
            }}
          >
            {"This operation cannot be undone"}
          </Typography>
          <Button
            variant="contained"
            sx={{
              marginTop: "69px",
              width: "100%",
              height: "48px",
              fontSize: "16px",
              fontFamily: "Saira",
              fontWeight: "500",
              backgroundColor: "#FF0000",
              borderRadius: "5px",
              color: "#FFFFFF",
            }}
            onClick={(event) => {
              event.stopPropagation();
              deleteRelays(deletingRealy);
              handleDialogClose();
            }}
          >
            {"Confirm"}
          </Button>
          <Button
            variant="text"
            sx={{
              marginTop: "35px",
              width: "100%",
              height: "48px",
              fontSize: "16px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            onClick={(event) => {
              event.stopPropagation();
              handleDialogClose();
            }}
          >
            {"Cancel"}
          </Button>
        </Box>
      </Dialog>
    );
  }
  return (
    <Box className={'relay_bg'}>
      {module.isDetail ? renderCurRelay() : renderRelays()}
      {renderDlg()}
    </Box>
  );
};

export default GRelays;
