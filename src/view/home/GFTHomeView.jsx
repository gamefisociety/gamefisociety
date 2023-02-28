import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { HashRouter, Route, Link, useNavigate } from 'react-router-dom'
import {
    getListData,
    getListChainData
} from '../../api/requestData'
import { getALLAssetsForAccount } from '../../api/nftscan'
import FsLightbox from 'fslightbox-react';

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
import GFTNewsView from './GFTNewsView'

import ic_play_youtube from "asset/image/logo/ic_play_youtube.png"

import './GFTHomeView.scss';
import GBanner from 'view/head/GBanner';

const GFTHomeView = () => {
    //
    const [videoList, setVideoList] = useState([]);
    const [chainList, setChainList] = useState([]);
    const [fsLightList, setFsLightList] = useState([]);

    const [toggler, setToggler] = useState(false);
    const [togSlide, setTogSlide] = useState(0);



    const navigate = useNavigate();
    useEffect(() => {
        requsetData();
        // fetchAllNFTs();
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

    const renderBanner = () => {
        return <GBanner />;
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
        return <GFTNewsView />
    }

    const renderNots = () => {
        return <Box sx={{
            width: '100%',
            height: '42px',
            // backgroundColor: 'blue'
        }}></Box>;
    }

    return (
        <Paper className='content_bg'>
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
}

export default GFTHomeView;