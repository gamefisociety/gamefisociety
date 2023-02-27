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

    const [winWidth, setWinWidth] = useState(win_w);

    //
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = 3;


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



    return (
        <Box sx={{ flexGrow: 1 }}>
        </Box>
    );
}

export default React.memo(GBanner);