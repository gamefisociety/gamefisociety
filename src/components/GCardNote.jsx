import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { setPost } from 'module/store/features/dialogSlice';
import { default_avatar } from "module/utils/xdef";
import xhelp from "module/utils/xhelp";
import "./GCardNote.scss";
import { System } from "nostr/NostrSystem";

const GCardNote = (props) => {
  const { note, info } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    //
    return () => { };
  }, [props]);

  const renderContent = (str) => {
    const strArray = str.split("\n");
    return (
      <Box
        className={'content'}
        onClick={() => {
          navigate("/notethread", {
            state: {
              note: { ...note },
              info: { ...info },
            },
          });
        }}
      >
        {strArray.map((stritem, index) => {
          try {
            if (stritem === "") {
              return null;
            } else if (
              (stritem.startsWith("http://") ||
                stritem.startsWith("https://")) &&
              (stritem.endsWith(".png") ||
                stritem.endsWith(".jpg") ||
                stritem.endsWith(".jpeg") ||
                stritem.endsWith(".gif"))
            ) {
              // console.log('render image', stritem);
              return (
                <CardMedia
                  component="img"
                  key={"cxt-" + index + "-" + stritem}
                  className={'inner_img'}
                  src={stritem}
                />
              );
            } else if (
              (stritem.startsWith("http://") ||
                stritem.startsWith("https://")) &&
              stritem.endsWith(".mp4")
            ) {
              console.log("render video", stritem);
              return null;
            } else {
              return (
                <Typography
                  sx={{
                    width: "100%",
                    // backgroundColor: 'red',
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    fontSize: "14px",
                  }}
                  color="#FFFFFF"
                  align="left"
                >
                  {stritem}
                </Typography>
              );
            }
          } catch (error) {
            // console.log('strArray error', error, stritem);
            return null;
          }
        })}
      </Box>
    );
  };

  const displayname = () => {
    if (info && info.display_name) {
      return info.display_name;
    } else {
      if (note.pubkey) {
        return (
          "Nostr#" +
          note.pubkey.substring(note.pubkey.length - 4, note.pubkey.length)
        );
      }
    }
    return "anonymous";
  };

  const username = () => {
    if (info && info.name) {
      return '@' + info.name;
    } else {
      if (note.pubkey) {
        return (
          "@Nostr#" +
          note.pubkey.substring(note.pubkey.length - 4, note.pubkey.length)
        );
      }
    }
    return "@anonymous";
  };

  const renderReplyLable = () => {
    if (!note) {
      return null;
    }
    // console.log('renderReplyLable note', note);
    if (note.tags && note.tags.length === 0) {
      return null;
    }
    return (
      <Typography className="level2_lable" sx={{ ml: "12px" }}>
        {'reply to xxx'}
      </Typography>
    );
  }

  return (
    <Card className={'card_note_bg'} elevation={0}>
      <Box className={'base_info'}
        onClick={() => {
          navigate("/userhome", { state: { pubkey: note.pubkey } });
        }}>
        <Avatar
          className="avatar"
          alt="Avatar"
          src={info && info.picture ? info.picture : default_avatar}
        />
        <Box className={'base_ext'}>
          <Stack direction='row'>
            <Typography className="level1_lable"
              sx={{
                ml: "8px",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              noWrap={true}
            >
              {displayname()}
            </Typography>
            <Typography className="level2_lable" sx={{ ml: "12px" }}>
              {username()}
            </Typography>
            <Typography className="level2_lable" sx={{ ml: "12px" }}>
              {xhelp.formateSinceTime(note.created_at * 1000)}
            </Typography>
          </Stack>
          {renderReplyLable()}
        </Box>
      </Box>
      {renderContent(note.content)}
      <Box className={'bottom'}>
        <img className={'icon_chat'} onClick={() => {
          dispatch(setPost({
            post: true,
            target: note,
          }));
        }} />
        <img className={'icon_right'} />
        <img className={'icon_trans'} />
        <img className={'icon_pay'} />
      </Box>
    </Card>
  );
};

export default React.memo(GCardNote);
