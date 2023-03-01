import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Card, CardMedia, CardActionArea, CardActions, CardContent } from "@mui/material";
import { Stepper, Step, StepLabel, StepContent } from "@mui/material";

import './GIntroduce.scss';
import GHeadIntro from 'view/head/GHeadIntro';
import GFTFooter from 'view/footer/GFTFooter';

import footer_logo from "../../asset/image/logo/footer_logo.png"
import logo_reddit from 'asset/image/logo/ic_reddit.png';
import logo_discord from 'asset/image/logo/ic_discord.png';
import logo_twitter from 'asset/image/logo/ic_twitter.png';
import logo_telegram from 'asset/image/logo/ic_telegram.png';
import logo_facebook from 'asset/image/logo/ic_facebook.png';
import logo_youtube from 'asset/image/logo/ic_youtube.png';
import logo_ins from 'asset/image/logo/ic_ins.png';
import logo_github from 'asset/image/logo/ic_github.png';

const steps = [
    {
        label: '2022-Q4',
        description: '# a\n# b\n# c\n',
    },
    {
        label: '2023-Q1',
        description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
    },
    {
        label: '2023-Q2',
        description:
            'An ad group contains one or more ads which target a shared set of keywords.',
    },
    {
        label: '2023-Q3',
        description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
    },
    {
        label: '2023-Q4',
        description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
    },
];


