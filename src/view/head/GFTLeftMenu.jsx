import { React, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

import './GFTLeftMenu.scss';

import ic_bnb from "../../asset/image/home/ic_bnb.png"
import ic_eth from "../../asset/image/home/ic_eth.png"
import ic_swap from "../../asset/image/home/ic_swap.png"



function GFTLeftMenu() {


    useEffect(() => {
        requsetData();
        return () => {

        }

    }, [])

    const requsetData = () => {

    }

    return (

        <div className='left_menu_bg'>
            <img className='img' src={ic_swap}></img>
            <img className='img' src={ic_bnb}></img>
            <img className='img' src={ic_eth}></img>
        </div>

    );
}

export default GFTLeftMenu;