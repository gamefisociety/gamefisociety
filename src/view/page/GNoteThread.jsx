import React, { useEffect, useState } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom'
import './GNoteThread.scss';
import { parseTextNote, BuildSub } from 'nostr/NostrUtils';
import { useMetadataPro } from 'nostr/protocal/MetadataPro';
import { useTextNotePro } from 'nostr/protocal/TextNotePro';
import { System } from 'nostr/NostrSystem';

const GNoteThread = () => {

    let location = useLocation();
    const metadataPro = useMetadataPro();
    const textnotePro = useTextNotePro();
    const { note } = location.state;

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
                }
            })
        } else {
            // const filterMetadata = metadataPro.get(parseRet.pArray); //parseRet.eArray
            const filterTextNote = textnotePro.getEvents([curNote.id]); //
            // filterTextNote.ids = [parseRet.eArray[0]];
            // filterTextNote['#e'] = [parseRet.eArray[1]];
            const sueThread = BuildSub(notethread_flag, [filterTextNote]);
            console.log('root msg textnotes curNote', curNote);
            console.log('root msg textnotes send', sueThread);
            System.BroadcastSub(sueThread, (tag, client, msg) => {
                console.log('root msg textnotes receive', msg);
                if (tag === 'EOSE') {
                    System.BroadcastClose(sueThread, client, null);
                }
            })
        }
    }

    useEffect(() => {
        fetchNotes(note);
        return () => {
        }
    }, [note])

    return (
        <div className='nft_detail_bg'>
            <div className='layout'>
                <div className='tab_layout'>
                    <Link className="txt" to="/">Home</Link>
                    <span className='txt'> {'>'}</span>
                    <span className='txt'> Society</span>
                    <span className='txt'> {'>'}</span>
                    <span className='txt'> {'Test'} </span>
                </div>
            </div>
        </div >
    );

}

export default GNoteThread;