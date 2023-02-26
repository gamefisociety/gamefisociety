import { React, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom'
import Box from '@mui/material/Box';

import GCardUser from 'components/GCardUser';
import './GProfile.scss';

const GProfile = () => {
    const location = useLocation();
    console.log('GProfile enter', location);
    const { info, pubkey } = location.state;
    //
    useEffect(() => {
        return () => {
            //
        }
    }, [])

    return (
        <Box sx={{
            width: '100%',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            my: '24px'
        }}>
            <GCardUser profile={{ ...info }} pubkey={pubkey} />
            <Box sx={{ height: '12px' }}></Box>
        </Box>
    );
}

export default GProfile;