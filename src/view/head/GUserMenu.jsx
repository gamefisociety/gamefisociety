import React, { useEffect } from "react";
import "./GUserMenu.scss";

import { useWeb3React } from "@web3-react/core";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setOpenLogin, setDrawer } from "module/store/features/dialogSlice";
import { styled, alpha, useColorScheme } from "@mui/material/styles";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GSearch from 'components/GSearch';
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import CardMedia from "@mui/material/CardMedia";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import PublicIcon from "@mui/icons-material/Public";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import GFetchMetadata from "components/GFetchMetadata";
import GListenDM from "components/GListenDM";
import {
  setIsOpen,
  setIsOpenWallet,
} from "module/store/features/dialogSlice";
import { default_avatar } from "module/utils/xdef";
import { logout } from "module/store/features/loginSlice";
import ic_logo from "../../asset/image/logo/ic_logo.png";
import ic_massage from "../../asset/image/home/ic_massage.png";
import ic_wallet from "../../asset/image/home/ic_wallet.png";
import ic_man from "../../asset/image/home/ic_man.png";
import icon_profile from "../../asset/image/login/icon_profile.png";
import icon_society from "../../asset/image/login/icon_society.png";
import icon_relays from "../../asset/image/login/icon_relays.png";
import icon_setting from "../../asset/image/login/icon_setting.png";
import icon_qr from "../../asset/image/login/icon_qr.png";
import icon_logout from "../../asset/image/login/icon_logout.png";
import { EventKind } from "nostr/def";
import { Divider } from "../../../node_modules/@mui/material/index";

const GUserMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const { loggedOut, publicKey } = useSelector((s) => s.login);
  const { profile } = useSelector((s) => s.profile);
  const { dms } = useSelector((s) => s.society);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => { };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    handleMobileMenuClose();
  };

  const openUserHome = () => {
    navigate("/userhome/" + publicKey);
    handleMenuClose();
  };

  const openProfile = () => {
    navigate("/profile", {
      state: { info: { ...profile }, pubkey: publicKey },
    });
    handleMenuClose();
  };

  const openSociety = () => {
    dispatch(
      setDrawer({
        isDrawer: true,
        placeDrawer: "right",
        cardDrawer: "follow",
      })
    );
    handleMenuClose();
  };

  const openRelays = () => {
    dispatch(
      setDrawer({
        isDrawer: true,
        placeDrawer: "right",
        cardDrawer: "relays",
      })
    );
  };

  const openSetting = () => {
    handleMenuClose();
    navigate("/setting");
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const getAvatarPicture = () => {
    if (profile && profile.picture && profile.picture !== "default") {
      return profile.picture;
    }
    return "";
  }

  const getDisplayName = () => {
    if (profile && profile.display_name) {
      return profile.display_name;
    }
    if (publicKey !== "") {
      return 'Nostr#' + publicKey.substring(publicKey.length - 4, publicKey.length)
    }
    return 'gfs';
  }

  const getName = () => {
    if (profile && profile.name) {
      return profile.name;
    }
    if (publicKey !== "") {
      return '@' + publicKey.substring(publicKey.length - 4, publicKey.length)
    }
    return '@gfs';
  }

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      sx={{ zIndex: '1000' }}
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={dms.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={openProfile}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <PublicIcon />
        </IconButton>
        <p>Relays</p>
      </MenuItem>
    </Menu>
  );

  // loggedOut, publicKey 
  return (
    <Box className="user_menu_bg">
      <Box className={'menu_first'} onClick={openUserHome}>
        <Avatar sx={{ width: "40px", height: "40px" }} edge="end" alt={getDisplayName()} src={getAvatarPicture()} />
        <Box className={'menu_first_name'}>
          <Typography className={'menu_label'}>
            {getDisplayName()}
          </Typography>
          <Typography className={'menu_label2'}>
            {getName()}
          </Typography>
        </Box>
      </Box>
      <Box className={'menu_item'} onClick={openProfile}>
        <Box className={'icon_profil'} />
        <Typography className={'menu_label'}>
          {"Profile"}
        </Typography>
      </Box>
      <Box className={'menu_item'} onClick={openSociety}>
        <Box className={'icon_society'} />
        <Typography className={'menu_label'}>
          {"Society"}
        </Typography>
      </Box>
      <Box className={'menu_item'} onClick={openRelays}>
        <Box className={'icon_relays'} />
        <Typography className={'menu_label'}>
          {"Relays"}
        </Typography>
      </Box>
      <Box className={'menu_item'} onClick={openSetting}>
        <Box className={'icon_settings'} />
        <Typography className={'menu_label'}>
          {"Settings"}
        </Typography>
      </Box>
      {/* <Button
                    sx={{
                        borderTop: 1,
                        borderColor: "#202122",
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        height: "68px",
                    }}
                    onClick={() => {
                        // openProfile();
                    }}
                >
                    <img className="iconimg" src={icon_qr} width="28px" alt="qr" />
                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontFamily: "Saira",
                            fontWeight: "500",
                            align: "left",
                        }}
                        color={"#FFFFFF"}
                    >
                        {"QR Code"}
                    </Typography>
                </Button> */}
      <Divider sx={{ width: '100%', py: '6px', backgroundColor: '0x0F0F0F' }} />
      <Box className="menu_item"
        onClick={() => {
          dispatch(logout());
        }}
      >
        <Box className={'icon_sign_out'} />
        <Typography className={'menu_label'}>
          {"Sign Out"}
        </Typography>
      </Box>
    </Box>
  );
};

export default React.memo(GUserMenu);
