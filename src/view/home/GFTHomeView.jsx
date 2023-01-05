import { React, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { HashRouter, Route, Link, useNavigate } from 'react-router-dom'
import {
    getListData,
    getListChainData
} from '../../api/requestData'
import {getALLAssetsForAccount} from '../../api/nftscan'
import './GFTHomeView.scss';
import FsLightbox from 'fslightbox-react';
import GFTFooter from '../footer/GFTFooter';

import ic_logo from "../../asset/image/logo/ic_logo.png"
import ic_detault_head from "../../asset/image/logo/ic_detault_head.png"
import ic_item_hot from "../../asset/image/logo/ic_item_hot.png"
import ic_default_sort_top from "../../asset/image/logo/ic_default_sort_top.png"
import ic_default_sort from "../../asset/image/logo/ic_default_sort.png"


import ic_mobile from "../../asset/image/home/ic_mobile.png"
import ic_nft from "../../asset/image/home/ic_nft.png"
import ic_battle from "../../asset/image/home/ic_battle.png"
import ic_card from "../../asset/image/home/ic_card.png"
import ic_play_youtube from "../../asset/image/logo/ic_play_youtube.png"


function GFTHomeView() {

    const [videoList, setVideoList] = useState([]);
    const [chainList, setChainList] = useState([]);
    const [fsLightList, setFsLightList] = useState([]);
    const [toggler, setToggler] = useState(false);
    const [togSlide, setTogSlide] = useState(0);

    const navigate = useNavigate();
    useEffect(() => {
        requsetData();
        fetchAllNFTs();
        return () => {

        }

    }, [])

    const requsetData = () => {

        getListData().then(res => {
            let list = [];
            for (let i = 0; i < res.list.length; i++) {
                list.push(res.list[i].url);
            }
            setFsLightList(list);
            setVideoList(res.list);
        })

        getListChainData().then(res => {
            console.log(res.list, "res");
            setChainList(res.list);
        })
    }

    const fetchAllNFTs = () => {
        getALLAssetsForAccount("0xcE97Ca12A55288f388a09392c6D525eBe94F8617").then(res => {
            console.log('fetchAllNFTs', res);
        }).catch((reason) => {

        })
        
    }

    const itemNFTClick = (item) => {
        navigate('/detail?name=' + item.name);
    }
    const itemVideo = (index) => {
        console.log(index);
        setTogSlide(index + 1);
        setToggler(!toggler);
    }


    return (
        <div className='content_bg'>
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
                    <div key={"video_item_" + index} className="layout_item" onClick={() => itemVideo(index)}>
                        <img className='video' src={item.thumb}>

                        </img>
                        <img className='play' src={ic_play_youtube}></img>
                        <span className="txt">{item.desc}</span>
                    </div>

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
                <div key={"chain_list" + index} className='rank_layout' onClick={() => itemNFTClick(item)}>
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
                        <span className='uaw_red'>{item.uaw}%</span>
                    </div>
                    <span className='volume'>{item.volume}</span>
                    <div className='layout_social_signal'>
                        <img className='img_hot' src={ic_item_hot}></img>
                        <span className='txt_price'>{item.price}</span>
                        <span className='txt_up'>{item.percentage}%</span>
                    </div>
                </div>
            ))}
            <GFTFooter></GFTFooter>
            <FsLightbox
                toggler={toggler}
                sources={fsLightList}
                slide={togSlide}
            />
        </div>);

}

export default GFTHomeView;