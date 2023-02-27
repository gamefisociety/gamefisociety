import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { HashRouter, Route, Link, useNavigate } from 'react-router-dom'
import {
    getListData,
    getListChainData
} from '../../api/requestData'
import { getALLAssetsForAccount } from '../../api/nftscan'
import './GFTHomeView.scss';
import FsLightbox from 'fslightbox-react';

import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CardActions from '@mui/material/CardActions';

import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import ic_banner_l1 from "asset/image/home/banner_l1.png"
import ic_banner_l2 from "asset/image/home/banner_l2.png"
import ic_banner_c from "asset/image/home/banner_c.png"
import ic_banner_r from "asset/image/home/banner_r.png"
import ic_play_youtube from "asset/image/logo/ic_play_youtube.png"

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const win_w = window.screen.width;
console.log('widows width', win_w);

const banners = [
    {
        l1: {
            img: ic_banner_l1,
            link: 'abc',
            label: 'abc'
        },
        l2: {
            img: ic_banner_l2,
            link: 'abc',
            label: 'abc'
        },
        c: {
            img: ic_banner_c,
            link: 'abc',
            label: 'abc'
        },
        r: {
            img: ic_banner_r,
            link: 'abc',
            label: 'abc'
        },
    },
    {
        l1: {
            img: ic_banner_l1,
            link: 'abc',
            label: 'abc'
        },
        l2: {
            img: ic_banner_l2,
            link: 'abc',
            label: 'abc'
        },
        c: {
            img: ic_banner_c,
            link: 'abc',
            label: 'abc'
        },
        r: {
            img: ic_banner_r,
            link: 'abc',
            label: 'abc'
        },
    },
    {
        l1: {
            img: ic_banner_l1,
            link: 'abc',
            label: 'abc'
        },
        l2: {
            img: ic_banner_l2,
            link: 'abc',
            label: 'abc'
        },
        c: {
            img: ic_banner_c,
            link: 'abc',
            label: 'abc'
        },
        r: {
            img: ic_banner_r,
            link: 'abc',
            label: 'abc'
        },
    }
]


