import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from "module/store/features/loginSlice";
import { setOpenLogin } from "module/store/features/dialogSlice";
import useMetadataPro from 'nostr/protocal/MetadataPro';
import { System } from 'nostr/NostrSystem';
//
import { styled, alpha } from '@mui/material/styles';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import AdbIcon from '@mui/icons-material/Adb';
import PublicIcon from '@mui/icons-material/Public';
import LoginIcon from '@mui/icons-material/Login';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';

import {
    decrement,
    increment,
    setIsOpen,
    setIsOpenWallet,
    setOpenMenuLeft
} from 'module/store/features/dialogSlice';

import {
    setProfile,
} from 'module/store/features/profileSlice';

import './GFTHead01.scss';

import ic_logo from "../../asset/image/logo/ic_logo.png"
import ic_massage from "../../asset/image/home/ic_massage.png"
import ic_wallet from "../../asset/image/home/ic_wallet.png"
import ic_man from "../../asset/image/home/ic_man.png"
import { Divider } from '../../../node_modules/@mui/material/index';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const GFTHead01 = () => {
    const navigate = useNavigate();
    const { loggedOut, publicKey, privateKey } = useSelector(s => s.login);
    const dispatch = useDispatch();
    const { activate, account, chainId, active, library, deactivate } = useWeb3React();
    const { isOpenMenuLeft, isOpenConnect } = useSelector(s => s.dialog);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const { picture, display_name, nip05 } = useSelector(s => s.profile);

    const MetaData = useMetadataPro();

    useEffect(() => {
        if (loggedOut === false) {
            //get user msg
            fetchProfile();
        }
        return () => {
            //
        }
    }, [loggedOut]);
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

    // const doLogin = async () => {
    //     try {
    //         if (key.startsWith("nsec")) {
    //             const hexKey = bech32ToHex(key);
    //             if (secp.utils.isValidPrivateKey(hexKey)) {
    //                 dispatch(setPrivateKey(hexKey));
    //             } else {
    //                 throw new Error("INVALID PRIVATE KEY");
    //             }
    //         } else if (key.startsWith("npub")) {
    //             const hexKey = bech32ToHex(key);
    //             dispatch(setPublicKey(hexKey));
    //         } else if (key.match(EmailRegex)) {
    //             const hexKey = await getNip05PubKey(key);
    //             dispatch(setPublicKey(hexKey));
    //         } else {
    //             if (secp.utils.isValidPrivateKey(key)) {
    //                 dispatch(setPrivateKey(key));
    //             } else {
    //                 throw new Error("INVALID PRIVATE KEY");
    //             }
    //         }
    //     } catch (e) {
    //         setError(`Failed to load NIP-05 pub key (${e})`);
    //         console.error(e);
    //     }
    // }

    // async function doNip07Login() {
    //     const pubKey = await window.nostr.getPublicKey();
    //     dispatch(setPublicKey(pubKey));
    //     if ("getRelays" in window.nostr) {
    //       const relays = await window.nostr.getRelays();
    //       dispatch(
    //         setRelays({
    //           relays: {
    //             ...relays,
    //             ...Object.fromEntries(DefaultRelays.entries()),
    //           },
    //           createdAt: 1,
    //         })
    //       );
    //     }
    //   }
    const openDialog = () => {
        if (account) {
            dispatch(setIsOpenWallet(true));
        } else {
            dispatch(setIsOpen(true));
        }
    }

    const getChainLows = () => {
        if (account) {
            return account.substring(0, 5) + "....." + account.substring(account.length - 5, account.length);
        }
        return "CONNECT"
    }
    const clickLogo = () => {
        navigate('/');
    }

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const fetchProfile = async () => {
        let sub = await MetaData.get(publicKey);
        // console.log('MetadataSub', sub);
        System.Broadcast(sub, 0, (msgs) => {
            if (msgs) {
                msgs.map(msg => {
                    if (msg.kind === 0 && msg.pubkey === publicKey && msg.content !== '') {
                        console.log('fetchProfile msgs', msg.content);
                        let content = JSON.parse(msg.content);
                        dispatch(setProfile(content))
                    }
                });
            }
        });
    }

    const openProfile = () => {
        // fetchProfile();
        navigate('/profile');
        handleMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            sx={{ maxWidth: '300px' }}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem sx={{ dispaly: 'flex', flexDirection: 'column' }}>
                <Box sx={{ dispaly: 'flex', flexDirection: 'row' }}>
                    <Avatar
                        sx={{ width: 32, height: 32, marginLeft: '12px' }}
                        edge="end"
                        alt="GameFi Society"
                        src={picture}
                    />
                    <Typography sx={{ marginLeft: '12px' }} color={'primary'} variant={'subtitle2'} >
                        {display_name}
                    </Typography>
                </Box>
                <Typography sx={{ width: '100%', marginTop: '12px', wordBreak: "break-word" }} color={'primary'} variant={'subtitle2'} >
                    {nip05}
                </Typography>
            </MenuItem>
            <Divider></Divider>
            <MenuItem onClick={openProfile}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
            <Divider></Divider>
            <MenuItem onClick={() => {
                setAnchorEl(null);
                handleMobileMenuClose();
                dispatch(logout());
            }}>Clear Account</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
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
            <MenuItem onClick={() => {
                navigate('/profile');
                setMobileMoreAnchorEl(null);
            }}>
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
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: '#191A1B' }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                        onClick={() => {
                            console.log('click menu');
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
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />
                    {
                        loggedOut === true ? <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                            <IconButton
                                size="large"
                                aria-label="relay icon"
                                color="inherit"
                            >
                                <PublicIcon />
                            </IconButton>
                            <Button sx={{ px: '24px', backgroundColor: 'rgba(255, 72, 100, 1)', color: 'white', borderRadius: '24px' }} endIcon={<AccountCircle />} onClick={() => {
                                dispatch(setOpenLogin(true));
                            }}>
                                Login
                            </Button>
                        </Box> :
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                                <Box className='wallet_layout' onClick={openDialog}>
                                    <Button sx={{ px: '24px', backgroundColor: 'rgba(0, 108, 249, 1)', color: 'white', borderRadius: '24px' }} startIcon={<AdbIcon />} >
                                        {account ? getChainLows() : 'CONNECT'}
                                    </Button>
                                </Box>
                                <IconButton
                                    size="large"
                                    aria-label="relay icon"
                                    color="inherit"
                                >
                                    <PublicIcon />
                                </IconButton>
                                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
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
                                <Avatar aria-controls={menuId}
                                    sx={{ width: 32, height: 32, marginLeft: '12px' }}
                                    edge="end"
                                    alt="GameFi Society"
                                    src={picture}
                                    onClick={handleProfileMenuOpen} />
                                {/* <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton> */}
                            </Box>
                    }
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}

export default React.memo(GFTHead01);