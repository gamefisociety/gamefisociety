import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { HashRouter, Route, Link, useNavigate } from 'react-router-dom'
import {
    getListData,
    getListChainData
} from 'api/requestData'
import { getALLAssetsForAccount } from '../../api/nftscan'
import FsLightbox from 'fslightbox-react';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CardActions from '@mui/material/CardActions';

import GFTNewsView from './GFTNewsView'
import GBanner from 'view/head/GBanner';

import ic_play_youtube from "asset/image/logo/ic_play_youtube.png"

import './GFTHomeView.scss';


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
            <Stack sx={{
                width: '100%',
                minHeigth: '200px',
                py: '24px',
            }} spacing={2} direction="column" alignItems={'flex-start'} justifyContent={'flex-start'}>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                }}>
                    <Typography sx={{
                        ml: '24px',
                    }} color={'white'} variant={'h6'} align={'left'} >
                        {'Videos'}
                    </Typography>
                </Box>
                <Grid container sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    // backgroundColor: 'yellow',
                }}>
                    {videoList.map((item, index) => (
                        <Grid item key={'video-index-' + index} sx={{
                            // backgroundColor: 'blue'
                        }}>
                            <Card sx={{
                                margin: '6px',
                                padding: '2px',
                                width: '320px',
                                borderRadius: '12px',
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
                                        <Typography sx={{ width: '100%', }} color={'text.primary'} variant={'body2'} multiline >
                                            {item.desc}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}>
                    <Button sx={{
                        mr: '24px',
                    }} onClick={() => {
                        navigate('/videopage');
                    }}>{'more'}</Button>
                </Box>
            </Stack>
        );
    }

    const renderGames = () => {
        return (
            <Stack sx={{
                width: '100%',
                minHeigth: '200px',
                py: '24px',
            }} direction="column" alignItems={'center'} justifyContent={'flex-start'}>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                }}>
                    <Typography sx={{
                        ml: '24px',
                    }} color={'white'} variant={'h6'} align={'left'} >
                        {'Projects'}
                    </Typography>
                </Box>
                <Box className={'game_card_contain'}>
                    {chainList.map((item, index) => {
                        if (index >= 10) {
                            return null;
                        }
                        return (
                            <Card className={'game_card'} key={'homepage-gamecard-index' + index} onClick={() => {
                                itemNFTClick(item);
                            }}>
                                <Avatar sx={{
                                    width: '64px',
                                    height: '64px',
                                }}
                                    alt="Remy Sharp"
                                    src={item.icon} />
                                <Typography sx={{
                                    mt: '12px'
                                }} color={'white'} variant={'body1'} >
                                    {item.name}
                                </Typography>
                                <Box sx={{ flexGrow: 1 }}></Box>
                                <Button variant="contained" >{'DETAIL'}</Button>
                            </Card>
                        );
                    })}
                </Box>
                <Box sx={{
                    mt: '24px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}>
                    <Button sx={{
                        mr: '24px',
                    }} onClick={() => {
                        navigate('/gamepage');
                    }}>{'more'}</Button>
                </Box>
            </Stack>
        )
    }

    const renderNews = () => {
        return (
            <Stack direction="column" alignItems={'flex-start'} justifyContent={'flex-start'}>
                <Typography sx={{
                    ml: '24px',
                }} color={'white'} variant={'h6'} align={'left'} >
                    {'News'}
                </Typography>
                <GFTNewsView />
                <Box sx={{
                    mt: '24px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}>
                    <Button sx={{
                        mr: '24px',
                    }} onClick={() => {
                        navigate('/newspage');
                    }}>{'more'}</Button>
                </Box>
            </Stack>
        );
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
            {renderBanner()}
            {/* <Divider light={true} sx={{
                width: '100%',
                color: 'blue',
            }} /> */}
            {renderVideos()}
            {renderNews()}
            {renderGames()}
            {renderNots()}
            <FsLightbox
                toggler={toggler}
                sources={fsLightList}
                slide={togSlide}
            />
        </Paper>)
}

export default GFTHomeView;