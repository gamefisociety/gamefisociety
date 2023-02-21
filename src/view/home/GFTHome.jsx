import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom'
import './GFTHome.scss';
import { System } from 'nostr/NostrSystem';
import { init } from "module/store/features/loginSlice";
import { initRelays } from 'module/store/features/profileSlice';
import { SearchRelays } from "nostr/Const";
// import GFTHead from '../head/GFTHead'
import Grid from '@mui/material/Grid';
import GFTHead01 from 'view/head/GFTHead01'
import GFTLeftMenu from 'view/head/GFTLeftMenu';
import GFTFooter from 'view/footer/GFTFooter';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const GFTHome = () => {

    const dispatch = useDispatch();

    const { relays } = useSelector((s) => s.profile);

    useEffect(() => {
        if (relays) {
            //connect target relays
            for (const [addr, v] of Object.entries(relays)) {
                System.ConnectRelay(addr, v.read, v.write);
            }
            // //diconnect noneed relays
            // for (const [addr] of System.ClientRelays) {
            //     if (!relays[addr] && !SearchRelays.has(addr)) {
            //         System.DisconnectRelay(addr);
            //     }
            // }
        }
    }, [relays]);

    //init param form db or others
    useEffect(() => {
        console.log('use db from reduce');
        dispatch(init('redux'));
        dispatch(initRelays())
    }, []);
    return (
        <Box sx={{ flexGrow: 1, backgroundColor: '#0F0F0F' }}>
            <Grid sx={{ flexGrow: 1 }} container>
                <Grid item xs={12}>
                    <GFTHead01 />
                </Grid>
                <Grid item xs={2}>
                    <GFTLeftMenu />
                </Grid>
                <Grid item xs={10}>
                    <Box sx={{
                        // flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        maxWidth: '1440px',
                        minHeight: '460px',
                        // backgroundColor: 'red',
                    }}
                    >
                        <Outlet />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <GFTFooter />
                </Grid>
            </Grid>
        </Box >
    );
}

export default GFTHome;