import React, { useEffect, useState, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, CardActionArea, CardActions } from "@mui/material";
import GSTAvatarNFTBase from "../web3/GSTAvatarNFT";
import {def_ipfs_public_gateway} from "../module/utils/xdef"
import { catIPFSContent } from "api/requestData";
import "./GCardMintNFT.scss";

const GCardMintNFT = (props) => {
  const { contract } = props;
  const { activate, account, chainId, active, library } = useWeb3React();
  const [nftInfo, setNFTInfo] = useState({
    image: "",
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [checkState, setCheckState] = useState(0);

  useEffect(() => {
    return () => {
      name();
      nftBaseURL();
      avatarBalance();
    };
  }, []);

  const nftBaseURL = () => {
    if (account) {
      GSTAvatarNFTBase.baseURL(contract, library)
        .then((res) => {
          console.log("baseURL", res);
          if (typeof res == "string" && res.length > 0) {
            let t_url = res.replace("https://gateway.pinata.cloud/ipfs/", "");
            catIPFSContent(t_url)
              .then((res) => {
                console.log(res, "nftBaseURLData");
                let t_img_url =
                  def_ipfs_public_gateway + "/ipfs/" +
                  res.image.replace("ipfs://", "");
                nftInfo.description = res.description;
                nftInfo.image = t_img_url;
                setNFTInfo({
                  ...nftInfo,
                });
              })
              .catch((err) => {
                console.log(err, "nftBaseURLData");
              });
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    } else {
      return 0;
    }
  };

  const name = () => {
    if (account) {
      GSTAvatarNFTBase.name(contract, library)
        .then((res) => {
          if (typeof res == "string" && res.length > 0) {
            nftInfo.name = res;
            setNFTInfo({ ...nftInfo });
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    } else {
      return 0;
    }
  };

  const avatarBalance = () => {
    if (account) {
      GSTAvatarNFTBase.getTokenBalanceOf(contract, library, account)
        .then((res) => {
          if (res > 0) {
            setCheckState(3);
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
    } else if (checkState === 3) {
      return "Minted!";
    }
  };

  return (
    <Card
      sx={{
        width: "300px",
        height: "400px",
        borderRadius: "4px",
        backgroundColor: "gray",
      }}
    >
      <CardActionArea
        sx={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: "164px", height: "164px", borderRadius: "4px" }}
          src={nftInfo.image}
        />
        {/* <Typography
          color={"white"}
          variant={"body1"}
        >
          {nftInfo.description}
        </Typography> */}
        <Typography sx={{ marginTop: "60px" }} color={"white"} variant={"h6"}>
          {nftInfo.name}
        </Typography>
      </CardActionArea>
      <LoadingButton
        sx={{ marginTop: "20px" }}
        color="secondary"
        loading={loading}
        disabled={checkState !== 0}
        variant="contained"
        size="large"
        onClick={() => {
          mintAvatar();
        }}
      >
        {mintNFTMsg()}
      </LoadingButton>
    </Card>
  );
};

export default React.memo(GCardMintNFT);
