import { React, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

import { Outlet } from 'react-router-dom'

import './GFTHome.scss';
// import GFTHead from '../head/GFTHead'
import GFTHead01 from '../head/GFTHead01'
import GFTLeftMenu from '../head/GFTLeftMenu';

function GFTHome() {
    return (
        <div className='home_bg'>
            <GFTHead01></GFTHead01>
            <div className='bt_layout'>
                <GFTLeftMenu></GFTLeftMenu>
                <Outlet/>
                {/* <Route path="/ranking" component={GFTNFTDetail} /> */}
            </div>
        </div>
    );
}

export default GFTHome;