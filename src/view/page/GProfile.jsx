import { React, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';

import GCardUser from 'components/GCardUser';
import './GProfile.scss';

function GProfile() {
    console.log('GProfile enter');
    const profile = useSelector(s => s.profile);
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
            <GCardUser profile={{ ...profile }} />
            <Box sx={{ height: '12px' }}></Box>
        </Box>
    );
}

export default GProfile;