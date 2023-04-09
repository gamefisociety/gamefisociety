import NostrRelay from "nostr/NostrRelay";
import NostrFactory from "nostr/NostrFactory";
import { unwrap } from "nostr/Util";
import { DefaultRelays } from 'nostr/Const';

let key_read_relay = 'key_read_relay';
let key_write_relay = 'key_write_relay';

let Relay = NostrRelay();

export class NostrSystem {

  constructor() {
    this.Clients = new Map();
    // this.readQuene = [];
    // this.writeQuene = [];
    let default_relay_read_str = window.localStorage.getItem(key_read_relay);
    if (default_relay_read_str) {
      this.readQuene = JSON.parse(default_relay_read_str);
    } else {
      this.readQuene = [];
    }
    let default_relay_write_str = window.localStorage.getItem(key_write_relay);
    if (default_relay_write_str) {
      this.writeQuene = JSON.parse(default_relay_write_str);
    } else {
      this.writeQuene = [];
    }
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

  isRead(addr) {
    return this.readQuene.includes(addr);
  }

  isWrite(addr) {
    return this.writeQuene.includes(addr);
  }

  addRead(addr) {
    if (this.isRead(addr)) {
      return;
    }
    this.readQuene.push(addr);
    window.localStorage.setItem(key_read_relay, JSON.stringify(this.readQuene));
  }

  rmRead(addr) {
    let ret = this.readQuene.indexOf(addr);
    if (ret >= 0) {
      this.readQuene.splice(ret, 1);
    }
    window.localStorage.setItem(key_read_relay, JSON.stringify(this.readQuene));
  }

  addWrite(addr) {
    if (this.isWrite(addr)) {
      return;
    }
    this.writeQuene.push(addr);
    window.localStorage.setItem(key_write_relay, JSON.stringify(this.writeQuene));
  }

  rmWrite(addr) {
    let ret = this.writeQuene.indexOf(addr);
    if (ret >= 0) {
      this.writeQuene.splice(ret, 1);
    }
    window.localStorage.setItem(key_write_relay, JSON.stringify(this.writeQuene));
  }

  ConnectRelay(address, read, write) {
    try {
      if (!this.Clients.has(address)) {
        const client = NostrFactory.createRelay(address, read, write);
        this.Clients.set(address, client);
        Relay.Connect(client).then(ret => {
          console.log('ConnectRelay', address);
          if (this.readQuene.length < 3) {
            this.readQuene.push(address);
          }
          this.writeQuene.push(address);
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
