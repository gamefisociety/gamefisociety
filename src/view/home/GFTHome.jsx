import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom'
import './GFTHome.scss';
import { System } from 'nostr/NostrSystem';
import { init, setRelays } from "module/store/features/loginSlice";
import { SearchRelays } from "nostr/Const";

// import GFTHead from '../head/GFTHead'
import GFTHead01 from '../head/GFTHead01'
import GFTLeftMenu from '../head/GFTLeftMenu';

const GFTHome = () => {

    const dispatch = useDispatch();

    const { relays, publicKey, loggedOut } =
        useSelector((s) => s.login);

    useEffect(() => {
        if (relays) {
            //connect target relays
            for (const [addr, v] of Object.entries(relays)) {
                System.ConnectRelay(addr, v.read, v.write);
            }
            //diconnect noneed relays
            for (const [addr] of System.ClientRelays) {
                if (!relays[addr] && !SearchRelays.has(addr)) {
                    System.DisconnectRelay(addr);
                }
            }
        }
    }, [relays]);

    //init param form db or others
    useEffect(() => {
        console.debug('use db from reduce');
        dispatch(init('redux'));
    }, []);

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