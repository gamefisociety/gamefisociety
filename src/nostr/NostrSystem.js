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

  //broadcast
  Broadcast(ev, once, callback, relays) {
    console.log('no relay now', this.Clients, ev);
    if (!ev) {
      return;
    }
    if (relays && relays.length !== 0) {
      for (const [addr, tmpRelay] of this.Clients) {
        if (relays.includes(addr)) {
          Relay.SendToRelay(tmpRelay, ev, once, callback);
        }
      }
    } else {
      for (const [addr, tmpRelay] of this.Clients) {
        // relays.relays();
        Relay.SendToRelay(tmpRelay, ev, once, callback);
      }
    }
  }

  //broadcast event
  BroadcastEvent(ev, once, callback) {
    console.log('BroadcastEvent', ev);
    if (!ev) {
      return;
    }
    for (const [, tmpRelay] of this.Clients) {
      Relay.SendToRelay(tmpRelay, ev, once, callback);
    }
  }

  //broadcast sub
  BroadcastSub(ev, once, callback) {
    console.log('BroadcastSub', ev);
    if (!ev) {
      return;
    }
    for (const [, tmpRelay] of this.Clients) {
      Relay.SendToRelay(tmpRelay, ev, once, callback);
    }
  }

  //broadcast close
  BroadcastClose(subid, client, callback) {
    console.log('BroadcastClose', subid);
    if (!subid) {
      return;
    }
    Relay.SendClose(client, subid);
  }

}

export const System = new NostrSystem();
