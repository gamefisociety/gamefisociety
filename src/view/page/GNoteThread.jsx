import React, { useEffect, useState } from 'react';
import './GNoteThread.scss';

import { useLocation, useNavigate } from 'react-router-dom'
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

import { parseTextNote, BuildSub } from 'nostr/NostrUtils';
import { useMetadataPro } from 'nostr/protocal/MetadataPro';
import { useTextNotePro } from 'nostr/protocal/TextNotePro';
import { System } from 'nostr/NostrSystem';

import NormalCache from 'db/NormalCache';
import TimelineCache from 'db/TimelineCache';
import UserDataCache from 'db/UserDataCache';

import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";

import GCardNote from "components/GCardNote";

const createThreadWorker = createWorkerFactory(() => import('worker/threadRequest'));

const GNoteThread = () => {
    const threadWorker = useWorker(createThreadWorker);

    let location = useLocation();
    const navigate = useNavigate();

    const { note } = location.state;
    const [mainNote, setMainNote] = useState(null);
    const [replyNote, setReplyNote] = useState(null);
    const [notes, setNotes] = useState([]);
    //
    const metadataPro = useMetadataPro();
    const textnotePro = useTextNotePro();
    //
    const TLCache = TimelineCache();
    const UserCache = UserDataCache();

    let main_note_id = '0';
    let reply_note_id = '0';

    const fetchMainNotes = (nodeId) => {
        //
        let tmpMainNote = TLCache.getThreadNote(nodeId);
        if (tmpMainNote) {
            setMainNote({ ...tmpMainNote });
        }
        //
        const filterTextNote = textnotePro.getEvents([nodeId]);
        const subThread = BuildSub('root_note', [filterTextNote]);
        threadWorker.fetch_thread_note(subThread, null, (datas, client) => {
            console.log('fetchMainNotes', datas);
            setNotes(datas.concat());
        });
    }

    const fetchReplyNotes = (nodeId) => {
        let tmpReplyNote = TLCache.getThreadNote(nodeId);
        if (tmpReplyNote) {
            setReplyNote({ ...tmpReplyNote });
        }
        //
        const filterTextNote = textnotePro.getEvents([nodeId]);
        const subThread = BuildSub('reply_note', [filterTextNote]);
        threadWorker.fetch_thread_note(subThread, null, (datas, client) => {
            console.log('fetchReplyNotes', datas);
            setNotes(datas.concat());
        });
    }

    const fetchMeta = (pubkeys) => {

    }

    useEffect(() => {
        TLCache.clear();
        let ret = TLCache.pushThreadNote(note);
        // console.log('pushThreadNote', note, ret);
        let eNum = 0;
        let pNum = 0;
        let eArray = [];
        let pArray = [];
        if (note.tags.length === 0) {
            main_note_id = note.id;
        } else {
            note.tags.map(item => {
                if (item[0] === '#e') {
                    eNum = eNum + 1;
                    eArray.push(item[1]);
                    if (item[3] && item[3] === 'root') {
                        main_note_id = item[1];
                    }
                    if (item[3] && item[3] === 'reply') {
                        reply_note_id = item[1];
                    }
                } else if (item[0] === '#p') {
                    pNum = pNum + 1;
                    pArray.push(item[1]);
                }
            });
        }
        console.log('pushThreadNote', note, ret, main_note_id);
        // get relate information
        fetchMainNotes(main_note_id);
        fetchReplyNotes(reply_note_id);
        fetchMeta(pArray);
        return () => {
        }
    }, [note])

    const renderRootNote = () => {
        if (mainNote === null) {
            return null;
        }
        let context = {};
        let info = UserCache.getMetadata(mainNote.pubkey);
        if (info) {
            context = JSON.parse(info.content)
        }
        // console.log('mainNote', info, mainNote.pubkey);
        return <GCardNote
            note={{ ...mainNote }}
            info={{ ...context }}
        />
    }

    const renderLocalNote = () => {
        if (note && note.id === main_note_id) {
            return null;
        }
        return notes.map((item, index) => {
            return <GCardNote key={'other_node_' + index} note={{ ...item }} />
        });
    }

    const renderReplyNote = () => {
        // if (note && note.id !== main_note_id) {
        //     return null;
        // }
        return notes.map((item, index) => {
            return <GCardNote key={'reply_node_' + index} note={{ ...item }} />
        });
    }

    return (
        <Paper className='node_thread_bg' elevation={1}>
            {/* <div className='back' onClick={() => {
                navigate(-1);
            }}></div> */}
            <Typography sx={{ width: '100%', py: '18px' }} align={'center'} variant="h5" >{'THREAD'}</Typography>
            {renderRootNote()}
            {renderLocalNote()}
            {renderReplyNote()}
        </Paper >
    );

}

export default GNoteThread;