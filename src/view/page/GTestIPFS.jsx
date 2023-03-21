import { React, useEffect, useState, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import { default_avatar } from "module/utils/xdef";
import xhelp from "module/utils/xhelp";
import { useNavigate } from "react-router-dom";
import "./GTestIPFS.scss";
import GSTArticlesBase from "web3/GSTArticles";
import closeImg from "./../../asset/image/social/close.png";
function GTestIPFS() {
  const navigate = useNavigate();
  const { activate, account, chainId, active, library, deactivate } =
    useWeb3React();
  const [publishState, setPublishState] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cidInfo, setCidInfo] = useState({ name: "", cid: "" });
  const [postDatas, setPostDatas] = useState([]);
  useEffect(() => {
    setPublishState(0);
    setPostDatas([]);
    getPostCount();
    return () => {
      setPublishState(0);
      setPostDatas([]);
    };
  }, []);
  const getPostCount = () => {
    if (account) {
      GSTArticlesBase.totalSupply(library)
        .then((res) => {
          console.log("totalSupply", res);
          if (res > 0) {
            fetchArticles(0, Number(res));
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    } else {
      return 0;
    }
  };
  const fetchArticles = (index, count) => {
    if (account) {
      let postCache = postDatas.concat();
      GSTArticlesBase.getArticles(library, index, count)
        .then((res) => {
          console.log("fetchPosts", res);
          if (res && res.length > 0) {
            postCache = postCache.concat(res);
            setPostDatas(postCache);
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    } else {
      return 0;
    }
  };

  const createArticle = () => {
    if (cidInfo.name.length === 0 || cidInfo.cid.length === 0) {
      return;
    }
    if (publishState === 1) {
      return;
    }
    setPublishState(1);
    if (account) {
      GSTArticlesBase.creatArticle(library, account, cidInfo.name, cidInfo.cid)
        .then((res) => {
          console.log("creatArticle", res);
          if (res) {
            setPublishState(2);
          } else {
            setPublishState(3);
          }
        })
        .catch((err) => {
          setPublishState(3);
          console.log(err, "err");
        });
    } else {
    }
  };

  const publishMsg = () => {
    if (publishState === 0) {
      return "Publish";
    } else if (publishState === 1) {
      return "Publishing...";
    } else if (publishState === 2) {
      return "Published";
    } else if (publishState === 3) {
      return "Error!";
    }
  };

  const handleClickDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    if (publishState === 1) {
      return;
    }
    setDialogOpen(false);
  };

  const publish = () => {
    createArticle();
  };
  return (
    <Box
      sx={{
        width: "960px",
        minHeight: "1000px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <Box
        sx={{
          marginTop: "60px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Button
          variant="contained"
          sx={{
            marginRight: "50px",
            width: "160px",
            height: "35px",
            borderRadius: "20px",
            backgroundColor: "#006CF9",
            fontSize: "14px",
            fontFamily: "Saira",
            fontWeight: "500",
          }}
          onClick={handleClickDialogOpen}
        >
          {"发推"}
        </Button>
      </Box>
      <List
        sx={{
          marginTop: "50px",
          width: "100%",
          height: "100%",
          overflow: "auto",
          backgroundColor: "transparent",
        }}
      >
        {postDatas.map((item, index) => {
          return (
            <Box
              sx={{
                marginTop: "30px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
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
                  className="avatar"
                  sx={{ width: "40px", height: "40px" }}
                  alt="Avatar"
                  src={default_avatar}
                  onClick={() => {}}
                />
                <Typography
                  sx={{
                    marginLeft: "10px",
                    fontSize: "18px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                    color: "#FFFFFF",
                    textAlign: "left",
                  }}
                >
                  {item.addr.substring(0, 5) +
                    "....." +
                    item.addr.substring(item.addr.length - 5, item.addr.length)}
                </Typography>
                <Typography
                  sx={{
                    ml: "30px",
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color="#666666"
                >
                  {xhelp.formateSinceTime(item.timestamp * 1000)}
                </Typography>
              </Box>
              <Box
                className="boxClick"
                sx={{
                  marginTop: "10px",
                  marginLeft: "48px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
                onClick={() => {
                  navigate("/article", {
                    state: {
                      name: item.name,
                      cid: item.cid,
                      timestamp: item.timestamp,
                    },
                  });
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                    color: "#FFFFFF",
                    textAlign: "left",
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  sx={{
                    marginTop: "5px",
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                    color: "#919191",
                    textAlign: "left",
                  }}
                >
                  {"CID: " + item.cid}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </List>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "#0F0F0F",
            paddingTop: "35px",
            paddingBottom: "35px",
            paddingLeft: "24px",
            paddingRight: "24px",
            position: "relative"
          }}
        >
          <Button
            className="button"
            sx={{
              position: "absolute",
              top: "5px",
              right: "5px",
              width: "38px",
              height: "38px",
            }}
            onClick={() => {
              handleDialogClose();
            }}
          >
            <img src={closeImg} width="38px" alt="close" />
          </Button>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontFamily: "Saira",
                fontWeight: "500",
                color: "#919191",
              }}
            >
              {"ARTICLE NAME"}
            </Typography>
            <TextField
              sx={{
                marginTop: "12px",
                width: "80%",
                borderRadius: "5px",
                borderColor: "#323232",
                backgroundColor: "#202122",
                fontSize: "14px",
                fontFamily: "Saira",
                fontWeight: "500",
                color: "#FFFFFF",
              }}
              value={cidInfo.name}
              variant="outlined"
              onChange={(event) => {
                cidInfo.name = event.target.value;
                setCidInfo({ ...cidInfo });
              }}
            />
          </Box>
          <Box
            sx={{
              width: "100%",
              marginTop: "35px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontFamily: "Saira",
                fontWeight: "500",
                color: "#919191",
              }}
            >
              {"ARTICLE CID"}
            </Typography>
            <TextField
              sx={{
                marginTop: "12px",
                width: "80%",
                borderRadius: "5px",
                borderColor: "#323232",
                backgroundColor: "#202122",
                fontSize: "14px",
                fontFamily: "Saira",
                fontWeight: "500",
                color: "#FFFFFF",
              }}
              value={cidInfo.cid}
              variant="outlined"
              onChange={(event) => {
                cidInfo.cid = event.target.value;
                setCidInfo({ ...cidInfo });
              }}
            />
          </Box>
          <Button
            disabled={publishState === 1 || publishState === 2}
            variant="contained"
            sx={{
              marginTop: "50px",
              width: "80%",
              height: "48px",
              backgroundColor: "#006CF9",
              borderRadius: "5px",
              fontSize: "16px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            onClick={publish}
          >
            {publishMsg()}
          </Button>
          <Link
            sx={{
              marginTop: "5px",
            }}
            target="_blank"
            href="https://ipfstexteditor.eth.limo"
          >
            Input On IPFS TextEditor
          </Link>
        </Box>
      </Dialog>
    </Box>
  );
}

export default GTestIPFS;
