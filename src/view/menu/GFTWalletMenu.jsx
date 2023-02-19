import { React, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useSelector, useDispatch } from 'react-redux';
import {
    setIsOpenWallet,
    isMenuWallet
} from 'module/store/features/dialogSlice';
// import GSTTokenBase from '../../web3/GSTToken';
import GSTPointsBase from '../../web3/GSTPoints';
import { changeNetwork, ChainId } from '../../web3/GFTChainNet'
import './GFTWalletMenu.scss';

const GFTWalletMenu = () => {
    const injected = new InjectedConnector({
        supportedChainIds: [ChainId.MATICTEST],
    })
    const [gstBalance, setGSTBalance] = useState("0");
    const { activate, account, chainId, active, library, deactivate } = useWeb3React();
    const { isOpenMenuWallet } = useSelector(s => s.dialog);
    const dispatch = useDispatch();
    useEffect(() => {
        requsetData();
        return () => {

        }

    }, [])

    const requsetData = () => {
        getGSTPoints();
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
    // const getTokenGST = () => {
    //     if (account) {
    //         GSTTokenBase.getTokenbalanceOf(library, account).then(res => {
    //             setGSTBalance(res/1000000000000000000.0);
    //         }).catch(err => {
    //             console.log(err,'err');

    //         })
    //     } else {
    //         return 0;
    //     }
    // }
    const getGSTPoints = () => {
        if (account) {
            GSTPointsBase.getTokenbalanceOf(library, account).then(res => {
                setGSTBalance(res / 1000000000000000000.0);
            }).catch(err => {
                console.log(err, 'err');

            })
        } else {
            return 0;
        }
    }
    return (
        <div className='wallet_menu_bg' onClick={cancelDialog}>
            <div className='layout' onClick={(event) => {
                event.stopPropagation();
            }}>
                <div className='wallet_infor_layout'>
                    <div className='title_layout'>
                        <div className='address_layout'>
                            <span className='address'>{getChainLows()}</span>
                            <div className='copy_img'></div>
                        </div>
                        <span className='go_pro'>Go PRO</span>
                    </div>
                    <div className='wallet_verified'>
                        <div className='img'></div>
                        <div className='txt'>Wallet verified</div>
                    </div>
                    <div className='coin_gfs_bas'>
                        <div className='coin_gft'>
                            <div className='img'></div>
                            {gstBalance} GST
                        </div>
                        <span className='usdtxt'>$ 0.00 USD</span>
                        <div className='item_coin_swap'>
                            <div className='item'>
                                <div className='img_buy'></div>
                                <span className='txt'>Buy</span>
                            </div>
                            <div className='item'>
                                <div className='img_send'></div>
                                <span className='txt'>Send</span>
                            </div>
                            <div className='item'>
                                <div className='img_exchange'></div>
                                <span className='txt'>Exchange</span>
                            </div>
                        </div>
                    </div>
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
    );
}

export default GFTWalletMenu;