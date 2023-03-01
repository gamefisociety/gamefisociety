import { React, useEffect, useState, useRef } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import {
    getListChainData
} from 'api/requestData'

import './GGamePage.scss';

const GGamePage = () => {

    const navigate = useNavigate();

    const [chainList, setChainList] = useState([]);

    const requsetData = () => {

        getListChainData().then(res => {
            console.log(res.list, "res");
            setChainList(res.list);
        })

    }

    useEffect(() => {
        requsetData();
        // fetchAllNFTs();
        return () => {
        }
    }, [])

    const renderGames = () => {
        return (
            <Stack sx={{
                width: '100%',
                minHeigth: '200px',
                py: '24px',
            }} direction="column" alignItems={'center'} justifyContent={'flex-start'}>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                }}>
                    <Typography sx={{
                        ml: '24px',
                    }} color={'white'} variant={'h6'} align={'left'} >
                        {'Projects'}
                    </Typography>
                </Box>
                <Box className={'game_card_contain'}>
                    {chainList.map((item, index) => {
                        return (
                            <Card className={'game_card'} key={'gamepage-card-index' + index}>
                                <Avatar sx={{
                                    width: '64px',
                                    height: '64px',
                                }}
                                    alt="Remy Sharp"
                                    src={item.icon} />
                                <Typography sx={{
                                    mt: '12px'
                                }} color={'white'} variant={'body1'} >
                                    {item.name}
                                </Typography>
                                <Box sx={{ flexGrow: 1 }} ></Box>
                                <Button variant="contained" onClick={() => {
                                    console.log(item);
                                    navigate('/detail?name=' + item.name);
                                }}>{'DETAIL'}</Button>
                            </Card>
                        );
                    })}
                </Box>
            </Stack>
        )
    }

    return (
        <Paper>
            {renderGames()}
        </Paper>
    );

}

export default GGamePage;