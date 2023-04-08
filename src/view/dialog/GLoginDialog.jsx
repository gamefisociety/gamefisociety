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
import Stack from '@mui/material/Stack';
//
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DoneIcon from '@mui/icons-material/Done';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
//
import { hexToBech32, bech32ToHex, parseId } from 'nostr/Util';
import * as secp from "@noble/secp256k1";

import logo_blue from "asset/image/logo/logo_blue.png";

import { useMetadataPro } from 'nostr/protocal/MetadataPro';
import { System } from 'nostr/NostrSystem';
import copy from "copy-to-clipboard";

const license_1 = 'End User License Agreement\n\n##Introduction\n\nThis End User License Agreement("EULA") is a legal agreement between you and GameFi Society Platform. For the use of our dapp,you agree to be bound of by the terms and conditions of this EULA';
const license_2 = '## Prohibited Content and Conduct\n\nYou agree not to use our Dapp to create,upload,post,send,or store any content that:\n\n*Is illegal,infringing,or fraudulent\n*Is defamatory,libelous,or threatening\n*Is pornographic,obscene,or offensive\n*Is discriminatory or promotes hate speech\n*Is harmful to minors\n*Is intended to harass or bully others\n*Is intendet to impersonnate others';
const license_3 = '## You also agree not to engage in any conduct thart.\n*Harasses or bullies others\n*Impersonates others\n*Is intended to intimidate or threaten others\n*Is intended to promote or incite violence';
const license_4 = '## Changes to EULA\n\nWe reserve the right to update ro modify this EULA at any time and without prior notice. Your continues use of out Dapp or Application following any changes to this EULA will be deemed to be your acceptance of such changes.';
const license_5 = '## Contact infomation\n\nIf you have any questions about this EULA, please contact us at apple.sve@gmail.com';

