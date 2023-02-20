import { React, useEffect, useState } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
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
        <Grid sx={{ margin: '24px', flexGrow: 1 }} container spacing={2}>
            <Grid item xs={6}>
                <GCardUser profile={{ ...profile }} />
            </Grid>
            <Grid item xs={12}>
                <GCardRelays />
            </Grid>
            <Grid item xs={12}>
                <Card sx={{}}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image="/static/images/cards/contemplative-reptile.jpg"
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Lizard
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Lizards are a widespread group of squamate reptiles, with over 6,000
                                species, ranging across all continents except Antarctica
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary">
                            Share
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );

}

export default GProfile;