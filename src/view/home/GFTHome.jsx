import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

import {
    getListData,
    getListChainData
} from '../../api/requestData'

import './GFTHome.scss';

import ic_logo from "../../asset/image/logo/ic_logo.png"
import ic_detault_head from "../../asset/image/logo/ic_detault_head.png"
import ic_item_hot from "../../asset/image/logo/ic_item_hot.png"
import ic_default_sort_top from "../../asset/image/logo/ic_default_sort_top.png"
import ic_default_sort from "../../asset/image/logo/ic_default_sort.png"

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
    const [chainList, setChainList] = React.useState([]);
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

        getListChainData().then(res => {
            console.log(res.list, "res");
            setChainList(res.list);
        })
    }

    return (
        <div className='home_bg'>
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
                            src={item.url}
                            controls="0"
                            allow="fullscreen;" >
                        </iframe>

                    ))}
                </div>
                <div className="rank_layout_head">
                    <span className='number'>#</span>
                    <span className='name'>Name</span>
                    <div className='layout_item'>
                        <span className='balance'>Balance</span>
                        <img className='sort_img' src={ic_default_sort}></img>
                    </div>
                    <div className='layout_item'>
                        <span className='uaw'>UAW</span>
                        <img className='sort_img' src={ic_default_sort}></img>
                    </div>
                    <div className='layout_item'>
                        <span className='volume'>Volume</span>
                        <img className='sort_img' src={ic_default_sort}></img>
                    </div>
                    <span className='social_signa'>social_signa</span>
                </div>
                {Array.from(chainList).map((item, index) => (
                    <div className='rank_layout'>
                        {
                            item.isAd ?
                                <div className='number_ad'>AD</div>
                                :
                                <div className='number'>{index}</div>
                        }

                        <img className='pro_img' src={item.icon}></img>
                        <div className='layout_name'>
                            <span className='name'>{item.name}</span>
                            <span className='chain_name'>{item.chainName}</span>
                        </div>
                        <span className="balance">{item.balance}</span>
                        <div className='layout_uaw'>
                            <span className='uaw'>{item.uawSum}</span>
                            <span className='uaw_red'>{item.uaw}</span>
                        </div>
                        <span className='volume'>{item.volume}</span>
                        <div className='layout_social_signal'>
                            <img className='img_hot' src={ic_item_hot}></img>
                            <span className='txt_price'>{item.price}</span>
                            <span className='txt_up'>{item.percentage}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GFTHome;