const GLoginDialog = () => {
    const { loggedOut } = useSelector(s => s.dialog);
    const dispatch = useDispatch();
    const [loginState, setLoginState] = useState(0);
    const [isNip19, setNip19] = useState(true);
    const [keys, setKeys] = useState({
        pri: '',
        pub: ''
    });
    const [profile, setProfile] = useState({
        name: '',
        display_name: '',
        about: ''
    });
    const [copyState, setCopyState] = useState({
        pubkey: false,
        prikey: false,
    });
    const [errorKey, setErrorKey] = useState(false);
    const MetaPro = useMetadataPro();
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
        //
        let ev = await MetaPro.create(keys.pub, keys.pri, profile);
        System.BroadcastEvent(ev, (tags, client, msg) => {
            console.log('MetaPro create', tags, msg);
            // console.log('create profile msg', msg);
        });
    }

    const IOSSwitch = styled((props) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
        width: 42,
        height: 22,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(20px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#32dce8' : '#65C466', //'#2ECA45',#65C466
                    opacity: 1,
                    border: 0,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 18,
            height: 18,
        },
        '& .MuiSwitch-track': {
            borderRadius: 22 / 2,
            backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
        },
    }));

    const handleLogin = () => {
        if (isNip19) {
            let flag = keys.pri.startsWith('nsec');
            if (flag) {
                let prikey = parseId(keys.pri);
                if (prikey) {
                    let pubkey = secp.utils.bytesToHex(secp.schnorr.getPublicKey(prikey));
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
            let flag = keys.pri.startsWith('nsec');
            if (flag === false) {
                let prikey = keys.pri;
                let pubkey = secp.utils.bytesToHex(secp.schnorr.getPublicKey(prikey));
                dispatch(setKeyPairs({
                    prikey: prikey,
                    pubkey: pubkey,
                }));
                dispatch(setOpenLogin(false));
            } else {
                //warning
                setErrorKey(true)
            }
        }
    }

    const renderIntroduce = () => {
        return (
            <DialogContent className={'dlg_content'} sx={{ backgroundColor: "background.paper" }}>
                <div className='close' onClick={() => {
                    dispatch(setOpenLogin(false));
                }}></div>
                <CardMedia
                    component="img"
                    sx={{ width: '120px', height: '120px' }}
                    src={logo_blue}
                    alt="Paella dish"
                />
                <DialogContentText color={'text.secondary'} variant={'h5'}>
                    {'GameFi Society'}
                </DialogContentText>
                <DialogContentText
                    sx={{ mt: '24px', px: '24px' }}
                    color={'text.secondary'}
                    variant={'subtitle2'}>
                    {'Decentralized game social platform. Good products come from user evaluations'}
                </DialogContentText>
                <DialogContentText
                    sx={{ mt: '12px', px: '24px' }}
                    color={'text.secondary'}
                    variant={'subtitle2'}>
                    {'Creating an account, doesn‘t require a phone number, email or name. Get started right away with zero friction.'}
                </DialogContentText>
                <DialogContentText
                    sx={{ mt: '12px', px: '24px' }}
                    color={'text.secondary'}
                    variant={'subtitle2'}>
                    {'Freedom post notes on nostr network and blockchain net.'}
                </DialogContentText>
                <DialogContentText
                    sx={{ mt: '12px', px: '24px' }}
                    color={'text.secondary'}
                    variant={'subtitle2'}>
                    {'End-to-End encrypted private messaging.Keep Big Tech out of your DMs'}
                </DialogContentText>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Button sx={{
                    mt: '24px',
                    width: '75%',
                    color: 'text.primary'
                }}
                    variant="contained"
                    onClick={() => {
                        setLoginState(1);
                    }}>
                    {'Create Account'}
                </Button>
                <Button sx={{
                    mt: '24px',
                    backgroundColor: 'transparent',
                    color: 'text.primary'
                }}
                    color="primary"
                    onClick={() => {
                        setLoginState(100);
                    }}>
                    {'Login'}
                </Button>
            </DialogContent>
        );
    }

    const renderWarning = () => {
        return (
            <DialogContent className={'dlg_content'} sx={{ backgroundColor: "background.paper" }}>
                <div className='back' onClick={() => {
                    setLoginState(0);
                }}></div>
                <DialogContentText sx={{
                    mt: '36px',
                    mb: '12px'
                }} color={'text.secondary'} variant={'h5'}>
                    {'EULA'}
                </DialogContentText>
                <DialogContent class={'eula_content'} dividers={true} sx={{ border: 0, boxSizing: 'border-box' }}>
                    <DialogContentText
                        sx={{
                            marginTop: '12px',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap'
                        }}
                        color={'text.secondary'}
                        variant={'subtitle2'}>
                        {license_1}
                    </DialogContentText>
                    <DialogContentText
                        sx={{
                            marginTop: '12px',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap'
                        }}
                        color={'text.secondary'}
                        variant={'subtitle2'}>
                        {license_2}
                    </DialogContentText>
                    <DialogContentText
                        sx={{
                            marginTop: '12px',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap'
                        }}
                        color={'text.secondary'}
                        variant={'subtitle2'}>
                        {license_3}
                    </DialogContentText>
                    <DialogContentText
                        sx={{
                            marginTop: '12px',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap'
                        }}
                        color={'text.secondary'}
                        variant={'subtitle2'}>
                        {license_4}
                    </DialogContentText>
                    <DialogContentText
                        sx={{
                            marginTop: '12px',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap'
                        }}
                        color={'text.secondary'}
                        variant={'subtitle2'}>
                        {license_5}
                    </DialogContentText>
                </DialogContent>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Button sx={{ marginTop: '24px', width: '75%' }} variant="contained" color="primary" onClick={() => {
                    newKeys();
                    setLoginState(2);
                }}>
                    {'Accept'}
                </Button>
                <Button sx={{
                    marginTop: '24px',
                    backgroundColor: 'transparent',
                    color: 'text.primary'
                }}
                    onClick={handleClose}>
                    {'Reject'}
                </Button>
            </DialogContent >
        );
    }

    const renderLogin = () => {
        return (
            <DialogContent className={'dlg_content'} sx={{ backgroundColor: "background.paper" }}>
                <div className='back' onClick={() => {
                    setLoginState(0);
                }}></div>
                <CardMedia
                    component="img"
                    sx={{ width: '120px', height: '120px' }}
                    src={logo_blue}
                    alt="Paella dish"
                />
                <DialogContentText color="text.secondary" variant={'h5'} sx={{ mt: '40px', width: '100%' }}>
                    {'Please enter your private key!'}
                </DialogContentText>
                <TextField
                    sx={{ mt: '24px', height: '42px' }}
                    autoFocus
                    placeholder={isNip19 ? "private key start with nsec" : 'private key start with hex'}
                    fullWidth
                    multiline
                    variant="outlined"
                    onChange={(event) => {
                        setErrorKey(false);
                        keys.pri = event.target.value;
                        keys.pub = '';
                        setKeys({ ...keys });
                    }}
                />
                <FormGroup sx={{ width: '100%', mt: '36px' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <IOSSwitch checked={isNip19}
                            onChange={(ev) => {
                                setNip19(ev.target.checked);
                            }} />
                        <Typography>{'NIP19'}</Typography>
                    </Stack>
                    {/* <FormControlLabel control={ } /> */}
                </FormGroup>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Button sx={{
                    width: '90%'
                }}
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}>
                    {'Let’s go!'}
                </Button>
                <Button sx={{
                    marginTop: '24px',
                    backgroundColor: 'transparent',
                    color: 'text.primary'
                }}
                    onClick={handleClose}>
                    {'Cancle'}
                </Button>
            </DialogContent>
        );
    }

    const renderProfile = () => {
        return (
            <DialogContent className={'dlg_content'} sx={{ backgroundColor: "background.paper" }} >
                <div className='back' onClick={() => {
                    setLoginState(0);
                }}></div>
                <CardMedia
                    component="img"
                    sx={{ width: '120px', height: '120px' }}
                    src={logo_blue}
                    alt="Paella dish"
                />
                <DialogContentText color={'text.secondary'} variant={'h6'}>
                    {'Create Account'}
                </DialogContentText>
                <DialogContentText
                    sx={{ mt: '0px', width: '100%' }} color={'text.secondary'} variant={'subtitle2'}>
                    {'Username'}
                </DialogContentText>
                <Stack sx={{
                    width: '100%',
                }} direction='row' alignItems='center' justifyContent='flex-start'>
                    <Typography color={'text.primary'}>{'@'}</Typography>
                    <TextField
                        className={'text_input'}
                        sx={{
                            ml: '15px',
                        }}
                        InputProps={{
                            sx: { height: '42px' },
                        }}
                        variant="outlined"
                        placeholder={'gamefi society username'}
                        value={profile.name}
                        onChange={(event) => {
                            profile.name = event.target.value;
                            setProfile({ ...profile });
                        }}
                    />
                </Stack>
                <DialogContentText
                    sx={{ mt: '18px', width: '100%' }} color={'text.secondary'} variant={'subtitle2'}>
                    {'Display Name'}
                </DialogContentText>
                <TextField
                    className={'text_input'}
                    variant="outlined"
                    placeholder={'gamefi society displayname'}
                    value={profile.display_name}
                    InputProps={{
                        sx: { height: '42px' },
                    }}
                    onChange={(event) => {
                        profile.display_name = event.target.value;
                        setProfile({ ...profile });
                    }}
                />
                <DialogContentText
                    sx={{ mt: '18px', width: '100%' }}
                    color={'text.secondary'}
                    variant={'subtitle2'}>
                    {'About'}
                </DialogContentText>
                <TextField
                    className={'text_input'}
                    value={profile.about}
                    placeholder={'introduce youself'}
                    onChange={(event) => {
                        profile.about = event.target.value;
                        setProfile({ ...profile });
                    }}
                    InputProps={{
                        sx: { height: '42px' },
                    }}
                    variant="outlined" />
                <DialogContentText sx={{ mt: '18px', width: '100%' }} color={'text.secondary'} variant={'subtitle2'}>
                    {'Account ID (public key)'}
                </DialogContentText>
                <Typography sx={{ mt: '12px', wordBreak: "break-word" }} color={'tetxt.primary'} variant={'subtitle2'} >
                    {hexToBech32('npub', keys.pub)}
                </Typography>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Button sx={{ width: '90%' }} variant="contained" color="primary" onClick={() => {
                    //
                    copyState.prikey = false;
                    copyState.pubkey = false;
                    setCopyState({ ...copyState });
                    //
                    setLoginState(3);
                }}>
                    {'Create'}
                </Button>
            </DialogContent >
        );
    }

    const renderKeys = () => {
        return (
            <DialogContent className={'dlg_content'} sx={{ backgroundColor: "background.paper" }}>
                <div className='back' onClick={() => {
                    setLoginState(2);
                }}></div>
                <DialogContentText color={'text.primary'} variant={'h5'} sx={{ mt: '32px' }}>
                    {'Welcome, ' + profile.name + '!'}
                </DialogContentText>
                <DialogContentText sx={{ mt: '12px' }} color={'text.primary'} variant={'subtitle2'}>
                    {'Before we start, you need to save your account information, keep your private key safe so you can log in at any time.'}
                </DialogContentText>
                <DialogContentText sx={{ mt: '42px' }} color={'text.primary'} variant={'h5'}>
                    {'Public Key'}
                </DialogContentText>
                <DialogContentText sx={{ marginTop: '6px' }} color={'text.primary'} variant={'subtitle2'}>
                    {'This is your account D, you can give this to your friends so that they can follow you. Click to copy.'}
                </DialogContentText>
                <Stack direction={'row'} alignItems={'center'}>
                    <Typography sx={{ width: '85%', mt: '12px', wordBreak: "break-word" }} color={'primary'} variant={'subtitle2'} >
                        {hexToBech32('npub', keys.pub)}
                    </Typography>
                    <IconButton color={'white'} onClick={() => {
                        copy(hexToBech32('npub', keys.pub));
                        copyState.pubkey = true;
                        setCopyState({ ...copyState });
                    }}>
                        {copyState.pubkey === false ? <ContentCopyIcon /> : <DoneIcon />}
                    </IconButton>
                </Stack>
                <DialogContentText sx={{ mt: '42px' }} color={'text.primary'} variant={'h5'}>
                    {'Private Key'}
                </DialogContentText>
                <DialogContentText sx={{ mt: '6px' }} color={'text.primary'} variant={'subtitle2'}>
                    {"This is your secret account key. You need this to access your account. Don't share this with anyone! Save it in a password manager and keep it safe!"}
                </DialogContentText>
                <Stack direction={'row'} alignItems={'center'}>
                    <Typography sx={{ width: '85%', marginTop: '12px', wordBreak: "break-word" }} color={'primary'} variant={'subtitle2'} >
                        {hexToBech32('nsec', keys.pri)}
                    </Typography>
                    <IconButton color={'white'} onClick={() => {
                        copy(hexToBech32('nsec', keys.pri));
                        copyState.prikey = true;
                        setCopyState({ ...copyState });
                    }}>
                        {copyState.prikey === false ? <ContentCopyIcon /> : <DoneIcon />}
                    </IconButton>
                </Stack>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Button sx={{ width: '75%' }} variant="contained" color="primary" onClick={handleCreate}>
                    {'Let’s go!'}
                </Button>
            </DialogContent >
        )
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
            return renderLogin();
        }
        return null;
    }

    // console.log('loggedOut', loggedOut)
    return (
        <Dialog
            className={'dialog_login'}
            open={loggedOut ? loggedOut : false}
            fullWidth={true}
            PaperProps={{
                style: {
                    width: '400px',
                    height: '650px',
                    backgroundColor: 'rgba(15, 15, 15, 1)',
                    boxShadow: 'none',
                },
            }}
        >
            {renderContent()}
        </Dialog>
    );
}

export default React.memo(GLoginDialog);