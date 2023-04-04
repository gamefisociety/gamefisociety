import { React, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import GProjectEditor from "components/GProjectEditor";
import icon_back from "../../asset/image/social/icon_back.png";
import copy from "copy-to-clipboard";
import "./GDetailProject.scss";
import ic_open_dapp from "../../asset/image/logo/ic_open_dapp.png";
import ic_report from "../../asset/image/logo/ic_report.png";
import ic_share from "../../asset/image/logo/ic_share.png";
import closeImg from "./../../asset/image/social/close.png";
function GDetailProject() {
  let location = useLocation();
  const navigate = useNavigate();
  const { projectInfo, tokenInfo, owner } = location.state;
  const [dialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    console.log(location.state);
    return () => {};
  }, []);

  const handleClickDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const copyUrlShare = () => {
    let url = window.location;
    copy(url.href);
  };

  const openClickLink = (url) => {
    window.open(url);
  };

  const editProject = () => {
    handleClickDialogOpen();
  };

  return (
    <div className="project_detail_bg">
      <Box
        sx={{
          width: "960px",
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
              color: "#FFFFFF",
            }}
          >
            {"Projects"}
          </Typography>
        </Box>
      </Box>
      <div className="layout">
        <div className="head_layout">
          <div className="product_layout">
            <img className="icon" src={projectInfo.thumb} alt="icon"></img>
            <div className="title_layout">
              <span className="title">{projectInfo.name}</span>
            </div>
          </div>
          <div className="right_layout">
            <div
              className="btn_open"
              onClick={() => openClickLink(projectInfo.website)}
            >
              <img className="img" src={ic_open_dapp} alt="dapp"></img>
              <span className="txt">Open dapp</span>
            </div>
            <div className="item_layout">
              <div className="share_btn" onClick={copyUrlShare}>
                <img className="img" src={ic_share} alt="share"></img>
                <span className="txt">Share</span>
              </div>
              <div className="share_btn">
                <img className="img" src={ic_report} alt="report"></img>
                <span className="txt">Report</span>
              </div>
            </div>
          </div>
        </div>
        <div className="tab_info_layout">
          <div className="overviewbg">
            <span className="overview">Overview</span>
          </div>

          {tokenInfo.owner === owner ? (
            <span className="btn_un" onClick={editProject}>
              Edit
            </span>
          ) : null}
        </div>
        <div className="info_layout">
          <div className="info_content">
            <span className="title">About {projectInfo.name}</span>
            <span className="desc">{projectInfo.description}</span>
            <span className="moreBtn">Read more.</span>
            <div className="item_fc_layout">
              <span className="name2">Social</span>
              {projectInfo.twitter && (
                <div
                  className="icon_twitter"
                  onClick={() => openClickLink(projectInfo.twitter)}
                ></div>
              )}
              {projectInfo.discord && (
                <div
                  className="icon_discord"
                  onClick={() => openClickLink(projectInfo.discord)}
                ></div>
              )}
              {projectInfo.reddit && (
                <div
                  className="icon_reddit"
                  onClick={() => openClickLink(projectInfo.reddit)}
                ></div>
              )}
              {projectInfo.github && (
                <div
                  className="icon_github"
                  onClick={() => openClickLink(projectInfo.github)}
                ></div>
              )}
              {projectInfo.telegram && (
                <div
                  className="icon_telegram"
                  onClick={() => openClickLink(projectInfo.telegram)}
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Drawer anchor={"bottom"} open={dialogOpen} onClose={handleDialogClose}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "#0F0F0F",
          }}
        >
          <Button
            className="button"
            sx={{
              position: "absolute",
              top: "0px",
              right: "20px",
              width: "60px",
              height: "60px",
              zIndex: 10,
            }}
            onClick={() => {
              handleDialogClose();
            }}
          >
            <img src={closeImg} width="60px" alt="close" />
          </Button>
          <GProjectEditor info={projectInfo} />
        </Box>
      </Drawer>
    </div>
  );
}

export default GDetailProject;
