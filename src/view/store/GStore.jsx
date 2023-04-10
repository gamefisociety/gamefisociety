import React, { useEffect } from "react";
import "./GStore.scss";

import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";

import GFTHead from "view/head/GFTHead";

const GIntroduce = () => {
  const navigate = useNavigate();
  useEffect(() => {
    return () => { };
  }, []);

  return (
    <Box className={'store_bg'}>
    </Box>
  );
};

export default GIntroduce;
