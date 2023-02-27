import { React, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { HashRouter, Route, Link, useNavigate } from 'react-router-dom'
import GCardMintNFT from 'components/GCardMintNFT';

import './GFTMintNFT.scss';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const GFTMintNFT = () => {

    const [nftList, setNFTList] = useState(["0xA63bF060fA5f6d4502402bf17b6A0825a2a47D17"]);
    const navigate = useNavigate();
    useEffect(() => {
        return () => {

        }

    }, [])

    const renderNFTs = () => {
        return (
            <Box>
                <Typography sx={{
                    width: '100%',
                    margin: '12px',
                }} color={'white'} variant={'h6'} align={'left'} >
                    {'NFT List'}
                </Typography>
                <Grid container spacing={2}>
                    {nftList.map((item, index) => (
                        <Grid item key={'game-index-' + index} sx={{
                            // backgroundColor: 'blue'
                        }}>
                            <GCardMintNFT contract={item} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        )
    }

    return (
        <Paper sx={{
            width: '100%',
            minHeight: '400px',
            // backgroundColor: 'red'
        }}>
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    {renderNFTs()}
                </Grid>
            </Grid>
        </Paper>)

    // <div className='content_bg'>
    //     <div className='item_tab'>
    //         <div className='card_layout right_18'>
    //             <img className='img' src={ic_card}></img>
    //             <span className='txt'>Card Area</span>
    //         </div>
    //         <div className='mobile_layout right_18'>
    //             <img className='img' src={ic_mobile}></img>
    //             <span className='txt1'>
    //                 Mobile
    //             </span>
    //             <span className='txt'>
    //                 Phone Area
    //             </span>
    //         </div>
    //         <div className='nft_layout right_18'>
    //             <img className='img' src={ic_nft}></img>
    //             <span className='txt'>NFT Trading Area</span>
    //         </div>
    //         <div className='battle_layout'>
    //             <img className='img' src={ic_battle}></img>
    //             <span className='txt'>Battle Area</span>
    //         </div>
    //     </div>
    //     <div className='video_layout'>
    //     </div>
    //     <div className="rank_layout_head">
    //         <span className='number'>#</span>
    //         <span className='name'>Name</span>
    //         <div className='layout_item'>
    //             <span className='balance'>Balance</span>
    //             <img className='sort_img' src={ic_default_sort}></img>
    //         </div>
    //         <div className='layout_item'>
    //             <span className='uaw'>UAW</span>
    //             <img className='sort_img' src={ic_default_sort}></img>
    //         </div>
    //         <div className='layout_item'>
    //             <span className='volume'>Volume</span>
    //             <img className='sort_img' src={ic_default_sort}></img>
    //         </div>
    //         <span className='social_signa'>social_signa</span>
    //     </div>
    // </div>);

}

export default GFTMintNFT;