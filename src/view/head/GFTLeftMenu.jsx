import { React, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { useSelector, useDispatch } from 'react-redux';
import {
    isCheckIn,
    setOpenCheckIn
} from '../../module/store/features/dialog/GFTDialogSlice';
import './GFTLeftMenu.scss';

import ic_bnb from "../../asset/image/home/ic_bnb.png"
import ic_eth from "../../asset/image/home/ic_eth.png"
import ic_swap from "../../asset/image/home/ic_swap.png"
import ic_polgon from "../../asset/image/home/ic_polgon.png"
import ic_check_in from "../../asset/image/home/ic_check_in.png"


function GFTLeftMenu() {
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
        dispatch(setOpenCheckIn(true));
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


        </div>

    );
}

export default GFTLeftMenu;