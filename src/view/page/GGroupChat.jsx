import { React, useEffect, useState, useRef } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom'
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import './GTest.scss';
import {
    nip26,
    nip05,
    SimplePool,
    relayInit,
    generatePrivateKey,
    getPublicKey,
    getEventHash,
    signEvent,
    validateEvent,
    verifySignature,

} from 'nostr-tools'

const relay = relayInit('wss://nos.lol');

function GGroupChat() {

    useEffect(() => {
        initRelay()
        return () => {

        }
    }, [])
    
    const  initRelay = async()=> {
        await relay.connect()
        relay.on('connect', () => {
            console.log(`connected to ${relay.url}`)
        })
        relay.on('error', () => {
            console.log(`failed to connect to ${relay.url}`)
        })
        createChannel();
    }

    const createChannel =()=>{
        let sk = "ce99f8ad4d082fabde803b0d2e101d321fd0cada4ec1d111776adb53f9af0bdc";
        let pk = getPublicKey(sk)
        let event = {
            kind: 40,
            pubkey: pk,
            created_at: Math.floor(Date.now() / 1000),
            tags:[],
            content: '{\"name\": \"Demo Channel\", \"about\": \"A test channel.\", picture: https://placekitten.com/200/200}'
        }
        event.id = getEventHash(event)
        event.sig = signEvent(event, sk)
        let pub = relay.publish(event)
        pub.on('ok', () => {
            console.log(`${relay.url} has accepted our event`)
        })
        pub.on('failed', reason => {
            console.log(`failed to publish to ${relay.url}: ${reason}`)
        })

    }

    return (
        <div className='nft_detail_bg'>
            aaaaaaawa
        </div >
    );

}

export default GGroupChat;