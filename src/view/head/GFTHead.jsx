import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setOpenLogin, setDrawer } from "module/store/features/dialogSlice";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { useFollowPro } from "nostr/protocal/FollowPro";
//
import { styled, alpha, useColorScheme } from "@mui/material/styles";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppBar from "@mui/material/AppBar";
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


import "./GFTHead.scss";

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

const ProfileTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#191A1B",
    //   color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: "228px",
    //   fontSize: theme.typography.pxToRem(12),
  },
}));

const GFTHead = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const { loggedOut, publicKey } = useSelector((s) => s.login);
  const { profile, relays } = useSelector((s) => s.profile);
  const { dms } = useSelector((s) => s.society);
  const { isOpenMenuLeft } = useSelector((s) => s.dialog);
  const [profileOpen, setProfileOPen] = React.useState(false);
  const [noticeNum, setNoticeNum] = React.useState(0);
  const [dmNum, setDmNum] = React.useState(0);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [searchProp, setSearchProp] = React.useState({
    value: "",
    nip19: false,
    open: false,
    anchorEl: null,
  });

  const handleTooltipClose = () => {
    setProfileOPen(false);
  };

  const handleTooltipOpen = () => {
    setProfileOPen(true);
  };

  const openDialog = () => {
    if (account) {
      dispatch(setIsOpenWallet(true));
    } else {
      dispatch(setIsOpen(true));
    }
  };

  const getChainLows = () => {
    if (account) {
      return (
        account.substring(0, 5) +
        "....." +
        account.substring(account.length - 5, account.length)
      );
    }
    return "CONNECT";
  };
  const clickLogo = () => {
    navigate("/home");
  };

  const handleProfileMenuOpen = (event) => { };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    handleMobileMenuClose();
  };

  const openUserHome = () => {
    navigate("/userhome:" + publicKey, { state: { pubkey: publicKey } });
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

  useEffect(() => {
    setDmNum(dms.length);
    // setNotifycationNum(dms.length);
  }, [dms]);

  const renderUserMenu = (
    <React.Fragment>
      <Box
        sx={{
          dispaly: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "228px",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            marginTop: "20px",
          }}
          onClick={() => {
            openUserHome();
          }}
        >
          <Avatar
            sx={{ width: "40px", height: "40px" }}
            // edge="end"
            alt="GameFi Society"
            src={
              profile.picture && profile.picture !== "default"
                ? profile.picture
                : default_avatar
            }
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "48px",
              dispaly: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              height: "40px",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontFamily: "Saira",
                fontWeight: "500",
                textAlign: "left",
              }}
              color={"text.primary"}
            >
              {profile.display_name
                ? profile.display_name
                : publicKey !== ""
                  ? "Nostr#" +
                  publicKey.substring(publicKey.length - 4, publicKey.length)
                  : "gfs"}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontFamily: "Saira",
                fontWeight: "500",
                textAlign: "left",
              }}
              color={"text.secondary"}
            >
              {profile.name
                ? "@" + profile.name
                : publicKey !== ""
                  ? "@" +
                  publicKey.substring(publicKey.length - 4, publicKey.length)
                  : "gfs"}
            </Typography>
          </Box>
        </Box>
        <Button
          className="button"
          sx={{
            marginTop: "20px",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            height: "36px",
          }}
          onClick={() => {
            openProfile();
          }}
        >
          <img
            className="iconimg"
            src={icon_profile}
            width="28px"
            alt="profile"
          />
          <Typography
            sx={{
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              align: "left",
            }}
            color={"#FFFFFF"}
          >
            {"Profile"}
          </Typography>
        </Button>
        <Button
          className="button"
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            height: "36px",
          }}
          onClick={() => {
            openSociety();
          }}
        >
          <img
            className="iconimg"
            src={icon_society}
            width="28px"
            alt="society"
          />
          <Typography
            sx={{
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              align: "left",
            }}
            color={"#FFFFFF"}
          >
            {"Society"}
          </Typography>
        </Button>
        <Button
          className="button"
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            height: "36px",
          }}
          onClick={() => {
            openRelays();
          }}
        >
          <img
            className="iconimg"
            src={icon_relays}
            width="28px"
            alt="relays"
          />
          <Typography
            sx={{
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              align: "left",
            }}
            color={"#FFFFFF"}
          >
            {"Relays"}
          </Typography>
        </Button>
        <Button
          className="button"
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            height: "36px",
          }}
          onClick={() => {
            openSetting();
          }}
        >
          <img
            className="iconimg"
            src={icon_setting}
            width="28px"
            alt="settings"
          />
          <Typography
            sx={{
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              align: "left",
            }}
            color={"#FFFFFF"}
          >
            {"Settings"}
          </Typography>
        </Button>
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
        <Button
          className="button"
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
            dispatch(logout());
          }}
        >
          <img
            className="iconimg"
            src={icon_logout}
            width="28px"
            alt="logout"
          />
          <Typography
            sx={{
              fontSize: "14px",
              fontFamily: "Saira",
              fontWeight: "500",
              align: "left",
            }}
            color={"#FFFFFF"}
          >
            {"Sign Out"}
          </Typography>
        </Button>
      </Box>
    </React.Fragment>
  );

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
    <Box className="head_bg">
      <GFetchMetadata logout={loggedOut} pubkey={publicKey} />
      <GListenDM logout={loggedOut} pubkey={publicKey} />
      <Toolbar className="toolbar_bg">
        <CardMedia
          component="img"
          sx={{ width: 160, cursor: "pointer" }}
          image={ic_logo}
          alt="Paella dish"
          onClick={clickLogo}
        />
        <GSearch />
        {loggedOut === true ? (
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            <Button
              className={"btLogin"}
              endIcon={<AccountCircle />}
              onClick={() => {
                dispatch(setOpenLogin(true));
              }}
            >
              {'Login'}
            </Button>
          </Box>
        ) : (
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            <Box className="wallet_layout" onClick={openDialog}>
              <Button
                className={"btConnect"}
                startIcon={<img src={ic_wallet} width="28px" />}
              >
                {account ? getChainLows() : "CONNECT"}
              </Button>
            </Box>
            <IconButton
              sx={{ mr: "12px" }}
              size="large"
              aria-label="relay icon"
              color="inherit"
              onClick={openRelays}
            >
              <PublicIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={dmNum} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={noticeNum} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <ClickAwayListener onClickAway={handleTooltipClose}>
              <Button className="button">
                <ProfileTooltip
                  PopperProps={{
                    disablePortal: true,
                  }}
                  title={renderUserMenu}
                  onClose={handleTooltipClose}
                  open={profileOpen}
                  placement="top-end"
                >
                  <Stack
                    sx={{
                      //   backgroundColor: "background.default",
                      px: "12px",
                      py: "6px",
                      borderRadius: "24px",
                    }}
                    direction="row"
                    alignItems="center"
                    onClick={handleTooltipOpen}
                  >
                    <Avatar
                      sx={{ width: 32, height: 32 }}
                      edge="end"
                      alt="GameFi Society"
                      src={
                        profile.picture && profile.picture !== "default"
                          ? profile.picture
                          : default_avatar
                      }
                    />
                    <Typography sx={{ ml: "6px" }} color={"text.primary"}>
                      {profile.display_name}
                    </Typography>
                  </Stack>
                </ProfileTooltip>
              </Button>
            </ClickAwayListener>
          </Box>
        )}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </Box>
      </Toolbar>
      {renderMobileMenu}
    </Box>
  );
};

export default React.memo(GFTHead);
