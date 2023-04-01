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

import { useTextNotePro } from 'nostr/protocal/TextNotePro';
import { System } from 'nostr/NostrSystem';


const GPostDialog = () => {

    const [text, setText] = useState('');
    const { isPost, targetPost } = useSelector(s => s.dialog);

    const dispatch = useDispatch();
    const textNotrPro = useTextNotePro();

    useEffect(() => {
        return () => {
        }
    }, [])

    // console.log('GPostDialog', targetPost);
    const postContext = async () => {
        if (targetPost === null) {
            let event = await textNotrPro.sendPost(text);
            System.BroadcastEvent(event, (tag, client, msg) => {
                console.log('post tag', tag, msg);
            });
        } else {
            let event = await textNotrPro.sendReplay(text, targetPost.id, targetPost.pubkey);
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
            <Typography className={'target_tips'}>{'Replay a note!'}</Typography>
            <Typography className={'target_note'}>{targetPost.content}</Typography>
        </Box>;
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
                },
            }}
        >
            {renderHeader()}
            <DialogContent className={'post_context'} >
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
                    }}
                />
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