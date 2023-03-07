import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setOpenLogin, setDrawer } from "module/store/features/dialogSlice";
import { useMetadataPro } from 'nostr/protocal/MetadataPro';
import { useRelayPro } from 'nostr/protocal/RelayPro';
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
import { Divider } from '@mui/material/index';
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
    setIsOpen,
    setIsOpenWallet,
    setOpenMenuLeft
} from 'module/store/features/dialogSlice';

import {
    setProfile,
} from 'module/store/features/profileSlice';
import { logout } from "module/store/features/loginSlice";
import { setRelays } from 'module/store/features/profileSlice';
import { setFollows } from 'module/store/features/userSlice';

import './GFTHead.scss';

import ic_logo from "../../asset/image/logo/ic_logo.png"
import ic_massage from "../../asset/image/home/ic_massage.png"
import ic_wallet from "../../asset/image/home/ic_wallet.png"
import ic_man from "../../asset/image/home/ic_man.png"
import { EventKind } from 'nostr/def';

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

const GFTHead = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loggedOut, publicKey } = useSelector(s => s.login);
    const { relays } = useSelector(s => s.profile);
    const { follows, followUpdate } = useSelector(s => s.user);

    const { account } = useWeb3React();
    const { isOpenMenuLeft } = useSelector(s => s.dialog);
    //
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const { picture, display_name, nip05 } = useSelector(s => s.profile);

    const MetaPro = useMetadataPro();
    const relayPro = useRelayPro();

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

    const fetchMeta = () => {
        let subMeta = MetaPro.get(publicKey);
        let subRelay = relayPro.get(publicKey);
        subMeta.childs.push(subRelay);
        // console.log('MetadataSub', subMeta);
        System.Broadcast(subMeta, 0, (msgs) => {
            if (msgs) {
                console.log('fetchMeta msgs', msgs);
                msgs.map(msg => {
                    if (msg.pubkey === publicKey) {
                        if (msg.kind === EventKind.SetMetadata && msg.content !== '') {
                            //meta data
                            let contentMeta = JSON.parse(msg.content);
                            contentMeta.created_at = msg.created_at;
                            dispatch(setProfile(contentMeta))
                        } else if (msg.kind === EventKind.ContactList) {
                            if (msg.content !== '') {
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
                                msg.tags.map(item => {
                                    if (item.length === 2 && item[0] === 'p') {
                                        follow_pubkes.push(item[1]);
                                    }
                                });
                                let followsInfo = {
                                    create_at: msg.created_at,
                                    follows: follow_pubkes.concat()
                                }
                                dispatch(setFollows(followsInfo));
                            }
                            //
                        }
                    }
                });
            }
        });
    }
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
        }
    }, [loggedOut]);

    const openProfile = () => {
        // fetchMeta();
        navigate('/setting');
        handleMenuClose();
    };

    const openSociety = () => {
        dispatch(setDrawer({
            isDrawer: true,
            placeDrawer: 'right',
            cardDrawer: 'follow'
        }));
        handleMenuClose();
    }

    const openRelays = () => {
        dispatch(setDrawer({
            isDrawer: true,
            placeDrawer: 'top',
            cardDrawer: 'relays'
        }));
        handleMenuClose();
    }

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
            <MenuItem onClick={openSociety}>Society</MenuItem>
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

        <AppBar className='head_bg'>
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
                            className='head_icon'
                            aria-label="relay icon"
                            color="inherit"
                            onClick={openRelays}
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
                                className='head_icon'
                                color="inherit"
                                onClick={openRelays}
                            >
                                <PublicIcon />
                            </IconButton>
                            <IconButton className='head_icon' color="inherit">
                                <Badge badgeContent={4} color="error">
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                            <IconButton
                                className='head_icon'
                                color="inherit"
                            >
                                <Badge badgeContent={17} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <Avatar aria-controls={menuId}
                                sx={{ width: '32px', height: '32px', marginLeft: '12px' }}
                                edge="end"
                                alt="GameFi Society"
                                src={picture}
                                onClick={handleProfileMenuOpen} />
                            <Typography variant="body2" color="text.secondary">{display_name}</Typography>
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
            {renderMobileMenu}
            {renderMenu}
        </AppBar>
    );
}

export default React.memo(GFTHead);