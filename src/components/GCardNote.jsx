import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { setPost } from "module/store/features/dialogSlice";
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
  // const renderSke = () => {
  //     return (
  //         <React.Fragment>
  //             <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
  //             <Skeleton animation="wave" height={10} width="80%" />
  //         </React.Fragment>
  //     )
  // }

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

  return (
    <Card className={'card_note_bg'} elevation={0}>
      <Box className={'base_info'}>
        <Avatar
          className="avatar"
          alt="Avatar"
          src={info && info.picture ? info.picture : default_avatar}
          onClick={() => {
            navigate("/userhome", {
              state: { info: { ...info }, pubkey: note.pubkey },
            });
          }}
        />
        <Typography
          className="name"
          sx={{
            ml: "8px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            fontSize: "14px",
            fontFamily: "Saira",
            fontWeight: "500",
          }}
          color={"#FFFFFF"}
          noWrap={true}
          onClick={() => {
            navigate("/userhome", {
              state: { info: { ...info }, pubkey: note.pubkey },
            });
          }}
        >
          {displayname()}
        </Typography>
        <Typography
          sx={{
            ml: "20px",
            fontSize: "14px",
            fontFamily: "Saira",
            fontWeight: "500",
          }}
          color="#666666"
        >
          {xhelp.formateSinceTime(note.created_at * 1000)}
        </Typography>
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
