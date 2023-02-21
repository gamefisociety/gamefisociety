import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from "notistack";
import {
    decrement,
    increment,
    setIsOpen,
    isOpen
} from 'module/store/features/dialogSlice';
import { changeNetwork, ChainId } from '../../web3/GFTChainNet'

import './GFTChatDialog.scss';

const GFTChatDialog = () => {
    const { enqueueSnackbar } = useSnackbar();
    const injected = new InjectedConnector({
        supportedChainIds: [ChainId.MATICTEST],
    })
    const { activate, account, chainId, active, library, deactivate } = useWeb3React();
    const { } = useSelector(s => s.dialog);
    const dispatch = useDispatch();
    useEffect(() => {
        requsetData();
        return () => {

        }

    }, [])

    const requsetData = () => {
        if (!window.ethereum) {
            return;
        }
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                deactivate()
            }
        })

        window.ethereum.on('disconnect', () => {
            deactivate()
        })

        window.ethereum.on('close', () => {
            deactivate()
        })

        window.ethereum.on('message', message => {
            // console.log('message', message)
        })
        window.ethereum.on('networkChanged', () => {
            activateMask();

        })

    }
    const cancelDialog = () => {
        dispatch(setIsOpen(false));
    }

    const itemClickOpenWallet = (event, item) => {
        console.log(item, "wallet");
        event.stopPropagation();
        if (item == 'MetaMask') {

            connectedClick();
        } else if (item == "WalletConnect") {

        } else if (item == "Coinbase Wallet") {

        }
    }

    const activateMask = async () => {
        try {
            await activate(injected, undefined, true).then(res => {
                cancelDialog();
            }).catch(error => {
                enqueueSnackbar(error, {
                    variant: "error",
                    anchorOrigin: { horizontal: "center", vertical: "top" }
                });
            })
        } catch (ex) {
            enqueueSnackbar(ex, {
                variant: "error",
                anchorOrigin: { horizontal: "center", vertical: "top" }
            });
            console.log(ex, "ex");
        }
    }

    const connectedClick = () => {
        console.log(chainId);
        if (chainId != ChainId.MATICTEST) {
            changeNetwork(ChainId.MATICTEST).then(res => {
                activateMask();
            })
            return;
        }
        activateMask();
    }

    const getChainLows = () => {
        if (account) {
            return account.substring(0, 5) + "....." + account.substring(account.length - 5, account.length);
        }
        return "MetaMask"
    }
    return (
        <div className='dialog_connect_bg' onClick={cancelDialog}>
            <div className='layout' onClick={(event) => {
                event.stopPropagation();
            }}>
                <span className='title'>Connect</span>
                <div className='item' onClick={(event) => itemClickOpenWallet(event, "MetaMask")}>
                    <span className='name'>{account ? getChainLows() : 'MetaMask'}</span>
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
    );
}

export default React.memo(GFTChatDialog);