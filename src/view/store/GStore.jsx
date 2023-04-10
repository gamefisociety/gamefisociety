import React, { useEffect } from "react";
import "./GStore.scss";

import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";

import GBanner from 'view/store/GBanner';

const GStore = () => {
  //
  const navigate = useNavigate();

  useEffect(() => {
    return () => { };
  }, []);

  const renderBanner = () => {
    return <GBanner />;
  }

  const renderHot = () => {
    return (
      <Box className={'store_hot_bg'}>
      </Box>
    );
  }

  const renderMarket = () => {
    return (
      <Box className={'store_market_bg'}>
      </Box>
    );
  }


  return (
    <Box className={'store_bg'}>
      {renderBanner()}
      {renderHot()}
      {renderMarket()}
    </Box>
  );
};

export default GStore;
