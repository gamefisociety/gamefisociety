import { React, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import {
    decrement,
    increment,
    setIsOpen,
    setIsOpenWallet,
    isOpen
} from 'module/store/features/dialogSlice';

import './GFTHead.scss';

import ic_logo from "../../asset/image/logo/ic_logo.png"
import ic_massage from "../../asset/image/home/ic_massage.png"
import ic_wallet from "../../asset/image/home/ic_wallet.png"
import ic_man from "../../asset/image/home/ic_man.png"

function GFTHead() {
    const navigate = useNavigate();
    const { activate, account, chainId, active, library, deactivate } = useWeb3React();
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

    return (

        <div className='head_bg'>
            <img className="logo" src={ic_logo} onClick={clickLogo}></img>
            <div className='right'>
                <img className='man' src={ic_man}></img>
                <img className='message' src={ic_massage}></img>
                <div className='wallet_layout' onClick={openDialog}>
                    <img className='img' src={ic_wallet} ></img>
                    <span className='txt'>{account ? getChainLows() : 'CONNECT'}</span>
                </div>
            </div>
        </div>

    );
}

export default GFTHead;