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

    // "tags": [
    //     ["e", <kind_40_event_id>, <relay-url>, "root"],
    //     ["e", <kind_42_event_id>, <relay-url>, "reply"],
    //     ["p", <pubkey>, <relay-url>],
    //     ...
    // ],
    // const modifyChannel =()=>{
    //     let sk = "ce99f8ad4d082fabde803b0d2e101d321fd0cada4ec1d111776adb53f9af0bdc";
    //     let pk = getPublicKey(sk)
    //     let event = {
    //         kind: 41,
    //         pubkey: pk,
    //         created_at: Math.floor(Date.now() / 1000),
    //         tags: [["e", <channel_create_event_id>, <relay-url>]],
    //         content: '{\"name\": \"Demo Channel\", \"about\": \"A test channel.\", picture: https://placekitten.com/200/200}'
    //     }
    //     event.id = getEventHash(event)
    //     event.sig = signEvent(event, sk)
    //     let pub = relay.publish(event)
    //     pub.on('ok', () => {
    //         console.log(`${relay.url} has accepted our event`)
    //     })
    //     pub.on('failed', reason => {
    //         console.log(`failed to publish to ${relay.url}: ${reason}`)
    //     })

    // }

     // const sendChannel =()=>{
    //     let sk = "ce99f8ad4d082fabde803b0d2e101d321fd0cada4ec1d111776adb53f9af0bdc";
    //     let pk = getPublicKey(sk)
    //     let event = {
    //         kind: 42,
    //         pubkey: pk,
    //         created_at: Math.floor(Date.now() / 1000),
    //        "tags": [["e", <kind_40_event_id>, <relay-url>, "root"]],
    //         content: 'abcd'
    //     }
    //     event.id = getEventHash(event)
    //     event.sig = signEvent(event, sk)
    //     let pub = relay.publish(event)
    //     pub.on('ok', () => {
    //         console.log(`${relay.url} has accepted our event`)
    //     })
    //     pub.on('failed', reason => {
    //         console.log(`failed to publish to ${relay.url}: ${reason}`)
    //     })

    // }

       // const hideChannel =()=>{
    //     let sk = "ce99f8ad4d082fabde803b0d2e101d321fd0cada4ec1d111776adb53f9af0bdc";
    //     let pk = getPublicKey(sk)
    //     let event = {
    //         kind: 43,
    //         pubkey: pk,
    //         created_at: Math.floor(Date.now() / 1000),
    //        "content": "{\"reason\": \"Dick pic\"}",
    //        "tags": [["e", <kind_42_event_id>]],
    //     }
    //     event.id = getEventHash(event)
    //     event.sig = signEvent(event, sk)
    //     let pub = relay.publish(event)
    //     pub.on('ok', () => {
    //         console.log(`${relay.url} has accepted our event`)
    //     })
    //     pub.on('failed', reason => {
    //         console.log(`failed to publish to ${relay.url}: ${reason}`)
    //     })

    // }

         // const MutePersonChannel =()=>{
    //     let sk = "ce99f8ad4d082fabde803b0d2e101d321fd0cada4ec1d111776adb53f9af0bdc";
    //     let pk = getPublicKey(sk)
    //     let event = {
    //         kind: 43,
    //         pubkey: pk,
    //         created_at: Math.floor(Date.now() / 1000),
    //         "content": "{\"reason\": \"Posting dick pics\"}",
    //         "tags": [["p", <pubkey>]],
    //     }
    //     event.id = getEventHash(event)
    //     event.sig = signEvent(event, sk)
    //     let pub = relay.publish(event)
    //     pub.on('ok', () => {
    //         console.log(`${relay.url} has accepted our event`)
    //     })
    //     pub.on('failed', reason => {
    //         console.log(`failed to publish to ${relay.url}: ${reason}`)
    //     })

    // }



    return (
        <div className='nft_detail_bg'>
            aaaaaaawa
        </div >
    );

}

export default GGroupChat;