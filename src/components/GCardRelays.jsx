import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { Divider } from '@mui/material/index';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Button, CardActions } from '@mui/material';
import { setRelays, removeRelay } from 'module/store/features/profileSlice';
import { useRelayPro } from 'nostr/protocal/RelayPro';
import { System } from 'nostr/NostrSystem';
import { EventKind } from "nostr/def";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import { DefaultRelays } from "nostr/Const";

import './GCardRelays.scss';

const GCardRelays = () => {

    const { relays } = useSelector(s => s.profile);
    const { publicKey, loggedOut } = useSelector(s => s.login);
    const dispatch = useDispatch();
    const relayPro = useRelayPro();
    const [newRelays, setNewRelays] = useState([]);
    
    console.log('init GCardRelays');

    const fetchRelays = () => {
        // console.log('fetchRelays', Object.entries(relays), sub);
        let sub = relayPro.get(publicKey);
        System.Broadcast(sub, 0, (msgs) => {
            if (msgs) {
                msgs.map(msg => {
                    // console.log('fetchRelays msgs', msg);
                    if (msg.kind === EventKind.ContactList && msg.pubkey === publicKey && msg.content !== '') {
                        let content = JSON.parse(msg.content);
                        let tmpRelays = {
                            relays: {
                                ...content,
                                ...Object.fromEntries(DefaultRelays.entries()),
                            },
                            createdAt: 1,
                        };
                        dispatch(setRelays(tmpRelays));
                    }
                });
            }
        });
    }

    const saveRelays = async () => {
        //
        return null;
    }

    const deleteRelays = async (addr) => {
        console.log('delete relay', addr);
        return null;
    }

    useEffect(() => {
        return () => {
            fetchRelays();
        }
    }, [])

    const renderCacheRelays = () => {
        return Object.entries(relays).map((item, index) => {
            return (
                <Grid item key={'relaycard-index-' + index}>
                    <Box sx={{
                        height: '32px',
                        px: '12px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#2F2F2F',
                        borderRadius: '12px'
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            {item[0]}
                        </Typography>
                        <Chip sx={{ ml: '6px', width: '12px', height: '12px' }} color={item[1].read ? "success" : "error"} />
                        <Chip sx={{ ml: '6px', width: '12px', height: '12px' }} color={item[1].write ? "success" : "error"} />
                        <IconButton sx={{ ml: '6px', width: '12px', height: '12px' }} onClick={() => {
                            deleteRelays(item[0]);
                        }}>
                            <RemoveCircleOutlineIcon sx={{ width: '12px', height: '12px' }} />
                        </IconButton>
                    </Box>
                </Grid>
            )
        })
    }

    //
    const renderNewRelays = () => {
        return (
            <Grid container>
                {
                    newRelays.map((item, index) => (
                        <Grid item key={'add-new-relay-' + index}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <TextField
                                    sx={{ mx: '6px' }}
                                    value={item}
                                    margin="dense"
                                    size='small'
                                    onChange={(event) => {
                                        newRelays[index] = event.target.value;
                                        setNewRelays(newRelays.concat());
                                    }}
                                />
                                <IconButton sx={{ ml: '6px', width: '12px', height: '12px' }} onClick={() => {
                                    newRelays.splice(index, 1);
                                    setNewRelays(newRelays.concat());
                                }}>
                                    <RemoveCircleOutlineIcon sx={{ width: '12px', height: '12px' }} />
                                </IconButton>
                            </Box>
                        </Grid>
                    ))
                }
            </Grid>
        );
    }

    return (
        <Card sx={{ backgroundColor: '#1F1F1F', padding: '6px' }}>
            <Typography sx={{ margin: '12px' }} variant="body2" color="primary">
                {'Your Relays'}
            </Typography>
            <Grid container spacing={2} >
                {renderCacheRelays()}
            </Grid>
            <Divider sx={{ mt: '12px' }} />
            <CardActions>
                {renderNewRelays()}
            </CardActions>
            <CardActions>
                <Button size="small" color="primary" onClick={() => {
                    newRelays.push('');
                    setNewRelays(newRelays.concat());
                }}>
                    {'Add'}
                </Button>
                {newRelays.length > 0 && <Button size="small" color="primary" onClick={saveRelays}>
                    {'Save'}
                </Button>}
                {loggedOut === false && <Button size="small" color="primary" onClick={fetchRelays}>
                    {'SYNC'}
                </Button>}

            </CardActions>
        </Card>
    );

}

export default React.memo(GCardRelays);