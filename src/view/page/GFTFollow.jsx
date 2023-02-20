import { React, useEffect, useState, useRef } from 'react';
import './GFTFollow.scss';
import { useNavigate } from 'react-router-dom'
import { bech32 } from "bech32";
import * as secp from "@noble/secp256k1";

import {
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
import { setPrivateKey } from 'module/store/features/loginSlice';
import ic_gfs_coin from "../../asset/image/logo/ic_gfs_coin.png"

export const EmailRegex =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;



function GFTFollow() {
    const navigate = useNavigate();
    const relay = relayInit('wss://relay.damus.io')
    const [isFollowTab, setFollowTab] = useState(true);
    const [dataFollowers, setDataFollowers] = useState([]);
    const [dataFollowing, setDataFollowing] = useState(new Map());
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
        privateKey = await doLogin("nsec16pvqz6fr89u8u6grvvwtwhs2sfseswhecwfkuu0glykmevx6du9sthk3je");
        pubKey = getPublicKey(privateKey);
        getDataList(pubKey);
        getDataFollowersList(pubKey);
    }

    const getDataList = (key) => {
        let sub = relay.sub([
            {
                kinds: [3],
                authors: [key]
            }
        ])
        let data = [];
        sub.on('event', event => {
            console.log('getDataList', event)

            for (let i = 0; i < event.tags.length; i++) {
                data.push(event.tags[i][1]);
                dataFollowing.set(event.tags[i][1], true);
            }
            setDataFollowing(new Map(dataFollowing));
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

    const getDataFollowersList = (key) => {
        let sub = relay.sub([
            {
                kinds: [3],
                '#p': [key]
            }
        ])
        let data = [];
        sub.on('event', event => {
            console.log('getDataFollowersList', event)
            data.push(event.pubkey)
            dataFollowers.push(event.pubkey);
            setDataFollowers([...dataFollowers]);
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
        <div className='follow_bg'>
            <div className='tab_layout'>
                <div className='tab' tabIndex="1" onClick={() => {
                    setFollowTab(true);
                }}>
                    Following
                </div>
                <div className='tab' tabIndex="2" onClick={() => {
                    setFollowTab(false);
                }}>
                    Followers
                </div>
            </div>
            {isFollowTab ?
                <div>
                    {[...dataFollowing.keys()].map(k => (
                        <div key={"follow" + k} className='item_list'>
                            <div className='info'>
                                <img className='ic' src={inforData.get(k)?.contentObj.picture != null ? inforData.get(k)?.contentObj.picture : ic_gfs_coin}></img>
                                <div className='name'>{inforData.get(k)?.contentObj.display_name}</div>
                            </div>
                            <span className='chat' onClick={() => {
                                navigate('/chat?name=' + k);
                            }}> chat</span>
                        </div>

                    ))}
                </div> :
                <div>
                    {Array.from(dataFollowers).map((item, index) => (
                        <div key={"followers" + index} className='item_list'>
                            <div className='info'>
                                <img className='ic' src={inforData.get(item)?.contentObj.picture != null ? inforData.get(item)?.contentObj.picture : ic_gfs_coin}></img>
                                <div className='name'>{inforData.get(item)?.contentObj.display_name}</div>
                            </div>
                            <span className='chat' onClick={() => {
                                navigate('/chat?name=' + item);
                            }}> chat</span>
                        </div>
                    ))}
                </div>
            }

        </div >
    );

}

export default GFTFollow;