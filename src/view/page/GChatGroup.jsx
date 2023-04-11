import React, { useEffect, useState, useRef } from "react";
import "./GChatGroup.scss";

import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

import GSearchChannel from 'components/GSearchChannel';
import GChatGroupCreate from 'view/page/GChatGroupCreate';
import GChatGroupInner from 'view/page/GChatGroupInner';
import GChatGroupInfo from 'view/page/GChatGroupInfo';

import { setDrawer } from "module/store/features/dialogSlice";
import { useChatPro } from "nostr/protocal/ChatPro";

import { BuildSub } from "nostr/NostrUtils"
import { System } from "nostr/NostrSystem";
import { EventKind } from "nostr/def";

import ChannelCache from 'db/ChannelCache';

const GChatGroup = () => {
  const { loggedOut } = useSelector((s) => s.login);
  const dispatch = useDispatch();
  const chatPro = useChatPro();

  const [groupInfo, setGroupInfo] = React.useState(null);
  const [groupState, setGroupState] = React.useState(0);
  const [channels, setChannels] = useState([]);

  const fetchChatGroup = async () => {
    let filterCreateChannel = chatPro.getChannel();
    let subCreateChannel = BuildSub("create_channel", [filterCreateChannel]);
    let tmp_channles = [];
    System.BroadcastSub(subCreateChannel, (tags, client, msg) => {
      let channelCache = ChannelCache();
      if (tags === 'EOSE') {
        System.BroadcastClose(subCreateChannel, client, null);
        tmp_channles.map((item) => {
          console.log('fetchChatGroup', item);
          channelCache.addInfo({ ...item });
        });
        setChannels(channelCache.getInfoList().concat());
      } else if (tags === 'EVENT') {
        if (msg.kind && msg.kind === EventKind.ChannelCreate) {
          tmp_channles.push(msg);
        }
      }
    }, null);

  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openMenu, setOpenMenu] = React.useState(false);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
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

  const renderChannelMenu = () => {
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
                    handleMenuClose(event);
                    setGroupState(3);
                  }}>
                    {'Information'}
                  </MenuItem>
                  <MenuItem onClick={(event) => {
                    handleMenuClose(event);
                  }} >
                    {'Share To'}
                  </MenuItem>
                  <MenuItem onClick={(event) => {
                    handleMenuClose(event);
                  }}>
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
                    event.stopPropagation();
                    setGroupInfo({ ...item });
                    setGroupState(2);
                  }}
                >
                  <Typography className={'lable_relay'}>
                    {profile.name}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Box className="icon_more" onClick={(event) => {
                    if (openMenu === false) {
                      setGroupInfo({ ...item });
                      handleMenuOpen(event);
                    } else {
                      setGroupInfo(null);
                      handleMenuClose(event);
                    }
                  }} />
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
        <Typography sx={{ width: '100%', py: '18px' }} align={'center'} variant="h5" >{'CHANNEL LIST'}</Typography>
        <GSearchChannel callback={(msg, channelId) => {
          if (msg === 'msg-channel-id') {
            console.log('msg-channel-id', channelId);
          }
        }} />
        <Button className={'create_group_bt'}
          onClick={() => {
            setGroupState(1);
          }}
        >
          {"+"}
        </Button>
        {renderChannelList()}
        <Box className={'bt_back'}
          onClick={(event) => {
            event.stopPropagation();
            dispatch(
              setDrawer({
                isDrawer: false,
                placeDrawer: "right",
                cardDrawer: "default",
              })
            );
          }}
        />
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
      {groupState === 3 && <GChatGroupInfo ginfo={{ ...groupInfo }} callback={() => {
        setGroupState(0);
      }} />}
      {renderChannelMenu()}
    </Box>
  );
};

export default GChatGroup;
