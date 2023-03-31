import { React, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MDEditor from "@uiw/react-md-editor";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useWeb3React } from "@web3-react/core";
import GSTArticlesBase from "web3/GSTArticles";
import GIPFSLogin from "./GIPFSLogin";
import ipfsupload from "api/ipfsupload";
import { def_ipfs_public_gateway } from "../module/utils/xdef";
import xhelp from "module/utils/xhelp";
import "./GPublishArticle.scss";

function GPublishArticle() {
  const { activate, account, chainId, active, library, deactivate } =
    useWeb3React();
  const { currentService, apiKey, apiSecret } = useSelector((s) => s.ipfs);
  var header = "Hello GameFi Society";
  const [content, setContent] = useState("**Hello GameFi Society**");
  const [publishState, setPublishState] = useState(0);
  const [step, setStep] = useState(0);
  const [stepMsgs, setStepMsgs] = useState([
    "PUBLISH ON IPFS",
    "PUBLISH ON CONTRACT",
  ]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [articleInfo, setArticleInfo] = useState({ name: "", cid: "" });

  useEffect(() => {
    setPublishState(0);
    setStep(0);
    return () => {
      setPublishState(0);
      setStep(0);
    };
  }, []);

  //
  const publishOnIPFS = () => {
    console.log("publish on ipfs", content);
    if (apiKey.length === 0 || apiSecret.length === 0) {
      alert("Please enter PROJECT KEY and PROJECT SECRET");
      return;
    }
    if (publishState === 1) {
      return;
    }
    //
    let new_content = xhelp.convertImageUrlFromIPFSToGFS(content);
    if (new_content.length === 0) {
      return;
    }
    //extract header
    const regXHeader = /(?<flag>#{1,6})\s+(?<content>.+)/g;
    const headers = Array.from(new_content.matchAll(regXHeader)).map(
      ({ groups: { flag, content } }) => ({
        header: `h${flag.length}`,
        content,
      })
    );
    if (headers.length > 0) {
      header = headers[0].content;
    }
    //
    setPublishState(1);
    if (currentService === "infura") {
      infuraUploadString(new_content);
    } else if (currentService === "fleek") {
      fleekUploadString(new_content);
    } else if (currentService === "pinata") {
      pinataUploadString(new_content);
    }
  };
  const infuraUploadString = (data) => {
    ipfsupload.infuraUpload(
      apiKey,
      apiSecret,
      data,
      (response) => {
        const cid = response.cid.toString();
        setPublishState(2);
        setStep(1);
        stepMsgs[0] = "PUBLISH ON IPFS SUCCEED \n" + "cid:" + cid;
        articleInfo.name = header;
        articleInfo.cid = cid;
        setArticleInfo({ ...articleInfo });
      },
      (err) => {
        setPublishState(0);
        setStep(0);
        stepMsgs[0] = "PUBLISH ON IPFS FAILED \n" + err;
      }
    );
  };

  const fleekUploadString = (data) => {
    ipfsupload.fleekUpload(
      apiKey,
      apiSecret,
      data,
      header,
      (response) => {
        const cid = response.hashV0;
        setPublishState(2);
        setStep(1);
        stepMsgs[0] = "PUBLISH ON IPFS SUCCEED \n" + "cid:" + cid;
        articleInfo.name = header;
        articleInfo.cid = cid;
        setArticleInfo({ ...articleInfo });
      },
      (err) => {
        setPublishState(0);
        setStep(0);
        stepMsgs[0] = "PUBLISH ON IPFS FAILED \n" + err;
      }
    );
  };

  const pinataUploadString = (data) => {
    ipfsupload.pinataUpload(
      apiKey,
      apiSecret,
      data,
      header,
      (response) => {
        const cid = response.IpfsHash;
        setPublishState(2);
        setStep(1);
        stepMsgs[0] = "PUBLISH ON IPFS SUCCEED \n" + "cid:" + cid;
        articleInfo.name = header;
        articleInfo.cid = cid;
        setArticleInfo({ ...articleInfo });
      },
      (err) => {
        setPublishState(0);
        setStep(0);
        stepMsgs[0] = "PUBLISH ON IPFS FAILED \n" + err;
      }
    );
  };
  ///
  const uploadImageOnIPFS = (event) => {
    if (apiKey.length === 0 || apiSecret.length === 0) {
      alert("Please enter PROJECT KEY and PROJECT SECRET");
      return;
    }
    if (uploadingImage === true) {
      return;
    }
    if (event.target.files && event.target.files[0]) {
      let data = event.target.files[0];
      setUploadingImage(true);
      console.log("uploadImageOnIPFS", data);
      if (currentService === "infura") {
        infuraUploadImage(data);
      } else if (currentService === "fleek") {
        fleekUploadImage(data);
      } else if (currentService === "pinata") {
        pinataUploadImage(data);
      }
    }
  };

  const pinataUploadImage = (data) => {
    let cache = uploadedImages.concat();
    ipfsupload.pinataUpload(
      apiKey,
      apiSecret,
      data,
      header,
      (response) => {
        const cid = response.IpfsHash;
        cache.push({ CID: cid });
        setUploadedImages(cache);
        setUploadingImage(false);
      },
      (err) => {
        setUploadingImage(false);
      }
    );
  };

  const fleekUploadImage = (data) => {
    let cache = uploadedImages.concat();
    ipfsupload.fleekUpload(
      apiKey,
      apiSecret,
      data,
      (response) => {
        const cid = response.hashV0;
        cache.push({ CID: cid });
        setUploadedImages(cache);
        setUploadingImage(false);
      },
      (err) => {
        setUploadingImage(false);
      }
    );
  };

  const infuraUploadImage = (data) => {
    let cache = uploadedImages.concat();
    ipfsupload.infuraUpload(
      apiKey,
      apiSecret,
      data,
      (response) => {
        const cid = response.cid.toString();
        cache.push({ CID: cid });
        setUploadedImages(cache);
        setUploadingImage(false);
      },
      (err) => {
        setUploadingImage(false);
      }
    );
  };
  //
  const publishiOnBlockchain = () => {
    if (articleInfo.name.length === 0 || articleInfo.cid.length === 0) {
      return;
    }
    if (publishState === 3) {
      return;
    }
    setPublishState(3);
    if (account) {
      GSTArticlesBase.creatArticle(
        library,
        account,
        articleInfo.name,
        articleInfo.cid
      )
        .then((res) => {
          console.log("creatArticle", res);
          if (res) {
            setPublishState(4);
            setStep(2);
            stepMsgs[1] = "PUBLISH ON BLOCKCHAIN SUCCEED";
          }
        })
        .catch((err) => {
          console.log(err, "err");
          stepMsgs[1] = "PUBLISH ON BLOCKCHAIN FAILED";
        });
    } else {
    }
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

  ///
  const renderUploadedImages = () => {
    return uploadedImages.map((item, index) => {
      return (
        <Box
          sx={{
            marginTop: "30px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
          key={"uploaded_image_" + index}
        >
          <img
            src={def_ipfs_public_gateway + "/ipfs/" + item.CID}
            width="80%"
            alt="uploadedImage"
          />
          <Typography
            sx={{
              width: "80%",
              fontSize: "12px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
              textAlign: "left",
            }}
          >
            {def_ipfs_public_gateway + "/ipfs/" + item.CID}
          </Typography>
        </Box>
      );
    });
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
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              width: "72%",
            }}
          >
            <MDEditor
              value={content}
              width={500}
              height={600}
              onChange={setContent}
            />
          </Box>
          <Box
            sx={{
              width: "22%",
              height: "600px",
            }}
          >
            <LoadingButton
              variant="contained"
              component="label"
              loading={uploadingImage}
            >
              Upload Image To IPFS
              <input
                hidden
                onChange={uploadImageOnIPFS}
                accept="image/*"
                multiple
                type="file"
              />
            </LoadingButton>
            {renderUploadedImages()}
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: "100%", marginTop: "20px" }}>
        <Stepper activeStep={step} alternativeLabel>
          {stepMsgs.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  whiteSpace: "pre-line",
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Button
        variant="contained"
        sx={{
          position: "relative",
          marginTop: "20px",
          width: "180px",
          height: "35px",
          borderRadius: "20px",
          fontSize: "14px",
          fontFamily: "Saira",
          fontWeight: "500",
          backgroundColor: "#006CF9",
        }}
        onClick={() => {
          if (publishState === 0) {
            publishOnIPFS();
          } else if (publishState === 2) {
            publishiOnBlockchain();
          }
        }}
      >
        {publishMsg()}
      </Button>
    </Box>
  );
}

export default GPublishArticle;
