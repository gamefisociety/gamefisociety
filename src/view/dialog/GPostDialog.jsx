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

    return (
        <Dialog
            className={'dialog_post_bg'}
            // backgroundColor={'background.default'}
            open={isPost}
            fullWidth={true}
            PaperProps={{
                style: {
                    width: '400px',
                    height: '580px',
                    // backgroundColor: 'red',
                    boxShadow: 'none',
                },
            }}
        >
            {/* <DialogTitle id="scroll-dialog-title">{'Replay to xxxx'}</DialogTitle> */}
            <DialogActions sx={{
                mt: '27px',
                mb: '12px',
                px: '24px'
            }}>
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
            <DialogContent className={'post_context'} >
                <TextField
                    className={'post_text'}
                    InputProps={{
                        sx: { height: '100%' },
                    }}
                    fullWidth
                    variant={'outlined'}
                    minRows={18}
                    maxRows={18}
                    multiline={true}
                    // label="Replay"
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                    }}
                />
            </DialogContent>
        </Dialog >
    );
}

export default React.memo(GPostDialog);