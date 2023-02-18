import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { useSelector, useDispatch } from 'react-redux';
import {
    setOpenLogin
} from 'module/store/features/dialogSlice';
import { setKeyPairs } from "module/store/features/loginSlice";
import './GLoginDialog.scss';
//
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
//
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
//
import { bech32ToHex, parseId } from 'nostr/Util';
import * as secp from "@noble/secp256k1";

const GLoginDialog = () => {
    const { isOpenLogin } = useSelector(s => s.dialog);
    const dispatch = useDispatch();
    const [gen, setGen] = useState(false);
    const [isNip19, setNip19] = useState(true);
    const [tmpPubKey, setTmpPubKey] = useState('');
    const [tmpPriKey, setTmpPriKey] = useState('');
    const [errorKey, setErrorKey] = useState(false);
    //
    useEffect(() => {
        return () => { }
    }, [])
    // const loginSuccess = async () => {
    //     const ev = await eventBuild.metadata('');
    //     console.log("metadata", ev);
    //     eventClient.broadcast(ev);
    // }
    // //logcheck
    // useEffect(() => {
    //     if (publicKey === null || publicKey === undefined) {
    //         //
    //     } else {
    //         console.log('loginin');
    //         loginSuccess();
    //         // setLoginState(1);
    //     }
    //     return () => {
    //     }
    // }, [publicKey])
    const newKeys = () => {
        const newPriKey = secp.utils.bytesToHex(secp.utils.randomPrivateKey());
        setTmpPriKey(newPriKey);
        const newPubKey = secp.utils.bytesToHex(secp.schnorr.getPublicKey(newPriKey));
        setTmpPubKey(newPubKey)
    }

    const handleClose = () => {
        dispatch(setOpenLogin(false));
    }

    const handleOk = () => {
        if (gen) {
            //new
            dispatch(setKeyPairs({
                prikey: tmpPriKey,
                pubkey: tmpPubKey,
            }));
            dispatch(setOpenLogin(false));
        } else {
            //old
            if (isNip19) {
                let flag = tmpPriKey.startsWith('nsec');
                if (flag) {
                    let prikey = parseId(tmpPriKey);
                    if (prikey) {
                        let pubkey = secp.utils.bytesToHex(secp.schnorr.getPublicKey(prikey));
                        console.log('pubkey', pubkey);
                        dispatch(setKeyPairs({
                            prikey: prikey,
                            pubkey: pubkey,
                        }));
                        dispatch(setOpenLogin(false));
                    }
                } else {
                    //warning
                    setErrorKey(true)
                }
                console.log('tmpKey.startsWith', flag);
            } else {
                dispatch(setOpenLogin(false));
            }
        }
    }

    const renderGen = () => {
        return (
            <DialogContent>
                <DialogContentText>
                    {'Your Public Key:'}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name-new-pubkey"
                    fullWidth
                    multiline={true}
                    variant="standard"
                    value={tmpPubKey}
                />
                <DialogContentText>
                    {'Your Private Key:'}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name-new-prikey"
                    fullWidth
                    variant="standard"
                    multiline={true}
                    value={tmpPriKey}
                />
            </DialogContent>
        );
    }

    const renderOld = () => {
        return (
            <DialogContent>
                <DialogContentText>
                    {'Please enter your private key!'}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label={isNip19 ? "private key start with nsec" : 'private key start with hex'}
                    fullWidth
                    variant="standard"
                    error={errorKey}
                    onChange={(event) => {
                        setErrorKey(false);
                        setTmpPriKey(event.target.value);
                    }}
                />
                <FormGroup>
                    <FormControlLabel control={<Switch checked={isNip19} onChange={(ev) => {
                        console.log('target', ev.target.checked);
                        setNip19(ev.target.checked);
                    }} />} label="nip19" />
                </FormGroup>
            </DialogContent>
        );
    }

    return (
        <Dialog open={isOpenLogin} fullWidth={true} maxWidth={'sm'} >
            <DialogTitle>Login</DialogTitle>
            {gen ? renderGen()
                : renderOld()}
            <DialogActions disableSpacing={true}>
                {gen ? <Button onClick={() => {
                    setGen(false);
                }}>Switch</Button> : <Button onClick={() => {
                    newKeys();
                    setGen(true);
                }}>Generate</Button>}
                <Box sx={{ flexGrow: 1 }} />
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleOk}>Ensure</Button>
            </DialogActions>
        </Dialog>
    );
}

export default React.memo(GLoginDialog);