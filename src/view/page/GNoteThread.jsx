import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom'
import './GNoteThread.scss';

import { parseTextNote, BuildSub } from 'nostr/NostrUtils';
import { useMetadataPro } from 'nostr/protocal/MetadataPro';
import { useTextNotePro } from 'nostr/protocal/TextNotePro';
import { System } from 'nostr/NostrSystem';

import NormalCache from 'db/NormalCache';
import TimelineCache, { thread_node_cache_flag } from 'db/TimelineCache';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";

import GCardNote from "components/GCardNote";

const GNoteThread = () => {
    let location = useLocation();
    const { note } = location.state;
    const [notes, setNotes] = useState([]);
    //
    const metadataPro = useMetadataPro();
    const textnotePro = useTextNotePro();
    //
    const NorCache = NormalCache();
    const TLCache = TimelineCache();

    let main_note_id = '0';

    let notethread_flag = 'note_thread';
    const fetchNotes = (curNote) => {
        console.log('GNoteThread', curNote);
        if (!curNote) {
            return;
        }
        let parseRet = parseTextNote(curNote);
        console.log('GNoteThread parse', parseRet);
        if (parseRet.notestate === 0) {
            const filterMetadata = metadataPro.get(curNote.pubkey);
            const sueThread = BuildSub(notethread_flag, [filterMetadata]);
            System.BroadcastSub(sueThread, (tag, client, msg) => {
                console.log('root msg', msg);
                if (tag === 'EOSE') {
                    System.BroadcastClose(sueThread, client, null);
                } else if (tag === 'EVENT') {

                }
            })
        } else {
            // const filterMetadata = metadataPro.get(parseRet.pArray); //parseRet.eArray
            const filterTextNote = textnotePro.getEvents([curNote.id]); //
            // filterTextNote.ids = [parseRet.eArray[0]];
            // filterTextNote['#e'] = [parseRet.eArray[1]];
            const sueThread = BuildSub(notethread_flag, [filterTextNote]);
            // console.log('root msg textnotes curNote', curNote);
            // console.log('root msg textnotes send', sueThread);
            System.BroadcastSub(sueThread, (tag, client, msg) => {
                // console.log('root msg textnotes receive', msg);
                if (tag === 'EOSE') {
                    System.BroadcastClose(sueThread, client, null);
                    const notes_cache = TLCache.get(thread_node_cache_flag)
                    setNotes(notes_cache.concat());
                    console.log('note cache', notes_cache);
                } else if (tag === 'EVENT') {
                    // console.log('root msg textnotes receive', msg);
                    TLCache.pushThreadNote(thread_node_cache_flag, msg);
                }
            })
        }
    }

    useEffect(() => {
        // console.log('main note', note);
        TLCache.clear(thread_node_cache_flag);
        TLCache.pushThreadNote(thread_node_cache_flag, note);
        //
        if (note.tags.length === 0) {
            main_note_id = note.id;
        } else {
            let eNum = 0;
            note.tags.map(item => {
                if (item[0] === '#e') {
                    eNum = eNum + 1;
                }
            });
            if (eNum === 1) {
                // the first e is main note id;
            } else if (eNum === 2) {
                // the first e is main note id;
                // the second e is relay note id
            }
        }
        // get relate information
        fetchNotes(note);
        return () => {
        }
    }, [note])

    const renderRootNote = () => {
        let info = NorCache.getMetadata('user_metadata', note.pubkey);
        // let main_note = TLCache.getThreadNote(thread_node_cache_flag, main_note_id);
        return <Stack sx={{
            width: '100%'
        }} direction={'column'}>
            <GCardNote
                note={{ ...note }}
                info={info}
            />
        </Stack>
    }

    const renderNotes = () => {
        return notes.map((item, index) => {
            return <GCardNote
                key={'other_node_' + index}
                note={{ ...item.msg }}
            // info={{...info}}
            />
        })
    }
    return (
        <Paper className='node_thread_bg' color={'background.default'} elevation={1}>
            <div className='back' onClick={() => {
                // setLoginState(0);
            }}></div>
            <Typography sx={{ width: '100%', py: '18px' }} align={'center'} variant="h5" >{'THREAD'}</Typography>
            {renderRootNote()}
            {renderNotes()}
        </Paper >
    );

}

export default GNoteThread;