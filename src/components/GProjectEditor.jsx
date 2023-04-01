import { React, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";

import Link from "@mui/material/Link";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useWeb3React } from "@web3-react/core";
import GIPFSLogin from "./GIPFSLogin";
import ipfsupload from "api/ipfsupload";
import {
  default_avatar,
  default_banner,
  def_ipfs_public_gateway,
} from "../module/utils/xdef";

import xhelp from "module/utils/xhelp";
import "./GProjectEditor.scss";

function GProjectEditor() {
  const { activate, account, chainId, active, library, deactivate } =
    useWeb3React();
  const { currentService, apiKey, apiSecret } = useSelector((s) => s.ipfs);
  const [publishState, setPublishState] = useState(0);
  const [project, setProject] = useState({
    thumb: "",
    banner: "",
    name: "",
    description: "",
    chainAddress: "",
    wesite: "",
    youtube: "",
    twitter: "",
    discord: "",
    reddit: "",
    telegram: "",
    github: "",
  });
  useEffect(() => {
    return () => {};
  }, []);

  const publishOnIPFS = (content) => {
    console.log("publish on ipfs", content);
    if (apiKey.length === 0 || apiSecret.length === 0) {
      alert("Please enter PROJECT KEY and PROJECT SECRET");
      return;
    }
    if (publishState === 1) {
      return;
    }
    //
    // let new_content = xhelp.convertImageUrlFromIPFSToGFS(content);
    // if (new_content.length === 0) {
    //   return;
    // }
    //upload
    setPublishState(1);
    ipfsupload.upload(
      apiKey,
      apiSecret,
      currentService,
      content,
      project.name,
      (response) => {
        const cid = response.CID;
        setPublishState(2);
        // setStep(1);
        // stepMsgs[0] = "PUBLISH ON IPFS SUCCEED \n" + "cid:" + cid;
        // articleInfo.name = header;
        // articleInfo.cid = cid;
        // setArticleInfo({ ...articleInfo });
      },
      (err) => {
        setPublishState(0);
        // setStep(0);
        // stepMsgs[0] = "PUBLISH ON IPFS FAILED \n" + err;
        console.log("ipfs upload error", err);
      }
    );
  };

  const publishMsg = () => {
    if (publishState === 0) {
      return "publish on ipfs";
    } else if (publishState === 1) {
      return "publishing on ipfs...";
    } else if (publishState === 2) {
      return "publish on blockchain";
    } else if (publishState === 3) {
      return "publishing on blockchain...";
    } else if (publishState === 4) {
      return "published";
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        // backgroundColor: "red"
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          position: "relative",
          maxWidth: "1600px",
          width: "60%",
          height: "100%",
          marginTop: "20px",
        }}
      >
        <GIPFSLogin />
      </Box>
      <Box className={"bg"}>
        <img className="banner" src={default_banner} alt="banner" />
        <Box className="content">
          <Avatar
            sx={{
              marginTop: "-43px",
              width: "86px",
              height: "86px",
            }}
            edge="end"
            alt="GameFi Society"
            src={default_avatar}
          />
          <Box
            sx={{
              width: "100%",
              marginTop: "35px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
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
              {"NAME"}
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
              value={project.name}
              variant="outlined"
              onChange={(event) => {
                project.name = event.target.value;
                setProject({ ...project });
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
              alignItems: "flex-start",
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
              {"DESCRIPTION"}
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
              value={project.description}
              variant="outlined"
              onChange={(event) => {
                project.description = event.target.value;
                setProject({ ...project });
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
              alignItems: "flex-start",
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
              {"THUMB"}
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
              value={project.thumb}
              variant="outlined"
              onChange={(event) => {
                project.thumb = event.target.value;
                setProject({ ...project });
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
              alignItems: "flex-start",
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
              {"BANNER"}
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
              value={project.banner}
              variant="outlined"
              onChange={(event) => {
                project.banner = event.target.value;
                setProject({ ...project });
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
              alignItems: "flex-start",
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
              {"WEBSITE"}
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
              value={project.website}
              variant="outlined"
              onChange={(event) => {
                project.website = event.target.value;
                setProject({ ...project });
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
              alignItems: "flex-start",
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
              {"YOUTUBE"}
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
              value={project.youtube}
              variant="outlined"
              onChange={(event) => {
                project.youtube = event.target.value;
                setProject({ ...project });
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
              alignItems: "flex-start",
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
              {"TWITTER"}
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
              value={project.twitter}
              variant="outlined"
              onChange={(event) => {
                project.twitter = event.target.value;
                setProject({ ...project });
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
              alignItems: "flex-start",
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
              {"DISCORD"}
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
              value={project.discord}
              variant="outlined"
              onChange={(event) => {
                project.discord = event.target.value;
                setProject({ ...project });
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
              alignItems: "flex-start",
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
              {"REDDIT"}
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
              value={project.reddit}
              variant="outlined"
              onChange={(event) => {
                project.reddit = event.target.value;
                setProject({ ...project });
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
              alignItems: "flex-start",
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
              {"TELEGRAM"}
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
              value={project.telegram}
              variant="outlined"
              onChange={(event) => {
                project.telegram = event.target.value;
                setProject({ ...project });
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
              alignItems: "flex-start",
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
              {"GITHUB"}
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
              value={project.github}
              variant="outlined"
              onChange={(event) => {
                project.github = event.target.value;
                setProject({ ...project });
              }}
            />
          </Box>
          <Button
            variant="contained"
            sx={{
              marginTop: "35px",
              width: "20%",
              height: "48px",
              backgroundColor: "#006CF9",
              borderRadius: "5px",
              fontSize: "16px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
            onClick={() => {
              const projectStr = JSON.stringify(project);
              publishOnIPFS(projectStr);
              console.log(projectStr);
            }}
          >
            SAVE
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default GProjectEditor;
