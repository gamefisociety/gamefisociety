import { React, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
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
import GSTProjectsBase from "web3/GSTProjects";
import {
  default_avatar,
  default_banner,
  def_ipfs_public_gateway,
} from "../module/utils/xdef";
import "./GProjectEditor.scss";

const GProjectEditor = (props) => {
  const { activate, account, chainId, active, library, deactivate } =
    useWeb3React();
  const { info } = props;
  const { currentService, apiKey, apiSecret } = useSelector((s) => s.ipfs);
  const [publishState, setPublishState] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [project, setProject] = useState({
    thumb: "",
    name: "",
    description: "",
    chainAddress: "",
    website: "",
    twitter: "",
    discord: "",
    reddit: "",
    telegram: "",
    github: "",
  });
  useEffect(() => {
    if (info) {
      setProject(info);
    }
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
        publishOnBlockchain(cid);
      },
      (err) => {
        setPublishState(0);
        console.log("ipfs upload error", err);
      }
    );
  };

  const publishOnBlockchain = (cid) => {
    if (cid.length === 0) {
      return;
    }
    if (account) {
      if (publishState === 2) {
        return;
      }
      setPublishState(2);
      GSTProjectsBase.createProject(library, account, cid)
        .then((res) => {
          console.log("createProject", res);
          if (res) {
            setPublishState(3);
          }
        })
        .catch((err) => {
          console.log(err, "err");
          setPublishState(1);
        });
    } else {
    }
  };

  const uploadThumbOnIPFS = (event) => {
    if (apiKey.length === 0 || apiSecret.length === 0) {
      alert("Please enter PROJECT KEY and PROJECT SECRET");
      return;
    }
    if (uploadingImage === true) {
      return;
    }
    if (event.target.files && event.target.files[0]) {
      let data = event.target.files[0];
      console.log("uploadImageOnIPFS", data);
      //upload
      setUploadingImage(true);
      ipfsupload.upload(
        apiKey,
        apiSecret,
        currentService,
        data,
        data.name,
        (response) => {
          const cid = response.CID;
          project.thumb = "gamefisociety/temp/image/ipfs/" + cid;
          setProject({ ...project });
          setUploadingImage(false);
        },
        (err) => {
          setUploadingImage(false);
        }
      );
    }
  };

  const saveMsg = () => {
    if (publishState === 0) {
      return "save";
    } else if (publishState === 1) {
      return "saving...";
    } else if (publishState === 2) {
      return "saving...";
    } else if (publishState === 3) {
      return "saved";
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
      <Box
        sx={{
          width: "663px",
          paddingTop: "24px",
          paddingBottom: "66px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            paddingLeft: "52px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
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
              {"ICON"}
            </Typography>
            <Box
              sx={{
                marginTop: "12px",
                position: "relative",
                width: "160px",
                height: "160px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  width: "160px",
                  height: "160px",
                }}
                edge="end"
                alt="GameFi Society"
                src={project.thumb.replace(
                  "gamefisociety/temp/image",
                  def_ipfs_public_gateway
                )}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  left: "40px",
                  top: "40px",
                  width: "80px",
                  height: "80px",
                }}
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={uploadThumbOnIPFS}
                />
                <AddAPhotoIcon />
              </IconButton>
            </Box>
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
              if (publishState === 1 || publishState === 2) {
                return;
              }
              const projectStr = JSON.stringify(project);
              publishOnIPFS(projectStr);
              console.log(projectStr);
            }}
          >
            {saveMsg()}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default GProjectEditor;
