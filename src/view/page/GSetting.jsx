import { React, useEffect, useState } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';

import GCardUserSetting from 'components/GCardUserSetting';
import './GSetting.scss';

function GSetting() {
    console.log('GSetting enter');
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
            <GCardUserSetting profile={{ ...profile }} />
            <Box sx={{ height: '12px' }}></Box>
        </Box>
    );

}

export default GSetting;