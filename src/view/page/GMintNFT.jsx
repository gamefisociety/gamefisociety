import { React, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { catIPFSContent } from "api/requestData";
import {
  isCheckIn,
  setOpenCheckIn,
  setIsOpen,
  setOpenMintAvatar,
} from "module/store/features/dialogSlice";
import GSTAvatarNFTBase from "web3/GSTAvatarNFT";
import "./GMintNFT.scss";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import bg_partwo_polygon from "../../asset/image/introduce/bg_partwo_polygon.png";
import logo_link from "../../asset/image/social/logo_link.png";
import logo_twitter from "../../asset/image/introduce/logo_twitter.png";
import logo_discord from "../../asset/image/introduce/logo_discord.png";
import logo_tele from "../../asset/image/introduce/logo_tele.png";
import footer_logo from "../../asset/image/logo/footer_logo.png";
const contract = "0xBD2e21a8b6F5B98ae8514259eC9f663cC1E617f8";
const GMintNFT = () => {
  const { activate, account, chainId, active, library, deactivate } =
    useWeb3React();
  const [nftInfo, setNFTInfo] = useState({
    image: "",
    name: "",
    description: "some descriptions about avatar nft",
  });
  const [loading, setLoading] = useState(false);
  const [checkState, setCheckState] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    fetchNftInfo();
    if (account) {
      avatarBalance();
    }
    return () => {};
  }, [account]);

  const fetchNftInfo = () => {
    const cidFile =
      "QmWaKFChNnsK6WENY43hn7nvYefSLeuPuj4q2TcGZPQkQg/IsaacAvatar.json";
    catIPFSContent(cidFile)
      .then((res) => {
        console.log(res, "nftBaseURLData");
        let t_img_url =
          "https://cloudflare-ipfs.com/ipfs/" +
          res.image.replace("ipfs://", "");
        // nftInfo.description = res.description;
        nftInfo.image = t_img_url;
        nftInfo.name = res.description;
        setNFTInfo({
          ...nftInfo,
        });
      })
      .catch((err) => {
        console.log(err, "nftBaseURLData");
      });
  };

  const avatarBalance = () => {
    if (account) {
      GSTAvatarNFTBase.getTokenBalanceOf(contract, library, account)
        .then((res) => {
          if (res > 0) {
            setCheckState(1);
          }
        })
        .catch((err) => {
          setCheckState(2);
          console.log(err, "err");
        });
    } else {
      return 0;
    }
  };

  const mintAvatar = () => {
    if (checkState !== 0) {
      return;
    }
    if (loading === true) {
      return;
    }
    if (account) {
      setLoading(true);
      GSTAvatarNFTBase.mintAvatar(library, account)
        .then((res) => {
          console.log(res, "res");
          setCheckState(1);
          setLoading(false);
        })
        .catch((err) => {
          setCheckState(2);
          setLoading(false);
          console.log(err, "err");
        });
    } else {
      return 0;
    }
  };

  const mintNFTMsg = () => {
    if (checkState === 0) {
      return "Mint";
    } else if (checkState === 1) {
      return "Minted!";
    } else if (checkState === 2) {
      return "Wrong!";
    }
  };

  const renderHeader = () => {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            width: "1172px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img src={footer_logo} width="200px" alt="footer_logo" />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Typography
              sx={{
                marginTop: "-20px",
                marginRight: "20px",
                fontSize: "15px",
                fontFamily: "Saira",
                fontWeight: "500",
                color: "#FFFFFF",
              }}
            >
              {"Polygon Mainnet"}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                marginTop: "-20px",
              }}
              onClick={() => {
                if (account) {
                } else {
                  dispatch(setIsOpen(true));
                }
              }}
            >
              <Typography
                sx={{
                  fontSize: "15px",
                  fontFamily: "Saira",
                  fontWeight: "500",
                  color: "#FFFFFF",
                }}
              >
                {!account
                  ? "Connect Wallet"
                  : account.substring(0, 5) +
                    "....." +
                    account.substring(account.length - 5, account.length)}
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };
  return (
    <Box
      sx={{
        // flexGrow: 1,
        width: "100%",
        minHeight: "1000px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#0F0F0F",
      }}
    >
      {renderHeader()}
      <img
        className="headerImg"
        src={bg_partwo_polygon}
        alt="bg_partwo_polygon"
      />
      <Box
        sx={{
          marginTop: "-60px",
          width: "1080px",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            width: "45%",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <img className="avatar" src={nftInfo.image} alt="nftInfo_img" />
          <Typography
            sx={{
              marginTop: "20px",
              fontSize: "28px",
              fontFamily: "Saira",
              fontWeight: "600",
              lineHeight: "28px",
              color: "#FFFFFF",
            }}
          >
            {nftInfo.name}
          </Typography>
          <Typography
            sx={{
              marginTop: "20px",
              fontSize: "20px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#FFFFFF",
            }}
          >
            {nftInfo.description}
          </Typography>
          <Box
            sx={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <Typography
              sx={{
                height: "20px",
                fontSize: "16px",
                fontFamily: "Saira",
                fontWeight: "500",
                color: "#919191",
              }}
            >
              {"CONTRACT LINK"}
            </Typography>
            <Box
              sx={{
                height: "20px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <img src={logo_link} width="20px" alt="link" />
              <Button
                sx={{
                  fontColor: "#85BBE6",
                }}
                href={
                  "https://polygonscan.com/token/0xbd2e21a8b6f5b98ae8514259ec9f663cc1e617f8"
                }
                component={Link}
              >
                {"0xbd2e21a8b6f5b98ae8514259ec9f663cc1e617f8"}
              </Button>
            </Box>
          </Box>

          <Typography
            sx={{
              marginTop: "20px",
              height: "20px",
              fontSize: "16px",
              fontFamily: "Saira",
              fontWeight: "500",
              color: "#919191",
            }}
          >
            {"Follow the steps to get more GameFi Society NFTs"}
          </Typography>
          <ul>
            <li className="step">Join our community.</li>
            <li className="step">Fill out the google form.</li>
            <li className="step">Mint Isaac Avatar NFT.</li>
          </ul>
        </Box>
        <Box
          sx={{
            width: "40%",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "#FFFFFF",
            borderRadius: "18px",
            paddingLeft: "30px",
            paddingRight: "30px",
          }}
        >
          <Box
            sx={{
              marginTop: "10px",
              width: "100%",
              height: "50px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              borderBottom: 1,
              borderColor: "#E7E9ED",
            }}
          >
            <Typography
              sx={{
                fontSize: "18px",
                fontFamily: "Saira",
                fontWeight: "500",
                color: "#0F0F0F",
              }}
            >
              {"Join our community"}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "60px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: 1,
              borderColor: "#E7E9ED",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <img src={logo_twitter} width="25px" alt="logo_twitter" />
              <Typography
                sx={{
                  marginLeft: "10px",
                  fontSize: "14px",
                  fontFamily: "Saira",
                  fontWeight: "500",
                  color: "#0F0F0F",
                }}
              >
                {"Twitter(@GameFi_Society)"}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                const w = window.open("about:blank");
                w.location.href = "https://twitter.com/GameFi_Society";
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontFamily: "Saira",
                  fontWeight: "500",
                  color: "#85BBE6",
                }}
              >
                {"Connect"}
              </Typography>
            </Button>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "60px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: 1,
              borderColor: "#E7E9ED",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <img src={logo_discord} width="25px" alt="logo_discord" />
              <Typography
                sx={{
                  marginLeft: "10px",
                  fontSize: "14px",
                  fontFamily: "Saira",
                  fontWeight: "500",
                  color: "#0F0F0F",
                }}
              >
                {"Discord"}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                const w = window.open("about:blank");
                w.location.href = "https://discord.gg/fWvn6k2J6k";
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontFamily: "Saira",
                  fontWeight: "500",
                  color: "#85BBE6",
                }}
              >
                {"Connect"}
              </Typography>
            </Button>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "60px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: 1,
              borderColor: "#E7E9ED",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <img src={logo_tele} width="25px" alt="logo_tele" />
              <Typography
                sx={{
                  marginLeft: "10px",
                  fontSize: "14px",
                  fontFamily: "Saira",
                  fontWeight: "500",
                  color: "#0F0F0F",
                }}
              >
                {"Telegram"}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                const w = window.open("about:blank");
                w.location.href = "https://t.me/+zIWIDNkzWuBlYzNl";
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontFamily: "Saira",
                  fontWeight: "500",
                  color: "#85BBE6",
                }}
              >
                {"Connect"}
              </Typography>
            </Button>
          </Box>
          <Box
            sx={{
              marginTop: "10px",
              width: "100%",
              height: "50px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              borderBottom: 1,
              borderColor: "#E7E9ED",
            }}
          >
            <Typography
              sx={{
                fontSize: "18px",
                fontFamily: "Saira",
                fontWeight: "500",
                color: "#0F0F0F",
              }}
            >
              {"Fill out the google form"}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "60px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: 1,
              borderColor: "#E7E9ED",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Typography
                sx={{
                  marginLeft: "10px",
                  fontSize: "14px",
                  fontFamily: "Saira",
                  fontWeight: "500",
                  color: "#0F0F0F",
                }}
              >
                {"Google Form"}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                const w = window.open("about:blank");
                w.location.href =
                  "https://docs.google.com/forms/d/e/1FAIpQLSf6NpFoBG0qR2uhCIy0HHOJjOUiUDzYlXjUdYqBXE_Z4TWTLw/viewform?usp=sf_link";
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontFamily: "Saira",
                  fontWeight: "500",
                  color: "#85BBE6",
                }}
              >
                {"Connect"}
              </Typography>
            </Button>
          </Box>
          <Box
            sx={{
              marginTop: "10px",
              width: "100%",
              height: "50px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              borderBottom: 1,
              borderColor: "#E7E9ED",
            }}
          >
            <Typography
              sx={{
                fontSize: "18px",
                fontFamily: "Saira",
                fontWeight: "500",
                color: "#0F0F0F",
              }}
            >
              {"Mint Avatar NFT"}
            </Typography>
          </Box>
          <Box
            sx={{
              marginTop: "20px",
              marginBottom: "20px",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LoadingButton
              sx={{ width: "140px", height: "40px" }}
              //   color="secondary"
              loading={loading}
              disabled={checkState === 1}
              variant="contained"
              size="large"
              onClick={() => {
                if (account) {
                  mintAvatar();
                } else {
                  dispatch(setIsOpen(true));
                }
              }}
            >
              {mintNFTMsg()}
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GMintNFT;
