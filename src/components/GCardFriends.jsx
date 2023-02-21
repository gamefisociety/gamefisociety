import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EventKind } from "nostr/def";
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';

import './GCardUser.scss';

import { setUsersFlag, setUsers } from 'module/store/features/userSlice';

import { useFollowPro } from 'nostr/protocal/FollowPro';
import { useMetadataPro } from 'nostr/protocal/MetadataPro';
import { System } from 'nostr/NostrSystem';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const GCardFriends = () => {
    // console.log('props.profile', props.profile);
    const FollowPro = useFollowPro();
    const MetadataPro = useMetadataPro();
    const { publicKey, privateKey } = useSelector(s => s.login);
    const { usersflag, follows } = useSelector(s => s.user);
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = React.useState(0);

    const fetchAllMeta = (msgs) => {
        msgs.map(msg => {
            // console.log('fetchFollowers msgs', msg);
            if (msg.kind === EventKind.ContactList && msg.pubkey === publicKey && msg.tags.length > 0) {
                let subMeta = MetadataPro.get(publicKey);
                msg.tags.map((item) => {
                    if (item.length === 2 && item[0] === 'p') {
                        subMeta.Authors.push(item[1]);
                    }
                });
                //
                System.Broadcast(subMeta, 0, (msgs1) => {
                    // console.log('fetchFollowers subMeta', msgs1);
                    let users = [];
                    msgs1.map(item1 => {
                        let info = {
                            pubkey: item1.pubkey,
                            content: {}
                        };
                        if (item1.content !== '') {
                            info.content = JSON.parse(item1.content);
                        }
                        info.content.created_at = item1.created_at;
                        info.content.following = 1;
                        users.push(info);
                    });
                    dispatch(setUsers(users));
                });
                //
            }
        });
    }

    const fetchFollowing = () => {
        if (usersflag === 0) {
            let ev = FollowPro.get(publicKey);
            System.Broadcast(ev, 0, (msgs) => {
                //set flag
                dispatch(setUsersFlag(1));
                fetchAllMeta(msgs);
                console.log('fetchFollowing msg', msgs);
            });
        } else if (usersflag === 1) {
            //update
        }
    }

    const fetchFollowers = () => {
        let subFollow = FollowPro.get(publicKey);
        // console.log('saveProfile', ev);
        System.Broadcast(subFollow, 0, (msgs) => {
            if (msgs) {
                //
            }
            // if (msg[0] === 'OK') {
            //     // setOpen(true)
            // }
            // console.log('fetchFollowers msg', msg);
        });
    }

    const switchTab = (event, newValue) => {
        console.log('switchTab newValue', newValue);
        if (newValue === 0) {
            fetchFollowing();
        } else if (newValue === 1) {
            fetchFollowers();
        }
        setTabIndex(newValue);
    };

    //
    useEffect(() => {
        fetchFollowing();
        return () => { }
    }, [])

    useEffect(() => {
        // fetchFollowing();
        console.log('following users', follows);
        return () => { }
    }, [follows])

    const renderFollowing = () => {
        return null;
    }

    const renderFollowers = () => {
        return null;
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
        <Box sx={{ backgroundColor: '#1F1F1F', width: '100%', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
                <Tabs sx={{ width: '100%' }}
                    variant="fullWidth"
                    value={tabIndex}
                    onChange={switchTab}
                    aria-label="friend tab">
                    <Tab label="Following" {...a11yProps(0)} />
                    <Tab label="Followers" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}>
                {renderFollowing()}
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                {renderFollowers()}
            </TabPanel>
        </Box>
    );

}

export default React.memo(GCardFriends);