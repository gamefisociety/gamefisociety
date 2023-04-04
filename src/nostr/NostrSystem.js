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
    DefaultRelays.map((cfg) => {
      this.ConnectRelay(cfg.addr, cfg.read, cfg.write);
    });
  }

  getRelay(addr) {
    const relay = this.Clients.get(addr);
    if (relay) {
      //
    }
    return null;
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
    if (!ev) {
      return;
    }
    for (const [, tmpRelay] of this.Clients) {
      if (tmpRelay.canWrite) {
        Relay.SendEvent(tmpRelay, ev, callback);
      }
    }
  }

  //broadcast sub
  BroadcastSub(sub, callback, relay) {
    if (!sub) {
      return;
    }
    for (let [addr, tmpRelay] of this.Clients.entries()) {
      // console.log('BroadcastSub relay', addr);
      if (relay) {
        // console.log('BroadcastSub relay', relay, addr, tmpRelay);
        if (relay === addr && relay.canSub) {
          Relay.SendSub(tmpRelay, sub, callback);
        }
      } else {
        if (tmpRelay.canSub) {
          Relay.SendSub(tmpRelay, sub, callback);
        }
      }
    }
  }

  //broadcast close
  BroadcastClose(subid, client, callback) {
    if (!subid[1]) {
      return;
    }
    if (client === null && !client) {
      for (const [, tmpRelay] of this.Clients) {
        Relay.SendClose(tmpRelay, subid[1], callback);
      }
    } else {
      Relay.SendClose(client, subid[1], callback);
    }
  }
}

export const System = new NostrSystem();
