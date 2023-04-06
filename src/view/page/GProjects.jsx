import { React, useEffect, useState, useRef } from "react";
import { useLocation, Link, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { setIsOpen } from "module/store/features/dialogSlice";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import GSTProjectsBase from "web3/GSTProjects";
import GCardProject from "components/GCardProject";
import GProjectEditor from "components/GProjectEditor";
import closeImg from "./../../asset/image/social/close.png";
import "./GProjects.scss";

const GProjects = () => {
  const navigate = useNavigate();
  const { activate, account, chainId, active, library, deactivate } =
    useWeb3React();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [projectDatas, setProjectDatas] = useState([]);
  const [waittingDatas, setWaittingDatas] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [fetching, setFetching] = useState(false);
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
      if (fetching) {
        return;
      }
      setFetching(true);
      GSTProjectsBase.totalSupply(library)
        .then((res) => {
          console.log("totalSupply", res);
          if (res > 0) {
            fetchProjects(0, Number(res));
          } else {
            setFetching(false);
          }
        })
        .catch((err) => {
          setFetching(false);
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
          setFetching(false);
          if (res && res.length > 0) {
            projectCache = projectCache.concat(res);
            projectCache.reverse();
            setProjectDatas(projectCache);
            console.log(res);
          }
        })
        .catch((err) => {
          setFetching(false);
          console.log(err, "err");
        });
    } else {
      setFetching(false);
      return 0;
    }
  };

  const handleClickDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const renderTop = () => {
    return (
      <Box
        sx={{
          marginTop: "40px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "16px",
            fontFamily: "Saira",
            fontWeight: "500",
            color: "#FFFFFF",
            textAlign: "center",
            marginLeft: "24px",
          }}
        >
          {"Projects"}
        </Typography>
        <Button
          variant="contained"
          sx={{
            marginLeft: "20px",
            width: "140px",
            height: "30px",
            borderRadius: "10px",
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

  const renderProjectCards = () => {
    return (
      <Box
        sx={{
          paddingTop: "24px",
          paddingLeft: "24px",
          paddingRight: "24px",
          width: "calc( 100% - 48px)",
          display: "flex",
          flexWrap: "wrap",
          gridGap: "32px",
          gap: "32px",
        }}
      >
        {projectDatas.map((item, index) => {
          return (
            <GCardProject
              tokenInfo={item}
              owner={account}
              key={"project-card-" + index}
            />
          );
        })}
      </Box>
    );
  };

  const renderWaittingCards = () => {
    return (
      <Box className={"project_card_contain"}>
        {waittingDatas.map((item, index) => {
          return (
            <Stack
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
              key={"project_waitting_" + index}
              spacing={1}
            >
              <Skeleton variant="circular" width={60} height={60} />
              <Skeleton variant="rectangular" width={214} height={60} />
              <Skeleton variant="rounded" width={214} height={60} />
            </Stack>
          );
        })}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: "760px",
        minHeight: "1000px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        pointerEvents: "all",
        backgroundColor: "rgba(0, 0, 0, 0.708)",
      }}
    >
      {renderTop()}
      {fetching === true ? renderWaittingCards() : renderProjectCards()}
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
    </Box>
  );
};

export default GProjects;
