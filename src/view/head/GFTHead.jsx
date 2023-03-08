import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setOpenLogin, setDrawer } from "module/store/features/dialogSlice";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { useRelayPro } from "nostr/protocal/RelayPro";
import { System } from "nostr/NostrSystem";
//
import { styled, alpha, useColorScheme } from "@mui/material/styles";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import CardMedia from "@mui/material/CardMedia";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import AdbIcon from "@mui/icons-material/Adb";
import PublicIcon from "@mui/icons-material/Public";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import {
  setIsOpen,
  setIsOpenWallet,
  setOpenMenuLeft,
} from "module/store/features/dialogSlice";

import { setProfile } from "module/store/features/profileSlice";
import { logout } from "module/store/features/loginSlice";
import { setRelays } from "module/store/features/profileSlice";
import { setFollows } from "module/store/features/userSlice";

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

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

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
  const { loggedOut, publicKey } = useSelector((s) => s.login);
  const { relays } = useSelector((s) => s.profile);
  const { follows, followUpdate } = useSelector((s) => s.user);

  const { account } = useWeb3React();
  const { isOpenMenuLeft } = useSelector((s) => s.dialog);
  //
  const [profileOpen, setProfileOPen] = React.useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { picture, display_name, name, nip05 } = useSelector((s) => s.profile);

  const MetaPro = useMetadataPro();
  const relayPro = useRelayPro();

  const { mode, setMode } = useColorScheme();

  console.log("current mode", mode);

  // const getNip05PubKey = async (addr) => {
  //     const [username, domain] = addr.split("@");
  //     const rsp = await fetch(`https://${domain}/.well-known/nostr.json?name=${encodeURIComponent(username)}`);
  //     if (rsp.ok) {
  //         const data = await rsp.json();
  //         const pKey = data.names[username];
  //         if (pKey) {
  //             return pKey;
  //         }
  //     }
  //     throw new Error("User key not found");
  // }
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
    navigate("/");
  };

  const handleProfileMenuOpen = (event) => {};

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    handleMobileMenuClose();
  };

  const fetchMeta = () => {
    let subMeta = MetaPro.get(publicKey);
    let subRelay = relayPro.get(publicKey);
    subMeta.childs.push(subRelay);
    // console.log('MetadataSub', subMeta);
    System.Broadcast(subMeta, 0, (msgs) => {
      if (msgs) {
        console.log("fetchMeta msgs", msgs);
        msgs.map((msg) => {
          if (msg.pubkey === publicKey) {
            if (msg.kind === EventKind.SetMetadata && msg.content !== "") {
              //meta data
              let contentMeta = JSON.parse(msg.content);
              contentMeta.created_at = msg.created_at;
              dispatch(setProfile(contentMeta));
            } else if (msg.kind === EventKind.ContactList) {
              if (msg.content !== "") {
                //relay info
                let content = JSON.parse(msg.content);
                let tmpRelays = {
                  relays: {
                    ...content,
                    ...relays,
                  },
                  createdAt: 1,
                };
                dispatch(setRelays(tmpRelays));
              }
              //follows
              if (msg.tags.length > 0) {
                let follow_pubkes = [];
                msg.tags.map((item) => {
                  if (item.length === 2 && item[0] === "p") {
                    follow_pubkes.push(item[1]);
                  }
                });
                let followsInfo = {
                  create_at: msg.created_at,
                  follows: follow_pubkes.concat(),
                };
                dispatch(setFollows(followsInfo));
              }
              //
            }
          }
        });
      }
    });
  };
  //
  //init param form db or others
  useEffect(() => {
    // console.log('use db from reduce');
    // dispatch(init('redux'));
    // dispatch(initRelays())
  }, []);

  useEffect(() => {
    if (loggedOut === false) {
      fetchMeta();
    }
    return () => {
      //
    };
  }, [loggedOut]);

  const openProfile = () => {
    // fetchMeta();
    navigate("/setting");
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

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
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
        >
          <Avatar
            sx={{ width: "40px", height: "40px" }}
            // edge="end"
            alt="GameFi Society"
            src={picture}
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
              color={"#FFFFFF"}
            >
              {display_name !== "default"
                ? display_name
                : "Nostr#" +
                  publicKey.substring(publicKey.length - 4, publicKey.length)}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontFamily: "Saira",
                fontWeight: "500",
                textAlign: "left",
              }}
              color={"#919191"}
            >
              {name !== "default"
                ? "@" + name
                : "@" +
                  publicKey.substring(publicKey.length - 4, publicKey.length)}
            </Typography>
          </Box>
        </Box>
        <Button
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
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            height: "36px",
          }}
          onClick={() => {
            // openProfile();
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
        <Button
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
        </Button>
        <Button
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
          <Badge badgeContent={17} color="error">
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

  return (
    <AppBar className="head_bg">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2 }}
          onClick={() => {
            console.log("click menu");
            dispatch(setOpenMenuLeft(!isOpenMenuLeft));
          }}
        >
          <MenuIcon />
        </IconButton>
        <CardMedia
          component="img"
          sx={{ width: 160 }}
          image={ic_logo}
          alt="Paella dish"
          onClick={clickLogo}
        />
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
        <Box sx={{ flexGrow: 1 }} />
        {loggedOut === true ? (
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            <IconButton
              size="large"
              aria-label="relay icon"
              color="inherit"
              onClick={openRelays}
            >
              <PublicIcon />
            </IconButton>
            <Button
              sx={{
                px: "24px",
                backgroundColor: "rgba(255, 72, 100, 1)",
                color: "white",
                borderRadius: "24px",
              }}
              endIcon={<AccountCircle />}
              onClick={() => {
                dispatch(setOpenLogin(true));
              }}
            >
              Login
            </Button>
          </Box>
        ) : (
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            <Box className="wallet_layout" onClick={openDialog}>
              <Button
                sx={{
                  px: "24px",
                  backgroundColor: "rgba(0, 108, 249, 1)",
                  color: "white",
                  borderRadius: "24px",
                }}
                startIcon={<AdbIcon />}
              >
                {account ? getChainLows() : "CONNECT"}
              </Button>
            </Box>
            <IconButton
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
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <ClickAwayListener onClickAway={handleTooltipClose}>
              <Button>
                <ProfileTooltip
                  PopperProps={{
                    disablePortal: true,
                  }}
                  title={renderUserMenu}
                  onClose={handleTooltipClose}
                  open={profileOpen}
                  placement="top-end"
                >
                  <Avatar
                    sx={{ width: 32, height: 32, marginLeft: "12px" }}
                    edge="end"
                    alt="GameFi Society"
                    src={picture}
                    onClick={handleTooltipOpen}
                  />
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
    </AppBar>
  );
};

export default React.memo(GFTHead);
