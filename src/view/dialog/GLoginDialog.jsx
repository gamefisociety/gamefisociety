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
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
//
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
//
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
//
import { bech32ToHex, parseId } from 'nostr/Util';
import * as secp from "@noble/secp256k1";

import logo_blue from "asset/image/logo/logo_blue.png";

const GLoginDialog = () => {
    const { isOpenLogin } = useSelector(s => s.dialog);
    const dispatch = useDispatch();
    const [loginState, setLoginState] = useState(0);
    const [gen, setGen] = useState(false);
    const [isNip19, setNip19] = useState(true);
    const [keys, setKeys] = useState({
        pri: '',
        pub: ''
    });
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
        const newPubKey = secp.utils.bytesToHex(secp.schnorr.getPublicKey(newPriKey));
        keys.pri = newPriKey;
        keys.pub = newPubKey;
        setKeys({ ...keys });
    }

    const handleClose = () => {
        dispatch(setOpenLogin(false));
    }

    const handleOk = () => {
        if (gen) {
            //new
            dispatch(setKeyPairs({
                prikey: keys.pri,
                pubkey: keys.pub,
            }));
            dispatch(setOpenLogin(false));
        } else {
            //old
            if (isNip19) {
                let flag = keys.pri.startsWith('nsec');
                if (flag) {
                    let prikey = parseId(keys.pri);
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
                    value={keys.pub}
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
                    value={keys.pri}
                />
            </DialogContent>
        );
    }

    const renderIntroduce = () => {
        return (
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '46px' }} >
                <CardMedia
                    component="img"
                    sx={{ width: 118, height: 118 }}
                    image={logo_blue}
                    alt="Paella dish"
                />
                <DialogContentText color={'primary'} variant={'h6'}>
                    Welcome to Gamefi Society
                </DialogContentText>
                <DialogContentText sx={{ marginTop: '12px' }} color={'primary'} variant={'subtitle2'}>
                    Completely decentralize the game community, keep big technology away from your community
                </DialogContentText>
                <DialogContentText sx={{ marginTop: '12px' }} color={'primary'} variant={'subtitle2'}>
                    Completely private, no phone number, email or name are required to create an account. Get started right away with zero friction.
                </DialogContentText>
                <Button sx={{ marginTop: '24px' }} variant="contained" color="primary" onClick={() => {
                    setLoginState(1);
                }}>
                    Create Account
                </Button>
                <Button sx={{ marginTop: '24px', backgroundColor: 'transparent' }} variant="contained" color="primary" onClick={() => {
                    setLoginState(100);
                }}>
                    Login
                </Button>
            </DialogContent>
        );
    }

    const renderWarning = () => {
        return (
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: '46px' }} >
                <Button sx={{ position: 'absolute', left: '0px', top: '0px' }} onClick={() => {
                    setLoginState(0);
                }}>Back</Button>
                <DialogContentText color={'primary'} variant={'h6'}>
                    You can review the end user agreement before registering
                </DialogContentText>
                <DialogContentText sx={{ marginTop: '12px' }} color={'primary'} variant={'subtitle2'}>
                    Completely decentralize the game community, keep big technology away from your community
                </DialogContentText>
                <DialogContentText sx={{ marginTop: '12px' }} color={'primary'} variant={'subtitle2'}>
                    Completely private, no phone number, email or name are required to create an account. Get started right away with zero friction.
                </DialogContentText>
                <Button sx={{ marginTop: '24px', width: '90%' }} variant="contained" color="primary" onClick={() => {
                    newKeys();
                    setLoginState(2);
                }}>
                    Accept
                </Button>
                <Button sx={{ marginTop: '24px', backgroundColor: 'transparent' }} variant="contained" color="primary" onClick={() => {
                    // setLoginState(100);
                }}>
                    Reject
                </Button>
            </DialogContent >
        );
    }

    const renderOld = () => {
        return (
            <DialogContent>
                <DialogContentText color="primary">
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
                        keys.pri = event.target.value;
                        keys.pub = '';
                        setKeys({ ...keys });
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

    const renderProfile = () => {
        return (
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: '46px' }} >
                <Button sx={{ position: 'absolute', left: '0px', top: '0px' }} onClick={() => {
                    setLoginState(0);
                }}>Back</Button>
                <DialogContentText color={'primary'} variant={'h6'}>
                    Create Account
                </DialogContentText>
                <CardMedia
                    component="img"
                    sx={{ width: 118, height: 118 }}
                    image={logo_blue}
                    alt="Paella dish"
                />
                <DialogContentText sx={{ marginTop: '12px', width: '100%' }} color={'primary'} variant={'subtitle2'}>
                    Username
                </DialogContentText>
                <TextField sx={{ marginTop: '12px', width: '100%', backgroundColor: 'rgba(50, 50, 50, 1)', borderRadius: '12px' }} variant="outlined" />
                <DialogContentText sx={{ marginTop: '12px', width: '100%' }} color={'primary'} variant={'subtitle2'}>
                    Display Name
                </DialogContentText>
                <TextField sx={{ marginTop: '12px', width: '100%', backgroundColor: 'rgba(50, 50, 50, 1)', borderRadius: '12px' }} variant="outlined" />
                <DialogContentText sx={{ marginTop: '12px', width: '100%' }} color={'primary'} variant={'subtitle2'}>
                    About
                </DialogContentText>
                <TextField sx={{ marginTop: '12px', width: '100%', backgroundColor: 'rgba(50, 50, 50, 1)', borderRadius: '12px' }} variant="outlined" />
                <DialogContentText sx={{ marginTop: '12px', width: '100%' }} color={'primary'} variant={'subtitle2'}>
                    Account ID
                </DialogContentText>
                <DialogContentText sx={{ marginTop: '12px', width: '100%' }} color={'primary'} variant={'subtitle2'} multiline={true}>
                    {keys.pub}
                </DialogContentText>
                <Button sx={{ marginTop: '24px', width: '90%' }} variant="contained" color="primary" onClick={() => {
                    setLoginState(2);
                }}>
                    Create
                </Button>
            </DialogContent >
        );
    }

    const renderTest = () => {
        if (gen) {
            return renderGen();
        } else {
            return renderOld();
        }
    }

    const renderContent = () => {
        if (loginState === 0) {
            return renderIntroduce();
        } else if (loginState === 1) {
            return renderWarning();
        } else if (loginState === 2) {
            return renderProfile();
        } else if (loginState === 100) {
            return renderTest();
        }
        return null;
    }

    return (
        <Dialog open={isOpenLogin} fullWidth={true} maxWidth={'xs'}
            PaperProps={{
                style: {
                    backgroundColor: 'rgba(15, 15, 15, 1)',
                    boxShadow: 'none',
                },
            }}>
            {/* <DialogTitle>Login</DialogTitle> */}
            {renderContent()}
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