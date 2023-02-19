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
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DoneIcon from '@mui/icons-material/Done';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
//
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
//
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
//
import { hexToBech32, bech32ToHex, parseId } from 'nostr/Util';
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
    const [profile, setProfile] = useState({
        nickname: '',
        displayname: '',
        about: ''
    });
    const [errorKey, setErrorKey] = useState(false);
    //
    useEffect(() => {
        return () => { }
    }, [])
    //
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

    const handleCreate = async () => {
        dispatch(setKeyPairs({
            prikey: keys.pri,
            pubkey: keys.pub,
        }));
        dispatch(setOpenLogin(false));
        // const ev = await eventBuild.metadata('');
        // console.log("metadata", ev);
        // eventClient.broadcast(ev);
    }

    const handleLogin = () => {
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
                <IconButton sx={{ position: 'absolute', left: '10px', top: '10px' }} onClick={() => {
                    setLoginState(0);
                }}>
                    <ArrowBackIosIcon />
                </IconButton>
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
                <Button sx={{ marginTop: '24px', backgroundColor: 'transparent' }} variant="contained" color="primary" onClick={handleClose}>
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
                <IconButton sx={{ position: 'absolute', left: '10px', top: '10px' }} onClick={() => {
                    setLoginState(0);
                }}>
                    <ArrowBackIosIcon />
                </IconButton>
                <DialogContentText color={'primary'} variant={'h6'}>
                    Create Account
                </DialogContentText>
                <CardMedia
                    component="img"
                    sx={{ width: 118, height: 118 }}
                    image={logo_blue}
                    alt="Paella dish"
                />
                <DialogContentText
                    sx={{ marginTop: '12px', width: '100%' }} color={'primary'} variant={'subtitle2'}>
                    Username
                </DialogContentText>
                <TextField
                    sx={{ marginTop: '12px', width: '100%', backgroundColor: 'rgba(50, 50, 50, 1)', borderRadius: '12px' }} variant="outlined"
                    value={profile.nickname}
                    onChange={(event) => {
                        profile.nickname = event.target.value;
                        setProfile({ ...profile });
                    }}
                />
                <DialogContentText
                    sx={{ marginTop: '12px', width: '100%' }} color={'primary'} variant={'subtitle2'}>
                    Display Name
                </DialogContentText>
                <TextField
                    sx={{ marginTop: '12px', width: '100%', backgroundColor: 'rgba(50, 50, 50, 1)', borderRadius: '12px' }} variant="outlined"
                    value={profile.displayname}
                    onChange={(event) => {
                        profile.displayname = event.target.value;
                        setProfile({ ...profile });
                    }}
                />
                <DialogContentText
                    sx={{ marginTop: '12px', width: '100%' }}
                    color={'primary'}
                    variant={'subtitle2'}>
                    About
                </DialogContentText>
                <TextField
                    sx={{ marginTop: '12px', width: '100%', backgroundColor: 'rgba(50, 50, 50, 1)', borderRadius: '12px' }}
                    value={profile.about}
                    onChange={(event) => {
                        profile.about = event.target.value;
                        setProfile({ ...profile });
                    }}
                    variant="outlined" />
                <DialogContentText sx={{ marginTop: '12px', width: '100%' }} color={'primary'} variant={'subtitle2'}>
                    Account ID
                </DialogContentText>
                <Typography sx={{ marginTop: '12px', wordBreak: "break-word" }} color={'primary'} variant={'subtitle2'} >
                    {hexToBech32('npub', keys.pub)}
                </Typography>
                <Button sx={{ marginTop: '24px', width: '90%' }} variant="contained" color="primary" onClick={() => {
                    setLoginState(3);
                }}>
                    Create
                </Button>
            </DialogContent >
        );
    }

    const renderKeys = () => {
        return (
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: '46px' }} >
                <IconButton sx={{ position: 'absolute', left: '10px', top: '10px' }} onClick={() => {
                    setLoginState(2);
                }}>
                    <ArrowBackIosIcon />
                </IconButton>
                <DialogContentText color={'primary'} variant={'h6'}>
                    {'Welcome,' + profile.nickname + '!'}
                </DialogContentText>
                <DialogContentText sx={{ marginTop: '12px' }} color={'primary'} variant={'subtitle2'}>
                    Before we start, you need to save your account information, keep your private key safe so you can log in at any time.
                </DialogContentText>
                <DialogContentText sx={{ marginTop: '24px' }} color={'primary'} variant={'h6'}>
                    {'Public Key'}
                </DialogContentText>
                <DialogContentText sx={{ marginTop: '12px' }} color={'primary'} variant={'subtitle2'}>
                    This is your account D, you can give this to your friends so that they can follow you. Click to copy.
                </DialogContentText>
                <DialogActions disableSpacing={true}>=
                    <Typography sx={{ marginTop: '12px', wordBreak: "break-word" }} color={'primary'} variant={'subtitle2'} >
                        {hexToBech32('npub', keys.pub)}
                    </Typography>
                    <IconButton aria-label="pub-done" color={'primary'}>
                        <DoneIcon />
                    </IconButton>
                </DialogActions>
                <DialogContentText sx={{ marginTop: '24px' }} color={'primary'} variant={'h6'}>
                    {'Private Key'}
                </DialogContentText>
                <DialogContentText sx={{ marginTop: '12px' }} color={'primary'} variant={'subtitle2'}>
                    This is your secret account key. You need this to access your account. Don't share this with anyone! Save it in a password manager and keep it safe!
                </DialogContentText>
                <DialogActions disableSpacing={true}>=
                    <Typography sx={{ marginTop: '12px', wordBreak: "break-word" }} color={'primary'} variant={'subtitle2'} >
                        {hexToBech32('nsec', keys.pri)}
                    </Typography>
                    <IconButton aria-label="pri-copy" color={'secondary'}>
                        <ContentCopyIcon />
                    </IconButton>
                </DialogActions>
                <Button sx={{ marginTop: '24px', width: '90%' }} variant="contained" color="primary" onClick={handleCreate}>
                    {'Let’s go!'}
                </Button>
            </DialogContent >
        )
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
        } else if (loginState === 3) {
            return renderKeys();
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
            {renderContent()}
        </Dialog>
    );
}

export default React.memo(GLoginDialog);