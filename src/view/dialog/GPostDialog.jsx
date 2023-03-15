import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from "notistack";
import { setPost } from 'module/store/features/dialogSlice';
import { changeNetwork, ChainId } from '../../web3/GFTChainNet'

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import DoneIcon from '@mui/icons-material/Done';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import './GPostDialog.scss';
import { red } from '../../../node_modules/@ant-design/colors/es/index';

const GPostDialog = () => {

    const [text, setText] = useState('');
    const { isPost } = useSelector(s => s.dialog);

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
        }
    }, [])

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