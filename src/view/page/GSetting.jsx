import { React, useEffect, useState } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';

import GCardRelays from 'components/GCardRelays';
import './GSetting.scss';

function GSetting() {
    console.log('GRelays enter');
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
            <GCardRelays />
        </Box>
    );

}

export default GSetting;