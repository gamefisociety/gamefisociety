import NostrClient from "nostr/NostrClient";
import { unwrap } from "nostr/Util";
import NostrFactory from "nostr/NostrFactory";

export class NostrSystem {

  constructor() {
    this.Clients = new Map();
    // this.Subscriptions = new Map();
    // this.PendingSubscriptions = [];
  }

  ConnectRelay(address, read, write) {
    try {
      if (!this.Clients.has(address)) {
        const client = NostrFactory.createClient(address, read, write);
        NostrClient.connect(client).then(ret => {
          console.log('nostr client connect', this);
          this.Clients.set(address, client);
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
    const c = this.Clients.get(address);
    if (c) {
      this.Clients.delete(address);
      c.Close();
    }
  }

  Broadcast(ev) {
    console.log('system Broadcast', ev);
    for (const [, tmpRelay] of this.Clients) {
      tmpRelay.SendEvent(ev)
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
