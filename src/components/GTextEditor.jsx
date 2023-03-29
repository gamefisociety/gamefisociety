import { React, useState, forwardRef, useImperativeHandle } from "react";
import MDEditor from "@uiw/react-md-editor";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import ipfspublish from "api/ipfspublish";
import { def_ipfs_public_gateway } from "../module/utils/xdef";
import "./GTextEditor.scss";
const GTextEditor = forwardRef((props, ref) => {
  const [content, setContent] = useState("**IPFS TextEditor**");
  const [platools, setPlatools] = useState(["infura", "fleek", "pinata"]);
  const [curplat, setCurplat] = useState("infura");
  const [key, setKey] = useState("");
  const [secret, setSecret] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
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
      props.publishHandle("BEGIN");
      setPublishing(true);
      if (curplat === "infura") {
        infuraPublish();
      } else if (curplat === "fleek") {
        fleekPublish();
      } else if (curplat === "pinata") {
        pinataUploadString();
      }
    },
  }));

  const infuraPublish = () => {
    ipfspublish.infuraPublish(
      key,
      secret,
      content,
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

  const fleekPublish = () => {
    ipfspublish.fleekPublish(
      key,
      secret,
      content,
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

  const pinataUploadString = () => {
    ipfspublish.pinataUpload(
      key,
      secret,
      content,
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

  const uploadImageOnIPFS = (event) => {
    if (event.target.files && event.target.files[0]) {
      let data = event.target.files[0];
      console.log("uploadImage", data);
      if (curplat === "infura") {
      } else if (curplat === "fleek") {
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
    ipfspublish.pinataUpload(
      key,
      secret,
      formData,
      (response) => {
        cache.push(response);
        setUploadedImages(cache);
      },
      (err) => {}
    );
  };

  const platHref = () => {
    if (curplat === "infura") {
      return "https://app.infura.io/dashboard";
    } else if (curplat === "fleek") {
      return "https://app.fleek.co/";
    } else if (curplat === "pinata") {
      return "https://app.pinata.cloud/developers/api-keys";
    }
  };

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
            src={def_ipfs_public_gateway + "/ipfs/" + item.IpfsHash}
            width="80%"
            alt="uploadedImage"
          />
          <Typography
            sx={{
              width:"80%",
              fontSize: "12px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
              textAlign: "left",
            }}
          >
            {def_ipfs_public_gateway + "/ipfs/" + item.IpfsHash}
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
            <Button variant="contained" component="label">
              Upload Image To IPFS
              <input
                hidden
                onChange={(e) => uploadImageOnIPFS(e)}
                accept="image/*"
                multiple
                type="file"
              />
            </Button>
            {renderUploadedImages()}
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

export default GTextEditor;
