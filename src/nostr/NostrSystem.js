import NostrRelay from "nostr/NostrRelay";
import NostrFactory from "nostr/NostrFactory";
import { unwrap } from "nostr/Util";
import { DefaultRelays } from 'nostr/Const';

let Relay = NostrRelay();

export class NostrSystem {

  constructor() {
    this.Clients = new Map();
  }

  initRelays() {
    for (const [addr, cfg] of DefaultRelays) {
      this.ConnectRelay(addr, cfg.read, cfg.write);
    }
  }

  relayState(addr) {
    const relay = this.Clients.get(addr);
    if (relay) {
      //
    }
    return -1;
  }

  ConnectRelay(address, read, write) {
    try {
      if (!this.Clients.has(address)) {
        const client = NostrFactory.createRelay(address, read, write);
        this.Clients.set(address, client);
        Relay.Connect(client).then(ret => {
          //check cache msg and send
        });

      } else {
        unwrap(this.Clients.get(address)).Settings = {
          read: read,
          write: write
        };
      }
    } catch (e) {
      console.error(e);
    }
  }

  DisconnectRelay(address) {
    const client = this.Clients.get(address);
    if (client) {
      this.Clients.delete(address);
      Relay.Close(client);
    }
  }

  //broadcast event
  BroadcastEvent(ev, callback) {
    console.log('BroadcastEvent', ev);
    if (!ev) {
      return;
    }
    for (const [, tmpRelay] of this.Clients) {
      Relay.SendEvent(tmpRelay, ev, callback);
    }
  }

  //broadcast sub
  BroadcastSub(sub, callback, relay) {
    if (!sub) {
      return;
    }
    // console.log('clients', this.Clients);
    for (const [addr, tmpRelay] of this.Clients) {
      if (relay) {
        if (relay === addr) {
          Relay.SendSub(tmpRelay, sub, callback);
        }
      } else {
        Relay.SendSub(tmpRelay, sub, callback);
      }
    }
  }

  //broadcast close
  BroadcastClose(subid, client, callback) {
    if (!subid[1]) {
      return;
    }
    Relay.SendClose(client, subid[1], callback);
  }
}

export const System = new NostrSystem();
