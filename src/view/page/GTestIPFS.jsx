import { React, useEffect, useState, useRef } from "react";
import "./GTestIPFS.scss";
import MDEditor from "@uiw/react-md-editor";
import Input from "@mui/material/Input";
import LoadingButton from "@mui/lab/LoadingButton";
import { catIPFSContent } from "../../api/requestData";
const ariaLabel = { "aria-label": "description" };
function GTestIPFS() {
  const [cid, setCID] = useState("");
  const [fetching, setFetching] = useState(false);
  const [content, setContent] = useState("");
  useEffect(() => {
    return () => {};
  }, []);

  const catContent = () => {
    if (cid.length === 0) {
        alert("CID is empty!")
      return;
    }
    if (fetching === true) {
      return;
    }
    setFetching(true);
    catIPFSContent(cid)
      .then((res) => {
        setFetching(false);
        if(typeof(res) === 'string'){
          setContent(res);
        }else if(typeof(res) === 'object'){
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
  return (
    <div className="container">
      <div className="layout">
        <div className="cid_block">
          <Input
            placeholder="CID"
            value={cid}
            onChange={handleInputChange}
            inputProps={ariaLabel}
          />
          <LoadingButton
            color="secondary"
            loading={fetching}
            variant="outlined"
            onClick={() => {
              catContent();
            }}
          >
            FETCH
          </LoadingButton>
        </div>
        <div className="content_block">
          <MDEditor.Markdown
            source={content}
            style={{ whiteSpace: "pre-wrap" }}
          />
        </div>
      </div>
    </div>
  );
}

export default GTestIPFS;
