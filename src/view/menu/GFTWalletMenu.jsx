import { React, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useSelector, useDispatch } from 'react-redux';
import {
    setIsOpenWallet,
    isMenuWallet
} from '../../module/store/features/dialog/GFTDialogSlice';
import { changeNetwork, ChainId } from '../../web3/GFTChainNet'
import './GFTWalletMenu.scss';




function GFTWalletMenu() {
    const injected = new InjectedConnector({
        supportedChainIds: [ChainId.MATICTEST],
    })
    const { activate, account, chainId, active, library, deactivate } = useWeb3React();
    const isOpenMenu = useSelector(isMenuWallet);
    const dispatch = useDispatch();
    useEffect(() => {
        requsetData();
        return () => {

        }

    }, [])

    const requsetData = () => {


    }
    const cancelDialog = () => {
        dispatch(setIsOpenWallet(false));
    }

    const getChainLows = () => {
        if (account) {
            return account.substring(0, 5) + "....." + account.substring(account.length - 5, account.length);
        }
        return "MetaMask"
    }
    const logOutWallet = () => {
        deactivate();
        cancelDialog();
    }
    return (

        <div>
            {isOpenMenu ?
                <div className='wallet_menu_bg' onClick={cancelDialog}>
                    <div className='layout' onClick={(event) => {
                        event.stopPropagation();
                    }}>
                        <div className='title_layout'>
                            <div className='address_layout'>
                                <span className='address'>{getChainLows()}</span>
                                <div className='copy_img'></div>
                            </div>
                            <span className='go_pro'>Go PRO</span>
                        </div>

                        <div className='layout_bottom'>
                            <div className='setting_layout'>
                                <div className='btn_layout'>
                                    <div className='icon_portfolio'></div>
                                    <span className='txt'>Portfolio</span>
                                    <div className='icon_right'></div>
                                </div>
                                <div className='btn_layout'>
                                    <div className='icon_setting'></div>
                                    <span className='txt'>Settings</span>
                                    <div className='icon_right'></div>
                                </div>
                            </div>
                            <span className='btn_logout' onClick={logOutWallet}>Log out</span>
                        </div>
                    </div>
                </div>
                : ""
            }
        </div>
    );
}

export default GFTWalletMenu;