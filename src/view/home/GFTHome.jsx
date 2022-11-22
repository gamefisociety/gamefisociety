import { React, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

import { Outlet } from 'react-router-dom'
import Router from '../../module/router/router'

import './GFTHome.scss';
import GFTHead from '../head/GFTHead'
import GFTLeftMenu from '../head/GFTLeftMenu';
import GFTHomeView  from './GFTHomeView';
import GFTNFTDetail from './GFTNFTDetail';



function GFTHome() {


    return (
        <div className='home_bg'>
            <GFTHead></GFTHead>
            <div className='bt_layout'>
                <GFTLeftMenu></GFTLeftMenu>
                <Outlet/>
                {/* <Route path="/ranking" component={GFTNFTDetail} /> */}
            </div>
        </div>
    );
}

export default GFTHome;