import React, { useEffect } from "react";
import "./GFTHead.scss";
import useMediaQuery from '@mui/material/useMediaQuery';
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
import GUserMenu from 'view/head/GUserMenu';
import {
  setIsOpen,
  setIsOpenWallet,
} from "module/store/features/dialogSlice";
import { default_avatar } from "module/utils/xdef";
import { logout } from "module/store/features/loginSlice";
import ic_logo from "../../asset/image/logo/ic_logo.png";
import ic_wallet from "../../asset/image/home/ic_wallet.png";
import { EventKind } from "nostr/def";

const ProfileTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#191A1B",
    // color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: "220px",
    // fontSize: theme.typography.pxToRem(12),
  },
}));

const GFTHead = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const { loggedOut, publicKey } = useSelector((s) => s.login);
  const { profile, relays } = useSelector((s) => s.profile);
  const { dms } = useSelector((s) => s.society);
  const [profileOpen, setProfileOPen] = React.useState(false);
  const [noticeNum, setNoticeNum] = React.useState(0);
  const [dmNum, setDmNum] = React.useState(0);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const matches = useMediaQuery('(min-width:600px)');

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
    navigate('/home');
  };

  const handleProfileMenuOpen = (event) => { };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    handleMobileMenuClose();
  };

  const openProfile = () => {
    navigate("/profile", {
      state: { info: { ...profile }, pubkey: publicKey },
    });
    handleMenuClose();
  };

  const openSocietyDM = () => {
    dispatch(
      setDrawer({
        isDrawer: true,
        placeDrawer: "right",
        cardDrawer: "society-dm",
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

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    // setDmNum(dms.length);
    // setNotifycationNum(dms.length);
  }, [dms]);


  const renderUserMenu = (<GUserMenu />);

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

  const renderLogout = () => {
    return (
      <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
        <IconButton
          sx={{ mr: "12px" }}
          size="large"
          aria-label="relay icon"
          color="inherit"
          onClick={openRelays}
        >
          <PublicIcon />
        </IconButton>
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
    );
  }

  const renderLogin = () => {
    return (
      <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
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
          onClick={openSocietyDM}
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
                  alt={profile.display_name}
                  src={
                    profile.picture && profile.picture !== "default"
                      ? profile.picture
                      : ""
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
    );
  }

  // loggedOut, publicKey 
  return (
    <Box className="head_bg">
      <GFetchMetadata logout={loggedOut} pubkey={publicKey} />
      <GListenDM logout={loggedOut} pubkey={publicKey} />
      <Toolbar className="toolbar_bg">
        <Box className={'logo_menu'}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 0 }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            sx={{ width: 160, cursor: "pointer" }}
            src={ic_logo}
            alt="Paella dish"
            onClick={clickLogo}
          />
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <GSearch />
        </Box>
        {loggedOut === true ? renderLogout() : renderLogin()}
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
      </Toolbar >
      {renderMobileMenu}
    </Box >
  );
};

export default React.memo(GFTHead);
