import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom'
import Grid from '@mui/material/Grid';
import GFTHead from 'view/head/GFTHead'
import GBanner from 'view/head/GBanner';
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

import { System } from 'nostr/NostrSystem';
import { init } from "module/store/features/loginSlice";
import { initRelays } from 'module/store/features/profileSlice';

import './GFTHome.scss';
import { Stack } from '../../../node_modules/@mui/material/index';

// const win_h = window.client

const GFTHome = () => {

    const dispatch = useDispatch();
    const { isDrawer, placeDrawer, cardDrawer } = useSelector(s => s.dialog);

    return (
        <Box className='main_bg'>
            <GFTHead />
            <Box sx={{
                width: '280px',
                position: 'fixed',
                top: '60px',
                zIndex: '1000',
            }}>
                <GFTLeftMenu />
            </Box>
            <Grid sx={{ flexGrow: 1 }} container>
                <Stack
                    className='main_content'
                    direction="row"
                    alignItems={'flex-start'}
                    justifyContent={'flex-start'}
                >
                    <Box sx={{ width: '280px' }} />
                    <Stack
                        sx={{ flexGrow: 1, backgroundColor: '#000000' }}
                        direction="column"
                        alignItems={'center'}
                        justifyContent={'flex-start'}
                    >
                        <Outlet />
                    </Stack>
                </Stack>
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
                {cardDrawer === 'follow' && <GCardFriends callback={() => {
                    dispatch(setDrawer({
                        isDrawer: false,
                        placeDrawer: 'right',
                        cardDrawer: 'default'
                    }))
                }} />}
                {cardDrawer === 'relays' && <GCardRelays />}
            </Drawer>
        </Box >
    );
}

export default GFTHome;