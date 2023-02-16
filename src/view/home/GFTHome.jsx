import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom'
import './GFTHome.scss';
import { System } from 'nostr/NostrSystem';
import { SearchRelays, SnortPubKey } from "nostr/Const";

// import GFTHead from '../head/GFTHead'
import GFTHead01 from '../head/GFTHead01'
import GFTLeftMenu from '../head/GFTLeftMenu';

const GFTHome = () => {

    const { relays, publicKey, loggedOut } =
        useSelector((s) => s.login);

    useEffect(() => {
        console.log('GFTHome relays', relays);
        if (relays) {
            for (const [k, v] of Object.entries(relays)) {
                System.ConnectRelay(k, v.read, v.write);
            }
            // for (const [k] of System.Sockets) {
            //     if (!relays[k] && !SearchRelays.has(k)) {
            //         System.DisconnectRelay(k);
            //     }
            // }
        }
    }, [relays]);

    return (
        <div className='home_bg'>
            <GFTHead01 />
            <div className='bt_layout'>
                <GFTLeftMenu></GFTLeftMenu>
                <Outlet />
                {/* <Route path="/ranking" component={GFTNFTDetail} /> */}
            </div>
        </div>
    );
}

export default GFTHome;