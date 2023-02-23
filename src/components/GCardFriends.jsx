import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EventKind } from "nostr/def";
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ChatIcon from '@mui/icons-material/Chat';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';

import './GCardUser.scss';

import { dbCache } from 'db/DbCache';

import { setUsersFlag } from 'module/store/features/userSlice';
import { useFollowPro } from 'nostr/protocal/FollowPro';
import { useMetadataPro } from 'nostr/protocal/MetadataPro';
import { System } from 'nostr/NostrSystem';

const db = dbCache();

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={'friend-pannel-' + index}
            {...other}
        >
            {value === index && (
                <Box sx={{ padding: '8px' }}>
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
    const FollowPro = useFollowPro();
    const MetadataPro = useMetadataPro();
    const { publicKey } = useSelector(s => s.login);
    const { followsData, follows } = useSelector(s => s.user);
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = React.useState(0);

    const fetchAllMeta = () => {
        let subMeta = MetadataPro.get(publicKey);
        follows.map((item) => {
            subMeta.Authors.push(item);
        });
        //
        System.Broadcast(subMeta, 0, (msgs) => {
            //
            let metaDatas = [];
            msgs.map(item => {
                let info = {
                    pubkey: item.pubkey,
                    created_at: item.created_at,
                    content: {}
                };
                if (item.content !== '') {
                    info.content = JSON.parse(item.content);
                }
                info.content.following = 1;
                metaDatas.push(info);
            });
            db.updateMetaDatas(metaDatas);
            dispatch(setUsersFlag(1));
        });
    }

    const fetchFollowing = () => {
        if (followsData === 0) {
            fetchAllMeta();
        } else if (followsData === 1) {
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
            // fetchFollowers();
        }
        setTabIndex(newValue);
    };

    //
    useEffect(() => {
        fetchFollowing();
        return () => { }
    }, [])

    //
    useEffect(() => {
        return () => { }
    }, [follows])

    const renderFollowing = () => {
        if (follows.length === 0) {
            return null;
        }
        return (
            <List> {
                follows.map((pubkey, index) => {
                    const item = db.getMetaData(pubkey);
                    if (!item) {
                        return null;
                    }
                    return (
                        <ListItem sx={{ my: '2px', backgroundColor: '#202020' }} key={'following-list-' + index}
                            secondaryAction={
                                <Button variant="outlined" sx={{ width: '80px', height: '24px', fontSize: '12px' }}>{'unfollow'}</Button>
                            }
                            disablePadding>
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar
                                        alt={'GameFi Society'}
                                        src={item.content.picture ? item.content.picture : ''}
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={item.content.name} />
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
        );
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
        <Box sx={{ backgroundColor: '#1F1F1F', width: '360px', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
                <Tabs sx={{ width: '100%' }}
                    variant="fullWidth"
                    value={tabIndex}
                    onChange={switchTab}
                    aria-label="friend tab">
                    <Tab label={"Following " + follows.length} {...a11yProps(0)} />
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