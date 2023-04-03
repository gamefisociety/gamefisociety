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
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";

import GCardNote from "components/GCardNote";

const createThreadWorker = createWorkerFactory(() => import('worker/threadRequest'));

const GNoteThread = () => {
    const threadWorker = useWorker(createThreadWorker);

    let location = useLocation();
    const navigate = useNavigate();

    const { note } = location.state;
    const [rootNote, setRootNote] = useState(null);
    const [replyNote, setReplyNote] = useState(null);
    const [notesRoot, setNotesRoot] = useState([]);
    const [notesReply, setNotesReply] = useState([]);
    //
    const metadataPro = useMetadataPro();
    const textnotePro = useTextNotePro();
    //
    const TLCache = TimelineCache();
    const UserCache = UserDataCache();

    let root_note_id = 0;
    let reply_note_id = 0;

    const fetchMainNotes = (nodeId) => {
        if (nodeId === 0) {
            return;
        }
        //
        let tmpMainNote = TLCache.getThreadNote(nodeId);
        if (tmpMainNote) {

        }
        //main note relay
        const filterTextNote = textnotePro.getEvents([nodeId]);
        const subThread = BuildSub('root_note', [filterTextNote]);
        threadWorker.fetch_thread_note(subThread, null, (datas, client) => {
            console.log('fetchMainNotes', datas);
            let tmpNoteIds = []
            datas.map((item) => {
                TLCache.pushThreadNote(item);
                tmpNoteIds.push(item.id);
            });
            let no_re_note_ids = new Set([...tmpNoteIds]);
            setNotesRoot(Array.from(no_re_note_ids));
        });
    }

    const fetchReplyNotes = (nodeId) => {
        if (nodeId === 0) {
            return;
        }
        let tmpReplyNote = TLCache.getThreadNote(nodeId);
        if (tmpReplyNote) {

        }
        //
        const filterTextNote = textnotePro.getEvents([nodeId]);
        const subThread = BuildSub('reply_note', [filterTextNote]);
        threadWorker.fetch_thread_note(subThread, null, (datas, client) => {
            console.log('fetchReplyNotes', datas);
            let tmpNoteIds = []
            datas.map((item) => {
                TLCache.pushThreadNote(item);
                tmpNoteIds.push(item.id);
            });
            let no_re_note_ids = new Set([...tmpNoteIds]);
            setNotesReply(Array.from(no_re_note_ids));
        });
    }

    const fetchMeta = (pubkeys) => {

    }

    useEffect(() => {
        TLCache.clear();
        TLCache.pushThreadNote(note);
        // console.log('pushThreadNote', note, ret);
        let eNum = 0;
        let pNum = 0;
        let eArray = [];
        let pArray = [];
        if (note.tags.length === 0) {
            root_note_id = note.id;
            reply_note_id = 0;
        } else {
            note.tags.map(item => {
                if (item[0] === 'e') {
                    eNum = eNum + 1;
                    eArray.push(item[1]);
                    if (item[3] && item[3] === 'root') {
                        root_note_id = item[1];
                    }
                    if (item[3] && item[3] === 'reply') {
                        reply_note_id = item[1];
                    }
                } else if (item[0] === 'p') {
                    pNum = pNum + 1;
                    pArray.push(item[1]);
                }
            });
        }
        if (eNum === 1) {
            root_note_id = eArray[0];
            reply_note_id = note.id;
        }
        setRootNote(root_note_id);
        setReplyNote(reply_note_id);
        console.log('pushThreadNote', note, root_note_id, reply_note_id, eArray, pArray);
        fetchMainNotes(root_note_id);
        fetchReplyNotes(reply_note_id);
        fetchMeta(pArray);
        return () => {
        }
    }, [note])

    const renderRootNote = () => {
        if (rootNote === null) {
            return null;
        }
        let context = {};
        let info = UserCache.getMetadata(rootNote);
        if (info) {
            context = JSON.parse(info.content)
        }
        let targetNote = TLCache.getThreadNote(rootNote);
        return <GCardNote note={{ ...targetNote }} info={{ ...context }} />
    }

    const renderReplyNote = () => {
        if (replyNote === null) {
            return null;
        }
        let context = {};
        let info = UserCache.getMetadata(replyNote);
        if (info) {
            context = JSON.parse(info.content)
        }
        let targetNote = TLCache.getThreadNote(replyNote);
        return <GCardNote note={{ ...targetNote }} info={{ ...context }} />
    }

    const renderRootNotes = () => {
        if (note && note.id === root_note_id) {
            return null;
        }
        return notesRoot.map((item, index) => {
            return <GCardNote key={'other_node_' + index} note={{ ...item }} />
        });
    }

    const renderReplyNotes = () => {
        return notesReply.map((item, index) => {
            return <GCardNote key={'reply_node_' + index} note={{ ...item }} />
        });
    }

    const renderContent = () => {
        if (!note) {
            return null;
        }
        if (root_note_id === note.id) {
            return (
                <Stack direction={'column'}>
                    {renderRootNote()}
                    {renderRootNotes()}
                </Stack>
            );
        } else if (reply_note_id === note.id) {
            return (
                <Stack direction={'column'}>
                    {renderReplyNote()}
                    {renderReplyNotes()}
                </Stack>
            );
        }
    }

    console.log('GNoteThread', note, rootNote, replyNote, notesRoot, notesReply);

    return (
        <Paper className='node_thread_bg' elevation={1}>
            {/* <div className='back' onClick={() => {
                navigate(-1);
            }}></div> */}
            <Typography sx={{ width: '100%', py: '18px' }} align={'center'} variant="h5" >{'THREAD'}</Typography>
            {renderContent()}
        </Paper >
    );

}

export default GNoteThread;