import { React, useEffect, useState, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import { default_avatar } from "module/utils/xdef";
import xhelp from "module/utils/xhelp";
import { useNavigate } from "react-router-dom";
import "./GTestIPFS.scss";
import GSTPostBase from "web3/GSTPost";
import { catIPFSContent } from "../../api/requestData";
function GTestIPFS() {
  const navigate = useNavigate();
  const { activate, account, chainId, active, library, deactivate } =
    useWeb3React();
  const [cid, setCID] = useState("");
  const [fetching, setFetching] = useState(false);
  const [content, setContent] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cidInfo, setCidInfo] = useState({ name: "", cid: "" });
  const [postDatas, setPostDatas] = useState([]);
  let postCache = [];
  useEffect(() => {
    postCache.splice(0, postCache.length);
    getPostCount();
    return () => {};
  }, []);
  const getPostCount = () => {
    if (account) {
      GSTPostBase.totalSupply(library)
        .then((res) => {
          console.log("totalSupply", res);
          if (res > 0) {
            for (let index = 0; index < Number(res); index++) {
              fetchPosts(index);
            }
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    } else {
      return 0;
    }
  };
  const fetchPosts = (index) => {
    if (account) {
      GSTPostBase.getPost(library, index)
        .then((res) => {
          console.log("fetchPosts", res);
          if (res) {
            postCache.push(res);
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
  const handleClickDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const catContent = () => {
    if (cid.length === 0) {
      alert("CID is empty!");
      return;
    }
    if (fetching === true) {
      return;
    }
    setFetching(true);
    catIPFSContent(cid)
      .then((res) => {
        setFetching(false);
        if (typeof res === "string") {
          setContent(res);
        } else if (typeof res === "object") {
          setContent(res.content);
        }
        console.log(res);
      })
      .catch((err) => {
        setFetching(false);
        console.log(err);
      });
  };
  const handleInputChange = (e) => {
    setCID(e.target.value);
    console.log(e.target.value);
  };

  const publish = () => {};
  return (
    <Box
      sx={{
        width: "663px",
        minHeight: "1000px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Button
        variant="contained"
        sx={{
          marginTop: "60px",
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
          }}
        >
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
            PUBLISH
          </Button>
        </Box>
      </Dialog>
    </Box>
    // <div className="container">
    //   <div className="layout">
    //     <div className="cid_block">
    //       <Input
    //         placeholder="CID"
    //         value={cid}
    //         onChange={handleInputChange}
    //         inputProps={ariaLabel}
    //       />
    //       <LoadingButton
    //         color="secondary"
    //         loading={fetching}
    //         variant="outlined"
    //         onClick={() => {
    //           catContent();
    //         }}
    //       >
    //         FETCH
    //       </LoadingButton>
    //     </div>
    //     <div className="content_block">
    //       <MDEditor.Markdown
    //         source={content}
    //         style={{ whiteSpace: "pre-wrap" }}
    //       />
    //     </div>
    //   </div>
    // </div>
  );
}

export default GTestIPFS;