const GIntroduce = () => {

    useEffect(() => {
        return () => {

        }
    }, [])

    const renderPartOne = () => {
        return (
            <Stack spacing={2} direction="column" alignItems={'center'} justifyContent={'flex-start'} sx={{
                width: '100%',
                // height: '400px',
                // backgroundColor: 'red',
            }}>
                <Stack direction="row" alignItems={'center'} justifyContent={'center'} sx={{
                    width: '1440px',
                    height: '100%',
                    // backgroundColor: 'blue',
                }}>
                    <Stack sx={{
                        width: '65%',
                        // height: '400px',
                        // backgroundColor: 'green',
                    }}
                        spacing={2}
                        direction="column"
                        justifyContent="center"
                    >
                        <Typography sx={{
                            width: '100%',
                            // ml: '8px'
                        }}
                            variant="h1"
                            color={'white'}
                            align={'left'}
                        >
                            {'GameFi Society'}
                        </Typography>
                        <Typography sx={{
                            width: '100%',
                            mt: '12px',
                            // ml: '8px'
                        }}
                            variant="h5"
                            color={'white'}
                            align={'left'}
                        >
                            {'A truly decentralized game social media, all information is the real reaction of users.'}
                        </Typography>
                        <Stack spacing={2} direction="row" justifyContent="flex-start" sx={{
                            mt: '12px',
                        }}>
                            <Button variant="contained" size={'large'}>WhitePaper</Button>
                            <Button variant="outlined">{'Launch'}</Button>
                        </Stack>
                    </Stack>
                    <Box sx={{
                        width: '35%',
                        height: '400px',
                        backgroundColor: 'gray',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}></Box>
                </Stack>
                {/*
                <Box sx={{
                    // backgroundColor: 'blue',
                    height: '400px'
                }}>

                </Box> */}
            </Stack>
        );
    }

    const renderTwoNet = () => {
        return (
            <Stack spacing={2} direction="column" alignItems={'center'} justifyContent={'flex-start'} sx={{
                width: '100%',
                // height: '400px',
                // backgroundColor: 'red',
            }}>
                <Stack direction="column" alignItems={'center'} justifyContent={'center'} sx={{
                    width: '1440px',
                    height: '100%',
                    // backgroundColor: 'blue',
                }}>
                    <Typography sx={{
                        width: '100%',
                        my: '46px',
                        // ml: '8px'
                    }}
                        variant="h4"
                        color={'white'}
                        align={'center'}
                    >
                        {'Nostr & Polygon'}
                    </Typography>
                    <Stack direction="row" alignItems={'center'} justifyContent={'space-around'} sx={{
                        width: '100%',
                    }}>
                        <Card sx={{
                            width: '35%',
                            height: '360px',
                            backgroundColor: 'gray',
                        }}>
                            <CardActionArea>
                                <Typography sx={{
                                    my: '24px'
                                }} variant="h5" component="div">
                                    {'Nostr'}
                                </Typography>
                                <Stack direction="row" alignItems={'center'} justifyContent={'space-around'} sx={{
                                    width: '100%',
                                    height: '100%',
                                }}>
                                    <Box sx={{
                                        width: '30%',
                                        height: '200px',
                                        backgroundColor: 'red'
                                    }}></Box>
                                    <Stack direction="column" alignItems={'center'} justifyContent={'space-around'} sx={{
                                        width: '60%',
                                    }}>
                                        <Typography sx={{ width: '100%', mt: '6px' }} variant="subtitle2" align="left" multiline>
                                            {'# keypairs to user system, say no to email & phone '}
                                        </Typography>
                                        <Typography sx={{ width: '100%', mt: '6px' }} variant="subtitle2" align="left">
                                            {'# Encrypted private chat days'}
                                        </Typography>
                                        <Typography sx={{ width: '100%', mt: '6px' }} variant="subtitle2" align="left">
                                            {'# Feel free to post to the relays'}
                                        </Typography>
                                        <Typography sx={{ width: '100%', mt: '6px' }} variant="subtitle2" align="left">
                                            {'# Content that never goes away'}
                                        </Typography>
                                        <Typography sx={{ width: '100%', mt: '6px' }} variant="subtitle2" align="left">
                                            {'# Censorship resistant content'}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardActionArea>
                        </Card>
                        <Card sx={{
                            width: '35%',
                            height: '360px',
                            backgroundColor: 'gray',
                        }}>
                            <CardActionArea>
                                <Typography sx={{
                                    my: '24px'
                                }} variant="h5" component="div">
                                    {'Polygon'}
                                </Typography>
                                <Stack direction="row" alignItems={'center'} justifyContent={'space-around'} sx={{
                                    width: '100%',
                                }}>
                                    <Stack direction="column" alignItems={'center'} justifyContent={'space-around'} sx={{
                                        width: '60%',
                                    }}>
                                        <Typography sx={{ width: '100%', mt: '6px' }} variant="subtitle2" align="left">
                                            {'# GFS Token ecology'}
                                        </Typography>
                                        <Typography sx={{ width: '100%', mt: '6px' }} variant="subtitle2" align="left">
                                            {'# NFT mint & market'}
                                        </Typography>
                                        <Typography sx={{ width: '100%', mt: '6px' }} variant="subtitle2" align="left">
                                            {'# Store key information on the chain'}
                                        </Typography>
                                        <Typography sx={{ width: '100%', mt: '6px' }} variant="subtitle2" align="left">
                                            {'# High-quality content on the chain'}
                                        </Typography>
                                        <Typography sx={{ width: '100%', mt: '6px' }} variant="subtitle2" align="left">
                                            {'# Game Society DAO'}
                                        </Typography>
                                    </Stack>
                                    <Box sx={{
                                        width: '30%',
                                        height: '200px',
                                        backgroundColor: 'red'
                                    }}></Box>
                                </Stack>
                            </CardActionArea>
                        </Card>
                    </Stack>
                </Stack>
            </Stack>
        );
    }

    const renderFeathers = () => {
        return (
            <Stack spacing={2} direction="column" alignItems={'center'} justifyContent={'flex-start'} sx={{
                width: '100%',
                // height: '400px',
                // backgroundColor: 'red',
            }}>
                <Stack direction="column" alignItems={'center'} justifyContent={'center'} sx={{
                    width: '1440px',
                    // backgroundColor: 'blue',
                }}>
                    <Typography sx={{
                        width: '100%',
                        my: '46px',
                        // ml: '8px'
                    }}
                        variant="h4"
                        color={'white'}
                        align={'center'}
                    >
                        {'Feathers'}
                    </Typography>
                    <Grid container sx={{
                        padding: '24px'
                    }} spacing={2}>
                        <Grid item>
                            <Card
                                className={'introduce_card'}
                                sx={{
                                    width: '320px',
                                    height: '320px'
                                }}>
                                <CardMedia
                                    sx={{ height: '140px' }}
                                    image={""}
                                    title="green iguana"
                                    alt={'p'}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {'Post Notes'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align={'left'}>
                                        {'Users can freely publish posts to the relays, and can also private message each other through the relays'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card className={'introduce_card'} sx={{
                                width: '320px',
                                height: '320px'
                            }}>
                                <CardMedia
                                    sx={{ height: '140px' }}
                                    image={""}
                                    title="green iguana"
                                    alt={'p'}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {'Follows'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align={'left'}>
                                        {'Users can follow each other and be followed by each other'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card className={'introduce_card'} sx={{
                                width: '320px',
                                height: '320px'
                            }}>
                                <CardMedia
                                    sx={{ height: '140px' }}
                                    image={""}
                                    title="green iguana"
                                    alt={'p'}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {'Premium Content'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align={'left'}>
                                        {'Users can spend some fees to push content to the blockchain. Obtain the display of the platform'}
                                    </Typography>
                                </CardContent>

                            </Card>
                        </Grid>
                        <Grid item>
                            <Card className={'introduce_card'} sx={{
                                width: '320px',
                                height: '320px'
                            }}>
                                <CardMedia
                                    sx={{ height: '140px' }}
                                    image={""}
                                    title="green iguana"
                                    alt={'p'}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {'Slots Auction'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align={'left'}>
                                        {'Users can purchase, bid for slots on the platform, and place their own content for display!'}
                                    </Typography>
                                </CardContent>

                            </Card>
                        </Grid>
                        <Grid item>
                            <Card className={'introduce_card'} sx={{
                                width: '320px',
                                height: '320px'
                            }}>
                                <CardMedia
                                    sx={{ height: '140px' }}
                                    image={""}
                                    title="green iguana"
                                    alt={'p'}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {'Create & Display Game'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align={'left'}>
                                        {'Users can push game items to the platform to get more traffic.'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card className={'introduce_card'} sx={{
                                width: '320px',
                                height: '320px'
                            }}>
                                <CardMedia
                                    sx={{ height: '140px' }}
                                    image={""}
                                    title="green iguana"
                                    alt={'p'}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {'Topic Group'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align={'left'}>
                                        {'Users join topic groups and can communicate around fixed topics. These subjects can be games, hobbies, news, etc.'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card className={'introduce_card'} sx={{
                                width: '320px',
                                height: '320px'
                            }}>
                                <CardMedia
                                    sx={{ height: '140px' }}
                                    image={""}
                                    title="green iguana"
                                    alt={'p'}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {'NFT Swap & Mint'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align={'left'}>
                                        {'Users can mint NFT, issue their own NFT, and conduct NFT transactions in the NFT market.'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card className={'introduce_card'} sx={{
                                width: '320px',
                                height: '320px'
                            }}>
                                <CardMedia
                                    sx={{ height: '140px' }}
                                    image={""}
                                    title="green iguana"
                                    alt={'p'}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {'GFS DAO'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align={'left'}>
                                        {'Users can participate in ecological governance, content review and receive certain rewards.'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Stack>
            </Stack>
        );
    }


    const renderToken = () => {
        return (
            <Stack spacing={2} direction="column" alignItems={'center'} justifyContent={'flex-start'} sx={{
                width: '100%',
                // height: '400px',
                // backgroundColor: 'red',
            }}>
                <Stack direction="row" alignItems={'center'} justifyContent={'center'} sx={{
                    width: '1440px',
                    height: '400px',
                    backgroundColor: 'blue',
                }}>
                    <Typography sx={{
                        width: '100%',
                        my: '46px',
                        // ml: '8px'
                    }}
                        variant="h4"
                        color={'white'}
                        align={'left'}
                    >
                        {'Token Display'}
                    </Typography>
                </Stack>
            </Stack>
        );
    }

    const renderRoadMap = () => {
        return (
            <Stack spacing={2} direction="column" alignItems={'center'} justifyContent={'flex-start'} sx={{
                width: '100%',
                pb: '46px',
                // height: '400px',
                // backgroundColor: 'red',
            }}>
                <Stack direction="column" alignItems={'center'} justifyContent={'center'} sx={{
                    width: '1440px',
                    // backgroundColor: 'blue',
                }}>
                    <Typography sx={{
                        width: '100%',
                        my: '46px',
                    }}
                        variant="h4"
                        color={'white'}
                        align={'right'}
                    >
                        {'RoadMap'}
                    </Typography>
                    <Stepper activeStep={1} orientation="horizontal" alternativeLabel={true}>
                        {steps.map((step, index) => (
                            <Step key={step.label} expanded={true}>
                                <StepLabel>
                                    {step.label}
                                </StepLabel>
                                <StepContent>
                                    <Typography sx={{
                                        mt: '24px',
                                        wordBreak: "break-word",
                                        whiteSpace: 'pre-wrap'
                                    }}
                                        variant="body2"
                                        color='white'
                                    >{step.description}</Typography>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                </Stack>

            </Stack>
        );
    }

    const renderUs = () => {
        return (
            <Stack spacing={2} direction="column" alignItems={'center'} justifyContent={'flex-start'} sx={{
                width: '100%',
                // height: '400px',
                // backgroundColor: 'red',
            }}>
                <Stack direction="column" alignItems={'center'} justifyContent={'center'} sx={{
                    width: '1440px',
                }}>
                    <Typography sx={{
                        width: '100%',
                        my: '46px',
                    }}
                        variant="h4"
                        color={'white'}
                        align={'center'}
                    >
                        {'Join our community'}
                    </Typography>
                    <Stack spacing={2} direction="row" alignItems={'center'} justifyContent={'center'} sx={{
                        width: '100%',
                        // backgroundColor: 'blue',
                    }}>
                        <Card className={'introduce_card'} sx={{
                            // width: '640px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: '12px',
                            py: '12px',
                        }}>
                            <CardMedia
                                sx={{
                                    width: '80px',
                                    height: '80px'
                                    // overflow: 'hidden',
                                    // objectFit: 'cover'
                                }}
                                image={logo_discord}
                                title="green iguana"
                                alt={'p'}
                            />
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {'Nostr'}
                                </Typography>
                                <Typography variant="body2" sx={{
                                    width: '100%',
                                    wordWrap: 'break-word',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {'npub1jxj9kzvtgd8pfvrnxy6ssvky5kz9j2c5a9c6ldlycq70f7z7wuhsfz96ep'}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="large">{'Follow on nostr'}</Button>
                            </CardActions>
                        </Card>
                    </Stack>
                    <Stack spacing={2} direction="row" alignItems={'center'} justifyContent={'center'} sx={{
                        width: '100%',
                        mt: '24px'
                        // backgroundColor: 'blue',
                    }}>
                        <Card className={'introduce_card'} sx={{
                            width: '240px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: '12px',
                            py: '12px',
                        }}>
                            <CardMedia
                                sx={{
                                    width: '80px',
                                    height: '80px'
                                    // overflow: 'hidden',
                                    // objectFit: 'cover'
                                }}
                                image={logo_twitter}
                                title="green iguana"
                                alt={'p'}
                            />
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {'Twitter'}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="large">{'Follow on twitter'}</Button>
                            </CardActions>
                        </Card>
                        <Card className={'introduce_card'} sx={{
                            width: '240px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: '12px',
                            py: '12px',
                        }}>
                            <CardMedia
                                sx={{
                                    width: '80px',
                                    height: '80px'
                                    // overflow: 'hidden',
                                    // objectFit: 'cover'
                                }}
                                image={logo_github}
                                title="green iguana"
                                alt={'p'}
                            />
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {'Github'}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="large">{'Follow on gihub'}</Button>
                            </CardActions>
                        </Card>

                        <Card className={'introduce_card'} sx={{
                            width: '240px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: '12px',
                            py: '12px',
                        }}>
                            <CardMedia
                                sx={{
                                    width: '80px',
                                    height: '80px'
                                    // overflow: 'hidden',
                                    // objectFit: 'cover'
                                }}
                                image={logo_discord}
                                title="green iguana"
                                alt={'p'}
                            />
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {'Discord'}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="large">{'Join in discord'}</Button>
                            </CardActions>
                        </Card>
                        <Card className={'introduce_card'} sx={{
                            width: '240px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: '12px',
                            py: '12px',
                        }}>
                            <CardMedia
                                sx={{
                                    width: '80px',
                                    height: '80px'
                                    // overflow: 'hidden',
                                    // objectFit: 'cover'
                                }}
                                image={logo_telegram}
                                title="green iguana"
                                alt={'p'}
                            />
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {'Telegram'}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="large">{'Join in telegram'}</Button>
                            </CardActions>
                        </Card>
                    </Stack>
                </Stack>
            </Stack>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, backgroundColor: '#0F0F0F' }}>
            <Grid sx={{ flexGrow: 1 }} container spacing={2}>
                <Grid item xs={12}>
                    <GHeadIntro />
                </Grid>
                <Grid item xs={12}>
                    {renderPartOne()}
                </Grid>
                <Grid item xs={12}>
                    {renderTwoNet()}
                </Grid>
                <Grid item xs={12}>
                    {renderFeathers()}
                </Grid>
                {/* <Grid item xs={12}>
                    {renderToken()}
                </Grid> */}
                <Grid item xs={12}>
                    {renderRoadMap()}
                </Grid>
                <Grid item xs={12}>
                    {renderUs()}
                </Grid>
                <Grid item xs={12}>
                    <GFTFooter />
                </Grid>
            </Grid>
        </Box >
    );

}

export default GIntroduce;