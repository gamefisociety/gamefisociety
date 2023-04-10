import React, { useEffect, useState, useRef } from "react";
import "./GChatGroup.scss";

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
import ListItemIcon from '@mui/material/ListItemIcon';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

import GChatGroupCreate from 'view/page/GChatGroupCreate';

import { alpha, styled } from "@mui/material/styles";
import { setRelays } from "module/store/features/profileSlice";
import { useRelayPro } from "nostr/protocal/RelayPro";
import logo_delete from "asset/image/social/icon_delete.png";
import icon_detail from "asset/image/social/icon_detail.png";
import icon_save from "asset/image/social/icon_save.png";
import icon_back_white from "../../asset/image/social/icon_back_white.png";

import { System } from "nostr/NostrSystem";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 36,
  height: 18,
  padding: 0,
  marginRight: 10,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#32dce8' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 16,
    height: 16,
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const GChatGroup = () => {
  const { relays, curRelay } = useSelector((s) => s.profile);
  const { loggedOut } = useSelector((s) => s.login);
  const dispatch = useDispatch();
  const relayPro = useRelayPro();
  const [groupState, setGroupState] = React.useState(0);
  const [newRelay, setNewRelay] = useState(null);
  const [opRelay, setOpRelay] = useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [module, setModule] = useState({ isDetail: false, curRelay: {} });

  const handleClickDialogOpen = () => {
    setDialogOpen(true);
  };

  const saveRelays = async (tmpRelays) => {
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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openMenu, setOpenMenu] = React.useState(false);

  const handleMenuOpen = (event, cfg) => {
    // console.log('handleOpen', event, cfg);
    event.stopPropagation();
    let tmpCfg = { ...cfg };
    tmpCfg.canRead = System.isRead(cfg.addr);
    tmpCfg.canWrite = System.isWrite(cfg.addr);
    setOpRelay({ ...tmpCfg });
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  const handleMenuClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
    setOpenMenu(false);
  };

  const renderRelayMenu = () => {
    return (
      <Popper
        open={openMenu}
        anchorEl={anchorEl}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'right bottom' : 'right top',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleMenuClose}>
                <MenuList autoFocusItem={openMenu}>
                  <MenuItem onClick={(event) => {
                    event.stopPropagation();
                    opRelay.canRead = !opRelay.canRead;
                    setOpRelay({ ...opRelay });
                  }}>
                    <IOSSwitch checked={opRelay ? opRelay.canRead : false} onChange={(ev) => {
                      if (ev.target.checked) {
                        System.addRead(opRelay.addr);
                      } else {
                        System.rmRead(opRelay.addr);
                      }
                    }} />
                    {'Read'}
                  </MenuItem>
                  <MenuItem onClick={(event) => {
                    event.stopPropagation();
                    opRelay.canWrite = !opRelay.canWrite;
                    setOpRelay({ ...opRelay });
                  }} >
                    <IOSSwitch checked={opRelay ? opRelay.canWrite : false} onChange={(ev) => {
                      if (ev.target.checked) {
                        System.addWrite(opRelay.addr);
                      } else {
                        System.rmWrite(opRelay.addr);
                      }
                    }} />
                    {'Write'}
                  </MenuItem>
                  <MenuItem onClick={(event) => {
                    event.stopPropagation();
                    handleMenuClose();
                    handleClickDialogOpen();
                  }}>
                    <ListItemIcon>
                      <Box className="icon_del" />
                    </ListItemIcon>
                    {'Delete'}
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    );
  }

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
                  <Typography className={'lable_relay'}>
                    {cfg.addr}
                  </Typography>
                  <Box
                    sx={{
                      ml: "10px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "8px",
                      backgroundColor: System.isRead(cfg.addr) === true ? "#4B8B1F" : "#D9D9D9",
                    }}
                  />
                  <Box
                    sx={{
                      ml: "10px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "8px",
                      backgroundColor: System.isWrite(cfg.addr) === true ? "#F5A900" : "#D9D9D9",
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }} />
                  <Box className="icon_more" onClick={(event) => {
                    if (openMenu === false) {
                      handleMenuOpen(event, cfg);
                    } else {
                      handleMenuClose(event);
                    }
                  }} />
                  {renderRelayMenu()}
                </Box>
              </ListItem>
            )
          })
        }
      </List>
    );
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

  const renderChatGroup = () => {
    return (
      <Box className={'inner_chat_group'}>
        <Button className={'create_group_bt'}
          onClick={() => {
            setGroupState(1);
          }}
        >
          {"+"}
        </Button>
        {renderCacheRelays()}
      </Box>
    );
  };


  return (
    <Box className={'chat_group_bg'}>
      {groupState === 0 && renderChatGroup()}
      {groupState === 1 && <GChatGroupCreate callback={() => {
        setGroupState(0);
      }} />}
    </Box>
  );
};

export default GChatGroup;
