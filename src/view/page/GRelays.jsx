import React, { useEffect, useState, useRef } from "react";
import "./GRelays.scss";

import { useSelector, useDispatch } from "react-redux";
import { setDrawer } from "module/store/features/dialogSlice";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { alpha, styled } from "@mui/material/styles";
import { setRelays } from "module/store/features/profileSlice";
import { useRelayPro } from "nostr/protocal/RelayPro";
import logo_delete from "asset/image/social/icon_delete.png";
import icon_detail from "asset/image/social/icon_detail.png";
import icon_back_white from "../../asset/image/social/icon_back_white.png";
import { System } from "nostr/NostrSystem";

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
            event.stopPropagation();
            props.openDetail();
          }}
        >
          {relayInfo.addr}
        </Typography>
        <Box
          sx={{
            cursor: "pointer",
            ml: "10px",
            width: "10px",
            height: "10px",
            borderRadius: "5px",
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
            ml: "5px",
            width: "10px",
            height: "10px",
            borderRadius: "5px",
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
  const [detailRelay, setDetailRelay] = useState(null);
  const [newRelays, setNewRelays] = useState([]);
  const [delInfo, setDelInfo] = useState({ open: false, relay: {} });
  const [mode, setMode] = useState("list"); //list detail new
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

  const addRelay = async (addr) => {
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

  const deleteRelay = async (addr) => {
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

  //
  const renderNewRelay = () => {
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
              setMode("list");
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
        <Box
          sx={{
            width: "100%",
            paddingLeft: "12px",
            paddingRight: "12px",
          }}
        >
          <Button
            variant="contained"
            sx={{
              marginBottom: "10px",
              width: "100%",
              height: "48px",
              fontSize: "40px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#A2A2A2",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "#383838",
              },
            }}
            onClick={() => {
              if (newRelays.length < 10) {
                let t_relays = newRelays.concat();
                t_relays.push("");
                setNewRelays(t_relays);
              }
            }}
          >
            {"+"}
          </Button>
          {newRelays.map((item, index) => {
            return (
              <Box
                key={"add-new-relay-" + index}
                sx={{
                  marginTop: "10px",
                  width: "100%",
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TextField
                  sx={{ width: "60%" }}
                  value={item}
                  size="small"
                  placeholder="wss://relay.example.com"
                  // focus={true}
                  onChange={(event) => {
                    let t_relays = newRelays.concat();
                    t_relays[index] = event.target.value;
                    setNewRelays(t_relays);
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    width: "40px",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: "#383838",
                    },
                  }}
                  onClick={() => {
                    let t_relays = newRelays.concat();
                    t_relays.splice(index, 1);
                    setNewRelays(t_relays);
                  }}
                >
                  <img src={logo_delete} width="40px" alt="logo_delete" />
                </Button>
              </Box>
            );
          })}
          {newRelays.length > 0 ? (
            <Button
              variant="contained"
              sx={{
                marginTop: "30px",
                width: "100%",
                height: "48px",
                fontSize: "16px",
                fontFamily: "Saira",
                fontWeight: "500",
                borderRadius: "5px",
                color: "#FFFFFF",
                backgroundColor: "#1C6CF9",
                "&:hover": {
                  backgroundColor: "#368AF9",
                },
              }}
              onClick={(event) => {
                event.stopPropagation();
                for (let index = 0; index < newRelays.length; index++) {
                  const t_relay = newRelays[index];
                  if (t_relay.length > 6 && t_relay.indexOf("wss://") === 0) {
                    addRelay(t_relay);
                  }
                }
                setMode("list");
              }}
            >
              {"SAVE"}
            </Button>
          ) : null}
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
          onClick={() => {
            setNewRelays([]);
            setMode("new");
          }}
        >
          {"+"}
        </Button>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={40}
              itemCount={relays.length}
              itemData={relays}
            >
              {({ data, index, style }) => (
                <Box style={style}>
                  <GRelayItem
                    style={style}
                    relay={data[index]}
                    openDetail={() => {
                      setMode("detail");
                      setDetailRelay(data[index]);
                    }}
                    openDel={() => {
                      delInfo.open = true;
                      delInfo.relay = data[index];
                      setDelInfo({ ...delInfo });
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

  const renderDetailRelay = () => {
    if (detailRelay === null) {
      return null;
    }
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
              setMode("list");
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
            marginTop: "20px",
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
            marginTop: "20px",
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
            marginTop: "20px",
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
            marginTop: "20px",
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
            marginTop: "20px",
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
            marginTop: "20px",
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
              fontSize: "22px",
              fontFamily: "Saira",
              fontWeight: "800",
              lineHeight: "29px",
              textAlign: "center",
              color: "#FFFFFF",
            }}
          >
            {"DELETE THIS RELAY"}
          </Typography>
          <Typography
            sx={{
              marginTop: "30px",
              fontSize: "16px",
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
              deleteRelay(delInfo.relay.addr);
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
  const renderContent = () => {
    if (mode === "list") {
      return renderRelays();
    } else if (mode === "detail") {
      return renderDetailRelay();
    } else if (mode === "new") {
      return renderNewRelay();
    }
    return null;
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
                cardDrawer: "relays",
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
  return (
    <Box className={"relay_bg"}>
      {renderHeader()}
      {renderContent()}
      {renderDlg()}
    </Box>
  );
};

export default GRelays;
