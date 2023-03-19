import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setOpenLogin, setDrawer } from "module/store/features/dialogSlice";
import { useMetadataPro } from "nostr/protocal/MetadataPro";
import { useFollowPro } from "nostr/protocal/FollowPro";
import { System } from "nostr/NostrSystem";
import { BuildSub } from "nostr/NostrUtils";
//
import { styled, alpha, useColorScheme } from "@mui/material/styles";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import CardMedia from "@mui/material/CardMedia";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
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
import { default_avatar } from "module/utils/xdef";
import { setProfile } from "module/store/features/profileSlice";
import { logout } from "module/store/features/loginSlice";
import { setRelays, setFollows } from "module/store/features/profileSlice";
import { parseId } from "nostr/Util";

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

const top100Films = [];

const GFTHead = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loggedOut, publicKey } = useSelector((s) => s.login);
  const { profile, relays } = useSelector((s) => s.profile);
  const { account } = useWeb3React();
  const { isOpenMenuLeft } = useSelector((s) => s.dialog);
  const [profileOpen, setProfileOPen] = React.useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [searchProp, setSearchProp] = React.useState({
    value: "",
    nip19: false,
    open: false,
    anchorEl: null,
  });

  const MetaPro = useMetadataPro();
  const followPro = useFollowPro();

  const selfMetadata = (msg) => {
    if (msg.kind === EventKind.SetMetadata) {
      let contentMeta = JSON.parse(msg.content);
      contentMeta.created_at = msg.created_at;
      dispatch(setProfile(contentMeta));
    } else if (msg.kind === EventKind.ContactList) {
      //relays
      if (msg.content !== "") {
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
          if (item.length >= 2 && item[0] === "p") {
            follow_pubkes.push(item[1]);
          }
        });
        let followsInfo = {
          create_at: msg.created_at,
          follows: follow_pubkes.concat(),
        };
        dispatch(setFollows(followsInfo));
      }
    }
  };

  const searchMetadata = (msg) => {
    if (msg.kind === EventKind.SetMetadata && msg.content !== "") {
      let tmpInfo = JSON.parse(msg.content);
      navigate("/profile", {
        state: { info: { ...tmpInfo }, pubkey: msg.pubkey },
      });
    }
  };

  const fetchMeta = (pubkey, callback) => {
    let filterMeta = MetaPro.get(pubkey);
    let filterFollow = followPro.getFollows(pubkey);
    let subMeta = BuildSub("profile_contact", [filterMeta, filterFollow]);
    let SetMetadata_create_at = 0;
    let ContactList_create_at = 0;
    System.BroadcastSub(subMeta, (tag, client, msg) => {
      if (!msg) return;
      if (tag === "EOSE") {
        System.BroadcastClose(subMeta, client, null);
      } else if (tag === "EVENT") {
        if (msg.pubkey !== pubkey) {
          return;
        }
        if (
          msg.kind === EventKind.SetMetadata &&
          msg.created_at > SetMetadata_create_at
        ) {
          SetMetadata_create_at = msg.created_at;
          if (callback) {
            callback(msg);
          }
        } else if (
          msg.kind === EventKind.ContactList &&
          msg.created_at > ContactList_create_at
        ) {
          ContactList_create_at = msg.created_at;
          if (callback) {
            callback(msg);
          }
        }
      }
    });
  };

  const handleTooltipClose = () => {
    setProfileOPen(false);
  };

  const handleTooltipOpen = () => {
    setProfileOPen(true);
  };

  const handleSearch = (e, value) => {
    searchProp.value = value;
    if (value.startsWith("npub") && value.length === 63) {
      searchProp.nip19 = true;
      searchProp.open = true;
      searchProp.anchorEl = e.currentTarget;
    } else if (value.length === 64) {
      searchProp.nip19 = false;
      searchProp.open = true;
      searchProp.anchorEl = e.currentTarget;
    }
    setSearchProp({ ...searchProp });
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

  const handleProfileMenuOpen = (event) => {};

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    handleMobileMenuClose();
  };

  useEffect(() => {
    if (loggedOut === false) {
      fetchMeta(publicKey, selfMetadata);
    }
    return () => {
      //
    };
  }, [loggedOut]);

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
    navigate("/setting");
    handleMenuClose();
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
      <Toolbar className="toolbar_bg">
        <Stack flexDirection="row">
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
            sx={{ width: 160, cursor: "pointer" }}
            image={ic_logo}
            alt="Paella dish"
            onClick={clickLogo}
          />
        </Stack>
        <TextField
          sx={{
            width: "450px",
            // borderColor: 'white',
          }}
          placeholder="Search input"
          value={searchProp.value}
          onChange={(e) => {
            if (e.target) {
              handleSearch(e, e.target.value);
            }
          }}
          InputProps={{
            sx: { height: "42px", borderRadius: "24px" },
            type: "search",
          }}
          SelectProps={{
            sx: { borderColor: "red" },
          }}
        />
        <Popover
          open={searchProp.open}
          anchorEl={searchProp.anchorEl}
          onClose={() => {
            searchProp.open = false;
            searchProp.anchorEl = null;
            setSearchProp({ ...searchProp });
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Typography
            sx={{
              p: "18px",
              cursor: "pointer",
            }}
            color={"primary"}
            onClick={() => {
              if (searchProp.nip19 === true) {
                let pub = parseId(searchProp.value);
                fetchMeta(pub, searchMetadata);
              } else {
                fetchMeta(searchProp.value, searchMetadata);
              }
              //
              searchProp.value = "";
              searchProp.open = false;
              searchProp.anchorEl = null;
              setSearchProp({ ...searchProp });
            }}
          >
            {"Get Profile: " + searchProp.value}
          </Typography>
        </Popover>
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
              className={"btLogin"}
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
            {/* <IconButton
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
                        </IconButton> */}
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
    </AppBar>
  );
};

export default React.memo(GFTHead);
