import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import IconButton from '@mui/material/IconButton';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import IosShareIcon from '@mui/icons-material/IosShare';

import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';

import './GCardUser.scss';

import { useMetadataPro } from 'nostr/protocal/MetadataPro';
import { System } from 'nostr/NostrSystem';

const GCardNote = (props) => {
    // console.log('props.profile', props.profile);
    const { pubkey, info, data } = props;

    const MetaPro = useMetadataPro();

    const { publicKey, privateKey } = useSelector(s => s.login);
    const dispatch = useDispatch();

    const [open, setOpen] = React.useState(false);

    // if (data) {
    //     console.log('GCardNote', data.content);
    // }

    useEffect(() => {
        //
        return () => {
        }
    }, [props])

    const renderContent = (str) => {
        const strArray = str.split("\n");
        // console.log('strArray', strArray);
        // if(strArray.length === 0) {
        //     return null;
        // }
        // return null;
        return (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                {strArray.map((stritem, index) => {
                    try {
                        if (stritem === '') {
                            return (
                                <Typography sx={{
                                    // margin: '12px',
                                    whiteSpace: 'pre-wrap'
                                }} variant="body2" align="left">{data.content}</Typography>
                            );
                        } else if ((stritem.startsWith('http://') || stritem.startsWith('https://'))
                            && (stritem.endsWith('.png') || stritem.endsWith('.jpg') || stritem.endsWith('.jpeg'))) {
                            console.log('render image', stritem);
                            return (<CardMedia
                                component="img"
                                key={'cxt-' + index + '-' + stritem}
                                sx={{ height: '240px', objectFit: 'contain' }}
                                src={stritem}></CardMedia>);
                        } else {
                            return (
                                <Typography sx={{
                                    // margin: '12px',
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
    return (
        <Card sx={{ width: '100%', padding: '12px', borderBottom: 1, borderColor: 'divider' }}>
            <CardActionArea
                sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Avatar
                    sx={{ width: 26, height: 26 }}
                    edge="end"
                    alt="GameFi Society"
                    src={info ? info.contentObj.picture : ''}
                />
                <Typography sx={{ ml: '8px', width: '120px', whiteSpace: 'nowrap', overflow: 'hidden' }}
                    noWrap={true}
                    variant="body2">
                    {pubkey ? pubkey : 'default'}
                </Typography>
                <Typography sx={{ ml: '8px' }} variant="body2">
                    {data ? data.created_at : 'default'}
                </Typography>
            </CardActionArea>
            {data && renderContent(data.content)}
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
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                message="SUCESS"
                autoHideDuration={2000}
            />
        </Card>
    );

}

export default React.memo(GCardNote);