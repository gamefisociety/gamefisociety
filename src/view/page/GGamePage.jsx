import { React, useEffect, useState, useRef } from "react";
import { useLocation, Link, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { getListChainData } from "api/requestData";
import GProjectEditor from "components/GProjectEditor";
import closeImg from "./../../asset/image/social/close.png";
import "./GGamePage.scss";

const GGamePage = () => {
  const navigate = useNavigate();

  const [chainList, setChainList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const requsetData = () => {
    getListChainData().then((res) => {
      console.log(res.list, "res");
      setChainList(res.list);
    });
  };

  useEffect(() => {
    requsetData();
    // fetchAllNFTs();
    return () => {};
  }, []);

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
        {chainList.map((item, index) => {
          return (
            <Card className={"game_card"} key={"gamepage-card-index" + index}>
              <Avatar
                sx={{
                  width: "64px",
                  height: "64px",
                }}
                alt="Remy Sharp"
                src={item.icon}
              />
              <Typography
                sx={{
                  mt: "12px",
                }}
                color={"white"}
                variant={"body1"}
              >
                {item.name}
              </Typography>
              <Box sx={{ flexGrow: 1 }}></Box>
              <Button
                variant="contained"
                onClick={() => {
                  console.log(item);
                  navigate("/detail?name=" + item.name);
                }}
              >
                {"DETAIL"}
              </Button>
            </Card>
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
