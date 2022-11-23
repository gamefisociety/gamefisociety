import { React, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useLocation, Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Mousewheel, Keyboard } from "swiper";
import './GFTNFTDetail.scss';

import down_drop_icon from "../../asset/image/detail/down_drop_icon.png"
import opensea_icon from "../../asset/image/detail/opensea_icon.png"
import img_swiper from "../../asset/image/detail/img_swiper.png"
import ic_open_dapp from "../../asset/image/logo/ic_open_dapp.png"
import ic_report from "../../asset/image/logo/ic_report.png"
import ic_share from "../../asset/image/logo/ic_share.png"


import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


function GFTNFTDetail() {

    let location = useLocation();
    const [videoList, setVideoList] = useState([1,2,3,4,5,6,7,8,9,10]);

    useEffect(() => {
        requsetData();
        return () => {

        }

    }, [])

    const requsetData = () => {
        console.log(location);

    }

    return (
        <div className='nft_detail_bg'>
            <div className='layout'>
                <div className='tab_layout'>
                    <Link className="txt" to="/">Home</Link>
                    <span className='txt'> {'>'}</span>
                    <span className='txt'> Rankings</span>
                    <span className='txt'> {'>'}</span>
                    <span className='txt'> Alien Worlds </span>
                </div>
                <div className='head_layout'>
                    <div className='product_layout'>
                        <img className='icon' src={opensea_icon}></img>
                        <div className='title_layout'>
                            <span className='title'>OpenSea</span>
                            <div className='data'>
                                <span className='txt'>Showing data for</span>
                                <div className='info_chain_layout'>
                                    <span className='number'>7</span>
                                    <span className='chain'>All chains</span>
                                    <img className='img' src={down_drop_icon}></img>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='right_layout'>
                        <div className='btn_open'>
                            <img className='img' src={ic_open_dapp}></img>
                            <span className='txt'>Open dapp</span>
                        </div>
                        <div className='item_layout'>
                            <div className='share_btn'>
                                <img className='img' src={ic_share}></img>
                                <span className='txt'>Share</span>
                            </div>
                            <div className='share_btn'>
                                <img className='img' src={ic_report}></img>
                                <span className='txt'>Report</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='tab_info_layout'>
                    <span className='btn_en'>Overview</span>
                    <span className='btn_un'>Marketplace</span>
                </div>
                <div className='info_layout'>
                    <div className='info_content'>
                        <span className='title'>About OpenSea</span>
                        <span className='desc'>OpenSea is the first and largest peer-to-peer marketplace for crypto collectibles, which include gaming items, digital art, and other virtual goods backed by a blockchain.</span>
                        <span className='moreBtn'>Read more.</span>
                        <div className='item_fc_layout'>
                            <span className='name'>Rank</span>
                            <span className='rank_vis'>16 In General</span>
                            <span className='rank_vis'>#1 in Marketplaces</span>
                        </div>
                        <div className='item_fc_layout'>
                            <span className='name2'>Social</span>
                            <div className='icon_twitter'></div>
                            <div className='icon_meduim'></div>
                            <div className='icon_discord'></div>
                            <div className='icon_reddit'></div>
                            <div className='icon_facebook'></div>
                            <div className='icon_github'></div>
                            <div className='icon_telegram'></div>
                            <div className='icon_youtube'></div>
                            <div className='icon_ins'></div>
                        </div>
                    </div>
                    <Swiper
                        cssMode={true}
                        navigation={true}
                        pagination={true}
                        mousewheel={true}
                        keyboard={true}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        modules={[Autoplay, Navigation, Pagination, Mousewheel, Keyboard]}
                        className="mySwiper"
                    >

                        <SwiperSlide>
                            <img className='img' src={img_swiper}></img>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img className='img' src={img_swiper}></img>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img className='img' src={img_swiper}></img>
                        </SwiperSlide>
                    </Swiper>

                </div>
                <div className='stats_layout'>
                    <span className='title'>Dapp stats</span>
                    <div className='time_layout'>
                        <span className='btn_en'>24h</span>
                        <span className='btn'>7d</span>
                        <span className='btn'>30d</span>
                    </div>
                    <div className='utvb_layout'>
                        <div className='item_layout'>
                            <span className='t_txt'>UAW</span>
                            <span className='t_price'>21.5k</span>
                            <span className='t_up'>2.25%</span>
                            <div className='img'></div>
                        </div>
                        <div className='item_layout'>
                            <span className='t_txt'>Transactions</span>
                            <span className='t_price'>43.82k</span>
                            <span className='t_down'>-19.57%</span>
                            <div className='img'></div>
                        </div>
                        <div className='item_layout'>
                            <span className='t_txt'>Volume</span>
                            <span className='t_price'>$55.17k</span>
                            <span className='t_up'>0.78%</span>
                            <div className='img'></div>
                        </div>
                        <div className='item_layout'>
                            <span className='t_txt'>UAW</span>
                            <span className='t_price'>21.5k</span>
                            <span className='t_up'>2.25%</span>
                            <div className='img'></div>
                        </div>
                    </div>
                </div>
                <div className='video_info_title'>
                    <span className='txt'>Related Videos</span>
                    <span className='txt1'>A collection of videos uploaded by enthusiast users themselves</span>
                    <span className='txt_sum'>（ 23 videos ）</span>
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
            </div>

        </div>
    );

}

export default GFTNFTDetail;