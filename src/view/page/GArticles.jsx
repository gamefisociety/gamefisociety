import { React, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { setIsOpen } from "module/store/features/dialogSlice";
import GPublishArticle from "components/GPublishArticle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import { default_avatar } from "module/utils/xdef";
import xhelp from "module/utils/xhelp";
import { useNavigate } from "react-router-dom";
import "./GArticles.scss";
import GSTArticlesBase from "web3/GSTArticles";
import closeImg from "./../../asset/image/social/close.png";
function GArticles() {
  const navigate = useNavigate();
  const { activate, account, chainId, active, library, deactivate } =
    useWeb3React();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [articleDatas, setArticleDatas] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (account) {
      setArticleDatas([]);
      getAllArticles();
    } else {
      dispatch(setIsOpen(true));
    }
    return () => {
      setArticleDatas([]);
    };
  }, [account]);
  const getAllArticles = () => {
    if (account) {
      GSTArticlesBase.totalSupply(library)
        .then((res) => {
          console.log("totalSupply", res);
          if (res > 0) {
            fetchArticles(0, Number(res));
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    } else {
      return 0;
    }
  };
  const fetchArticles = (index, count) => {
    if (account) {
      let articleCache = articleDatas.concat();
      GSTArticlesBase.getArticles(library, index, count)
        .then((res) => {
          if (res && res.length > 0) {
            articleCache = articleCache.concat(res);
            articleCache.reverse();
            setArticleDatas(articleCache);
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

  return (
    <Box
      sx={{
        width: "960px",
        minHeight: "1000px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        pointerEvents: "all",
        // backgroundColor: "red",
      }}
    >
      <Box
        sx={{
          marginTop: "60px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Button
          variant="contained"
          sx={{
            marginRight: "50px",
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
          {"Create Article"}
        </Button>
      </Box>
      <List
        sx={{
          marginTop: "50px",
          width: "100%",
          height: "100%",
          overflow: "auto",
          backgroundColor: "transparent",
        }}
      >
        {articleDatas.map((item, index) => {
          return (
            <Box
              key={"article" + index}
              sx={{
                marginTop: "30px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
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
                <Avatar
                  className="avatar"
                  sx={{ width: "40px", height: "40px" }}
                  alt="Avatar"
                  src={default_avatar}
                  onClick={() => {}}
                />
                <Typography
                  sx={{
                    marginLeft: "10px",
                    fontSize: "18px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                    color: "#FFFFFF",
                    textAlign: "left",
                  }}
                >
                  {item.addr.substring(0, 5) +
                    "....." +
                    item.addr.substring(item.addr.length - 5, item.addr.length)}
                </Typography>
                <Typography
                  sx={{
                    ml: "30px",
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                  }}
                  color="#666666"
                >
                  {xhelp.formateSinceTime(item.timestamp * 1000)}
                </Typography>
              </Box>
              <Box
                className="boxClick"
                sx={{
                  marginTop: "10px",
                  marginLeft: "48px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
                onClick={() => {
                  navigate("/detailarticle", {
                    state: {
                      name: item.name,
                      cid: item.cid,
                      timestamp: item.timestamp,
                    },
                  });
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                    color: "#FFFFFF",
                    textAlign: "left",
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  sx={{
                    marginTop: "5px",
                    fontSize: "14px",
                    fontFamily: "Saira",
                    fontWeight: "500",
                    color: "#919191",
                    textAlign: "left",
                  }}
                >
                  {"CID: " + item.cid}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </List>
      <Drawer anchor={"bottom"} open={dialogOpen} onClose={handleDialogClose}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            minHeight: "1000px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "#0F0F0F",
            // backgroundColor: "red",
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
          <GPublishArticle />
        </Box>
      </Drawer>
    </Box>
  );
}

export default GArticles;
