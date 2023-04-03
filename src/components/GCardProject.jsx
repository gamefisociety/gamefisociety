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
  const { cid, owner } = props;
  const [projectInfo, setProjectInfo] = useState({});
  useEffect(() => {
    catContent();
    return () => {};
  }, [props]);

  const catContent = () => {
    if (cid.length === 0) {
      alert("CID is empty!");
      return;
    }
    if (fetching === true) {
      return;
    }
    fetching = true;
    catIPFSContent(cid)
      .then((res) => {
        console.log("catContent", res);
        fetching = false;
        let t_res = "";
        if (typeof res === "string" || res instanceof String) {
          t_res = res;
        } else if (typeof res === "object") {
          t_res = res.content;
        }
        //
        t_res = t_res.replaceAll("gamefisociety/temp/image", def_ipfs_public_gateway)
        let t_item = JSON.parse(t_res);
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
  // thumb: "",
  //   name: "",
  //   description: "",
  //   chainAddress: "",
  //   website: "",
  //   twitter: "",
  //   discord: "",
  //   reddit: "",
  //   telegram: "",
  //   github: "",

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
          navigate("/detailproject", {
            state: {
              info: projectInfo,
              owner: owner
            },
          });
          // navigate("/detail?name=" + item.name);
        }}
      >
        {"DETAIL"}
      </Button>
    </Card>
  );
};

export default React.memo(GCardProject);
