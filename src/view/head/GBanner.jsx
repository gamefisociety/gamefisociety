import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
//

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import './GBanner.scss';

import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

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

const GBanner = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const tmpH = win_w >= 1440 ? 1400 * 0.75 * 0.333 : win_w * 0.75 * 0.333;
    const [fixHeight, setFixHeight] = useState(tmpH);

    //
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = 3;

    useEffect(() => {
        const winResize = (e) => {
            const curWidth = e.target.screen.width;
            const tmpH = curWidth >= 1440 ? 1400 * 0.75 * 0.333 : curWidth * 0.75 * 0.333;
            console.log('window resize', e.target.screen.width, tmpH);
            setFixHeight(tmpH);
        }
        window.addEventListener('resize', winResize)
        return () => {
            window.removeEventListener('resize', winResize);
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

    const renderPicture = (img, lable, url, h) => {
        return (
            <Box sx={{
                backgroundColor: 'blue',
                width: '100%',
                height: h ? h : fixHeight,
                // margin: '24px'
            }}>
                {/* <Box
                    component="img"
                    sx={{
                        padding: '8px',
                        display: 'block',
                        overflow: 'hidden',
                        objectFit: 'contain'
                        // maxHeight: '116px'
                    }}
                    src={img}
                    alt={'a'}
                /> */}
                <Typography
                    sx={{
                        width: '100%',
                        backgroundColor: '#2F2F2F',
                    }}
                    variant="h5"
                    color='white'
                    align={'center'}>
                    {fixHeight}
                </Typography>
            </Box>);
    }
    //document.documentElement.clientWidth

    return (
        <Box sx={{ width: '100%', maxWidth: '1440px', backgroundColor: 'red' }}>
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
                                    height: fixHeight,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                {renderPicture(step.l1.img, step.l1.lable, step.l1.url, fixHeight * 0.5)}
                                {renderPicture(step.l2.img, step.l2.lable, step.l2.url, fixHeight * 0.5)}
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            {renderPicture(step.c.img, step.c.lable, step.c.url)}
                        </Grid>
                        <Grid item xs={4}>
                            {renderPicture(step.r.img, step.r.lable, step.r.url)}
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
        </Box>
    );
}

export default GBanner;