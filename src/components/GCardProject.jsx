import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Button, Link } from "@mui/material";
import { catIPFSContent } from "api/requestData";
import { def_ipfs_public_gateway } from "module/utils/xdef";
import "./GCardProject.scss";
//
const GCardProject = (props) => {
  let fetching = false;
  const navigate = useNavigate();
  const { tokenInfo, owner } = props;
  const [projectInfo, setProjectInfo] = useState({});
  useEffect(() => {
    catContent();
    return () => {};
  }, [props]);

  const catContent = () => {
    if (tokenInfo.cid.length === 0) {
      alert("CID is empty!");
      return;
    }
    if (fetching === true) {
      return;
    }
    fetching = true;
    catIPFSContent(tokenInfo.cid)
      .then((res) => {
        console.log("catIPFSContent", res);
        fetching = false;
        let t_res = "";
        if (typeof res === "string" || res instanceof String) {
          t_res = res;
        } else if (typeof res === "object") {
          t_res = res.content;
        }
        //
        console.log("project info string", t_res);
        t_res = t_res.replace("gamefi society projects ", "");
        const itemStr = t_res.replaceAll("gamefisociety/temp/image", def_ipfs_public_gateway)
        let t_item = JSON.parse(itemStr);
        if(t_item){
          setProjectInfo(t_item);
        }
        console.log(res);
      })
      .catch((err) => {
        fetching = false;
        console.log(err);
      });
  };

  return (
    <Card className={"project_card"}>
      <Avatar
        sx={{
          width: "64px",
          height: "64px",
        }}
        alt="Remy Sharp"
        src={projectInfo.thumb}
      />
      <Typography
        sx={{
          mt: "12px",
        }}
        color={"white"}
        variant={"body1"}
      >
        {projectInfo.name}
      </Typography>
      <Box sx={{ flexGrow: 1 }}></Box>
      <Button
        variant="contained"
        onClick={() => {
          console.log(projectInfo);
          navigate("/game/"+projectInfo.name, {
            state: {
              projectInfo: projectInfo,
              tokenInfo: tokenInfo,
              owner: owner
            },
          });
        }}
      >
        {"DETAIL"}
      </Button>
    </Card>
  );
};

export default React.memo(GCardProject);
