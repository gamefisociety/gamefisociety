import { Outlet } from "react-router-dom";
import "./MetaLayout.scss";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import GFTHead from "view/head/GFTHead";

// ==============================|| MINIMAL LAYOUT ||============================== //

const MetaLayout = () => {
  return (
    <Box className="meta_layout">
      <GFTHead />
      <Box className="meta_layout_content">
        <Outlet />
      </Box>
    </Box>
  );
};

export default MetaLayout;