const GFTHomeView = () => {

    const [winWidth, setWinWidth] = useState(win_w);
    //
    const [videoList, setVideoList] = useState([]);
    const [chainList, setChainList] = useState([]);
    const [fsLightList, setFsLightList] = useState([]);
    const [toggler, setToggler] = useState(false);
    const [togSlide, setTogSlide] = useState(0);
    //
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = 3;

    const navigate = useNavigate();
    useEffect(() => {
        requsetData();
        // fetchAllNFTs();
        return () => {
        }
    }, [])

    useEffect(() => {
        const winResize = (e) => {
            console.log('window resize', e.target.screen.width);
            setWinWidth(e.target.screen.width);
        }
        window.addEventListener('resize', winResize)
        return () => {
            window.removeEventListener('resize', winResize);
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

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    const renderBanner = () => {
        return <Box sx={{
            width: '100%',
            // height: '42px',
            // backgroundColor: 'blue'
        }}>
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {banners.map((step, index) => (
                    <Grid container key={'banner-index-' + index} spacing={2} sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Grid item xs={4}>
                            <Box
                                key={'banner-index-' + index}
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                <Box
                                    component="img"
                                    sx={{
                                        padding: '8px',
                                        width: '100%',
                                        display: 'block',
                                        overflow: 'hidden',
                                        objectFit: 'fill'
                                        // maxHeight: '116px'
                                    }}
                                    src={step.l1.img}
                                    alt={'a'}
                                />
                                <Box
                                    component="img"
                                    sx={{
                                        padding: '8px',
                                        width: '100%',
                                        display: 'block',
                                        overflow: 'hidden',
                                        objectFit: 'fill'
                                        // maxHeight: '116px'
                                    }}
                                    src={step.l2.img}
                                    alt={'a'}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box
                                component="img"
                                sx={{
                                    width: '100%',
                                    display: 'block',
                                    overflow: 'hidden',
                                }}
                                src={step.c.img}
                                alt={'a'}
                            />
                            {/* <Typography
                                sx={{
                                    width: '100%',
                                    backgroundColor: '#2F2F2F',
                                }}
                                variant="h5"
                                color='white'
                                align={'center'}>
                                {step.c.label}
                            </Typography> */}
                        </Grid>
                        <Grid item xs={4}>
                            <Box
                                component="img"
                                sx={{
                                    width: '100%',
                                    display: 'block',
                                    overflow: 'hidden',
                                }}
                                src={step.r.img}
                                alt={'a'}
                            />
                        </Grid>
                        <Typography >{step.r.label}</Typography>
                    </Grid>
                ))}
            </AutoPlaySwipeableViews>
            <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                    >
                        Next
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                        Back
                    </Button>
                }
            />
        </Box>;
    }

    const renderVideos = () => {
        return (
            <Grid container spacing={0}>
                {videoList.map((item, index) => (
                    <Grid item key={'video-index-' + index} sx={{
                        // backgroundColor: 'blue'
                    }}>
                        <Card sx={{
                            padding: '2px',
                            width: '320px'
                        }} onClick={() => itemVideo(index)}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    sx={{ width: '100%' }}
                                    src={item.thumb}
                                    alt="video" />
                                <CardMedia
                                    component="img"
                                    sx={{
                                        width: '62px',
                                        height: '62px',
                                        position: 'absolute',
                                        left: '38%',
                                        top: '38%'
                                    }}
                                    src={ic_play_youtube}
                                    alt="play" />
                            </CardActionArea>
                            <CardActionArea>
                                <CardContent>
                                    <Typography sx={{ width: '100%', }} color={'white'} variant={'body2'} multiline >
                                        {item.desc}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    }
    // <div key={"chain_list" + index} className='rank_layout' onClick={() => itemNFTClick(item)}>
    //     {
    //         item.isAd ?
    //             <div className='number_ad'>AD</div>
    //             :
    //             <div className='number'>{index}</div>
    //     }
    //     <img className='pro_img' src={item.icon}></img>
    //     <div className='layout_name'>
    //         <span className='name'>{item.name}</span>
    //         <span className='chain_name'>{item.chainName}</span>
    //     </div>
    //     <span className="balance">{item.balance}</span>
    //     <div className='layout_uaw'>
    //         <span className='uaw'>{item.uawSum}</span>
    //         <span className='uaw_red'>{item.uaw}%</span>
    //     </div>
    //     <span className='volume'>{item.volume}</span>
    //     <div className='layout_social_signal'>
    //         <img className='img_hot' src={ic_item_hot}></img>
    //         <span className='txt_price'>{item.price}</span>
    //         <span className='txt_up'>{item.percentage}%</span>
    //     </div>
    // </div>
    const renderGames = () => {
        return (
            <Box>
                <Typography sx={{
                    width: '100%',
                    margin: '12px',
                }} color={'white'} variant={'h6'} align={'left'} >
                    {'Project List'}
                </Typography>
                <Grid container spacing={2}>
                    {chainList.map((item, index) => (
                        <Grid item key={'game-index-' + index} sx={{
                            // backgroundColor: 'blue'
                        }}>
                            <Card sx={{
                                width: '240px',
                                borderRadius: '4px',
                                backgroundColor: 'gray'
                            }}>
                                <CardActionArea sx={{
                                    padding: '12px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start'
                                }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: '64px', height: '64px', borderRadius: '4px' }}
                                        src={item.icon}
                                        alt="icon" />
                                    <Typography sx={{
                                        marginLeft: '12px'
                                    }} color={'white'} variant={'body1'} >
                                        {item.name}
                                    </Typography>
                                </CardActionArea>
                                <CardActions disableSpacing>
                                    <IconButton sx={{}} size="small" onClick={() => {
                                        // setLoginState(0);
                                    }}>
                                        <ChatBubbleOutlineIcon />
                                    </IconButton>
                                    {/* <IconButton sx={{}} size="small" onClick={() => {
                                    // setLoginState(0);
                                }}>
                                    <ChatBubbleOutlineIcon />
                                </IconButton> */}
                                    <Box sx={{ flexGrow: 1 }}></Box>
                                    <IconButton sx={{}} size="small" onClick={() => {
                                        // setLoginState(0);
                                    }}>
                                        <MoreHorizIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        )
    }

    const renderNews = () => {
        return <Box sx={{
            width: '100%',
            height: '42px',
            // backgroundColor: 'blue'
        }}></Box>;
    }

    const renderNots = () => {
        return <Box sx={{
            width: '100%',
            height: '42px',
            // backgroundColor: 'blue'
        }}></Box>;
    }

    return (
        <Paper sx={{
            width: '100%',
            minHeight: '400px',
            // backgroundColor: 'red'
        }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box sx={{ padding: '24px' }}>
                        {renderBanner()}
                    </Box>
                </Grid>
                <Divider />
                <Grid item xs={12}>
                    {renderVideos()}
                </Grid>
                <Divider />
                <Grid item xs={9}>
                    {renderGames()}
                </Grid>
                <Grid item xs={3}>
                    {renderNews()}
                </Grid>
                <Divider />
                <Grid item xs={12}>
                    {renderNots()}
                </Grid>
            </Grid>
            <FsLightbox
                toggler={toggler}
                sources={fsLightList}
                slide={togSlide}
            />
        </Paper>)

    // <div className='content_bg'>
    //     <div className='item_tab'>
    //         <div className='card_layout right_18'>
    //             <img className='img' src={ic_card}></img>
    //             <span className='txt'>Card Area</span>
    //         </div>
    //         <div className='mobile_layout right_18'>
    //             <img className='img' src={ic_mobile}></img>
    //             <span className='txt1'>
    //                 Mobile
    //             </span>
    //             <span className='txt'>
    //                 Phone Area
    //             </span>
    //         </div>
    //         <div className='nft_layout right_18'>
    //             <img className='img' src={ic_nft}></img>
    //             <span className='txt'>NFT Trading Area</span>
    //         </div>
    //         <div className='battle_layout'>
    //             <img className='img' src={ic_battle}></img>
    //             <span className='txt'>Battle Area</span>
    //         </div>
    //     </div>
    //     <div className='video_layout'>
    //     </div>
    //     <div className="rank_layout_head">
    //         <span className='number'>#</span>
    //         <span className='name'>Name</span>
    //         <div className='layout_item'>
    //             <span className='balance'>Balance</span>
    //             <img className='sort_img' src={ic_default_sort}></img>
    //         </div>
    //         <div className='layout_item'>
    //             <span className='uaw'>UAW</span>
    //             <img className='sort_img' src={ic_default_sort}></img>
    //         </div>
    //         <div className='layout_item'>
    //             <span className='volume'>Volume</span>
    //             <img className='sort_img' src={ic_default_sort}></img>
    //         </div>
    //         <span className='social_signa'>social_signa</span>
    //     </div>
    // </div>);

}

export default GFTHomeView;