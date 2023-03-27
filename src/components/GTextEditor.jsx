import { React, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
// import tpublish from "../module/tpublish";
import "./GTextEditor.scss";
function GTextEditor() {
  const [content, setContent] = useState('**IPFS TextEditor**');
  const [platools, setPlatools] = useState(['infura', 'fleek', 'pinata']);
  const [curplat, setCurplat] = useState('infura');
  const [key, setKey] = useState('');
  const [secret, setSecret] = useState('');
  const [msg, setMsg] = useState('');
  const [publishing, setPublishing] = useState(false);
  const onPublish = () => {
    console.log("publish to ipfs", content);
    if (key.length === 0 || secret.length === 0) {
      alert('Please enter PROJECT KEY and PROJECT SECRET');
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
    // if (curplat === "infura") {
    //   infuraPublish();
    // } else if (curplat === "fleek") {
    //   fleekPublish();
    // }else if(curplat === 'pinata'){
    //     pinataPublish();
    // }
  };

  // const infuraPublish = () => {
  //   tpublish.infuraPublish(
  //     key,
  //     secret,
  //     content,
  //     (response) => {
  //       const cid = response.cid.toString();
  //       setMsg("Success! CID: " + cid);
  //       setPublishing(false);
  //     },
  //     (err) => {
  //       setMsg(String(err));
  //       setPublishing(false);
  //     }
  //   );
  // };

  // const fleekPublish = () => {
  //   tpublish.fleekPublish(
  //     key,
  //     secret,
  //     content,
  //     (response) => {
  //       const cid = response.hashV0;
  //       setMsg("Success! CID: " + cid);
  //       setPublishing(false);
  //     },
  //     (err) => {
  //       setMsg(String(err));
  //       setPublishing(false);
  //     }
  //   );
  // };

  // const pinataPublish = () => {
  //   tpublish.pinataPublish(
  //     key,
  //     secret,
  //     content,
  //     (response) => {
  //       const cid = response.IpfsHash;
  //       setMsg("Success! CID: " + cid);
  //       setPublishing(false);
  //     },
  //     (err) => {
  //       setMsg(String(err));
  //       setPublishing(false);
  //     }
  //   );
  // };

  const platHref = () => {
    if(curplat === 'infura'){
        return 'https://app.infura.io/dashboard';
    }else if(curplat === 'fleek'){
        return 'https://app.fleek.co/'
    }else if(curplat === 'pinata'){
        return 'https://app.pinata.cloud/developers/api-keys';
    }
  }

  return (
    <div className="bg">
      <div className="warpper">
        <header className="header">IPFS TextEditor</header>
        <p className="notice">
          ⚠️ Notice ⚠️ - &nbsp;Please rest assured that we do not save or upload
          your project key or project secret, we only use them to obtain
          platform upload permissions.
        </p>
        <div className="checkboxs">
          {platools.map((platool) => (
            <label className="label" key={platool}>
              <input
                className="checkbox"
                checked={curplat === platool}
                onChange={() => {
                  setCurplat(platool);
                  setKey('');
                  setSecret('');
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
            <a
              rel="noreferrer"
              href={platHref()}
              target="_blank"
            >
              {"No project key, go " + curplat + " get it"}
            </a>
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
            {publishing === true ? 'PUBLISHING...' : 'PUBLISH TO IPFS'}
          </button>
        </div>
        <MDEditor value={content} height={400} onChange={setContent} />
        {/* <MDEditor.Markdown source={value} style={{ whiteSpace: "pre-wrap" }} /> */}
      </div>
    </div>
  );
}

export default GTextEditor;
