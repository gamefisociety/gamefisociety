import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import IosShareIcon from '@mui/icons-material/IosShare';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import './GCardUser.scss';

import { useMetadataPro } from 'nostr/protocal/MetadataPro';
import { System } from 'nostr/NostrSystem';

const GCardNote = (props) => {
    const navigate = useNavigate();

    const { pubkey, info, content, time } = props;

    const MetaPro = useMetadataPro();

    const { publicKey, privateKey } = useSelector(s => s.login);
    const dispatch = useDispatch();

    useEffect(() => {
        //
        return () => {
        }
    }, [props])

    const renderContent = (str) => {
        const strArray = str.split("\n");
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                {strArray.map((stritem, index) => {
                    try {
                        if (stritem === '') {
                            return (
                                <Typography sx={{
                                    margin: '12px',
                                    wordWrap: 'break-word',
                                    whiteSpace: 'pre-wrap'
                                }} variant="body2" align="left">{content}</Typography>
                            );
                        } else if ((stritem.startsWith('http://') || stritem.startsWith('https://'))
                            && (stritem.endsWith('.png') || stritem.endsWith('.jpg') || stritem.endsWith('.gif'))) {
                            // console.log('render image', stritem);
                            return (<CardMedia
                                component="img"
                                key={'cxt-' + index + '-' + stritem}
                                sx={{ height: '240px', objectFit: 'contain' }}
                                src={stritem}></CardMedia>);
                        } else if ((stritem.startsWith('http://') || stritem.startsWith('https://'))
                            && (stritem.endsWith('.mp4'))) {
                            console.log('render video', stritem)
                            return null;
                        } else {
                            return (
                                <Typography sx={{
                                    margin: '12px',
                                    wordWrap: 'break-word',
                                    whiteSpace: 'pre-wrap'
                                }} variant="body2" align="left">{stritem}</Typography>
                            );
                        }
                    } catch (error) {
                        // console.log('strArray error', error, stritem);
                        return null;
                    }
                })}
            </Box>
        );
    }
    // const renderSke = () => {
    //     return (
    //         <React.Fragment>
    //             <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
    //             <Skeleton animation="wave" height={10} width="80%" />
    //         </React.Fragment>
    //     )
    // }

    const curTime = Number(Date.now() / 1000);
    const getTime = (tim) => {
        let diff = (curTime - tim).toFixed(1);
        if (diff > 1) {
            return diff + ' seconds';
        } else {
            return 'now';
        }
    }

    return (
        <Card sx={{
            width: '100%',
            borderBottom: 1,
            borderColor: 'divider'
        }}>
            <CardActionArea
                sx={{
                    py: '12px',
                    px: '24px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}
                onClick={() => {
                    navigate('/profile', { state: { info: { ...info }, pubkey: pubkey } });
                }}
            >
                <Avatar
                    sx={{ width: '26px', height: '26px' }}
                    // edge="end"
                    alt="Avatar"
                    src={info ? info.picture : ''}
                />
                <Typography sx={{ ml: '8px', width: '120px', whiteSpace: 'nowrap', overflow: 'hidden' }}
                    noWrap={true}
                    variant="body2">
                    {pubkey ? pubkey : 'default'}
                </Typography>
                <Typography sx={{ ml: '8px' }} variant="body2">
                    {getTime(Number(time))}
                </Typography>
            </CardActionArea>
            {content && renderContent(content)}
            {/* {data && <Typography sx={{
                margin: '12px',
                whiteSpace: 'pre-wrap'
            }} variant="body2" align="left">{data.content}</Typography>} */}
            <CardActions sx={{ mx: '6px' }}>
                <IconButton sx={{}} size="small" onClick={() => {
                    // setLoginState(0);
                }}>
                    <ChatBubbleOutlineIcon />
                </IconButton>
                <IconButton sx={{}} size="small" onClick={() => {
                    // setLoginState(0);
                }}>
                    <ReplyIcon />
                </IconButton>
                <IconButton sx={{}} size="small" onClick={() => {
                    // setLoginState(0);
                }}>
                    <ThumbUpOffAltIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1 }}></Box>
                <IconButton size="small" onClick={() => {
                    // setLoginState(0);
                }}>
                    <IosShareIcon />
                </IconButton>
            </CardActions>
        </Card>
    );

}

export default React.memo(GCardNote);