import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';

import './GCardUser.scss';

import { useMetadataPro } from 'nostr/protocal/MetadataPro';
import { System } from 'nostr/NostrSystem';

const GCardUser = (props) => {
    // console.log('props.profile', props.profile);

    const MetaPro = useMetadataPro();

    const [localProfile, setLocalProfile] = useState({
        picture: '',
        banner: '',
        name: 'default',
        display_name: 'default',
        about: 'default',
        website: 'default',
        lud06: '',
        created: 'default',
    });
    const { publicKey, privateKey } = useSelector(s => s.login);
    const dispatch = useDispatch();

    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        localProfile.picture = props.profile.picture;
        localProfile.banner = props.profile.banner;
        localProfile.name = props.profile.name;
        localProfile.display_name = props.profile.display_name;
        localProfile.about = props.profile.about;
        localProfile.website = props.profile.website;
        localProfile.nip05 = props.profile.nip05;
        localProfile.lud06 = props.profile.lud06;
        localProfile.created = props.profile.created;
        setLocalProfile({ ...localProfile });
        return () => {
        }
    }, [props])

    const saveProfile = async () => {
        let ev = await MetaPro.send(publicKey, localProfile, privateKey);
        // console.log('saveProfile', ev);
        System.Broadcast(ev, 0, (msg) => {
            if (msg[0] === 'OK') {
                setOpen(true)
            }
            console.log('modify profile msg', msg);
        });
    }

    const updateProfile = async () => {
        // let ev = await MetaPro.send(keys.pub, localProfile, keys.pri);
        // console.log('MetadataPro', ev);
        // System.Broadcast(ev, 0, (msg) => {
        //     console.log('create profile msg', msg);
        // });
    }

    // const renderSke = () => {
    //     return (
    //         <React.Fragment>
    //             <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
    //             <Skeleton animation="wave" height={10} width="80%" />
    //         </React.Fragment>
    //     )
    // }

    return (
        <Card sx={{ backgroundColor: '#1F1F1F', padding: '12px', width: '100%', maxWidth: '960px' }}>
            <Typography align='left' variant="h6" component="div">
                {'Profile Panel'}
            </Typography>
            <CardActionArea sx={{ mt: '12px' }}>
                <Avatar
                    sx={{ width: 64, height: 64, position: 'absolute', left: '24px', top: '120px' }}
                    edge="end"
                    alt="GameFi Society"
                    src={localProfile.picture}
                />
                <CardMedia
                    component="img"
                    sx={{ height: '140px' }}
                    image={localProfile.banner}
                    alt="green iguana"
                />
                <CardContent sx={{ mt: '32px' }}>
                    <Typography variant="body2" component="div" align={'left'}>
                        {'Update: ' + localProfile.created}
                    </Typography>
                    <Typography sx={{ mt: '24px' }} variant="subtitle2" color='gray' align={'left'}>
                        {'Your Name'}
                    </Typography>
                    <TextField
                        value={localProfile.display_name}
                        margin="dense"
                        id="name"
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            localProfile.display_name = event.target.value;
                            setLocalProfile({ ...localProfile });
                        }}
                    />
                    <Typography sx={{ mt: '16px' }} variant="subtitle2" color='gray' align={'left'}>
                        {'User Name'}
                    </Typography>
                    <TextField
                        value={localProfile.name}
                        margin="dense"
                        id="name"
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            localProfile.name = event.target.value;
                            setLocalProfile({ ...localProfile });
                        }}
                    />
                    <Typography sx={{ mt: '16px' }} variant="subtitle2" color='gray' align={'left'}>
                        {'Profile Picture'}
                    </Typography>
                    <TextField
                        value={localProfile.picture}
                        margin="dense"
                        id="name"
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            localProfile.picture = event.target.value;
                            setLocalProfile({ ...localProfile });
                        }}
                    />
                    <Typography sx={{ mt: '16px' }} variant="subtitle2" color='gray' align={'left'}>
                        {'Banner Image'}
                    </Typography>
                    <TextField
                        value={localProfile.banner}
                        margin="dense"
                        id="name"
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            localProfile.banner = event.target.value;
                            setLocalProfile({ ...localProfile });
                        }}
                    />
                    <Typography sx={{ mt: '16px' }} variant="subtitle2" color='gray' align={'left'}>
                        {'Website'}
                    </Typography>
                    <TextField
                        value={localProfile.website}
                        margin="dense"
                        id="name"
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            localProfile.website = event.target.value;
                            setLocalProfile({ ...localProfile });
                        }}
                    />
                    <Typography sx={{ mt: '16px' }} variant="subtitle2" color='gray' align={'left'}>
                        {'Abount Me'}
                    </Typography>
                    <TextField
                        value={localProfile.about}
                        margin="dense"
                        id="name"
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            localProfile.about = event.target.value;
                            setLocalProfile({ ...localProfile });
                        }}
                    />
                    <Typography sx={{ mt: '16px' }} variant="subtitle2" color='gray' align={'left'}>
                        {'NIP-05'}
                    </Typography>
                    <TextField
                        value={localProfile.nip05}
                        margin="dense"
                        id="name"
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            localProfile.nip05 = event.target.value;
                            setLocalProfile({ ...localProfile });
                        }}
                    />
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary" onClick={saveProfile}>
                    Save
                </Button>
                <Button size="small" color="primary" onClick={updateProfile}>
                    Reset
                </Button>
            </CardActions>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                message="SUCESS"
                autoHideDuration={2000}
            />
        </Card>
    );

}

export default React.memo(GCardUser);