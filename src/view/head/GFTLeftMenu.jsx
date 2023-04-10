import React, { useEffect, useState, forwardRef } from 'react';
import './GFTLeftMenu.scss';

import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { withAliveScope, useAliveController } from 'react-activation'
import {
    isCheckIn,
    setOpenCheckIn,
    setIsOpen,
    setOpenMintAvatar
} from 'module/store/features/dialogSlice';
import { setOpenLogin, setDrawer } from "module/store/features/dialogSlice";

import Box from '@mui/material/Box';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import GFTFooter from 'view/footer/GFTFooter';
import Paper from '@mui/material/Paper';
import { Divider } from '@mui/material/index';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import ic_polgon from "asset/image/home/ic_polgon.png";
import ic_check_in from "asset/image/home/ic_check_in.png";
import ic_create from 'asset/image/home/ic_create.png';
import ic_home from 'asset/image/logo/ic_home.png';
import ic_chat from 'asset/image/logo/ic_chat.png';
import ic_sub from 'asset/image/logo/ic_sub.png';
import ic_menu_wallet from 'asset/image/home/ic_menu_wallet.png';
import ic_dm from "asset/image/logo/icon_dm.png";
import ic_global from "asset/image/logo/icon_global.png";

const mapData = [
    // {
    //     txt: 'HOME',
    //     img: ic_home
    // },
    {
        txt: 'META(beta)',
        img: ic_home
    },
    {
        txt: 'GLOBAL',
        img: ic_global
    },
    {
        txt: 'POST & REPLY',
        img: ic_chat,
        // out: true
    },
    {
        txt: 'DM',
        img: ic_dm,
        // out: true
    },
    {
        txt: 'CHAT GROUP',
        img: ic_dm,
        // out: true
    },
    {
        txt: 'INTRODUCE',
        img: ic_sub,
        out: true
    },
    {
        txt: 'NFT',
        img: ic_sub,
    },
    {
        txt: 'DAO',
        img: ic_sub,
    },
    {
        txt: 'ARTICLE',
        img: ic_create
    },
    {
        txt: 'DIVIDER',
        img: ''
    },
    {
        txt: 'CHECK IN',
        img: ic_check_in
    },
    // {
    //     txt: 'MINT AVATAR',
    //     img: ic_free_nft
    // },
    // {
    //     txt: 'SWAP IN',
    //     img: ic_swap
    // },
    {
        txt: 'DIVIDER',
        img: ''
    },
    {
        txt: 'WALLET',
        img: ic_menu_wallet
    },
    // {
    //     txt: 'NEWS',
    //     img: ic_eth
    // },
    // {
    //     txt: 'VIDEOS',
    //     img: ic_bnb
    // },
    {
        txt: 'GAME',
        img: ic_polgon
    },
    // {
    //     txt: 'DIVIDER',
    //     img: ''
    // },
    // {
    //     txt: 'CREATE',
    //     img: ic_create
    // },
    // {
    //     txt: 'FOLLOW',
    //     img: ic_create
    // },
    // {
    //     txt: 'GROUP CHAT',
    //     img: ic_create
    // }
];

const GFTLeftMenu = () => {
    const { drop, dropScope, clear, refresh, getCachingNodes } = useAliveController()
    const navigate = useNavigate();
    const { activate, account, chainId, active, library, deactivate } = useWeb3React();
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
        }

    }, [])

    const openMainContent = () => {
        //
    }

    const clickMenu = (item) => {
        if (item.txt === 'HOME') {
            navigate('/home');
        } else if (item.txt === 'META(beta)') {
            navigate('/meta');
        } else if (item.txt === 'CHECK IN') {
            if (account) {
                dispatch(setOpenCheckIn(true));
            } else {
                dispatch(setIsOpen(true));
            }
        } else if (item.txt === 'GLOBAL') {
            clear();
            navigate('/global/all');
            openMainContent();
        } else if (item.txt === 'POST & REPLY') {
            navigate('/post-reply');
            openMainContent();
        } else if (item.txt === 'DM') {
            dispatch(
                setDrawer({
                    isDrawer: true,
                    placeDrawer: "right",
                    cardDrawer: "society-dm",
                })
            );
        } else if (item.txt === 'CHAT GROUP') {
            dispatch(
                setDrawer({
                    isDrawer: true,
                    placeDrawer: "right",
                    cardDrawer: "society-chat-group",
                })
            );
        } else if (item.txt === 'FOLLOW') {
            navigate('/follow');
        } else if (item.txt === 'CREATE') {
            navigate('/create_project');
        } else if (item.txt === 'MINT AVATAR') {
            // navigate('/mint');
            if (account) {
                navigate('/mint');
            } else {
                dispatch(setIsOpen(true));
            }
        } else if (item.txt === 'GAME') {
            // dropScope('ProjectsCache');
            clear();
            // console.log(getCachingNodes());
            navigate('/game');
        } else if (item.txt === 'VIDEOS') {
            navigate('/videopage');
        } else if (item.txt === 'NEWS') {
            navigate('/newspage');
        } else if (item.txt === 'ARTICLE') {
            // dropScope('ArticlesCache');
            clear();
            navigate('/article');
        } else if (item.txt === 'INTRODUCE') {
            navigate('/introduce');
        } else if (item.txt === 'NFT') {
            navigate('/store');
        } else if (item.txt === 'GROUP CHAT') {
            navigate('/groupchat');
        } else if (item.txt === 'WALLET') {
            navigate('/wallet');
        }
    }

    let itemTarget = '_self';
    // if (item.target) {
    //     itemTarget = '_blank';
    // }
    // if (item?.external) {
    // }
    // let listItemProps = { component: 'a', href: '/introduce', target: itemTarget };

    const renderMenu = (item, index) => {
        if (item.txt === 'DIVIDER') {
            return (<Divider key={'main-menu-' + index} />);
        }
        if (item.out) {
            let listItemProps = { component: forwardRef((props, ref) => <Link ref={ref} {...props} to={'/introduce'} target={itemTarget} />) };
            // let listItemProps = { component: 'a', href: '/introduce', target: itemTarget };
            return (
                <MenuItem
                    {...listItemProps}
                    key={'main-menu-' + index}
                    onClick={() => { }}>
                    <CardMedia
                        sx={{ width: 28, height: 28 }}
                        component="img"
                        image={item.img}
                        alt="green iguana"
                    />
                    <Typography sx={{ mx: '12px' }} variant="caption" component="div" color="white">
                        {item.txt}
                    </Typography>
                </MenuItem>
            );
        }
        return (
            <MenuItem
                key={'main-menu-' + index}
                onClick={() => {
                    clickMenu(item);
                }}>
                <CardMedia
                    sx={{ width: 28, height: 28 }}
                    component="img"
                    image={item.img}
                    alt="green iguana"
                />
                <Typography sx={{ mx: '12px' }} variant="caption" component="div" color="white">
                    {item.txt}
                </Typography>
            </MenuItem>
        )
    }

    return (
        <Paper className='left_menu_bg'>
            <MenuList>
                {mapData.map((item, index) => {
                    return renderMenu(item, index)
                })}
            </MenuList>
            <Box sx={{ flexGrow: 1 }}></Box>
            <GFTFooter />
        </Paper>
    );
}

export default React.memo(GFTLeftMenu);