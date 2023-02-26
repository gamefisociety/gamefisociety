import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
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

    const { profile, pubkey } = props;

    console.log('GCardUser profile', profile);

    const MetaPro = useMetadataPro();

    const { publicKey, privateKey } = useSelector(s => s.login);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
        }
    }, [props])

    //#1F1F1F
    return (
        <Card sx={{ backgroundColor: '#1F1F1F', padding: '12px', minWidth: '960px' }}>
            <CardContent>
                <CardMedia
                    component="img"
                    sx={{ height: '140px' }}
                    src="localProfile.banner"
                    image={profile ? profile.banner : ''}
                    alt="no banner"
                />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    // backgroundColor: 'red',
                    px: '12px'
                }}>
                    <Avatar
                        sx={{ width: '64px', height: '64px', mt: '-23px' }}
                        edge="end"
                        alt="GameFi Society"
                        src={profile ? profile.picture : ''}
                    />
                    <Box sx={{
                        ml: '12px',
                        pt: '4px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Typography sx={{}} variant="body1" color='white' align={'left'}>
                            {profile.display_name}
                        </Typography>
                        <Typography sx={{}} variant="body2" color='gray' align={'left'}>
                            {'@' + profile.name}
                        </Typography>
                    </Box>
                </Box>
                <Typography sx={{ mt: '4px', width: '75%' }} variant="subtitle2" color='white' align={'left'} multiline>
                    {pubkey}
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    // backgroundColor: 'red',
                    px: '12px',
                    py: '16px'
                }}>
                    <Typography
                        sx={{ px: '16px', backgroundColor: 'gray', borderRadius: '4px' }}
                        variant="subtitle2"
                        color='white'
                        align={'center'}>
                        {'Follow'}
                    </Typography>
                    <Typography
                        sx={{ px: '16px', ml: '12px', backgroundColor: 'gray', borderRadius: '4px' }}
                        variant="subtitle2"
                        color='white'
                        align={'center'}>
                        {'Chat'}
                    </Typography>
                    <Typography
                        sx={{ px: '16px', ml: '12px', backgroundColor: 'gray', borderRadius: '4px' }}
                        variant="subtitle2"
                        color='white'
                        align={'center'}>
                        {'Pay'}
                    </Typography>
                </Box>
                <Typography sx={{ mt: '4px' }} variant="subtitle2" color='gray' align={'left'}>
                    {profile.about}
                </Typography>
                {/* <TextField
                        value={profile.about}
                        margin="dense"
                        id="name"
                        fullWidth
                        variant="standard"
                    /> */}
                {/* <Typography sx={{ mt: '16px' }} variant="subtitle2" color='gray' align={'left'}>
                        {'NIP-05'}
                    </Typography>
                    <TextField
                        value={profile.nip05}
                        margin="dense"
                        id="name"
                        fullWidth
                        variant="standard"
                    /> */}
            </CardContent>
        </Card>
    );

}

export default React.memo(GCardUser);