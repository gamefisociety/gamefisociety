import NostrRelay from "nostr/NostrRelay";
import NostrFactory from "nostr/NostrFactory";
import { unwrap } from "nostr/Util";
import { DefaultRelays } from 'nostr/Const';

let Relay = NostrRelay();

export class NostrSystem {

  constructor() {
    this.Clients = new Map();
    this.readQuene = [];
    this.writeQuene = [];
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
          console.log('ConnectRelay', address);
          this.readQuene.push(address);
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
  BroadcastSub(sub, callback, relayaddr) {
    if (!sub) {
      return;
    }
    if (relayaddr) {
      let tmp_relay = this.Clients.get(relayaddr);
      if (tmp_relay) {
        Relay.SendSub(tmp_relay, sub, callback);
      } else {
        // reture error
      }
    } else {
      this.readQuene.map((tmpaddr) => {
        let tmp_relay = this.Clients.get(tmpaddr);
        if (tmp_relay) {
          Relay.SendSub(tmp_relay, sub, callback);
        } else {
          // reture error
        }
      });
    }
  }

  //broadcast close
  BroadcastClose(subid, relayaddr, callback) {
    if (!subid[1]) {
      return;
    }
    if (relayaddr) {
      Relay.SendClose(relayaddr, subid[1], callback);
    } else {
      for (const [, tmpRelay] of this.Clients) {
        Relay.SendClose(tmpRelay, subid[1], callback);
      }
    }
  }
}

export const System = new NostrSystem();
