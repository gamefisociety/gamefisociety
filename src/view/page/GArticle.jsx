import { React, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "./GArticle.scss";
import MDEditor from "@uiw/react-md-editor";
import icon_back from "../../asset/image/social/icon_back.png";
import { catIPFSContent } from "../../api/requestData";
function GArticle() {
  const location = useLocation();
  const navigate = useNavigate();
  console.log("GProfile enter", location);
  const { name, cid, timestamp } = location.state;
  const [fetching, setFetching] = useState(false);
  const [content, setContent] = useState("");
  useEffect(() => {
    catContent();
    return () => {};
  }, []);

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

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "960px",
        minHeight: "1000px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: "24px",
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
        <Box
          className={"boxClick"}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
          onClick={() => {
            navigate(-1);
          }}
        >
          <img src={icon_back} width="38px" alt="icon_back" />
          <Typography
            sx={{
              marginLeft: "5px",
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
          >
            {"Global"}
          </Typography>
        </Box>
      </Box>

      <MDEditor.Markdown source={content} style={{marginTop: "30px", whiteSpace: "pre-wrap" }} />
    </Box>
    // <div className="container">
    //   <div className="layout">
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

export default GArticle;
