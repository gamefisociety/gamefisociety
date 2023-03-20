import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea } from "@mui/material";
import { setPost } from "module/store/features/dialogSlice";
import { default_avatar } from "module/utils/xdef";
import xhelp from "module/utils/xhelp";
import "./GCardNote.scss";
import icon_comment from "../asset/image/social/icon_comment.png";
import icon_praise from "../asset/image/social/icon_praise.png";
import icon_share from "../asset/image/social/icon_share.png";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
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
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {strArray.map((stritem, index) => {
          try {
            if (stritem === "") {
              return (
                <Typography
                  key={"card_note_txt_" + index}
                  sx={{
                    // margin: "12px",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    fontSize: "14px",
                  }}
                  color="text.primary"
                  align="left"
                >
                  {note.content}
                </Typography>
              );
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
                  sx={{ height: "240px", objectFit: "contain" }}
                  src={stritem}
                ></CardMedia>
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
                    // margin: "12px",
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
    <Card
      sx={{
        width: "100%",
        backgroundColor: "background.paper",
      }}
      elevation={0}
    >
      <Box
        sx={{
          py: "12px",
          px: "24px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Avatar
          className="avatar"
          sx={{ width: "36px", height: "36px" }}
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
            // width: "120px",
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
      <Box
        sx={{
          width: "100%",
          paddingLeft: "64px",
          paddingRight: "64px",
        }}
        onClick={() => {
          navigate("/notethread", {
            state: {
              note: { ...note },
              info: { ...info },
            },
          });
        }}
      >
        {/* <CardContent>{content && renderContent(content)}</CardContent> */}
        {renderContent(note.content)}
        <Box
          sx={{
            width: "100%",
            paddingBottom: "16px",
            borderBottom: 1,
            borderColor: "#191A1B",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            marginTop: "23px",
          }}
        >
          <Button
            sx={{
              minWidth: "28px",
              width: "28px",
              height: "28px",
              marginRight: "28px",
            }}
            onClick={() => {
              //
              dispatch(setPost({
                post: true,
                target: note,
              }));
            }}
          >
            <img src={icon_comment} width="28px" alt="comment" />
          </Button>
          <Button
            sx={{
              minWidth: "28px",
              width: "28px",
              height: "28px",
            }}
            onClick={() => { }}
          >
            <img src={icon_praise} width="28px" alt="praise" />
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default React.memo(GCardNote);
