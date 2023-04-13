import React, { useEffect, useState } from 'react';
import './GMainBanner.scss';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
//
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import ic_banner_l1 from "asset/image/home/banner_l1.png"
import ic_banner_l2 from "asset/image/home/banner_l2.png"
import ic_banner_c from "asset/image/home/banner_c.png"
import ic_banner_r from "asset/image/home/banner_r.png"

const main_banners = [
    {
        img: ic_banner_l1,
        link: 'abc',
        label: 'aaa'
    },
    {
        img: ic_banner_l1,
        link: 'abc',
        label: 'aaa'
    },
    {
        img: ic_banner_l1,
        link: 'abc',
        label: 'aaa'
    }
]

const GMainBanner = () => {

    useEffect(() => {
        return () => { }
    }, [])

    const renderPicture = (step, index) => {
        return (
            <Box className={'full_img'} key={'main_banner_' + index}>
                <Box component="img" className={'banner_img'} src={step.img} />
                {/* <Typography
                    sx={{
                        width: '100%',
                        height: '50%',
                        backgroundColor: '#2F2F2F',
                        position: 'absolute',
                        bottom: '0px',
                        left: '0px',
                        opacity: 0.2,
                    }}
                    variant="h5"
                    color='white'
                    align={'center'}>
                    {lable}
                </Typography> */}
            </Box>);
    }

    return (
        <Box className={'main_banner_bg'}>
            {renderPicture(main_banners[0], 0)}
        </Box>
    );
}

export default GMainBanner;