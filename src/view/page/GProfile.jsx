import { React, useEffect, useState } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Button, CardActionArea, CardActions } from '@mui/material';
import GCardRelays from 'components/GCardRelays';
import GCardUser from 'components/GCardUser';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
            <GCardRelays />
        </Box>
    );

}

export default GProfile;