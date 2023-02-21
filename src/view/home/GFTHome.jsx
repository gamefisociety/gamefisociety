import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom'
import './GFTHome.scss';
import { System } from 'nostr/NostrSystem';
import { init } from "module/store/features/loginSlice";
import { initRelays } from 'module/store/features/profileSlice';
import { SearchRelays } from "nostr/Const";
import Grid from '@mui/material/Grid';
import GFTHead from 'view/head/GFTHead'
import GFTLeftMenu from 'view/head/GFTLeftMenu';
import GFTFooter from 'view/footer/GFTFooter';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import GCardFriends from 'components/GCardFriends';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { setDrawer } from 'module/store/features/dialogSlice';

const GFTHome = () => {

    const dispatch = useDispatch();
    const { drawer } = useSelector(s => s.dialog);
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

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={() => { }}
            onKeyDown={() => { }}
        >
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

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
                            maxWidth: '1440px',
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
                                { marginTop: '84px', minWidth: '320px', height: '92%', borderRadius: '12px', backgroundColor: '#0F0F0F' }
                        }}
                        variant="persistent"
                        anchor={'right'}
                        open={drawer}
                        hideBackdrop={true}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#202020' }}>
                            <IconButton sx={{}} onClick={() => {
                                dispatch(setDrawer(false))
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Divider />
                        <GCardFriends />

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