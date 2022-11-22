import { React, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

import { useLocation, Link } from 'react-router-dom'

import './GFTNFTDetail.scss';



function GFTNFTDetail() {

    let location = useLocation();

    useEffect(() => {
        requsetData();
        return () => {

        }

    }, [])

    const requsetData = () => {
        console.log(location);

    }

    return (
        <div className='nft_detail_bg'>
            <div className='tab_layout'>
                <Link className="txt" to="/">Home</Link>
                <span className='txt'> {'>'}</span>
                <span className='txt'> Rankings</span>
                <span className='txt'> {'>'}</span>
                <span className='txt'> Alien Worlds </span>
            </div>
        </div>
    );

}

export default GFTNFTDetail;