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
        }else if(type === 'telegram'){
            window.open("https://t.me/gamefi_society_g1");
        }
    }

    return (
        <Paper className='footer_bg'>
            <Typography className='text_line'>{'About Us'}</Typography>
            <Typography className='text_line'>{'FAQ'}</Typography>
            <Typography className='text_line'>{'Blog'}</Typography>
            <Typography className='text_line'>{'Disclaimer'}</Typography>
            <Box className='logo_layout'>
                <Box
                    className="icon_twitter"
                    sx={{ width: '34px', height: '34px', mx: '2px' }}
                    onClick={() => openClickLink('twitter')}>
                </Box>
                <Box
                 sx={{ width: '34px', height: '34px', mx: '2px' }}
                    className="icon_github">
                </Box>
                <Box
                 sx={{ width: '34px', height: '34px', mx: '2px' }}
                    className="icon_telegram"
                    onClick={() => openClickLink('telegram')} >
                </Box>
                <Box
                 sx={{ width: '34px', height: '34px', mx: '2px' }}
                    className="icon_discord">
                </Box>
                <Box
                 sx={{ width: '34px', height: '34px', mx: '2px' }}
                    className="icon_youtube">
                </Box>
                <Box
                 sx={{ width: '34px', height: '34px', mx: '2px' }}
                    className="icon_ins">
                </Box>
                <Box
                 sx={{ width: '34px', height: '34px', mx: '2px' }}
                    className="icon_reddit">
                </Box>
                <Box
                 sx={{ width: '34px', height: '34px', mx: '2px' }}
                    className="icon_facebook">
                </Box>
                
            </Box>
            {/* <div className='lang'>
                <span className='txt'>English</span>
                <img className='img' src={icon_menu_down}></img>
            </div> */}
            <Typography className='footer_end' >
                {'© 2022 GameFi Society'}
            </Typography>
        </Paper>
    );
}

export default React.memo(GFTFooter);