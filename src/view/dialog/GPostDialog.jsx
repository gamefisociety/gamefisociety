import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPost } from 'module/store/features/dialogSlice';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useTextNotePro } from 'nostr/protocal/TextNotePro';
import { System } from 'nostr/NostrSystem';

import './GPostDialog.scss';

const GPostDialog = () => {

    const [text, setText] = useState('');
    const { isPost } = useSelector(s => s.dialog);

    const dispatch = useDispatch();
    const textNotrPro = useTextNotePro();

    useEffect(() => {
        return () => {
        }
    }, [])

    // let nodeId = '971a46a084f0bca022a87834c2c35d771ef390b29fcf3c1af6615ebde84e620f';
    // let targetPubkey = '91a45b098b434e14b07331350832c4a584592b14e971afb7e4c03cf4f85e772f';
    const postContext = async () => {
        let event = await textNotrPro.sendPost(text);
        System.BroadcastEvent(event, (tag, client, msg) => {
            console.log('post tag', tag, msg);
        });
        // let event = await textNotrPro.sendReplay(text, nodeId, targetPubkey);
        // System.BroadcastEvent(event, (tag, client, msg) => {
        //     console.log('post tag', tag, msg);
        // });
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
                        dispatch(setPost(false));
                    }}>
                    {'Cancel'}
                </Button>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Button sx={{
                    color: 'text.primary'
                }}
                    variant={'contained'}
                    onClick={() => {
                        dispatch(setPost(false));
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