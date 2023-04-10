import { Outlet } from "react-router-dom";
import "./StoreLayout.scss";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import GFTHead from "view/head/GFTHead";
import GFTLeftMenu from "view/head/GFTLeftMenu";

// ==============================|| MINIMAL LAYOUT ||============================== //

const StoreLayout = () => {
  return (
    <Box className="store_bg">
      <GFTHead />
      <GFTLeftMenu />
      <Box className="store_content">
        <Outlet />
      </Box>
    </Box>
  );
};

export default StoreLayout;
