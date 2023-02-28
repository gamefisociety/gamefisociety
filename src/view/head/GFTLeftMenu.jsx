import React, { useEffect, useState, forwardRef } from 'react';
import { Link } from 'react-router-dom';

import { useWeb3React } from '@web3-react/core'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import {
    isCheckIn,
    setOpenCheckIn,
    setIsOpen,
    setOpenMintAvatar
} from 'module/store/features/dialogSlice';
import './GFTLeftMenu.scss';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import { Divider } from '@mui/material/index';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import ic_bnb from "asset/image/home/ic_bnb.png";
import ic_eth from "asset/image/home/ic_eth.png";
import ic_swap from "asset/image/home/ic_swap.png";
import ic_polgon from "asset/image/home/ic_polgon.png";
import ic_check_in from "asset/image/home/ic_check_in.png";
import ic_free_nft from "asset/image/home/ic_free_nft.png";
import ic_create from 'asset/image/home/ic_create.png';
import ic_home from 'asset/image/logo/ic_home.png';
import ic_chat from 'asset/image/logo/ic_chat.png';
import ic_sub from 'asset/image/logo/ic_sub.png';

const mapData = [
    {
        txt: 'HOME',
        img: ic_home
    },
    {
        txt: 'GLOBAL',
        img: ic_chat
    },
    {
        txt: 'INTRODUCE',
        img: ic_sub,
        out: true
    },
    {
        txt: 'DIVIDER',
        img: ''
    },
    {
        txt: 'CHECK IN',
        img: ic_check_in
    },
    {
        txt: 'MINT AVATAR',
        img: ic_free_nft
    },
    {
        txt: 'SWAP IN',
        img: ic_swap
    },
    {
        txt: 'DIVIDER',
        img: ''
    },
    {
        txt: 'ETH',
        img: ic_eth
    },
    {
        txt: 'BNB',
        img: ic_bnb
    },
    {
        txt: 'POLYGON',
        img: ic_polgon
    },
    {
        txt: 'DIVIDER',
        img: ''
    },
    {
        txt: 'CREATE',
        img: ic_create
    },
    {
        txt: 'FOLLOW',
        img: ic_create
    },
    {
        txt: 'IPFS',
        img: ic_create
    }
];

const GFTLeftMenu = () => {
    const navigate = useNavigate();
    const { activate, account, chainId, active, library, deactivate } = useWeb3React();
    const { isOpenMenuLeft } = useSelector(s => s.dialog);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
        }

    }, [])

    const clickMenu = (item) => {
        if (item.txt === 'HOME') {
            navigate('/');
        } else if (item.txt === 'CHECK IN') {
            if (account) {
                dispatch(setOpenCheckIn(true));
            } else {
                dispatch(setIsOpen(true));
            }
        } else if (item.txt === 'GLOBAL') {
            navigate('/global');
        } else if (item.txt === 'FOLLOW') {
            navigate('/follow');
        } else if (item.txt === 'CREATE') {
            navigate('/create_project');
        } else if (item.txt === 'MINT AVATAR') {
            if (account) {
                navigate('/mint');
            } else {
                dispatch(setIsOpen(true));
            }
        } else if (item.txt === 'POLYGON') {
            navigate('/hall');
        } else if (item.txt === 'IPFS') {
            navigate('/ipfs');
        } else if (item.txt === 'INTRODUCE') {
            navigate('/introduce');
        }
    }

    let itemTarget = '_self';
    // if (item.target) {
    //     itemTarget = '_blank';
    // }
    let listItemProps = { component: forwardRef((props, ref) => <Link ref={ref} {...props} to={'/introduce'} target={itemTarget} />) };
    // if (item?.external) {
    // }
    // let listItemProps = { component: 'a', href: '/introduce', target: itemTarget };

    return (
        <Paper sx={{ width: 230 }}>
            <MenuList>
                {mapData.map((item, index) => {
                    if (item.txt === 'DIVIDER') {
                        return (<Divider key={'main-menu-' + index} />);
                    }
                    return (
                        <MenuItem
                            // {...listItemProps}
                            key={'main-menu-' + index}
                            onClick={() => {
                                if (!item.out) {
                                    clickMenu(item);
                                }
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
                })}
            </MenuList>
        </Paper>
    );
}

export default React.memo(GFTLeftMenu);