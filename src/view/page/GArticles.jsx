import { React, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { setIsOpen } from "module/store/features/dialogSlice";
import { useNavigate } from "react-router-dom";
import GPublishArticle from "components/GPublishArticle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import GSTArticlesBase from "web3/GSTArticles";
import xhelp from "module/utils/xhelp";
import { default_avatar } from "module/utils/xdef";
import "./GArticles.scss";
import closeImg from "./../../asset/image/social/close.png";
function GArticles() {
  const navigate = useNavigate();
  const { activate, account, chainId, active, library, deactivate } =
    useWeb3React();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [articleDatas, setArticleDatas] = useState([]);
  const [waittingDatas, setWaittingDatas] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
  ]);
  const [fetching, setFetching] = useState(false);
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
      if (fetching) {
        return;
      }
      setFetching(true);
      GSTArticlesBase.totalSupply(library)
        .then((res) => {
          console.log("totalSupply", res);
          if (res > 0) {
            fetchArticles(0, Number(res));
          } else {
            setFetching(false);
          }
        })
        .catch((err) => {
          setFetching(false);
          console.log(err, "err");
        });
    }
  };
  const fetchArticles = (index, count) => {
    if (account) {
      let articleCache = articleDatas.concat();
      GSTArticlesBase.getArticles(library, index, count)
        .then((res) => {
          setFetching(false);
          if (res && res.length > 0) {
            articleCache = articleCache.concat(res);
            articleCache.reverse();
            setArticleDatas(articleCache);
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
          {"Articles"}
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
          {"Create Article"}
        </Button>
      </Box>
    );
  };

  const renderArticleList = () => {
    return (
      <List
        sx={{
          marginLeft: "24px",
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
                  navigate("/article/"+item.cid, {
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
    );
  };

  const renderWaittingList = () => {
    return (
      <List
        sx={{
          marginLeft: "24px",
          width: "100%",
          height: "100%",
          overflow: "auto",
          backgroundColor: "transparent",
        }}
      >
        {waittingDatas.map((item, index) => {
          return (
            <Box
              key={"article" + index}
              sx={{
                marginTop: "40px",
                width: "700px",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton animation="wave" width={"90%"} />
              </Box>

              <Skeleton animation={false} width={"100%"} />
            </Box>
          );
        })}
      </List>
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
        backgroundColor: "rgba(27, 27, 27, 0.95)",
      }}
    >
      {renderTop()}
      {fetching === true ? renderWaittingList() : renderArticleList()}
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
