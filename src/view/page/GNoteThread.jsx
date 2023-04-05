import React, { useEffect, useState } from 'react';
import './GNoteThread.scss';

import { useLocation, useNavigate } from 'react-router-dom'
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

import { BuildSub } from 'nostr/NostrUtils';
import { useTextNotePro } from 'nostr/protocal/TextNotePro';
import TimelineCache from 'db/TimelineCache';
import UserDataCache from 'db/UserDataCache';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
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
    const textnotePro = useTextNotePro();
    const TLCache = TimelineCache();
    const UserCache = UserDataCache();

    const fetchMainNotes = (nodeId) => {
        if (nodeId === 0) {
            return;
        }
        //
        let filterArray = [];
        const filterTextNote = textnotePro.getEvents([nodeId]);
        filterArray.push(filterTextNote);
        let tmpMainNote = TLCache.getThreadNote(nodeId);
        if (!tmpMainNote) {
            let filterTarget = textnotePro.getEventsByIds([nodeId]);
            filterArray.push(filterTextNote, filterTarget);
        }
        const subThread = BuildSub('root_note', filterArray);
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
        let root_note_id = 0;
        let reply_note_id = 0;
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
        //
        if (eNum === 0) {
            root_note_id = note.id;
            reply_note_id = 0;
        } else if (eNum === 1) {
            root_note_id = eArray[0];
            reply_note_id = note.id;
        }
        //
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
        let targetNote = TLCache.getThreadNote(rootNote);
        if (targetNote === null) {
            return null;
        }
        return <GCardNote note={{ ...targetNote }} />
    }

    const renderReplyNotes = () => {
        if (notesReply.length === 0) {
            return <Typography sx={{ width: '100%' }} align={"center"} color={'#656565'}>{'No Replies'}</Typography>
        }
        return notesReply.map((item, index) => {
            console.log('notesReply', item);
            let targetNote = TLCache.getThreadNote(item);
            if (targetNote === null) {
                return null;
            }
            console.log('GNoteThread renderReplyNotes', rootNote, targetNote);
            return <GCardNote key={'reply_node_' + index} note={{ ...targetNote }} />
        });
    }

    const renderReplyNote = () => {
        if (replyNote === null) {
            return null;
        }
        let targetNote = TLCache.getThreadNote(replyNote);
        if (targetNote === null) {
            return null;
        }
        return <GCardNote note={{ ...targetNote }} />
    }

    const renderSelf = () => {
        if (note === null) {
            return null
        }
        return <GCardNote note={{ ...note }} />
    }

    const renderRootNotes = () => {
        if (notesRoot.length === 0) {
            return <Typography sx={{ width: '100%' }} align={"center"} color={'#656565'}>{'No Replies'}</Typography>
        }
        return notesRoot.map((item, index) => {
            let targetNote = TLCache.getThreadNote(item);
            if (targetNote === null) {
                return null;
            }
            return <GCardNote key={'other_node_' + index} note={{ ...targetNote }} />
        });
    }

    const renderContent = () => {
        console.log('GNoteThread renderContent', note, rootNote, replyNote);
        if (!note) {
            return null;
        }
        if (rootNote === note.id) {
            console.log('GNoteThread renderContent renderRoot', rootNote);
            return (
                <Stack sx={{ width: '100%' }} direction={'column'} alignItems={'center'}>
                    <Stack sx={{ width: '100%' }} direction={'column'}>
                        {renderRootNote()}
                    </Stack>
                    <Divider sx={{ width: '100%', py: '6px', color: 'white' }} light={true}>{'REPLIES'}</Divider>
                    <Stack sx={{ width: '80%' }} direction={'column'}>
                        {renderRootNotes()}
                    </Stack>
                </Stack>
            );
        } else if (replyNote === note.id) {
            console.log('GNoteThread renderContent replyNote', replyNote);
            return (
                <Stack sx={{ width: '100%' }} direction={'column'} alignItems={'center'}>
                    <Stack sx={{ width: '100%' }} direction={'column'}>
                        {renderRootNote()}
                    </Stack>
                    {/* {renderReplyNote()} */}
                    <Divider sx={{ width: '100%', py: '6px', color: 'white' }} light={true}>{'REPLY'}</Divider>
                    <Stack sx={{ width: '80%', border: 1, borderColor: 'white', py: '6px' }} direction={'column'}>
                        {renderSelf()}
                    </Stack>
                    <Stack sx={{ width: '100%' }} direction={'column'}>
                        <Divider sx={{ width: '100%', py: '6px', color: 'white' }} light={true}>{'RELATIVE'}</Divider>
                        {renderReplyNotes()}
                    </Stack>
                </Stack>
            );
        } else {
            return (
                <Stack sx={{ width: '100%' }} direction={'column'} alignItems={'center'}>
                    <Stack sx={{ width: '100%' }} direction={'column'}>
                        {renderRootNote()}
                    </Stack>
                    <Stack sx={{ width: '100%' }} direction={'column'}>
                        {renderReplyNote()}
                    </Stack>
                    <Divider sx={{ width: '100%', py: '6px', color: 'white' }} light={true}>{'REPLIES'}</Divider>
                    <Stack sx={{ width: '80%', border: 1, borderColor: 'white', py: '6px' }} direction={'column'}>
                        {renderSelf()}
                    </Stack>
                    <Stack sx={{ width: '100%' }} direction={'column'}>
                        <Divider sx={{ width: '100%', py: '6px', color: 'white' }} light={true}>{'RELATIVE'}</Divider>
                        {renderReplyNotes()}
                    </Stack>
                </Stack>
            );
        }
    }

    // console.log('GNoteThread', note, rootNote, replyNote, notesRoot, notesReply);

    return (
        <Paper className='node_thread_bg' elevation={1}>
            <Typography sx={{ width: '100%', py: '18px' }} align={'center'} variant="h5" >{'THREAD'}</Typography>
            {renderContent()}
        </Paper >
    );

}

export default GNoteThread;