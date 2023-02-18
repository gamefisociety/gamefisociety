import * as secp from "@noble/secp256k1";
import { v4 as uuid } from "uuid";
import { DefaultConnectTimeout } from "nostr/Const";
import { ClientState, Nips } from "nostr/def";
import { System } from "nostr/NostrSystem";
import { unwrap } from "nostr/Util";

const NostrClient = () => {

  return {
    connect: async (client, subInit, subCallback) => {
      let flag = false;
      try {
        if (this.RelayInfo === undefined) {
          const u = new URL(this.Address);
          const rsp = await fetch(`https://${u.host}`, {
            headers: {
              accept: "application/nostr+json",
            },
          });
          if (rsp.ok) {
            const data = await rsp.json();
            for (const [k, v] of Object.entries(data)) {
              if (v === "unset" || v === "") {
                data[k] = undefined;
              }
            }
            this.RelayInfo = data;
            this.SubInit = subInit;
            this.SubCallback = subCallback;
            flag = true;
          } else {
            flag = false;
          }
          // console.log('relay info', this.RelayInfo);
        }
      } catch (e) {
        console.warn("Could not load relay information", e);
      } finally {
        if (flag === true) {
          if (this.IsClosed) {
            this._UpdateState();
          } else {
            this.IsClosed = false;
            this.Socket = new WebSocket(this.Address);
            // on open
            this.Socket.onopen = () => {
              this.ConnectTimeout = DefaultConnectTimeout;
              this._InitSubscriptions();
              console.log(`[${this.Address}] Open!`);
            };
            // on error
            this.Socket.onerror = e => {
              console.error(e);
              this._UpdateState();
            };
            //on close
            this.Socket.onclose = e => {
              if (!this.IsClosed) {
                this.ConnectTimeout = this.ConnectTimeout * 2;
                console.log(
                  `[${this.Address}] Closed (${e.reason}), trying again in ${(this.ConnectTimeout / 1000)
                    .toFixed(0)
                    .toLocaleString()} sec`
                );
                this.ReconnectTimer = setTimeout(() => {
                  this.connect(this.SubInit, this.SubCallback);
                }, this.ConnectTimeout);
                this.Stats.Disconnects++;
              } else {
                console.log(`[${this.Address}] Closed!`);
                this.ReconnectTimer = null;
              }
              this._UpdateState();
            };
            //
            this.Socket.onmessage = e => this.OnMessage(e);
          }
        }
        return new Promise((resolve, reject) => {
          resolve(flag);
        });
      }
    },

    // Close() {
    //   this.IsClosed = true;
    //   if (this.ReconnectTimer !== null) {
    //     clearTimeout(this.ReconnectTimer);
    //     this.ReconnectTimer = null;
    //   }
    //   this.Socket?.close();
    //   this._UpdateState();
    // }

    // OnMessage(target) {
    //   if (target.data.length > 0) {
    //     const msg = JSON.parse(target.data);
    //     console.log('OnMessage', msg);
    //     const tag = msg[0];
    //     if (tag === 'AUTH') {
    //       this._OnAuthAsync(msg[1]);
    //       this.Stats.EventsReceived++;
    //       this._UpdateState();
    //     } else if (tag === 'EVENT') {
    //       this._OnEvent(msg[1], msg[2]);
    //       this.Stats.EventsReceived++;
    //       this._UpdateState();
    //     } else if (tag === 'EOSE') {
    //       this._OnEnd(msg[1]);
    //     } else if (tag === 'OK') {
    //       console.debug(`${this.Address} OK: `, msg);
    //       const id = msg[1];
    //       if (this.EventsCallback.has(id)) {
    //         const cb = unwrap(this.EventsCallback.get(id));
    //         this.EventsCallback.delete(id);
    //         cb(msg);
    //       }
    //     } else if (tag === 'NOTICE') {
    //       console.warn(`[${this.Address}] NOTICE: ${msg[1]}`);
    //     } else {
    //       console.warn(`Unknown tag: ${tag}`);
    //     }
    //   }
    // }

    // SendEvent(ev) {
    //   if (!this.Settings.write) {
    //     return;
    //   }
    //   // console.log('client SendEvent', ev);
    //   const req = ["EVENT", ev.ToObject()];
    //   this._SendJson(req);
    //   this.Stats.EventsSent++;
    //   this._UpdateState();
    // }

    // async SendAsync(e, timeout = 5000) {
    //   return new Promise(resolve => {
    //     if (!this.Settings.write) {
    //       resolve();
    //       return;
    //     }
    //     const t = setTimeout(() => {
    //       resolve();
    //     }, timeout);
    //     this.EventsCallback.set(e.Id, () => {
    //       clearTimeout(t);
    //       resolve();
    //     });

    //     const req = ["EVENT", e.ToObject()];
    //     this._SendJson(req);
    //     this.Stats.EventsSent++;
    //     this._UpdateState();
    //   });
    // }

    // AddSub(subId, sub) {
    //   if (!this.Settings.read) {
    //     return false;
    //   }
    //   if (sub.Search && !this.SupportsNip(Nips.Search)) {
    //     return false;
    //   }
    //   if (this.SubSupports.has(subId)) {
    //     return false;
    //   }
    //   this.SubSupports.set(subId, true);
    //   //send msg
    //   if (!this.Authed && this.AwaitingAuth.size > 0) {
    //     this.PendingList.push(sub.ToObject());
    //     return true;
    //   }
    //   this._SendJson(sub.reqMsg(this.Address));
    //   return true;
    // }

    // RemoveSub(subId, sub) {
    //   if (this.SubSupports.has(subId)) {
    //     this._SendJson(sub.closeMsg);
    //     this.Subscriptions.delete(subId);
    //     return true;
    //   }
    //   return false;
    // }

    // StatusHook(fnHook) {
    //   const id = uuid();
    //   this.StateHooks.set(id, fnHook);
    //   return () => {
    //     this.StateHooks.delete(id);
    //   };
    // }

    // GetState() {
    //   if (this.HasStateChange) {
    //     this.LastState = Object.freeze({ ...this.CurrentState });
    //     this.HasStateChange = false;
    //   }
    //   return this.LastState;
    // },

    SupportsNip: (n) => {
      return this.RelayInfo?.supported_nips?.some(nipId => nipId === n) ?? false;
    },

    // _UpdateState() {
    //   this.CurrentState.connected = this.Socket?.readyState === WebSocket.OPEN;
    //   this.CurrentState.events.received = this.Stats.EventsReceived;
    //   this.CurrentState.events.send = this.Stats.EventsSent;
    //   this.CurrentState.avgLatency =
    //     this.Stats.Latency.length > 0 ? this.Stats.Latency.reduce((acc, v) => acc + v, 0) / this.Stats.Latency.length : 0;
    //   this.CurrentState.disconnects = this.Stats.Disconnects;
    //   this.CurrentState.info = this.RelayInfo;
    //   this.CurrentState.id = this.Id;
    //   this.Stats.Latency = this.Stats.Latency.slice(-20); // trim
    //   this.HasStateChange = true;
    //   this._NotifyState();
    // }

    // _NotifyState() {
    //   const state = this.GetState();
    //   for (const [, h] of this.StateHooks) {
    //     h(state);
    //   }
    // }

    // _InitSubscriptions() {
    //   //clear pendingList
    //   this.PendingList.map(msg => {
    //     this._SendJson(msg);
    //   });
    //   this.PendingList = [];
    //   //
    //   if (this.SubInit) {
    //     this.SubInit(this);
    //   }
    //   //
    //   this._UpdateState();
    // }

    // _SendJson(obj) {
    //   if (this.Socket?.readyState === WebSocket.OPEN) {
    //     const json = JSON.stringify(obj);
    //     this.Socket.send(json);
    //   } else {
    //     //push msg in pendingList
    //     this.PendingList.push(obj);
    //   }
    // }

    // _OnEvent(subId, ev) {
    //   if (this.Subscriptions.has(subId) && this.SubCallback) {
    //     const tagged = {
    //       ...ev,
    //       relays: [this.Address],
    //     };
    //     this.SubCallback(subId, tagged);
    //   } else {
    //     // console.warn(`No subscription for event! ${subId}`);
    //     // ignored for now, track as "dropped event" with connection stats
    //   }
    // }

    // async _OnAuthAsync(challenge) {
    //   //
    //   console.log('auto msg', challenge);
    //   //
    //   const authCleanup = () => {
    //     this.AwaitingAuth.delete(challenge);
    //   };
    //   this.AwaitingAuth.set(challenge, true);
    //   const authEvent = await System.nip42Auth(challenge, this.Address);
    //   return new Promise(resolve => {
    //     if (!authEvent) {
    //       authCleanup();
    //       return Promise.reject("no event");
    //     }

    //     const t = setTimeout(() => {
    //       authCleanup();
    //       resolve();
    //     }, 10_000);

    //     this.EventsCallback.set(authEvent.Id, (msgs) => {
    //       clearTimeout(t);
    //       authCleanup();
    //       if (msgs.length > 3 && msgs[2] === true) {
    //         this.Authed = true;
    //         this._InitSubscriptions();
    //       }
    //       resolve();
    //     });

    //     const req = ["AUTH", authEvent.ToObject()];
    //     this._SendJson(req);
    //     this.Stats.EventsSent++;
    //     this._UpdateState();
    //   });
    // }

    // _OnEnd(subId) {
    //   const sub = this.Subscriptions.get(subId);
    //   if (sub) {
    //     const now = new Date().getTime();
    //     const started = sub.Started.get(this.Address);
    //     sub.Finished.set(this.Address, now);
    //     if (started) {
    //       const responseTime = now - started;
    //       if (responseTime > 10_000) {
    //         console.warn(`[${this.Address}][${subId}] Slow response time ${(responseTime / 1000).toFixed(1)} seconds`);
    //       }
    //       this.Stats.Latency.push(responseTime);
    //     } else {
    //       console.warn("No started timestamp!");
    //     }
    //     sub.OnEnd(this);
    //     this._UpdateState();
    //   } else {
    //     console.warn(`No subscription for end! ${subId}`);
    //   }
    // },

    _VerifySig: (rawEv) => {
      const payload = [0, rawEv.pubkey, rawEv.created_at, rawEv.kind, rawEv.tags, rawEv.content];

      const payloadData = new TextEncoder().encode(JSON.stringify(payload));
      if (secp.utils.sha256Sync === undefined) {
        throw "Cannot verify event, no sync sha256 method";
      }
      const data = secp.utils.sha256Sync(payloadData);
      const hash = secp.utils.bytesToHex(data);
      if (!secp.schnorr.verifySync(rawEv.sig, hash, rawEv.pubkey)) {
        throw "Sig verify failed";
      }
      return rawEv;
    }
  }
};

export default NostrClient;
