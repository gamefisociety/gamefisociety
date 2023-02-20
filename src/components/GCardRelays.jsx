import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { setRelays, removeRelay } from 'module/store/features/profileSlice';
import { useRelayPro } from 'nostr/protocal/RelayPro';
import { System } from 'nostr/NostrSystem';
import { EventKind } from "nostr/def";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import { DefaultRelays } from "nostr/Const";

import './GCardRelays.scss';

function GCardRelays() {

    const { relays } = useSelector(s => s.profile);
    const { publicKey } = useSelector(s => s.login);
    const dispatch = useDispatch();
    const relayPro = useRelayPro();

    const fetchRelays = async () => {
        //
        let sub = await relayPro.get(publicKey);
        // console.log('fetchRelays', Object.entries(relays), sub);
        System.Broadcast(sub, 0, (msgs) => {
            if (msgs) {
                msgs.map(msg => {
                    console.log('fetchRelays msgs', msg);
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

    const addRelays = async (addr) => {
        return null;
    }

    const deleteRelays = async (addr) => {
        return null;
    }

    useEffect(() => {
        return () => {
            fetchRelays();
        }
    }, [])

    const renderRelays = () => {
        return Object.entries(relays).map((item, index) => {
            return (
                <Grid item key={'relaycard-index-' + index}>
                    <CardActionArea>
                        <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#2F2F2F', borderRadius: '24px' }}>
                            <Typography sx={{ minWidth: '' }} variant="body2" color="text.secondary">
                                {item[0]}
                            </Typography>
                            <Chip sx={{ marginLeft: '12px' }} label="read" color={item[1].read ? "success" : "error"} size="small" />
                            <Chip sx={{ marginLeft: '12px' }} label="write" color={item[1].write ? "success" : "error"} size="small" />
                            <IconButton sx={{ marginLeft: '12px' }} onClick={() => {
                                deleteRelays(item[0]);
                            }}>
                                <DisabledByDefaultIcon />
                            </IconButton>
                        </CardContent>
                    </CardActionArea>
                </Grid>
            )
        })
    }

    return (
        <Card sx={{ backgroundColor: '#1F1F1F', padding: '12px' }}>
            <Typography align='left' variant="h6" component="div">
                {'Relay Panel'}
            </Typography>
            <Grid container spacing={2} sx={{ my: '12px' }}>
                {renderRelays()}
            </Grid>
            <CardActions>
                <Button size="small" color="primary" onClick={fetchRelays}>
                    refresh
                </Button>
                <Button size="small" color="primary" onClick={fetchRelays}>
                    Add
                </Button>
            </CardActions>
        </Card>
    );

}

export default React.memo(GCardRelays);