import { React, useEffect, useState, useRef } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useLocation, Link, useSearchParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Mousewheel, Keyboard } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MenuUnstyled from '@mui/base/MenuUnstyled';
import { StyledListbox, StyledMenuItem, Popper } from '../menu/GFTMenuPopStyle'
import {
    getDetailData
} from '../../api/requestData'

import './GFTNFTDetail.scss';
import down_drop_icon from "../../asset/image/detail/down_drop_icon.png"
import ic_open_dapp from "../../asset/image/logo/ic_open_dapp.png"
import ic_report from "../../asset/image/logo/ic_report.png"
import ic_share from "../../asset/image/logo/ic_share.png"







function GFTNFTDetail() {

    let location = useLocation();
    const [search, setsearch] = useSearchParams();
    const [videoList, setVideoList] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [detailData, setDetailData] = useState({
        chainList: [], banner: [], social: {}, stats: {
            h24: {
                uaw: {
                    percen: 0,
                    sum: 0
                },
                transactions: {
                    percen: 0,
                    sum: 0
                },
                volume: {
                    percen: 0,
                    sum: 0
                },
                balance: {
                    percen: 0,
                    sum: 0
                }
            }, d7: {
                uaw: {
                    percen: 0,
                    sum: 0
                },
                transactions: {
                    percen: 0,
                    sum: 0
                },
                volume: {
                    percen: 0,
                    sum: 0
                },
                balance: {
                    percen: 0,
                    sum: 0
                }
            }, d30: {
                uaw: {
                    percen: 0,
                    sum: 0
                },
                transactions: {
                    percen: 0,
                    sum: 0
                },
                volume: {
                    percen: 0,
                    sum: 0
                },
                balance: {
                    percen: 0,
                    sum: 0
                }
            }
        }
    });
    const [tabStats, setTabStats] = useState("h24");
    const buttonRef = useRef(null);
    const menuActions = useRef(null);
    const preventReopen = useRef(false);
    const isOpen = Boolean(anchorEl);
    const [pathName, setPathName] = useState(search.get('name'));

    useEffect(() => {
        requsetData();
        return () => {

        }

    }, [])

    const requsetData = () => {
        console.log(location);
        getDetailData(pathName).then(res => {
            console.log(res.data, "res");
            setDetailData(res.data);
            setVideoList(res.data.videos);
        })

    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const onClickTab = (name) => {
        setTabStats(name);
    }
    const getBalancesStats = (name, name2) => {
        return detailData.stats[name][name2].sum;
    }
    const getPercentStats = (name, name2) => {
        return detailData.stats[name][name2].percen;
    }

    return (
        <div className='nft_detail_bg'>
            <div className='layout'>
                <div className='tab_layout'>
                    <Link className="txt" to="/">Home</Link>
                    <span className='txt'> {'>'}</span>
                    <span className='txt'> Rankings</span>
                    <span className='txt'> {'>'}</span>
                    <span className='txt'> {pathName} </span>
                </div>
                <div className='head_layout'>
                    <div className='product_layout'>
                        <img className='icon' src={detailData.icon}></img>
                        <div className='title_layout'>
                            <span className='title'>{detailData.name}</span>
                            <div className='data'>
                                <span className='txt'>Showing data for</span>
                                <div id='basic-button' className='info_chain_layout' onClick={handleClick}>
                                    <span className='number'>{detailData.chainList.length}</span>
                                    <span className='chain'>All chains</span>
                                    <img className='img' src={down_drop_icon}></img>
                                </div>
                                <MenuUnstyled
                                    actions={menuActions}
                                    open={isOpen}
                                    onClose={handleClose}
                                    anchorEl={anchorEl}
                                    slots={{ root: Popper, listbox: StyledListbox }}
                                    slotProps={{ listbox: { id: 'simple-menu' } }}
                                >
                                    <StyledMenuItem>
                                        <span className='detail_menu_number'>{detailData.chainList.length}</span>
                                        All chains
                                    </StyledMenuItem>
                                    {Array.from(detailData.chainList).map((item, index) => (
                                        <StyledMenuItem key={"item_chain_list_" + index}>
                                            <img className='detail_menu_img' src={item.icon}></img>
                                            {item.name}
                                        </StyledMenuItem>
                                    ))};
                                </MenuUnstyled>
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
                        <span className='desc'>{detailData.about}</span>
                        <span className='moreBtn'>Read more.</span>
                        <div className='item_fc_layout'>
                            <span className='name'>Rank</span>
                            <span className='rank_vis'>{detailData.rank_General} In General</span>
                            <span className='rank_vis'>#{detailData.rank_marketplaces} in Marketplaces</span>
                        </div>
                        <div className='item_fc_layout'>
                            <span className='name2'>Social</span>
                            {
                                detailData.social.twitter && <div className='icon_twitter'></div>

                            }
                            {
                                detailData.social.meduim && <div className='icon_meduim'></div>

                            }
                            {
                                detailData.social.discord && <div className='icon_discord'></div>

                            }
                            {
                                detailData.social.reddit && <div className='icon_facebook'></div>

                            }
                            {
                                detailData.social.facebook && <div className='icon_github'></div>

                            }
                            {
                                detailData.social.github && <div className='icon_telegram'></div>

                            }
                            {
                                detailData.social.telegram && <div className='icon_youtube'></div>

                            }
                            {
                                detailData.social.ins && <div className='icon_ins'></div>

                            }


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
                        {Array.from(detailData.banner).map((item, index) => (
                            <SwiperSlide key={"swiper_key_" + index}>
                                <img className='img' src={item.url}></img>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                </div>
                <div className='stats_layout'>
                    <span className='title'>Dapp stats</span>
                    <div className='time_layout'>
                        <span className={tabStats == "h24" ? "btn_en" : 'btn'} onClick={() => onClickTab("h24")}>24h</span>
                        <span className={tabStats == "d7" ? "btn_en" : 'btn'} onClick={() => onClickTab("d7")}>7d</span>
                        <span className={tabStats == "d30" ? "btn_en" : 'btn'} onClick={() => onClickTab("d30")}>30d</span>
                    </div>
                    <div className='utvb_layout'>
                        <div className='item_layout'>
                            <span className='t_txt'>UAW</span>
                            <span className='t_price'>{getBalancesStats(tabStats, "uaw")}</span>
                            <span className={getPercentStats(tabStats, "uaw") >= 0 ? "t_up" : "t_down"}>{getPercentStats(tabStats, "uaw") + "%"}</span>
                            <div className='img'></div>
                        </div>
                        <div className='item_layout'>
                            <span className='t_txt'>Transactions</span>
                            <span className='t_price'>{getBalancesStats(tabStats, "transactions") }</span>
                            <span className={getPercentStats(tabStats, "transactions") >= 0 ? "t_up" : "t_down"}>{getPercentStats(tabStats, "transactions") + "%"}</span>
                            <div className='img'></div>
                        </div>
                        <div className='item_layout'>
                            <span className='t_txt'>Volume</span>
                            <span className='t_price'>{getBalancesStats(tabStats, "volume")}</span>
                            <span className={getPercentStats(tabStats, "volume") >= 0 ? "t_up" : "t_down"}>{getPercentStats(tabStats, "volume") + "%"}</span>
                            <div className='img'></div>
                        </div>
                        <div className='item_layout'>
                            <span className='t_txt'>Balance</span>
                            <span className='t_price'>{getBalancesStats(tabStats, "volume")}</span>
                            <span className={getPercentStats(tabStats, "balance") >= 0 ? "t_up" : "t_down"}>{getPercentStats(tabStats, "balance") + "%"}</span>
                            <div className='img'></div>
                        </div>
                    </div>
                </div>
                <div className='video_info_title'>
                    <span className='txt'>Related Videos</span>
                    <span className='txt1'>A collection of videos uploaded by enthusiast users themselves</span>
                    <span className='txt_sum'>（ {videoList.length} videos ）</span>
                </div>
                <div className='video_layout'>
                    {Array.from(videoList).map((item, index) => (
                        <div className='layout'>
                            <iframe key={"video_detail_Key" + index} className='video'
                                src={item.url}
                                frameborder="0"
                                controls="0"
                                allow="fullscreen;" >
                            </iframe>
                            <span className='txt'>{item.title}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div >
    );

}

export default GFTNFTDetail;