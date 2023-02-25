import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom'
import './GFTHome.scss';
import { System } from 'nostr/NostrSystem';
import { init } from "module/store/features/loginSlice";
import { initRelays } from 'module/store/features/profileSlice';
import Grid from '@mui/material/Grid';
import GFTHead from 'view/head/GFTHead'
import GFTLeftMenu from 'view/head/GFTLeftMenu';
import GFTFooter from 'view/footer/GFTFooter';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import GCardFriends from 'components/GCardFriends';
import GCardRelays from 'components/GCardRelays';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { SearchRelays } from "nostr/Const";
import { setDrawer } from 'module/store/features/dialogSlice';

const GFTHome = () => {

    const dispatch = useDispatch();
    const { isDrawer, placeDrawer, cardDrawer } = useSelector(s => s.dialog);
    // const { relays } = useSelector((s) => s.profile);
    // useEffect(() => {
    //     if (relays) {
    //         for (const [addr, v] of Object.entries(relays)) {
    //             System.ConnectRelay(addr, v.read, v.write);
    //         }
    //     }
    // }, [relays]);
    //init param form db or others
    // useEffect(() => {
    //     console.log('use db from reduce');
    //     dispatch(init('redux'));
    //     dispatch(initRelays())
    // }, []);

    return (
        <Box sx={{ flexGrow: 1, backgroundColor: '#0F0F0F' }}>
            <Grid sx={{ flexGrow: 1 }} container>
                <Grid item xs={12}>
                    <GFTHead />
                </Grid>
                <Grid sx={{ flexGrow: 1 }} container>
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
                            // maxWidth: '1440px',
                            minHeight: '460px',
                            // backgroundColor: 'red',
                        }}
                        >
                            <Outlet />
                        </Box>
                    </Grid>
                    <Drawer
                        PaperProps={{
                            style:
                            {
                                borderRadius: '12px',
                                backgroundColor: '#0F0F0F'
                            }
                        }}
                        anchor={placeDrawer}
                        open={isDrawer}
                        onClose={() => {
                            dispatch(setDrawer({
                                isDrawer: false,
                                placeDrawer: 'right',
                                cardDrawer: 'default'
                            }))
                        }}
                    >
                        {cardDrawer === 'follow' && <GCardFriends />}
                        {cardDrawer === 'relays' && <GCardRelays />}
                    </Drawer>
                </Grid>
                <Grid item xs={12}>
                    <GFTFooter />
                </Grid>
            </Grid>
        </Box >
    );
}

export default GFTHome;