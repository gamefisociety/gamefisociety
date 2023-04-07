import React, { useEffect, useState } from 'react';
import './GNoteThread.scss';

import { useLocation, useNavigate } from 'react-router-dom'
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

import { BuildSub, ParseNote } from 'nostr/NostrUtils';
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
    const { note } = location.state;
    const [noteRet, setNoteRet] = useState(null);
    const [notesRoot, setNotesRoot] = useState([]);
    const [notesReply, setNotesReply] = useState([]);
    const textnotePro = useTextNotePro();
    const TLCache = TimelineCache();

    const fetchMainNotes = (rootNodeId, replyNoteId) => {
        let filterArray = [];
        //fetch [main note] and [main note] reply
        if (rootNodeId !== 0) {
            let tmpMainNote = TLCache.getThreadNote(rootNodeId);
            if (!tmpMainNote) {
                let filterRoot = textnotePro.getEventsByIds([rootNodeId]);
                filterArray.push(filterRoot);
            }
            const filterTextNote = textnotePro.getEvents([rootNodeId]);
            filterArray.push(filterTextNote);
        }
        //fetch [reply note] and [reply note] reply
        if (replyNoteId !== 0) {
            let tmpReplyNote = TLCache.getThreadNote(replyNoteId);
            if (!tmpReplyNote) {
                let filterReply = textnotePro.getEventsByIds([replyNoteId]);
                filterArray.push(filterReply);
            }
        }
        const subThread = BuildSub('root_note', filterArray);
        threadWorker.fetch_thread_note(subThread, null, (datas, client) => {
            // console.log('fetchMainNotes', datas);
            let tmpNoteIds = []
            datas.map((item) => {
                TLCache.pushThreadNote(item);
                if (item.id !== rootNodeId || item.id !== replyNoteId) {
                    tmpNoteIds.push(item.id);
                }
            });
            let no_re_note_ids = new Set([...tmpNoteIds]);
            setNotesRoot(Array.from(no_re_note_ids));
        });
    }

    const fetchReplyNotesToLocal = (nodeId) => {
        if (nodeId === 0) {
            return;
        }
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

    useEffect(() => {
        TLCache.clear();
        TLCache.pushThreadNote(note);
        let ret = ParseNote(note);
        console.log('GNoteThread', ret);
        setNoteRet({ ...ret });
        fetchMainNotes(ret.root_note_id, ret.reply_note_id);
        fetchReplyNotesToLocal(ret.local_note);
        return () => { }
    }, [note])

    const renderRootNote = () => {
        if (!noteRet || noteRet.root_note_id === 0) {
            return null;
        }
        let targetNote = TLCache.getThreadNote(noteRet.root_note_id);
        if (targetNote === null) {
            return null;
        }
        return (
            <Stack sx={{ width: '100%' }} direction={'column'}>
                <GCardNote note={{ ...targetNote }} />
            </Stack>
        );
    }

    const renderRootNotes = () => {
        if (!noteRet || noteRet.root_note_id === 0) {
            return null;
        }
        if (noteRet.reply_note_id !== 0) {
            return null;
        }
        if (notesRoot.length === 0) {
            return <Typography sx={{ width: '100%' }} align={"center"} color={'#656565'}>{'No Replies'}</Typography>
        }
        return (
            <Stack className={'note_in'} >
                <Divider sx={{ width: '100%', py: '6px', color: 'white' }} light={true}>{'ROOT REPLIES'}</Divider>
                {
                    notesRoot.map((item, index) => {
                        let targetNote = TLCache.getThreadNote(item);
                        if (targetNote === null) {
                            return null;
                        }
                        return <GCardNote key={'other_node_' + index} note={{ ...targetNote }} />
                    })
                }
            </Stack>
        );
    }

    const renderReplyNote = () => {
        if (!noteRet || noteRet.reply_note_id === 0) {
            return null;
        }
        // if (noteRet.reply_note_id === noteRet.local_note) {
        //     return null;
        // }
        let targetNote = TLCache.getThreadNote(noteRet.reply_note_id);
        if (targetNote === null) {
            return null;
        }
        return (
            <Stack className={noteRet.reply_note_id === noteRet.local_note ? 'note_in' : 'note_out'}>
                <GCardNote note={{ ...targetNote }} />
            </Stack>
        );
    }

    const renderLocalNote = () => {
        if (!noteRet || noteRet.local_note === 0) {
            return null;
        }
        if (noteRet.local_note === noteRet.reply_note_id) {
            return null;
        }
        let targetNote = TLCache.getThreadNote(noteRet.local_note);
        if (targetNote === null) {
            return null;
        }
        return (
            <Stack className={'note_in'} >
                <GCardNote note={{ ...note }} />
            </Stack>
        );
    }

    const renderReplyNotes = () => {
        if (!noteRet || noteRet.reply_note_id === 0) {
            return null;
        }
        if (notesReply.length === 0) {
            return <Typography sx={{ width: '100%' }} align={"center"} color={'#656565'}>{'No Replies'}</Typography>
        }
        return (
            <Stack className={'note_out'}>
                <Divider sx={{ width: '100%', py: '6px', color: 'white' }} light={true}>{'REPLY TO'}</Divider>
                {
                    notesReply.map((item, index) => {
                        let targetNote = TLCache.getThreadNote(item);
                        if (targetNote === null) {
                            return null;
                        }
                        return <GCardNote key={'reply_node_' + index} note={{ ...targetNote }} />
                    })
                }
            </Stack>
        );
    }

    const renderContent = () => {
        console.log('GNoteThread renderContent', noteRet);
        if (!note) {
            return null;
        }
        return (
            <Stack sx={{ width: '100%' }} direction={'column'} alignItems={'center'}>
                {renderRootNote()}
                {renderRootNotes()}
                {renderReplyNote()}
                {renderLocalNote()}
                {renderReplyNotes()}
            </Stack>
        );
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