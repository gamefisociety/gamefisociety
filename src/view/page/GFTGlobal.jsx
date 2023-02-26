import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import GCardNote from 'components/GCardNote';
import List from '@mui/material/List';

import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

import { useTextNotePro } from 'nostr/protocal/TextNotePro';
import { useMetadataPro } from 'nostr/protocal/MetadataPro';
import { System } from 'nostr/NostrSystem';

import './GFTGlobal.scss';
import { Button, IconButton, TextField, Typography } from '../../../node_modules/@mui/material/index';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));


const curRelays = [];
const labelS = ['All', 'ETH', 'BTC', 'DOT', 'GAME',
    'SPORTS', 'SPORTS', 'SPORTS', 'SPORTS', 'SPORTS', 'SPORTS',
    'SPORTS', 'SPORTS', 'SPORTS', 'SPORTS', 'SPORTS', 'SPORTS',
    'SPORTS', 'SPORTS', 'SPORTS', 'SPORTS', 'SPORTS', 'SPORTS',
    'SPORTS', 'SPORTS', 'SPORTS', 'SPORTS', 'SPORTS', 'SPORTS',
    'SPORTS', 'SPORTS', 'SPORTS', 'SPORTS', 'SPORTS', 'SPORTS',];

const GFTGlobal = () => {
    // const [curRelays, setCurRelays] = useState([]);
    //
    const [curLable, setCurLable] = useState('All');
    //
    const [data, setData] = useState([]);
    const [inforData, setInforData] = useState(new Map());

    const textNotePro = useTextNotePro();
    const metadataPro = useMetadataPro();

    useEffect(() => {
        getDataList();
        return () => { }
    }, [])

    const getDataList = () => {

        const textNote = textNotePro.get();
        textNote.Until = Date.now();
        textNote.Limit = 50;
        //
        curRelays.push('wss://nos.lol');
        //
        System.Broadcast(textNote, 0, (msgs, client) => {
            // console.log('textNote msgs', msgs);
            setData(msgs.concat());
            //
            const pubkeys = [];
            msgs.map((item) => {
                pubkeys.push(item.pubkey);
            });
            const pubkyes_filter = new Set(pubkeys);
            getInfor(pubkyes_filter, curRelays);
        }, curRelays);
    }

    const getInfor = (pkeys, relays) => {
        const metadata = metadataPro.get(Array.from(pkeys));
        metadata.Authors = Array.from(pkeys);
        //
        const newInfo = new Map();
        System.Broadcast(metadata, 0, (msgs, client) => {
            msgs.map((item) => {
                //
                let info = {};
                if (item.content !== '') {
                    info = JSON.parse(item.content);
                }
                newInfo.set(item.pubkey, info);
            });
            setInforData(newInfo);
        }, relays);
    }

    const renderPartment = () => {
        return <Box sx={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'row',
            alighItems: 'center',
            justifyContent: 'space-around',
            // backgroundColor: 'red'
        }}>
            <Typography sx={{ px: '18px', py: '6px' }}
                variant="subtitle2"
                color='primary'
                backgroundColor={'gray'}
                align={'center'}
                borderRadius={'4px'}
                onClick={() => {
                    // setCurLable(item);
                }}
            >
                {'Post&Replay'}
            </Typography>
            <Typography sx={{ px: '18px', py: '6px' }}
                variant="subtitle2"
                color='primary'
                backgroundColor={'gray'}
                align={'center'}
                borderRadius={'4px'}
                onClick={() => {
                    // setCurLable(item);
                }}
            >
                {'Global'}
            </Typography>
            <Typography sx={{ px: '18px', py: '6px' }}
                variant="subtitle2"
                color='primary'
                backgroundColor={'gray'}
                align={'center'}
                borderRadius={'4px'}
                onClick={() => {
                    // setCurLable(item);
                }}
            >
                {'DMs'}
            </Typography>
            <Typography sx={{ px: '18px', py: '6px' }}
                variant="subtitle2"
                color='primary'
                backgroundColor={'gray'}
                align={'center'}
                borderRadius={'4px'}
                onClick={() => {
                    // setCurLable(item);
                }}
            >
                {'Notificatons'}
            </Typography>
        </Box>;
    }

    const renderLables = () => {
        return (
            <Paper>
                <Box sx={{
                    width: '100%',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'row',
                    alighItems: 'center',
                    justifyContent: 'center',
                }}>
                    <IconButton >
                        <SearchIcon sx={{ height: '46px' }} />
                    </IconButton>
                    <TextField sx={{ width: '360px', height: '46px' }}
                        label='Search'
                    >
                    </TextField>
                </Box>
                <Grid container spacing={2}
                    sx={{
                        px: '24px',
                        maxHeight: '92px',
                        // backgroundColor: 'blue',
                        overflow: 'hidden',
                    }}
                // expanded={true}
                >
                    {labelS.map((item, index) => (<Grid item key={'label-index-' + index}>
                        {<Typography sx={{ px: '18px', py: '2px' }}
                            variant="body2"
                            color='primary'
                            backgroundColor={curLable === item ? 'green' : 'gray'}
                            align={'center'}
                            borderRadius={'4px'}
                            onClick={() => {
                                setCurLable(item);
                            }}
                        >
                            {item}
                        </Typography>}
                    </Grid>))}
                </Grid>
                <Button>{'more'}</Button>
            </Paper>);
    }

    const renderContent = () => {
        return (
            <List>
                {data.map((item, index) => {
                    const info = inforData.get(item.pubkey);
                    // console.log('time', item);
                    return (
                        <GCardNote key={'global-note-' + index}
                            pubkey={item.pubkey}
                            content={item.content}
                            time={item.created_at}
                            info={info} />)
                })}
            </List>
        );
    }

    return (
        <Paper style={{
            minHeight: '800px',
            width: '100%',
            maxWidth: '960px',
            overflow: 'auto',
            // backgroundColor: 'blue'
        }}>
            {renderPartment()}
            {renderLables()}
            {renderContent()}
        </Paper>
    );
}

export default GFTGlobal;