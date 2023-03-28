import { React, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import ipfspublish from "api/ipfspublish";
import "./GTextEditor.scss";
function GTextEditor() {
  const [content, setContent] = useState("**IPFS TextEditor**");
  const [platools, setPlatools] = useState(["infura", "fleek", "pinata"]);
  const [curplat, setCurplat] = useState("infura");
  const [key, setKey] = useState("");
  const [secret, setSecret] = useState("");
  const [msg, setMsg] = useState("");
  const [publishing, setPublishing] = useState(false);
  const onPublish = () => {
    console.log("publish to ipfs", content);
    if (key.length === 0 || secret.length === 0) {
      alert("Please enter PROJECT KEY and PROJECT SECRET");
      return;
    }
    publishToIPFS();
  };
  const publishToIPFS = () => {
    if (publishing) {
      return;
    }
    setPublishing(true);
    setMsg("publishing...");
    if (curplat === "infura") {
      infuraPublish();
    } else if (curplat === "fleek") {
      fleekPublish();
    } else if (curplat === "pinata") {
      pinataPublish();
    }
  };

  const infuraPublish = () => {
    ipfspublish.infuraPublish(
      key,
      secret,
      content,
      (response) => {
        const cid = response.cid.toString();
        setMsg("Success! CID: " + cid);
        setPublishing(false);
      },
      (err) => {
        setMsg(String(err));
        setPublishing(false);
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
        setMsg("Success! CID: " + cid);
        setPublishing(false);
      },
      (err) => {
        setMsg(String(err));
        setPublishing(false);
      }
    );
  };

  const pinataPublish = () => {
    ipfspublish.pinataPublish(
      key,
      secret,
      content,
      (response) => {
        const cid = response.IpfsHash;
        setMsg("Success! CID: " + cid);
        setPublishing(false);
      },
      (err) => {
        setMsg(String(err));
        setPublishing(false);
      }
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
        <div className="buttonbox">
          {msg.length !== 0 ? <p className="textcid">{msg}</p> : undefined}
          <button
            className="buttonpublish"
            disabled={publishing}
            onClick={onPublish}
          >
            {publishing === true ? "PUBLISHING..." : "PUBLISH TO IPFS"}
          </button>
        </div>
        <MDEditor value={content} height={600} onChange={setContent} />
      </Box>
    </Box>
  );
}

export default GTextEditor;
