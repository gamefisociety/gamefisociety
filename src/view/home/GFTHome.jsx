import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

import { getListData } from '../../api/requestData'

import './GFTHome.scss';

import ic_logo from "../../asset/image/logo/ic_logo.png"
import ic_massage from "../../asset/image/home/ic_massage.png"
import ic_wallet from "../../asset/image/home/ic_wallet.png"
import ic_man from "../../asset/image/home/ic_man.png"

import ic_mobile from "../../asset/image/home/ic_mobile.png"
import ic_nft from "../../asset/image/home/ic_nft.png"
import ic_battle from "../../asset/image/home/ic_battle.png"
import ic_card from "../../asset/image/home/ic_card.png"
import ic_bnb from "../../asset/image/home/ic_bnb.png"
import ic_eth from "../../asset/image/home/ic_eth.png"
import ic_swap from "../../asset/image/home/ic_swap.png"


function GFTHome() {

    const [videoList, setVideoList] = React.useState([]);
    useEffect(() => {
        requsetData();
        return () => {

        }

    }, [])

    const requsetData = () => {
        
        getListData().then(res => {
            console.log(res.list, "res");
            setVideoList(res.list);
        })
    }

    return (
        <div className='bg'>
            <div className='head'>
                <img className="logo" src={ic_logo}></img>
                <div className='right'>
                    <img className='man' src={ic_man}></img>
                    <img className='message' src={ic_massage}></img>
                    <div className='wallet_layout'>
                        <img className='img' src={ic_wallet} ></img>
                        <span className='txt'>CONNECT</span>
                    </div>
                </div>
            </div>
            <div className='let_menu'>
                <img className='img' src={ic_swap}></img>
                <img className='img' src={ic_bnb}></img>
                <img className='img' src={ic_eth}></img>
            </div>
            <div className='content'>
                <div className='item_tab'>
                    <div className='card_layout right_18'>
                        <img className='img' src={ic_card}></img>
                        <span className='txt'>Card Area</span>
                    </div>
                    <div className='mobile_layout right_18'>
                        <img className='img' src={ic_mobile}></img>
                        <span className='txt1'>
                            Mobile
                        </span>
                        <span className='txt'>
                            Phone Area
                        </span>
                    </div>
                    <div className='nft_layout right_18'>
                        <img className='img' src={ic_nft}></img>
                        <span className='txt'>NFT Trading Area</span>
                    </div>
                    <div className='battle_layout'>
                        <img className='img' src={ic_battle}></img>
                        <span className='txt'>Battle Area</span>
                    </div>
                </div>
                <div className='video_layout'>
                    {Array.from(videoList).map((item, index) => (

                        <iframe key={"videoKey" + index} className='video'
                            width="310"
                            height="173"
                            src={item.url}
                            controls="0"
                            allow="fullscreen;" >
                        </iframe>

                    ))}
                </div>
            </div>
        </div>
    );
}

export default GFTHome;