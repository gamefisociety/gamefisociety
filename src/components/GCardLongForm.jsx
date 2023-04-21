import React, { useEffect, useState, useRef } from "react";
import "./GCardLongForm.scss";
import { useSelector, useDispatch } from "react-redux";
import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { setPost } from "module/store/features/dialogSlice";
import xhelp from "module/utils/xhelp";
import Helpers from "../../src/view/utils/Helpers";
import GReportDlg from "view/dialog/GReportDlg";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { useRepostPro } from "nostr/protocal/RepostPro";
import { useReactionPro } from "nostr/protocal/ReactionPro";
import { useRelayPro } from "nostr/protocal/RelayPro";

import { BuildSub, ParseNote, ParseLongForm } from "nostr/NostrUtils";
import { EventKind } from "nostr/def";
import UserDataCache from "db/UserDataCache";
import { System } from "nostr/NostrSystem";

const createNostrWorker = createWorkerFactory(() =>
  import("worker/nostrRequest")
);

const GCardLongForm = (props) => {
  const nostrWorker = useWorker(createNostrWorker);
  const { note } = props;
  const { loggedOut, publicKey } = useSelector((s) => s.login);
  const [meta, setMeta] = useState(null);
  const [baseInfo, setBaseInfo] = useState(null);
  const [expand, setExpand] = useState(false);
  const [replyMeta, setReplyMeta] = useState(null);
  const [repostOpen, setRepostOpen] = useState({
    open: false,
    note: null,
  });
  const [repostData, setRepostData] = useState([]);
  const [reactData, setReactData] = useState([]);
  const [openMore, setOpenMore] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openReport, setOpenReport] = useState({
    open: false,
    note: null,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserCache = UserDataCache();
  const MetaPro = useMetadataPro();
  const repostPro = useRepostPro();
  const reactionPro = useReactionPro();
  const relayPro = useRelayPro();

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

  const fetch_relative_info = () => {
    let ret = ParseNote(note);
    let filter = [];
    let metaKeys = [];
    let metaInfo = UserCache.getMetadata(ret.local_p);
    if (!metaInfo) {
      metaKeys.push(ret.local_p);
    } else {
      setMeta({ ...metaInfo });
    }
    if (
      ret.reply_note_p !== null &&
      ret.reply_note_p !== 0 &&
      ret.root_note_p !== null &&
      ret.root_note_p !== 0
    ) {
      let replyInfo = UserCache.getMetadata(ret.root_note_p);
      if (!replyInfo) {
        metaKeys.push(ret.root_note_p);
      } else {
        setReplyMeta({ ...replyInfo });
      }
    }
    if (metaKeys.length > 0) {
      let tt_metakeys = new Set(metaKeys);
      let filterMeta = MetaPro.get(Array.from(tt_metakeys));
      filter.push(filterMeta);
    }
    //get relay
    let filterRelay = relayPro.get(ret.local_note);
    filter.push(filterRelay);
    //get reaction
    let filterReact = reactionPro.getByIds([ret.local_note]);
    filter.push(filterReact);
    //get repost
    let filterRepost = repostPro.getByIds([ret.local_note]);
    filter.push(filterRepost);
    //request
    if (filter.length === 0) {
      return;
    }
    let tmp_repost_arr = [];
    let tmp_react_arr = [];
    let subMeta = BuildSub(
      "note_relat_" + note.id.substr(0, 4),
      filter.concat()
    );
    // console.log('fetch_relative_info', subMeta);
    nostrWorker.fetch_textnote_rela(subMeta, null, (datas, client) => {
      console.log("fetch_relative_info back", datas);
      datas.map((msg) => {
        if (msg.kind === EventKind.SetMetadata) {
          if (msg.pubkey === ret.local_p) {
            if (meta === null || meta.created_at < msg.created_at) {
              setMeta({ ...msg });
            }
          }
          if (msg.pubkey === ret.reply_note_p) {
            if (replyMeta === null || replyMeta.created_at < msg.created_at) {
              console.log("GCardNote fetch_user_info meta reply", msg);
              setReplyMeta({ ...msg });
            }
          }
        } else if (msg.kind === EventKind.ContactList) {
          //
        } else if (msg.kind === EventKind.Relays) {
          console.log("GCardNote fetch_user_info relay", msg);
        } else if (msg.kind === EventKind.TextNote) {
          //
        } else if (msg.kind === EventKind.Repost) {
          let ret = tmp_repost_arr.some((item) => {
            return item.pubkey === msg.pubkey;
          });
          if (ret === false) {
            tmp_repost_arr.push(msg);
          }
        } else if (msg.kind === EventKind.Reaction) {
          let ret = tmp_react_arr.some((item) => {
            return item.pubkey === msg.pubkey;
          });
          if (ret === false) {
            tmp_react_arr.push(msg);
          }
        }
      });
      setRepostData(tmp_repost_arr.concat());
      setReactData(tmp_react_arr.concat());
      console.log("GCardNote repost & react", tmp_repost_arr, tmp_react_arr);
    });
  };

  const isYourReact = () => {
    return reactData.some((item) => {
      return item.pubkey === publicKey;
    });
  };

  const isYourRepost = () => {
    return repostData.some((item) => {
      return item.pubkey === publicKey;
    });
  };

  const repostNote = async (targetNote) => {
    if (targetNote === null) {
      return;
    }
    let ev = await repostPro.repost(targetNote);
    System.BroadcastEvent(ev, (tag, client, msg) => {
      console.log("repostNote tag", tag, msg);
    });
  };

  const likeNote = async (targetNote) => {
    if (targetNote === null) {
      return;
    }
    let ev = await reactionPro.like(targetNote);
    console.log("reactionPro like", ev);
    System.BroadcastEvent(ev, (tag, client, msg) => {
      // console.log('reactionPro tag', tag, msg);
      fetch_relative_info();
    });
  };

  const displayname = () => {
    let tmp_display_name = "anonymous";
    if (meta && meta.content !== "") {
      let metaCxt = JSON.parse(meta.content);
      tmp_display_name = metaCxt.display_name;
    } else {
      if (note && note.pubkey) {
        tmp_display_name =
          "Nostr#" +
          note.pubkey.substring(note.pubkey.length - 4, note.pubkey.length);
      }
    }
    return tmp_display_name;
  };

  const username = () => {
    let tmp_user_name = "@anonymous";
    if (meta && meta.content !== "") {
      let metaCxt = JSON.parse(meta.content);
      tmp_user_name = "@" + metaCxt.name;
    } else {
      if (note && note.pubkey) {
        tmp_user_name =
          "@Nostr#" +
          note.pubkey.substring(note.pubkey.length - 4, note.pubkey.length);
      }
    }
    return tmp_user_name;
  };

  useEffect(() => {
    let ret = ParseLongForm(note);
    setBaseInfo({ ...ret });
    fetch_relative_info();
    // console.log('renderContent111', note);
    return () => {};
  }, [note]);

  const renderHead = () => {
    return (
      <Box className={"base_info"}>
        <Avatar
          className="avatar"
          alt={displayname()}
          src={pictrue}
          onClick={(event) => {
            event.stopPropagation();
            navigate("/userhome/" + note.pubkey);
          }}
        />
        <Box className={"base_ext"}>
          <Stack sx={{ width: "100%" }} direction="row" alignItems={"center"}>
            <Typography
              className="level1_lable"
              sx={{
                ml: "8px",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              noWrap={true}
              onClick={(event) => {
                event.stopPropagation();
                navigate("/userhome/" + note.pubkey);
              }}
            >
              {displayname()}
            </Typography>
            <Typography
              className="level2_lable"
              sx={{ ml: "12px" }}
              onClick={(event) => {
                event.stopPropagation();
                navigate("/userhome/" + note.pubkey);
              }}
            >
              {username()}
            </Typography>
            <Typography className="level2_lable_unhover" sx={{ ml: "12px" }}>
              {xhelp.formateSinceTime(note.created_at * 1000)}
            </Typography>
          </Stack>
          {renderReplyLable()}
        </Box>
        <Box sx={{ flexGrow: 1 }}></Box>
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

  const renderTitle = () => {
    if (!baseInfo || baseInfo.title === "") {
      return null;
    }
    return (
      <Box className={"lable_frame"}>
        <Typography
          className="lable_title"
          sx={{ ml: "12px" }}
          onClick={(event) => {
            event.stopPropagation();
            setExpand(true);
          }}
        >
          {baseInfo.title}
        </Typography>
      </Box>
    );
  };

  const renderImage = () => {
    if (!baseInfo || baseInfo.image === "") {
      return null;
    }
    return (
      <Box
        component="img"
        src={baseInfo.image}
        className={expand === false ? "lable_image" : "lable_image_full"}
        sx={{ ml: "12px" }}
        onClick={(event) => {
          event.stopPropagation();
          setExpand(true);
        }}
      />
    );
  };

  const renderSummary = () => {
    if (!baseInfo || baseInfo.summary === "") {
      return null;
    }
    return (
      <Box className={"lable_frame"}>
        <Typography className="lable_summary" sx={{ ml: "12px" }}>
          {baseInfo.summary}
        </Typography>
        <Typography
          className="lable_detail"
          sx={{ ml: "12px" }}
          onClick={(event) => {
            event.stopPropagation();
            setExpand(true);
          }}
        >
          {"Expand"}
        </Typography>
      </Box>
    );
  };

  const renderContent = (str) => {
    // console.log('renderContent111', str.trim());
    return (
      <Box
        className={"content"}
        onClick={() => {
          // navigate("/notethread/" + note.id);
        }}
      >
        {Helpers.highlightEverything(str.trim(), null, {
          showMentionedMessages: true,
        })}
        <Typography
          className="lable_detail"
          onClick={(event) => {
            event.stopPropagation();
            setExpand(false);
          }}
        >
          {"Collapse"}
        </Typography>
      </Box>
    );
  };

  const renderBottom = () => {
    return (
      <Box className={"bottom"}>
        <Box
          className="icon_chat"
          onClick={() => {
            dispatch(
              setPost({
                post: true,
                target: note,
              })
            );
          }}
        />
        <Box className="icon_chain_push" />
        <Box className="icon_pay" />
        <Box
          className={isYourRepost() ? "icon_trans_1" : "icon_trans"}
          onClick={(event) => {
            event.stopPropagation();
            repostOpen.open = true;
            repostOpen.note = { ...note };
            setRepostOpen({ ...repostOpen });
          }}
        />
        <Typography className="level2_lable" sx={{ ml: "12px" }}>
          {repostData.length}
        </Typography>
        <Box
          className={isYourReact() ? "icon_right_1" : "icon_right"}
          onClick={(event) => {
            event.stopPropagation();
            if (isYourReact() === false) {
              likeNote(note);
            }
          }}
        />
        <Typography className="level2_lable" sx={{ ml: "12px" }}>
          {reactData.length}
        </Typography>
      </Box>
    );
  };

  const renderReplyLable = () => {
    if (replyMeta === null) {
      return null;
    }
    let showName = "default";
    if (replyMeta && replyMeta.content && replyMeta.content !== "") {
      let replyMetaCxt = JSON.parse(replyMeta.content);
      showName = replyMetaCxt.name;
    }
    // console.log('renderReplyLable', showName);
    return (
      <Stack direction={"row"} alignItems={"center"}>
        <Typography className="level2_lable" sx={{ ml: "12px" }}>
          {"reply to "}
        </Typography>
        <Typography
          className="level3_lable"
          sx={{ ml: "12px" }}
          onClick={(event) => {
            console.log("navigate userhome", replyMeta.pubkey);
            navigate("/userhome/" + replyMeta.pubkey);
            event.stopPropagation();
          }}
        >
          {"@" + showName}
        </Typography>
      </Stack>
    );
  };

  let pictrue = "";
  if (meta && meta.content !== "") {
    let metaCxt = JSON.parse(meta.content);
    pictrue = metaCxt.picture;
  }

  const renderRepostDlg = () => {
    // onClose={handleDialogClose}
    return (
      <Dialog
        open={repostOpen.open}
        PaperProps={{
          style: {
            width: "400px",
            // height: '580px',
            // boxShadow: 'none',
            backgroundColor: "#0F0F0F",
          },
        }}
        elevation={1}
      >
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "#0F0F0F",
            padding: "24px",
          }}
        >
          <Typography
            color={"#919191"}
            sx={{
              mt: "24px",
              fontSize: "24px",
              fontFamily: "Saira",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {"Are you want to repost this?"}
          </Typography>
          <Button
            variant="contained"
            sx={{
              marginTop: "42px",
              width: "100%",
              height: "48px",
              fontSize: "16px",
              fontFamily: "Saira",
              fontWeight: "500",
              borderRadius: "5px",
              color: "#FFFFFF",
            }}
            onClick={(event) => {
              event.stopPropagation();
              repostNote(repostOpen.note);
              repostOpen.open = false;
              repostOpen.note = null;
              setRepostOpen({ ...repostOpen });
            }}
          >
            {"Confirm"}
          </Button>
          <Button
            variant="text"
            sx={{
              marginTop: "32px",
              width: "100%",
              height: "48px",
              fontSize: "16px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            onClick={(event) => {
              event.stopPropagation();
              repostOpen.open = false;
              repostOpen.note = null;
              setRepostOpen({ ...repostOpen });
            }}
          >
            {"Cancel"}
          </Button>
        </Box>
      </Dialog>
    );
  };

  const renderReportDlg = () => {
    return (
      <GReportDlg
        open={openReport.open}
        note={openReport.note}
        close={() => {
          openReport.open = false;
          setOpenReport({ ...openReport });
        }}
      />
    );
  };

  const renderMoreMenu = () => {
    return (
      <Popper
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
                    onClick={(event) => {
                      event.stopPropagation();
                      if (openReport.open) {
                        openReport.open = false;
                        setOpenReport({ ...openReport });
                      } else {
                        openReport.open = true;
                        openReport.note = { ...note };
                        setOpenReport({ ...openReport });
                        console.log(note);
                      }
                    }}
                  >
                    {"Report"}
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    );
  };

  return (
    <Card className={"card_longform_bg"} elevation={0}>
      {renderHead()}
      {renderTitle()}
      <Box className={"context_summary"}>
        {expand === false && renderSummary()}
        {renderImage()}
      </Box>
      {expand === true && renderContent(note.content)}
      {renderBottom()}
      {renderRepostDlg()}
      {renderReportDlg()}
    </Card>
  );
};

export default React.memo(GCardLongForm);
