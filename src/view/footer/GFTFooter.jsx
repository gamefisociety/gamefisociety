import React, { useEffect, useState } from 'react';


import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import './GFTFooter.scss';
import footer_logo from "../../asset/image/logo/footer_logo.png"
import logo_reddit from 'asset/image/logo/ic_reddit.png';
import logo_discord from 'asset/image/logo/ic_discord.png';
import logo_twitter from 'asset/image/logo/ic_twitter.png';
import logo_telegram from 'asset/image/logo/ic_telegram.png';
import logo_facebook from 'asset/image/logo/ic_facebook.png';
import logo_youtube from 'asset/image/logo/ic_youtube.png';
import logo_ins from 'asset/image/logo/ic_ins.png';
import logo_github from 'asset/image/logo/ic_github.png';
//
import icon_crypto from "../../asset/image/logo/icon_crypto.png"
import icon_coingecko from "../../asset/image/logo/icon_coingecko.png"
import icon_menu_down from "../../asset/image/logo/icon_menu_down.png"

const GFTFooter = () => {

    const openClickLink = (type) => {
        if (type === 'twitter') {
            window.open("https://twitter.com/GameFi_Society");
        }
    }

    return (
        <Paper sx={{
            pt: '24px',
            px: '42px',
            backgroundColor: '#0F0F0F'
        }}>
            <Divider />
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <CardMedia
                    component="img"
                    sx={{ width: '160px' }}
                    src={footer_logo}
                    // image={footer_logo}
                    alt="no banner"
                />
                <Box sx={{ flexGrow: 1 }}></Box>
                <CardMedia
                    component="img"
                    sx={{ width: '34px', height: '34px', mx: '2px' }}
                    src={logo_twitter}
                    alt="no logo"
                    onClick={() => openClickLink('twitter')}
                />
                <CardMedia
                    component="img"
                    sx={{ width: '34px', height: '34px', mx: '2px' }}
                    src={logo_github}
                    alt="no logo"
                />
                <CardMedia
                    component="img"
                    sx={{ width: '34px', height: '34px', mx: '2px' }}
                    src={logo_telegram}
                    alt="no logo"
                />
                <CardMedia
                    component="img"
                    sx={{ width: '34px', height: '34px', mx: '2px' }}
                    src={logo_discord}
                    alt="no logo"
                />
                <CardMedia
                    component="img"
                    sx={{ width: '34px', height: '34px', mx: '2px' }}
                    src={logo_youtube}
                    alt="no logo"
                />
                <CardMedia
                    component="img"
                    sx={{ width: '34px', height: '34px', mx: '2px' }}
                    src={logo_ins}
                    alt="no logo"
                />
                <CardMedia
                    component="img"
                    sx={{ width: '34px', height: '34px', mx: '2px' }}
                    src={logo_reddit}
                    alt="no logo"
                />
                <CardMedia
                    component="img"
                    sx={{ width: '34px', height: '34px', mx: '2px' }}
                    src={logo_facebook}
                    alt="no logo"
                />
            </Box>
            <Divider />
            {/* <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Box sx={{ backgroundColor: 'transparent', height: '100px' }}></Box>
                </Grid>
                <Grid item xs={3}>
                    <Box sx={{ backgroundColor: 'transparent', height: '100px' }}></Box>
                </Grid>
                <Grid item xs={3}>
                    <Box sx={{ backgroundColor: 'transparent', height: '100px' }}></Box>
                </Grid>
                <Grid item xs={3}>
                    <Box sx={{ backgroundColor: 'transparent', height: '100px' }}></Box>
                </Grid>
            </Grid>
            <Divider /> */}
            <Box sx={{
                py: '16px',
                display: 'flex',
                flexDirection: 'row'
            }}>
                <Typography sx={{}} color={'gray'} variant={'body2'} >
                    {'© 2022 GameFi Society'}
                </Typography>
                <Box sx={{ flexGrow: 1 }}></Box>
                {/* <div className='lang'>
                    <span className='txt'>English</span>
                    <img className='img' src={icon_menu_down}></img>
                </div> */}
            </Box>
            {/* <div className='line'></div> */}
            {/* <div className='logo_layout'>
            </div> */}
            {/* <div className='line'></div> */}
            {/* <div className='infor_layout'>
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
            </div> */}
            {/* <div className='service_layout'>
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
            </div> */}
        </Paper>
    );
}

export default React.memo(GFTFooter);