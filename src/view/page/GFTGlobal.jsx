import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import GCardNote from 'components/GCardNote';

import List from '@mui/material/List';

import { useTextNotePro } from 'nostr/protocal/TextNotePro';
import { useMetadataPro } from 'nostr/protocal/MetadataPro';
import { System } from 'nostr/NostrSystem';

import './GFTGlobal.scss';

export const EmailRegex =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const GFTGlobal = () => {
    const [curRelays, setCurRelays] = useState([]);
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

    return (
        <Paper style={{ height: '100%', width: '100%', maxWidth: '960px', overflow: 'auto' }}>
            <Grid container></Grid>
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
        </Paper>
    );
}

export default GFTGlobal;