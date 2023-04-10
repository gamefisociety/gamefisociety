import React, { useEffect, useState } from 'react';
import './GBanner.scss';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
//
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import MobileStepper from '@mui/material/MobileStepper';

import ic_banner_l1 from "asset/image/home/banner_l1.png"
import ic_banner_l2 from "asset/image/home/banner_l2.png"
import ic_banner_c from "asset/image/home/banner_c.png"
import ic_banner_r from "asset/image/home/banner_r.png"

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const win_w = window.screen.width;
console.log('widows width', win_w);

const banners = [
    {
        l1: {
            img: ic_banner_l1,
            link: 'abc',
            label: 'aaa'
        },
        l2: {
            img: ic_banner_l2,
            link: 'abc',
            label: 'abb'
        },
        c: {
            img: ic_banner_c,
            link: 'abc',
            label: 'ccc'
        },
        r: {
            img: ic_banner_r,
            link: 'abc',
            label: 'ddd'
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

const GBanner = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    //
    const theme = useTheme();

    // console.log('useTheme', theme);
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = 3;

    useEffect(() => {

        return () => {
        }
    }, [])

    // window.onresize = () => {
    //     const tmpW = window.width();
    //     setFixHeight(tmpW);
    // }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    const renderHalfPicture = (img, lable, url, h) => {
        return (
            <Box className={'half_img'}>
                <Box component="img" className={'banner_img'} src={img} />
                {/* <Typography
                    sx={{
                        backgroundColor: '#2F2F2F',
                        position: 'relative',
                    }}
                    variant="h1"
                    color='white'
                    align={'center'}>
                    {'addddd'}
                </Typography> */}
            </Box>);
    }

    const renderPicture = (img, lable, url, h) => {
        return (
            <Box className={'full_img'}>
                <Box component="img" className={'banner_img'} src={img} />
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
        <Box className={'banner_bg'}>
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {banners.map((step, index) => (
                    <Grid container key={'banner-index-' + index} sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Grid item xs={4}>
                            {renderHalfPicture(step.l1.img, step.l1.label, step.l1.url)}
                            {renderHalfPicture(step.l2.img, step.l2.label, step.l2.url)}
                        </Grid>
                        <Grid item xs={4}>
                            {renderPicture(step.c.img, step.c.label, step.c.url)}
                        </Grid>
                        <Grid item xs={4}>
                            {renderPicture(step.r.img, step.r.label, step.r.url)}
                        </Grid>
                        <Typography >{step.r.label}</Typography>
                    </Grid>
                ))}
            </AutoPlaySwipeableViews>
            <MobileStepper className={'step'}
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                variant={'dots'}
            />
        </Box>
    );
}

export default GBanner;