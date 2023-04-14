import React, { useEffect, useState, useRef } from "react";
import "./GRelays.scss";

import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { alpha, styled } from "@mui/material/styles";
import { setRelays } from "module/store/features/profileSlice";
import { useRelayPro } from "nostr/protocal/RelayPro";
import logo_delete from "asset/image/social/icon_delete.png";
import icon_detail from "asset/image/social/icon_detail.png";
import icon_save from "asset/image/social/icon_save.png";
import icon_back_white from "../../asset/image/social/icon_back_white.png";

import { System } from "nostr/NostrSystem";
import { event } from "jquery";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 36,
  height: 18,
  padding: 0,
  marginRight: 10,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#32dce8" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 16,
    height: 16,
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const ReadSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#4B8B1F",
    "&:hover": {
      backgroundColor: alpha("#4B8B1F", theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#4B8B1F",
  },
}));

const WriteSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#F5A900",
    "&:hover": {
      backgroundColor: alpha("#F5A900", theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#F5A900",
  },
}));

const GRelayItem = (props) => {
  const relay = props.relay;
  const [openMore, setOpenMore] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [relayInfo, setRelayInfo] = useState(null);
  useEffect(() => {
    if (relay) {
      let t_relay = { ...relay };
      t_relay.canRead = System.isRead(relay.addr);
      t_relay.canWrite = System.isWrite(relay.addr);
      setRelayInfo(t_relay);
    }
  }, [relay]);

  const handleCloseMore = (event, cfg) => {
    event.stopPropagation();
    setAnchorEl(null);
    setOpenMore(false);
  };

  const handleOpenMore = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setOpenMore(true);
  };

  const renderMoreMenu = () => {
    return (
      <Popper
        sx={{
          zIndex: 10,
        }}
        open={openMore}
        anchorEl={anchorEl}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "right bottom" : "right top",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleCloseMore}>
                <MenuList autoFocusItem={openMore}>
                  <MenuItem
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      // "&:hover": {
                      //   backgroundColor: "transparent",
                      // },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontFamily: "Saira",
                        fontWeight: "500",
                        color: relayInfo.canRead ? "#4B8B1F" : "#D9D9D9",
                      }}
                    >
                      {"R"}
                    </Typography>
                    <ReadSwitch
                      checked={relayInfo.canRead}
                      size="small"
                      inputProps={{ "aria-label": "controlled" }}
                      onChange={(ev) => {
                        if (ev.target.checked) {
                          System.addRead(relayInfo.addr);
                          relayInfo.canRead = true;
                          setRelayInfo({ ...relayInfo });
                        } else {
                          System.rmRead(relayInfo.addr);
                          relayInfo.canRead = false;
                          setRelayInfo({ ...relayInfo });
                        }
                      }}
                    />
                  </MenuItem>
                  <MenuItem
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontFamily: "Saira",
                        fontWeight: "500",
                        color: relayInfo.canWrite ? "#F5A900" : "#D9D9D9",
                      }}
                    >
                      {"W"}
                    </Typography>
                    <WriteSwitch
                      checked={relayInfo.canWrite}
                      size="small"
                      inputProps={{ "aria-label": "controlled" }}
                      onChange={(ev) => {
                        if (ev.target.checked) {
                          System.addWrite(relayInfo.addr);
                          relayInfo.canWrite = true;
                          setRelayInfo({ ...relayInfo });
                        } else {
                          System.rmWrite(relayInfo.addr);
                          relayInfo.canWrite = false;
                          setRelayInfo({ ...relayInfo });
                        }
                      }}
                    />
                  </MenuItem>
                  <MenuItem
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      className={"icon_del"}
                      sx={{}}
                      onClick={() => {
                        props.openDel();
                        setOpenMore(false);
                      }}
                    ></Box>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    );
  };

  const renderItem = () => {
    if (!relayInfo) return null;
    return (
      <Box className={"relay_item"}>
        <Typography
          className={"lable_relay"}
          onClick={(event) => {
            props.openDetail();
          }}
        >
          {relayInfo.addr}
        </Typography>
        <Box
          sx={{
            cursor: "pointer",
            ml: "10px",
            width: "16px",
            height: "16px",
            borderRadius: "8px",
            backgroundColor: relayInfo.canRead === true ? "#4B8B1F" : "#D9D9D9",
          }}
          onClick={(event) => {
            event.stopPropagation();
            if (!relayInfo.canRead) {
              System.addRead(relayInfo.addr);
              relayInfo.canRead = true;
              setRelayInfo({ ...relayInfo });
            } else {
              System.rmRead(relayInfo.addr);
              relayInfo.canRead = false;
              setRelayInfo({ ...relayInfo });
            }
          }}
        />
        <Box
          sx={{
            cursor: "pointer",
            ml: "10px",
            width: "16px",
            height: "16px",
            borderRadius: "8px",
            backgroundColor:
              relayInfo.canWrite === true ? "#F5A900" : "#D9D9D9",
          }}
          onClick={(event) => {
            event.stopPropagation();
            if (!relayInfo.canWrite) {
              System.addWrite(relayInfo.addr);
              relayInfo.canWrite = true;
              setRelayInfo({ ...relayInfo });
            } else {
              System.rmWrite(relayInfo.addr);
              relayInfo.canWrite = false;
              setRelayInfo({ ...relayInfo });
            }
          }}
        />

        <Box
          className="icon_more"
          onClick={(event) => {
            event.stopPropagation();
            if (openMore === false) {
              handleOpenMore(event, null);
            } else {
              handleCloseMore(event);
            }
          }}
        ></Box>
        {renderMoreMenu()}
      </Box>
    );
  };
  return renderItem();
};

