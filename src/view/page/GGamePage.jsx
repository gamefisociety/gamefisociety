import { React, useEffect, useState, useRef } from "react";
import { useLocation, Link, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { setIsOpen } from "module/store/features/dialogSlice";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import GSTProjectsBase from "web3/GSTProjects";
import GCardProject from "components/GCardProject";
import GProjectEditor from "components/GProjectEditor";
import closeImg from "./../../asset/image/social/close.png";
import "./GGamePage.scss";

const GGamePage = () => {
  const navigate = useNavigate();
  const { activate, account, chainId, active, library, deactivate } =
    useWeb3React();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [projectDatas, setProjectDatas] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (account) {
      setProjectDatas([]);
      getAllProjects();
    } else {
      dispatch(setIsOpen(true));
    }
    return () => {
      setProjectDatas([]);
    };
  }, [account]);

  const getAllProjects = () => {
    if (account) {
      GSTProjectsBase.totalSupply(library)
        .then((res) => {
          console.log("totalSupply", res);
          if (res > 0) {
            fetchProjects(0, Number(res));
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    } else {
      return 0;
    }
  };
  const fetchProjects = (index, count) => {
    if (account) {
      let projectCache = projectDatas.concat();
      GSTProjectsBase.getProjects(library, index, count)
        .then((res) => {
          if (res && res.length > 0) {
            projectCache = projectCache.concat(res);
            projectCache.reverse();
            setProjectDatas(projectCache);
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    } else {
      return 0;
    }
  };

  const handleClickDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const renderGamesTop = () => {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            py: "12px",
            pl: "24px",
          }}
          color={"white"}
          variant={"h6"}
          align={"left"}
        >
          {"Game Projects"}
        </Typography>
        <Button
          variant="contained"
          sx={{
            marginRight: "24px",
            width: "160px",
            height: "35px",
            borderRadius: "20px",
            backgroundColor: "#006CF9",
            fontSize: "14px",
            fontFamily: "Saira",
            fontWeight: "500",
          }}
          onClick={handleClickDialogOpen}
        >
          {"Create Project"}
        </Button>
      </Box>
    );
  };

  return (
    <Paper className={"main_game_bg"}>
      {renderGamesTop()}
      <Box className={"game_card_contain"}>
        {projectDatas.map((item, index) => {
          return (
            <GCardProject cid={item.cid} key={"project-card-" + index}/>
          );
        })}
      </Box>
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
          <GProjectEditor />
        </Box>
      </Drawer>
    </Paper>
  );
};

export default GGamePage;
