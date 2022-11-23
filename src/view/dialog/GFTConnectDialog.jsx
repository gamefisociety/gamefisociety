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

import './GFTConnectDialog.scss';




function GFTConnectDialog() {
    const isOpenConnect = useSelector(isOpen);
    const dispatch = useDispatch();



    useEffect(() => {
        return () => {

        }

    }, [])

    const requsetData = () => {

    }
    const cancelDialog = () => {
        dispatch(setIsOpen(false));
    }

    const itemClickOpenWallet = (event, item) => {
        console.log(item,"wallet");
        event.stopPropagation();
        if (item == 'MetaMask') {

        } else if (item == "WalletConnect") {

        } else if (item == "Coinbase Wallet") {

        }
    }

    return (

        <div>
            {isOpenConnect ?
                <div className='dialog_connect_bg' onClick={cancelDialog}>
                    <div className='layout' onClick={(event)=>{
                        event.stopPropagation();
                    }}>
                        <span className='title'>Connect</span>
                        <div className='item' onClick={(event) => itemClickOpenWallet(event, "MetaMask")}>
                            <span className='name'>MetaMask</span>
                            <div className='ic_metamask'></div>
                            <div className='ic_menu_right'></div>
                        </div>
                        <div className='item'>
                            <span className='name' onClick={(event) => itemClickOpenWallet(event, "WalletConnect")} >WalletConnect</span>
                            <div className='ic_walletconnect'></div>
                            <div className='ic_menu_right'></div>
                        </div>
                        <div className='item' onClick={(event) => itemClickOpenWallet(event, "Coinbase Wallet")}>
                            <span className='name'>Coinbase Wallet</span>
                            <div className='ic_coinbase'></div>
                            <div className='ic_menu_right'></div>
                        </div>
                        <span className='privacy'>By continuing you agree to GameFi Society’s <span className='privacy_link'>Privacy Policy</span> and <span className='privacy_link'> Terms and Conditions</span></span>
                    </div>
                </div>
                : ""
            }
        </div>
    );
}

export default GFTConnectDialog;