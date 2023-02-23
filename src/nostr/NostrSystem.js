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
    //init default relays
    for (const [addr, cfg] of DefaultRelays) {
      this.ConnectRelay(addr, cfg.read, cfg.write);
    }
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

  Broadcast(ev, once, callback) {
    console.log('no relay now', this.Clients, ev);
    if (!ev) {
      return;
    }
    for (const [, tmpRelay] of this.Clients) {
      Relay.SendToRelay(tmpRelay, ev, once, callback);
    }
  }

  BroadcastSub(ev, once, callback) {
    console.log('BroadcastSub', ev);
    if (!ev) {
      return;
    }
    for (const [, tmpRelay] of this.Clients) {
      Relay.SendToRelay(tmpRelay, ev, once, callback);
    }
  }

  BroadcastEvent(ev, once, callback) {
    console.log('BroadcastEvent', ev);
    if (!ev) {
      return;
    }
    for (const [, tmpRelay] of this.Clients) {
      Relay.SendToRelay(tmpRelay, ev, once, callback);
    }
  }

  // initSubEvent = (client) => {
  //   for (const [, s] of this.Subscriptions) {
  //     client.sendSubscription(s);
  //   }
  // }
  // //process sub event
  // processSubEvent = (subId, tagged) => {
  //   this.Subscriptions.get(subId)?.OnEvent(tagged);
  // }

  // AddSubscription(sub) {
  //   for (const [, tmpRelay] of this.ClientRelays) {
  //     tmpRelay.AddSub(sub.Id, sub)
  //   }
  //   this.Subscriptions.set(sub.Id, sub);
  // }

  // RemoveSubscription(sub) {
  //   for (const [, tmpRelay] of this.ClientRelays) {
  //     tmpRelay.RemoveSub(sub.Id, sub)
  //   }
  //   this.Subscriptions.delete(sub.Id);
  // }

  // async WriteOnceToRelay(address, ev) {
  //   const c = new Relay(address, { write: true, read: false });
  //   await c.SendAsync(ev);
  //   c.Close();
  // }

  // TrackMetadata(pks) {
  //   for (const p of Array.isArray(pks) ? pks : [pks]) {
  //     if (pks.length > 0) {
  //       this.WantsMetadata.add(p);
  //     }
  //   }
  // }

  // UntrackMetadata(pks) {
  //   for (const p of Array.isArray(pks) ? pks : [pks]) {
  //     if (p.length > 0) {
  //       this.WantsMetadata.delete(p);
  //     }
  //   }
  // }
}

export const System = new NostrSystem();
