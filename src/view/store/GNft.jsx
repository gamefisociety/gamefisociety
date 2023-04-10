import React, { useEffect } from "react";
import "./GNft.scss";

import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";

const GNft = () => {
  //
  const navigate = useNavigate();

  //
  useEffect(() => {
    return () => { };
  }, []);

  return (
    <Box className={'nft_bg'}>
    </Box>
  );
};

export default GNft;
