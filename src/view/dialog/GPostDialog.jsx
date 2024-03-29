import React, { useEffect, useState } from 'react';
import './GPostDialog.scss';

import { useSelector, useDispatch } from 'react-redux';
import { setPost } from 'module/store/features/dialogSlice';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Upload from 'components/buttons/Upload';
import { ParseNote } from 'nostr/NostrUtils';
import { useTextNotePro } from 'nostr/protocal/TextNotePro';
import { System } from 'nostr/NostrSystem';

import reactStringReplace from 'react-string-replace';


const GPostDialog = () => {

    const [text, setText] = useState('');
    const [lables, setLables] = useState([]);
    const { isPost, targetPost } = useSelector(s => s.dialog);

    const dispatch = useDispatch();
    const textNotrPro = useTextNotePro();

    useEffect(() => {
        // console.log('GPostDialog', targetPost);
        let ret = ParseNote(targetPost);
        console.log('GPostDialog ret', targetPost, ret);
        return () => { }
    }, [targetPost])

    // console.log('GPostDialog', targetPost);
    const postContext = async () => {
        let ret = ParseNote(targetPost);
        let event = null;
        let tmpTags = [];
        //add e,p tag
        if (ret.root_note_id !== 0 && ret.reply_note_id === 0) {
            tmpTags.push(['e', ret.root_note_id]);
            tmpTags.push(['p', ret.root_note_p]);
        } else if (ret.root_note_id !== 0 && ret.reply_note_id !== 0) {
            tmpTags.push(['e', ret.root_note_id, '', 'root']);
            tmpTags.push(['e', ret.root_note_p, '', 'reply']);
            tmpTags.push(['p', targetPost.id]);
            tmpTags.push(['p', targetPost.pubkey]);
        }
        //add t tag
        lables.map((item) => {
            if (item && item.startsWith('#')) {
                tmpTags.push(['t', item.substr(1)]);
            }
        });
        event = await textNotrPro.sendPost(text, tmpTags);
        if (event !== null) {
            console.log('post event', event);
            System.BroadcastEvent(event, (tag, client, msg) => {
                console.log('post tag', tag, msg);
            });
        }
    }

    const renderHeader = () => {
        console.log('target note', targetPost);
        if (targetPost === null) {
            return <Box className={'post_header'}>
                <Typography className={'target_tips'}>{'Post new note!'}</Typography>
            </Box>;
        }
        return <Box className={'post_header'}>
            <Typography className={'target_tips'}>{'Reply a note!'}</Typography>
            <Typography className={'target_note'}>{targetPost.content}</Typography>
        </Box>;
    }

    const setProfileAttribute = (key, value) => {
        key = key.trim();
        console.log(key, value);
        let content = text + "\n" + value;
        setText(content);
    }

    return (
        <Dialog
            className={'dialog_post_bg'}
            open={isPost}
            fullWidth={true}
            PaperProps={{
                style: {
                    width: '400px',
                    height: '580px',
                    boxShadow: 'none',
                    backgroundColor: '#0F0F0F',
                },
            }}
            elevation={0}
        >
            <DialogContent className={'post_context'} >
                {renderHeader()}
                <TextField
                    className={'post_text'}
                    InputProps={{
                        sx: { flexGrow: 1 },
                    }}
                    fullWidth
                    variant={'outlined'}
                    minRows={17}
                    maxRows={17}
                    multiline={true}
                    // label="Replay"
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        //match label
                        let tmp_label = [];
                        const hashtagRegex = /(#\w+)/g;
                        let s = e.target.value.trim()
                        reactStringReplace(s, hashtagRegex, (match) => {
                            tmp_label.push(match);
                        });
                        setLables(tmp_label.concat());
                    }}
                />
                <Box className={'labels'}>
                    {lables.map((item, index) => (<Typography key={'label_tag_' + index} className={'lable_tag'}>{item}</Typography>))}
                </Box>
            </DialogContent>
            <DialogActions className={'post_op'}>
                <Button sx={{
                    color: 'text.primary'
                }}
                    onClick={() => {
                        dispatch(setPost({
                            post: false,
                            target: null,
                        }));
                    }}>
                    {'Cancel'}
                </Button>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Upload onUrl={(url) => setProfileAttribute("string", url)} />
                <Button sx={{
                    color: 'text.primary'
                }}
                    variant={'contained'}
                    onClick={() => {
                        dispatch(setPost({
                            post: false,
                            target: null,
                        }));
                        postContext();
                    }}>
                    {'Post'}
                </Button>
            </DialogActions>
        </Dialog >
    );
}

export default React.memo(GPostDialog);