import { React, useEffect, useState, useRef } from 'react';
import './GFTChat.scss';

import { bech32 } from "bech32";
import * as secp from "@noble/secp256k1";
import { useLocation, Link, useSearchParams } from 'react-router-dom'
import {
    nip05,
    nip04,
    SimplePool,
    relayInit,
    generatePrivateKey,
    getPublicKey,
    getEventHash,
    signEvent,
    validateEvent,
    verifySignature,

} from 'nostr-tools'
import { setPrivateKey } from 'module/store/features/loginSlice';
import ic_gfs_coin from "../../asset/image/logo/ic_gfs_coin.png"

export const EmailRegex =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;



function GFTChat() {
    const relay = relayInit('wss://relay.damus.io')
    let location = useLocation();
    const [search, setsearch] = useSearchParams();
    const [chatAddress, setChatAddress] = useState(search.get('name'));
    const [inforData, setInforData] = useState(new Map());
    let pubKey = ""
    let privateKey = ""
    let onlyPost = false;
    useEffect(() => {
        return () => {
            initConnect();
        }
    }, [])

    const initConnect = async () => {
        await relay.connect()
        relay.on('connect', () => {
            console.log(`connected to ${relay.url}`)
        })
        relay.on('error', () => {
            console.log(`failed to connect to ${relay.url}`)
        })
        login();

    }

    const login = async () => {
        privateKey = await doLogin("nsec1e6vl3t2dpqh6hh5q8vxjuyqaxg0apjk6fmqazythdtd487d0p0wq94pkwp");
        pubKey = getPublicKey(privateKey);
        getDataList(pubKey);
    }

   const  getDecode=async (sk,pk,data)=>{
        let content = await nip04.decrypt(sk, pk, data);
    return content
   }
    const getDataList = async (key) => {
        let sub = relay.sub([
            {
                kinds: [4],
                '#p': [chatAddress,key]
            }
        ])
        let data = [];
        sub.on('event', event => {
            console.log('content', getDecode(privateKey,event.tags[0][1],event.content)); 
            console.log('getDataList', event)
        })
        sub.on('eose', () => {
            console.log('sub list eose event', data)
            getInfor(data);
            sub.unsub()
        })

        sub.off('event', () => {
            console.log('off event')
        })

        sub.off('eose', () => {
            console.log('off eose event')
        })
    }



    //login
    async function getNip05PubKey(addr) {
        const [username, domain] = addr.split("@");
        const rsp = await fetch(`https://${domain}/.well-known/nostr.json?name=${encodeURIComponent(username)}`);
        if (rsp.ok) {
            const data = await rsp.json();
            const pKey = data.names[username];
            if (pKey) {
                return pKey;
            }
        }
        throw new Error("User key not found");
    }

    async function doLogin(key) {
        try {
            if (key.startsWith("nsec")) {
                const hexKey = bech32ToHex(key);
                console.log(hexKey);
                return hexKey;
                // if (secp.utils.isValidPrivateKey(hexKey)) {
                //     console.log("ccccc");
                //     return hexKey;
                // } else {
                //   throw new Error("INVALID PRIVATE KEY");
                // }
            } else if (key.startsWith("npub")) {
                const hexKey = bech32ToHex(key);
                return hexKey;
            } else if (key.match(EmailRegex)) {
                const hexKey = await getNip05PubKey(key);
                if (secp.utils.isValidPrivateKey(hexKey)) {
                    return hexKey;
                } else {
                    throw new Error("INVALID PRIVATE KEY");
                }
            } else {
                if (secp.utils.isValidPrivateKey(key)) {
                    return key;
                } else {
                    throw new Error("INVALID PRIVATE KEY");
                }
            }
        } catch (e) {
            console.error(e);
        }
    }


    const getInfor = (pkey) => {
        let sub = relay.sub([
            {
                kinds: [0],
                authors: pkey
            }
        ])
        sub.on('event', event => {
            console.log('event', event);
            event.contentObj = JSON.parse(event.content);
            setInforData(new Map(inforData.set(event.pubkey, event)));
            // sub.unsub()
        })
        sub.on('eose', () => {
            console.log('eose event')
            sub.unsub()
        })

        sub.off('event', () => {
            console.log('off event')
        })

        sub.off('eose', () => {
            console.log('off eose event')
        })
    }
    function bech32ToHex(str) {
        const nKey = bech32.decode(str);
        const buff = bech32.fromWords(nKey.words);
        return secp.utils.bytesToHex(Uint8Array.from(buff));
    }

    function bech32ToText(str) {
        const decoded = bech32.decode(str, 1000);
        const buf = bech32.fromWords(decoded.words);
        return new TextDecoder().decode(Uint8Array.from(buf)).to;
    }


    return (
        <div className='chat_bg'>
            



        </div >
    );

}

export default GFTChat;