import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import "./GChatGroupInner.scss";

import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import { useSelector, useDispatch } from "react-redux";
import { Button, Box, Paper, Stack, Divider } from "@mui/material";
import { VariableSizeList as List } from "react-window";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

import GChatItem from "components/GChatItem";

import { useChatPro } from "nostr/protocal/ChatPro";
import { BuildSub } from "nostr/NostrUtils"

import { System } from "nostr/NostrSystem";

const createChatWorker = createWorkerFactory(() => import('worker/chatRequest'));

const GChatGroupInner = (props) => {
  const { callback, ginfo } = props;
  const chatWorker = useWorker(createChatWorker);
  const { loggedOut, publicKey } = useSelector((s) => s.login);

  const [inValue, setInValue] = useState("");
  const chatPro = useChatPro();
  const [msgs, setMsgs] = useState([]);

  const listRef = useRef();
  const sizeMap = useRef({});
  const setSize = useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current.resetAfterIndex(index);
  }, []);
  const getSize = (index) => sizeMap.current[index] || 50;

  //
  const sendMsg = async () => {
    if (inValue.length === 0) {
      return;
    }
    const chatEv = await chatPro.sendChannelMessge(inValue, ginfo);
    System.BroadcastEvent(chatEv, (tag, client, msg) => {
      if (tag === "OK" && msg.ret && msg.ret === true) {
        setInValue("");
        // let flag = dm_cache.pushChat(chatPK, chatEv.Id, chatEv.PubKey, chatEv.CreatedAt, inValue);
        // if (flag === false) {
        //   return;
        // }
        // let chat_datas = dm_cache.get(chatPK);
        // if (chat_datas) {
        //   setChatData(chat_datas.concat());
        //   setInValue("");
        // }
      }
    });
  };

  const listenChatGroupSub = (ids) => {
    // console.log('listenChatGroupSub', ids);
    return chatPro.getChannelMessage(ids);
  }

  useEffect(() => {
    if (!ginfo) {
      return;
    }
    let filter = listenChatGroupSub([ginfo.id]);
    let subChannelMsg = BuildSub("create_channel", [filter]);
    chatWorker.listen_chatgroup(subChannelMsg, ginfo.id, null, true, (cache, client) => {
      console.log('listen_chatgroup cache', cache);
      if (cache) {
        setMsgs(cache.concat());
      }
    });
    return () => {
      if (!ginfo) {
        return;
      }
      chatWorker.unlisten_chatgroup(subChannelMsg, null, null);
    }
  }, [ginfo]);

  //
  useEffect(() => {
    if (msgs.length > 0 && listRef.current) {
      listRef.current.scrollToItem(msgs.length, "smart");
    }
    return () => { };
  }, [msgs]);

  const getGroupName = () => {
    if (ginfo === null || !ginfo.content || ginfo.content === '') {
      return 'default';
    }
    let profile = JSON.parse(ginfo.content);
    return profile.name;
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openMenu, setOpenMenu] = React.useState(false);

  const handleMenuOpen = (event) => {
    // console.log('handleOpen', event, cfg);
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  const handleMenuClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
    setOpenMenu(false);
  };

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
                    event.stopPropagation();
                    handleMenuClose(event);
                  }}>
                    {'Information'}
                  </MenuItem>
                  <MenuItem onClick={(event) => {
                    event.stopPropagation();
                    handleMenuClose(event);
                  }} >
                    {'Share To'}
                  </MenuItem>
                  <Divider sx={{ width: '100%' }} />
                  <MenuItem onClick={(event) => {
                    event.stopPropagation();
                    handleMenuClose(event);
                  }}>
                    {'Remove'}
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    );
  }

  const renderHeader = () => {
    return (
      <Box className={'chat_group_header'}>
        <Box className={'bt_back_inner'}
          onClick={() => {
            if (callback) {
              callback();
            }
          }}
        />
        <Typography className={'lable_head'}>
          {getGroupName()}
        </Typography>
        <Box className="icon_more" onClick={(event) => {
          if (openMenu === false) {
            handleMenuOpen(event);
          } else {
            handleMenuClose(event);
          }
        }} />
      </Box>
    );
  }

  const ListRow = (props) => {
    const { data, index, setSize, pk } = props;
    const rowRef = useRef(null);
    const item = data[index];

    const fetchMeta = (targetPubkey) => {
      //targetPubkey
    }

    useEffect(() => {
      // console.log('ListRow item', item);
      // console.log('ListRow item', rowRef);
      fetchMeta(item.pubkey);
    }, [item.pubkey]);

    // console.log('ListRow item', rowRef);

    useEffect(() => {
      console.log('ListRow item1111', rowRef);
      setSize(index, rowRef.current.getHeight());
    }, [setSize, index]);

    return <GChatItem
      ref={rowRef}
      key={'chatitem-' + index}
      content={item.content}
      pubkey={item.pubkey}
      callback={(msg, pubkey, info) => {
        if (msg === 'msg-user') {
          if (info && info.content) {
            let tmp_info = JSON.parse(info.content);
            let tmp_at = inValue + '@' + tmp_info.name + ' ';
            setInValue(tmp_at);
          } else {
            //
          }
        }
      }}
    />
  };

  const renderContent = () => {
    return (
      <Box className={'chat_group_content'}>
        <List
          ref={listRef}
          height={500}
          width={"100%"}
          itemSize={getSize}
          itemCount={msgs.length}
          itemData={msgs}
        >
          {({ data, index, style }) => (
            <div style={style}>
              <ListRow
                data={data}
                index={index}
                setSize={setSize}
                pk={publicKey}
              />
            </div>
          )}
        </List>
      </Box>
    );
  }

  const renderInput = () => {
    return <Box className={'chat_group_input'}>
      <TextField
        vlabel="Multiline"
        multiline
        maxRows={4}
        value={inValue}
        className={'input_text'}
        onChange={(e) => {
          setInValue(e.target.value);
        }}
      />
      <Button
        variant="contained"
        className={'dm_send_bt'}
        onClick={() => {
          sendMsg();
        }}
      >
        {'send'}
      </Button>
    </Box>;
  }

  return (
    <Paper className={'chat_group_inner_bg'} >
      {renderHeader()}
      <Divider sx={{ width: '100%', py: '4px' }} />
      {renderContent()}
      <Divider sx={{ width: '100%', py: '4px' }} />
      {renderInput()}
      {renderChannelMenu()}
    </Paper>
  );
};

export default React.memo(GChatGroupInner);
