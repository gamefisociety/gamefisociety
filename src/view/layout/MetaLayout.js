import { Outlet } from "react-router-dom";
import "./MetaLayout.scss";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import GFTHead from "view/head/GFTHead";
import GMetaUI from 'view/meta/GMetaUI';

// ==============================|| MINIMAL LAYOUT ||============================== //

const MetaLayout = () => {
  return (
    <Box className="meta_layout">
      <Outlet />
      <GMetaUI />
    </Box>
  );
};

export default MetaLayout;
