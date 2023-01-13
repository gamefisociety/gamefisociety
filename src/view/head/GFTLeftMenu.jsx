import { React, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import {
    isCheckIn,
    setOpenCheckIn,
    setIsOpen
} from '../../module/store/features/dialog/GFTDialogSlice';
import './GFTLeftMenu.scss';

import ic_bnb from "../../asset/image/home/ic_bnb.png"
import ic_eth from "../../asset/image/home/ic_eth.png"
import ic_swap from "../../asset/image/home/ic_swap.png"
import ic_polgon from "../../asset/image/home/ic_polgon.png"
import ic_check_in from "../../asset/image/home/ic_check_in.png"
import ic_create from '../../asset/image/home/ic_create.png'


function GFTLeftMenu() {
    const navigate = useNavigate();
    const { activate, account, chainId, active, library, deactivate } = useWeb3React();
    const isOpen = useSelector(isCheckIn);
    const dispatch = useDispatch();

    useEffect(() => {
        requsetData();
        return () => {

        }

    }, [])

    const requsetData = () => {

    }
    const openCheckIn = () => {
        if (account) {
            dispatch(setOpenCheckIn(true));
        } else {
            dispatch(setIsOpen(true));
        }
    }

    const clickCreate = () => {
        navigate('/create_project');
    }

    return (
        <div className='left_menu_bg'>
            <div className='item' onClick={openCheckIn}>
                <img className='img' src={ic_check_in}></img>
                <span className='txt'>check in</span>
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
            <div className='item'>
                <img className='img' src={ic_polgon}></img>
                <span className='txt'>POLYGON</span>
            </div>
            <div className='item'>
                <img className='img' src={ic_create} onClick={clickCreate}></img>
                <span className='txt'>create</span>
            </div>
        </div>

    );
}

export default GFTLeftMenu;