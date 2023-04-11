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
import GChatGroupInner from 'view/page/GChatGroupInner';

import { styled } from "@mui/material/styles";
import { useRelayPro } from "nostr/protocal/RelayPro";
import { useChatPro } from "nostr/protocal/ChatPro";

import { BuildSub } from "nostr/NostrUtils"
import { System } from "nostr/NostrSystem";
import { EventKind } from "nostr/def";

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
  const { loggedOut } = useSelector((s) => s.login);
  const dispatch = useDispatch();
  const relayPro = useRelayPro();
  const chatPro = useChatPro();

  const [groupInfo, setGroupInfo] = React.useState(null);
  const [groupState, setGroupState] = React.useState(0);
  const [channels, setChannels] = useState([]);
  const [opRelay, setOpRelay] = useState(null);

  const fetchChatGroup = async () => {
    let filterCreateChannel = chatPro.getChannel();
    let subCreateChannel = BuildSub("create_channel", [filterCreateChannel]);
    let tmp_channles = [];
    System.BroadcastSub(subCreateChannel, (tags, client, msg) => {
      console.log('fetchChatGroup', msg);
      if (tags === 'EOSE') {
        System.BroadcastClose(subCreateChannel, client, null);
        setChannels(tmp_channles.concat());
      } else if (tags === 'EVENT') {
        if (msg.kind && msg.kind === EventKind.ChannelCreate) {
          tmp_channles.push(msg);
        }
      }
    }, null);

  };

  // const addRelays = async (addr) => {
  //   let tmps = relays.concat();
  //   let flagIndex = tmps.findIndex((item) => {
  //     return item.addr === addr;
  //   });
  //   if (flagIndex < 0) {
  //     tmps.push({ addr: addr, read: true, write: false });
  //   }
  //   dispatch(setRelays(tmps));
  //   if (loggedOut === false) {
  //     saveRelays(tmps);
  //   }
  //   return null;
  // };

  // const deleteRelays = async (addr) => {
  //   let tmps = relays.concat();
  //   let flagIndex = tmps.findIndex((item) => {
  //     return item.addr === addr;
  //   });
  //   tmps.splice(flagIndex, 1);
  //   dispatch(setRelays(tmps));
  //   if (loggedOut === false) {
  //     saveRelays(tmps);
  //   }
  //   return null;
  // };

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

  useEffect(() => {
    fetchChatGroup();
  }, [groupState]);

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

  const renderChannelList = () => {
    return (
      <List className="list_bg">
        {
          channels.map((item, index) => {
            console.log('renderCacheRelays', item);
            if (!item.content || item.content === '') {
              return null;
            }
            let profile = JSON.parse(item.content);
            return (
              <ListItem key={'channel-' + index}>
                <Box
                  className={'channel_item'}
                  onClick={(event) => {
                    setGroupInfo({ ...item });
                    setGroupState(2)
                    // console.log('new event', event);
                    // module.isDetail = true;
                    // module.curRelay = cfg;
                    // setModule({ ...module });
                  }}
                >
                  <Typography className={'lable_relay'}>
                    {profile.name}
                  </Typography>
                  {/* <Box
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
                  /> */}
                  <Box sx={{ flexGrow: 1 }} />
                  <Box className="icon_more" onClick={(event) => {
                    // if (openMenu === false) {
                    //   handleMenuOpen(event, cfg);
                    // } else {
                    //   handleMenuClose(event);
                    // }
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
        {renderChannelList()}
      </Box>
    );
  };

  return (
    <Box className={'chat_group_bg'}>
      {groupState === 0 && renderChatGroup()}
      {groupState === 1 && <GChatGroupCreate callback={() => {
        setGroupState(0);
      }} />}
      {groupState === 2 && <GChatGroupInner ginfo={{ ...groupInfo }} callback={() => {
        setGroupState(0);
      }} />}
    </Box>
  );
};

export default GChatGroup;