const GRelays = () => {
  const { relays, curRelay } = useSelector((s) => s.profile);
  const { loggedOut } = useSelector((s) => s.login);
  const dispatch = useDispatch();
  const relayPro = useRelayPro();
  const [newRelay, setNewRelay] = useState(null);
  const [detailInfo, setDetailInfo] = useState({ open: false, relay: {} });
  const [delInfo, setDelInfo] = useState({ open: false, relay: {} });

  const handleDialogClose = () => {
    delInfo.open = false;
    setDelInfo({ ...delInfo });
  };

  const saveRelays = async (tmpRelays) => {
    let event = await relayPro.syncRelayKind3(tmpRelays);
    System.BroadcastEvent(event, (tags, client, msg) => {
      if (tags === "OK" && msg.ret === true) {
        console.log("remove relay", event, msg);
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
        {relays.map((cfg, index) => {
          return (
            <ListItem key={"relay-" + index}>
              <GRelayItem
                relay={cfg}
                openDetail={() => {
                  detailInfo.open = true;
                  detailInfo.relay = cfg;
                  setDetailInfo({ ...detailInfo });
                }}
                openDel={() => {
                  delInfo.open = true;
                  delInfo.relay = cfg;
                  setDelInfo({ ...delInfo });
                }}
              />
            </ListItem>
          );
        })}
      </List>
    );
  };

  //
  const renderNewRelay = () => {
    if (newRelay === null) {
      return null;
    }
    return (
      <Box
        key={"add-new-relay-"}
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
      <Box className={"inner_relays"}>
        <Typography className={"tips_relay"}>
          {"Your Relays " + relays.length}
        </Typography>
        <Button
          variant="contained"
          sx={{
            width: "80%",
            height: "36px",
            marginLeft: "10%",
            my: "12px",
            borderRadius: "6px",
            fontSize: "28px",
            fontFamily: "Saira",
            fontWeight: "500",
            color: "white",
            backgroundColor: "#1C6CF9",
            "&:hover": {
              backgroundColor: "#368AF9",
            },
          }}
          disabled={newRelay !== null}
          onClick={() => {
            if (newRelay === null) {
              setNewRelay("");
            }
          }}
        >
          {"+"}
        </Button>
        {renderNewRelay()}
        {renderCacheRelays()}
      </Box>
    );
  };

  const renderCurRelay = () => {
    return (
      <Box className={"relay_detail_bg"}>
        <Box className={"relay_detail_header"}>
          <Box
            className={"goback"}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
            onClick={() => {
              detailInfo.open = false;
              setDetailInfo({ ...detailInfo });
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
            onClick={() => {}}
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
            onChange={(event) => {}}
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
            onChange={(event) => {}}
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
            onChange={(event) => {}}
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
            onChange={(event) => {}}
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
            onChange={(event) => {}}
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
            onChange={(event) => {}}
          />
        </Box>
      </Box>
    );
  };

  const renderDlg = () => {
    return (
      <Dialog open={delInfo.open} onClose={handleDialogClose}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "#0F0F0F",
            paddingLeft: "24px",
            paddingRight: "24px",
            paddingBottom: " 30px",
          }}
        >
          <Typography
            sx={{
              marginTop: "25px",
              fontSize: "24px",
              fontFamily: "Saira",
              fontWeight: "500",
              lineHeight: "29px",
              textAlign: "center",
              color: "#FFFFFF",
            }}
          >
            {"Delete This Relay"}
          </Typography>
          <Typography
            sx={{
              marginTop: "30px",
              fontSize: "18px",
              fontFamily: "Saira",
              fontWeight: "500",
              lineHeight: "29px",
              textAlign: "center",
              color: "#FFFFFF",
            }}
          >
            {"Are you sure to delete this relay?"}
          </Typography>
          <Button
            variant="contained"
            sx={{
              marginTop: "40px",
              width: "80%",
              height: "48px",
              fontSize: "16px",
              fontFamily: "Saira",
              fontWeight: "500",
              backgroundColor: "#FF0000",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#FF6262",
              },
            }}
            onClick={(event) => {
              event.stopPropagation();
              deleteRelays(delInfo.relay.addr);
              handleDialogClose();
            }}
          >
            {"Delete"}
          </Button>
          <Button
            variant="contained"
            sx={{
              marginTop: "10px",
              width: "80%",
              height: "48px",
              fontSize: "16px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
              backgroundColor: "#272727",
              "&:hover": {
                backgroundColor: "#383838",
              },
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
  };
  return (
    <Box className={"relay_bg"}>
      {detailInfo.open ? renderCurRelay() : renderRelays()}
      {renderDlg()}
    </Box>
  );
};

export default GRelays;
