import 'websocket-polyfill'
import {
    nip05,
    relayInit,
    generatePrivateKey,
    getPublicKey,
    getEventHash,
    signEvent
} from 'nostr-tools'

function GFTNostrUtils() {

    const getData = async () => {
        const relay = relayInit('wss://brb.io')
        await relay.connect()

        relay.on('connect', () => {
            console.log(`connected to ${relay.url}`)
        })
        relay.on('error', () => {
            console.log(`failed to connect to ${relay.url}`)
        })
        let sk = "8321a1e3a0eb60dace54c844047adf989b140447fc1673140603612594bc9272"
        let pk = "01da64b8141980bb9ddf5eac006189d0a1b315f31977c2be7355d4ba5e23d8d0"
        console.log(sk, pk, 'key');
        let sub = relay.sub([
            {
                kinds: [1],
                authors: [pk]
            }
        ])
        sub.on('event', event => {
            console.log('got event:', event)
        })

        let event = {
            kind: 1,
            pubkey: pk,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: 'hello world1234567'
        }
        event.id = getEventHash(event)
        event.sig = signEvent(event, sk)
        let pub = relay.publish(event)
        pub.on('ok', () => {
            console.log(`${relay.url} has accepted our event`)
        })
        pub.on('seen', () => {
            console.log(`we saw the event on ${relay.url}`)
        })
        pub.on('failed', reason => {
            console.log(`failed to publish to ${relay.url}: ${reason}`)
        })
        // await relay.close()
    }

    const getData2 = async () => {

        const relay = relayInit('wss://brb.io')
        await relay.connect()

        relay.on('connect', () => {
            console.log(`connected to ${relay.url}`)
        })
        relay.on('error', () => {
            console.log(`failed to connect to ${relay.url}`)
        })

        // let's query for an event that exists
        let sk = "8321a1e3a0eb60dace54c844047adf989b140447fc1673140603612594bc9272"
        let pk = "01da64b8141980bb9ddf5eac006189d0a1b315f31977c2be7355d4ba5e23d8d0"
        let sub = relay.sub([
            {
                kind: [1]
            }
        ])
        
        sub.on('event', event => {
            console.log('we got the event we wanted:', event)
        })
        sub.on('eose', () => {
            sub.unsub()
        })
    }

    const getData3 = async () => {
        let profile = await nip05.queryProfile('jb55.com')
        console.log(profile.pubkey)
        // prints: 32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245
        console.log(profile.relays)
    }

}

export default GFTNostrUtils;