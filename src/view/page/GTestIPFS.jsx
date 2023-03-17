import { React, useEffect, useState, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import "./GTestIPFS.scss";
import MDEditor from "@uiw/react-md-editor";
import Input from "@mui/material/Input";
import LoadingButton from "@mui/lab/LoadingButton";
import GSTPostBase from "web3/GSTPost";
import { catIPFSContent } from "../../api/requestData";
function GTestIPFS() {
  const { activate, account, chainId, active, library, deactivate } =
    useWeb3React();
  const [cid, setCID] = useState("");
  const [fetching, setFetching] = useState(false);
  const [content, setContent] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cidInfo, setCidInfo] = useState({ name: "", cid: "" });
  useEffect(() => {
    fetchPosts();
    return () => {};
  }, []);
  const fetchPosts = () => {
    if (account) {
      GSTPostBase.getPost(library, 0)
        .then((res) => {
          console.log("fetchPosts", res);
          if (res > 0) {
            
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    } else {
      return 0;
    }
  }
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
        width: "100%",
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
