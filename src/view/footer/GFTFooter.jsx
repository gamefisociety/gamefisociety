import { React, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

import { Outlet } from 'react-router-dom'

import './GFTFooter.scss';
import footer_logo from "../../asset/image/logo/footer_logo.png"
import icon_crypto from "../../asset/image/logo/icon_crypto.png"
import icon_coingecko from "../../asset/image/logo/icon_coingecko.png"
import icon_menu_down from "../../asset/image/logo/icon_menu_down.png"




function GFTFooter() {


    return (
        <div className='footer_bg'>
            <div className='line'></div>
            <div className='logo_layout'>
                <div className='logo'>
                    <img className='img' src={footer_logo}></img>
                    <span className='txt'>The gamefi paradise of the world</span>
                </div>

                <div className='media'>
                    <div className='icon_reddit'></div>
                    <div className='icon_meduim'></div>
                    <div className='icon_discord'></div>
                    <div className='icon_facebook'></div>
                    <div className='icon_github'></div>
                    <div className='icon_telegram'></div>
                    <div className='icon_youtube'></div>
                    <div className='icon_ins'></div>
                    <div className='icon_twitter'></div>
                </div>
            </div>
            <div className='line'></div>
            <div className='infor_layout'>
                <div className='txt_layout'>
                    <span className='txt'>Products</span>
                    <span className='txt_tap'>Products</span>
                    <span className='txt_tap'>Token swap</span>
                    <span className='txt_tap'>Airdrops</span>
                </div>
                <div className='txt_layout'>
                    <span className='txt'>Conmpany</span>
                    <span className='txt_tap'>About us</span>
                    <span className='txt_tap'>Press</span>
                    <span className='txt_tap'>Disclaimer</span>
                </div>
                <div className='txt_layout'>
                    <span className='txt'>Resources</span>
                    <span className='txt_tap'>Blog</span>
                    <span className='txt_tap'>FAQ</span>
                </div>
                <div className='txt_layout'>
                    <span className='txt'>Developers</span>
                    <span className='txt_tap'>Submit a project</span>
                    <span className='txt_tap'>Advertising</span>
                </div>
                <div className='txt_layout'>
                    <span className='txt'>Recommendations</span>
                    <span className='txt_tap'>MetaMask</span>
                    <span className='txt_tap'>Huobi Wallet</span>
                    <span className='txt_tap'>Coinbase</span>
                </div>
            </div>
            <div className='service_layout'>
                <span className='txt'>List of services that we’re using to calculate data:</span>
                <img className='img' src={icon_crypto}></img>
                <img className='img' src={icon_coingecko}></img>
            </div>
            <div className='line'></div>
            <div className='layout_setting'>
                <span className='txt'>© 2022 GameFi Society</span>
                <div className='lang'>
                    <span className='txt'>English</span>
                    <img className='img' src={icon_menu_down}></img>
                </div>
            </div>
        </div>
    );
}

export default GFTFooter;