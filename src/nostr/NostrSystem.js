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
        const c = new ClientRelay(address, read, write);
        this.ClientRelays.set(address, c);
        for (const [, s] of this.Subscriptions) {
          c.AddSubscription(s);
        }
      } else {
        // unwrap(this.ClientRelays.get(address)).Settings = options;
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

  AddSubscription(sub) {
    for (const [, tmpRelay] of this.ClientRelays) {
      tmpRelay.AddSubscription(sub)
    }
    //
    this.Subscriptions.set(sub.Id, sub);
  }

  RemoveSubscription(subId) {
    for (const [, tmpRelay] of this.ClientRelays) {
      tmpRelay.RemoveSubscription(subId)
    }
    //
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
