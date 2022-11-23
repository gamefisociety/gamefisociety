import { React, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useSelector, useDispatch } from 'react-redux';
import {
    decrement,
    increment,
    setIsOpen,
    isOpen
} from '../../module/store/features/dialog/GFTDialogSlice';

import './GFTHead.scss';

import ic_logo from "../../asset/image/logo/ic_logo.png"
import ic_massage from "../../asset/image/home/ic_massage.png"
import ic_wallet from "../../asset/image/home/ic_wallet.png"
import ic_man from "../../asset/image/home/ic_man.png"




function GFTHead() {
    const isOpenConnect = useSelector(isOpen);
    const dispatch = useDispatch();

    useEffect(() => {
        requsetData();
        return () => {

        }

    }, [])

    const requsetData = () => {

    }
    const openDialog = () => {
        dispatch(setIsOpen(true));
    }

    return (

        <div className='head_bg'>
            <img className="logo" src={ic_logo}></img>
            <div className='right'>
                <img className='man' src={ic_man}></img>
                <img className='message' src={ic_massage}></img>
                <div className='wallet_layout' onClick={openDialog}>
                    <img className='img' src={ic_wallet} ></img>
                    <span className='txt'>CONNECT</span>
                </div>
            </div>
        </div>

    );
}

export default GFTHead;