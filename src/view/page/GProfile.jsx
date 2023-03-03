import { React, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer';
import GCardUser from 'components/GCardUser';
import GCardNote from 'components/GCardNote';
import GFTChat from './GFTChat';
import { useMetadataPro } from 'nostr/protocal/MetadataPro';
import { useTextNotePro } from 'nostr/protocal/TextNotePro';
import { System } from 'nostr/NostrSystem';

import './GProfile.scss';

let lastPubKey = '';

const GProfile = () => {
    const location = useLocation();
    console.log('GProfile enter', location);
    const { info, pubkey } = location.state;
    //
    const [chatDrawer, setChatDrawer] = useState(false);
    const [notes, setNotes] = useState([]);
    // console.log('GCardUser profile', profile);

    const TextNotePro = useTextNotePro();

    const fetchTextNote = (pub) => {
        //
        const curRelays = [];
        curRelays.push('wss://nos.lol');
        //
        const textNote = TextNotePro.get();
        textNote.Authors = [pub];

        System.Broadcast(textNote, 1, (msgs) => {
            console.log('user sub', msgs);
            if (msgs && msgs.length > 0) {
                setNotes(msgs.concat());
            }
        }, curRelays);
    }

    useEffect(() => {
        console.log('profile user', lastPubKey, 'pub', pubkey);
        if (pubkey && lastPubKey !== pubkey) {
            lastPubKey = pubkey;
            fetchTextNote(pubkey);
        }
        return () => {
        }
    }, [pubkey])

    //
    useEffect(() => {
        return () => {
            //
        }
    }, [])

    return (
        <Box sx={{
            width: '100%',
            maxWidth: '960px',
            // height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            my: '24px',
            // backgroundColor: 'red',
        }}>
            <GCardUser profile={{ ...info }} pubkey={pubkey} chatOnClick={(param) => {
                setChatDrawer(true);
            }}/>
            <List sx={{ width: '100%', maxHeight: '800px', overflow: 'auto' }}>
                {notes.map((item, index) => (
                    <GCardNote
                        key={'profile-note-index' + index}
                        pubkey={item.pubkey}
                        content={item.content}
                        time={item.created_at}
                        info={info} />
                ))}
            </List>
            <Drawer
            anchor={'right'}
            open={chatDrawer}
            onClose={() => {
                setChatDrawer(false);
            }}
          >
            <GFTChat chatPK={pubkey}/>
          </Drawer>
            {/* <Box sx={{ height: '12px' }}></Box> */}
        </Box>
    );
}

export default GProfile;