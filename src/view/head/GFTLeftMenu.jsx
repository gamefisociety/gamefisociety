import { React, useEffect, useState } from 'react';
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
import { Divider } from '@mui/material/index';

import ic_bnb from "asset/image/home/ic_bnb.png"
import ic_eth from "asset/image/home/ic_eth.png"
import ic_swap from "asset/image/home/ic_swap.png"
import ic_polgon from "asset/image/home/ic_polgon.png"
import ic_check_in from "asset/image/home/ic_check_in.png"
import ic_free_nft from "asset/image/home/ic_free_nft.png"
import ic_create from 'asset/image/home/ic_create.png'

const GFTLeftMenu = () => {
    const navigate = useNavigate();
    const { activate, account, chainId, active, library, deactivate } = useWeb3React();
    const { isOpenMenuLeft } = useSelector(s => s.dialog);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
        }

    }, [])

    const openCheckIn = () => {
        if (account) {
            dispatch(setOpenCheckIn(true));
        } else {
            dispatch(setIsOpen(true));
        }
    }

    const mintAvatarHandle = () => {
        if (account) {
            dispatch(setOpenMintAvatar(true));
        } else {
            dispatch(setIsOpen(true));
        }
    }

    const clickCreate = () => {
        navigate('/create_project');
    }

    const clickGlobal = () => {
        navigate('/global');
    }

    return (
        <div className='left_menu_bg'>
            <div className='item' onClick={openCheckIn}>
                <img className='img' src={ic_check_in}></img>
                <span className='txt'>CHECK IN</span>
            </div>
            <div className='item' onClick={mintAvatarHandle}>
                <img className='img' src={ic_free_nft}></img>
                <span className='txt'>MINT AVATAR</span>
            </div>
            <div className='item'>
                <img className='img' src={ic_swap}></img>
                <span className='txt'>SWAP</span>
            </div>
            <div className='item'>
                <img className='img' src={ic_eth}></img>
                <span className='txt'>ETH</span>
            </div>
            <div className='item'>
                <img className='img' src={ic_bnb}></img>
                <span className='txt'>BNB</span>
            </div>
            <Divider light />
            <div className='item'>
                <img className='img' src={ic_polgon} onClick={() => {
                    navigate('/hall');
                }}></img>
                <span className='txt' >POLYGON</span>
            </div>
            <div className='item'>
                <img className='img' src={ic_create} onClick={clickCreate}></img>
                <span className='txt'>CREATE</span>
            </div>
            <div className='item' onClick={clickGlobal}>
                <img className='img' src={ic_create}></img>
                <span className='txt'>Global</span>
            </div>
        </div>
    );
}

export default GFTLeftMenu;