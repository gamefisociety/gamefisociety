import ClientRelay from "nostr/ClientRelay";
import { unwrap } from "nostr/Util";

export class NostrSystem {

  constructor() {
    this.ClientRelays = new Map();
    this.Subscriptions = new Map();
    this.PendingSubscriptions = [];
    this.WantsMetadata = new Set();
    // this._FetchMetadata();
  }

  ConnectRelay(address, read, write) {
    try {
      if (!this.ClientRelays.has(address)) {
        const client = new ClientRelay(address, read, write);
        let sys = this;
        client.connect(this.processSubEvent).then(ret => {
          // console.log('GFTHome relays', ret, address);
          sys.ClientRelays.set(address, client);
        });
        //
      } else {
        unwrap(this.ClientRelays.get(address)).Settings = {
          read: read,
          write: write
        };
      }
    } catch (e) {
      console.error(e);
    }
  }

  DisconnectRelay(address) {
    const c = this.ClientRelays.get(address);
    if (c) {
      this.ClientRelays.delete(address);
      c.Close();
    }
  }

  initSubEvent = (client) => {
    for (const [, s] of this.Subscriptions) {
      client.sendSubscription(s);
    }
  }
  //process sub event
  processSubEvent = (subId, tagged) => {
    this.Subscriptions(subId)?.OnEvent(tagged);
  }

  AddSubscription(sub) {
    for (const [, tmpRelay] of this.ClientRelays) {
      if (tmpRelay.AddSub(sub.Id, sub)) {
        tmpRelay.sendSubscription(sub);
      }
    }
    this.Subscriptions.set(sub.Id, sub);
  }

  RemoveSubscription(subId) {
    for (const [, tmpRelay] of this.ClientRelays) {
      tmpRelay.RemoveSub(subId)
    }
    this.Subscriptions.delete(subId);
  }

  Broadcast(ev) {
    for (const [, tmpRelay] of this.ClientRelays) {
      tmpRelay.SendEvent(ev)
    }
  }

  // async WriteOnceToRelay(address, ev) {
  //   const c = new Relay(address, { write: true, read: false });
  //   await c.SendAsync(ev);
  //   c.Close();
  // }

  TrackMetadata(pks) {
    for (const p of Array.isArray(pks) ? pks : [pks]) {
      if (pks.length > 0) {
        this.WantsMetadata.add(p);
      }
    }
  }

  UntrackMetadata(pks) {
    for (const p of Array.isArray(pks) ? pks : [pks]) {
      if (p.length > 0) {
        this.WantsMetadata.delete(p);
      }
    }
  }
}

export const System = new NostrSystem();
