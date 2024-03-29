import { React, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "./GDetailArticle.scss";
import MDEditor from "@uiw/react-md-editor";
import xhelp from "module/utils/xhelp";
import icon_back from "../../asset/image/social/icon_back.png";
import { catIPFSContent } from "../../api/requestData";
function GDetailArticle() {
  const location = useLocation();
  const navigate = useNavigate();
  console.log("GProfile enter", location);
  const { name, cid, timestamp } = location.state;
  const [fetching, setFetching] = useState(false);
  const [content, setContent] = useState("");
  useEffect(() => {
    setFetching(false);
    catContent();
    return () => {
      setFetching(false);
    };
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
        console.log("catContent", res);
        setFetching(false);
        let t_res = "";
        if (typeof res === "string" || res instanceof String) {
          t_res = res;
        } else if (typeof res === "object") {
          t_res = res.content;
        }
        //
        let new_content = xhelp.convertImageUrlFromGFSToIPFS(t_res);
        setContent(new_content);
        console.log(res);
      })
      .catch((err) => {
        setFetching(false);
        console.log(err);
      });
  };

  return (
    <Box
      className={"container"}
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
              fontSize: "16px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#666666",
            }}
          >
            {"Articles"}
          </Typography>
        </Box>
      </Box>
      {/* <Typography
        sx={{
          fontSize: "18px",
          fontFamily: "Saira",
          fontWeight: "500",
          color: "#FFFFFF",
          textAlign: "left",
        }}
      >
        {name}
      </Typography> */}
      <Typography
        sx={{
          width: "100%",
          textAlign: "right",
          fontSize: "14px",
          fontFamily: "Saira",
          fontWeight: "500",
        }}
        color="#666666"
      >
        {xhelp.formateSinceTime(timestamp * 1000)}
      </Typography>
      <Box
        sx={{
          marginTop: "10px",
          marginBottom: "40px",
          width: "100%",
          height: "100%",
          minHeight: "1000px",
          paddingTop: "40px",
          paddingBottom: "60px",
          paddingLeft: "80px",
          paddingRight: "80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "#FFFFFF",
          // borderColor: "#D0D7DF",
          borderRadius: "6px"
        }}
      >
        <MDEditor.Markdown
          source={content}
          style={{
            whiteSpace: "pre-wrap",
            width: "100%",
            // height: "100%",
            // padding: "20px",
            // display: "flex",
            // flexDirection: "column",
            // alignItems: "center",
            // justifyContent: "flex-start",
          }}
        />
      </Box>
    </Box>
  );
}

export default GDetailArticle;
