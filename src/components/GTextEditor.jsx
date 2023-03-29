import { React, useState, forwardRef, useImperativeHandle } from "react";
import MDEditor from "@uiw/react-md-editor";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import ipfsupload from "api/ipfsupload";
import { def_ipfs_public_gateway } from "../module/utils/xdef";
import xhelp from "module/utils/xhelp";
import "./GTextEditor.scss";
const GTextEditor = forwardRef((props, ref) => {
  const [content, setContent] = useState("**IPFS TextEditor**");
  const [platools, setPlatools] = useState(["infura", "fleek", "pinata"]);
  const [curplat, setCurplat] = useState("infura");
  const [key, setKey] = useState("");
  const [secret, setSecret] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  useImperativeHandle(ref, () => ({
    publishOnIPFS() {
      console.log("publish on ipfs", content);
      if (key.length === 0 || secret.length === 0) {
        alert("Please enter PROJECT KEY and PROJECT SECRET");
        return;
      }
      if (publishing) {
        return;
      }
      //
      let new_content = xhelp.convertImageUrlFromIPFSToGFS(content);
      if(new_content.length === 0){
        return;
      }
      //
      setPublishing(true);
      props.publishHandle("BEGIN");
      if (curplat === "infura") {
        infuraUploadString(new_content);
      } else if (curplat === "fleek") {
        fleekUploadString(new_content);
      } else if (curplat === "pinata") {
        pinataUploadString(new_content);
      }
    },
  }));
///
  const infuraUploadString = (data) => {
    ipfsupload.infuraUpload(
      key,
      secret,
      data,
      (response) => {
        const cid = response.cid.toString();
        setPublishing(false);
        props.publishHandle("SUCCESS", cid);
      },
      (err) => {
        setPublishing(false);
        props.publishHandle("FAILED", String(err));
      }
    );
  };

  const fleekUploadString = (data) => {
    ipfsupload.fleekUpload(
      key,
      secret,
      data,
      (response) => {
        const cid = response.hashV0;
        setPublishing(false);
        props.publishHandle("SUCCESS", cid);
      },
      (err) => {
        setPublishing(false);
        props.publishHandle("FAILED", String(err));
      }
    );
  };

  const pinataUploadString = (data) => {
    ipfsupload.pinataUpload(
      key,
      secret,
      data,
      (response) => {
        const cid = response.IpfsHash;
        setPublishing(false);
        props.publishHandle("SUCCESS", cid);
      },
      (err) => {
        setPublishing(false);
        props.publishHandle("FAILED", String(err));
      }
    );
  };
///
  const uploadImageOnIPFS = (event) => {
    if (key.length === 0 || secret.length === 0) {
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
      if (curplat === "infura") {
        infuraUploadImage(data);
      } else if (curplat === "fleek") {
        fleekUploadImage(data);
      } else if (curplat === "pinata") {
        pinataUploadImage(data);
      }
    }
  };

  const pinataUploadImage = (data) => {
    const formData = new FormData();
    formData.append("file", data);
    const metadata = JSON.stringify({
      name: data.name,
    });
    formData.append("pinataMetadata", metadata);
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);
    let cache = uploadedImages.concat();
    ipfsupload.pinataUpload(
      key,
      secret,
      formData,
      (response) => {
        const cid = response.IpfsHash;
        cache.push({"CID": cid});
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
      key,
      secret,
      data,
      (response) => {
        const cid = response.hashV0;
        cache.push({"CID": cid});
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
      key,
      secret,
      data,
      (response) => {
        const cid = response.cid.toString();
        cache.push({"CID": cid});
        setUploadedImages(cache);
        setUploadingImage(false);
      },
      (err) => {
        setUploadingImage(false);
      }
    );
  };

  ///
  const platHref = () => {
    if (curplat === "infura") {
      return "https://app.infura.io/dashboard";
    } else if (curplat === "fleek") {
      return "https://app.fleek.co/";
    } else if (curplat === "pinata") {
      return "https://app.pinata.cloud/developers/api-keys";
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
    <Box className="bg">
      <Typography
        sx={{
          fontSize: "15px",
          fontFamily: "Saira",
          fontWeight: "500",
          color: "#FFFFFF",
          textAlign: "left",
          lineHeight: "18px",
        }}
      >
        ⚠️ Notice ⚠️ - &nbsp;Please rest assured that we do not save or upload
        your project key or project secret, we only use them to obtain platform
        upload permissions.
      </Typography>
      <Box className="warpper">
        <div className="checkboxs">
          {platools.map((platool) => (
            <label className="label" key={platool}>
              <input
                className="checkbox"
                checked={curplat === platool}
                onChange={() => {
                  setCurplat(platool);
                  setKey("");
                  setSecret("");
                }}
                type="checkbox"
              />
              {platool}
            </label>
          ))}
        </div>
        <div className="keyblock">
          <div className="project">
            <p className="name">{"[" + curplat.toUpperCase() + "]"}</p>
            <Link
              sx={{
                marginTop: "5px",
              }}
              target="_blank"
              href={platHref()}
            >
              {"No project key, go " + curplat + " get it"}
            </Link>
          </div>

          <div className="keybox">
            <div className="pid">
              <p className="name">PROJECT KEY</p>
              <input
                type="text"
                className="name"
                value={key}
                onChange={(e) => {
                  console.log(e);
                  setKey(e.target.value);
                }}
                size="30"
              ></input>
            </div>
            <div className="pid">
              <p className="name">PROJECT SECRET</p>
              <input
                type="password"
                className="name"
                value={secret}
                onChange={(e) => {
                  console.log(e);
                  setSecret(e.target.value);
                }}
                size="30"
              ></input>
            </div>
          </div>
        </div>
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
            <LoadingButton variant="contained" component="label" loading={uploadingImage}>
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
    </Box>
  );
});

export default GTextEditor;
