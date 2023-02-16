import * as secp from "@noble/secp256k1";
import { v4 as uuid } from "uuid";
import { DefaultConnectTimeout } from "Const";
import { ClientState, Nips } from "nostr/def";
import { System } from "nostr/System";
import { unwrap } from "nostr/Util";

export var RelaySetting = {
  read: 1,
  write: 1
};

export default class ClientRelay {

  constructor(addr, options) {
    this.Id = uuid();
    this.Address = addr;
    this.Socket = null;
    this.Pending = [];
    this.Subscriptions = new Map();
    this.Settings = options;
    this.ConnectTimeout = DefaultConnectTimeout;
    this.Stats = new ClientState();
    this.StateHooks = new Map();
    this.HasStateChange = true;
    this.CurrentState = {
      connected: false,
      disconnects: 0,
      avgLatency: 0,
      events: {
        received: 0,
        send: 0,
      },
    };
    this.LastState = Object.freeze({ ...this.CurrentState });
    this.IsClosed = false;
    this.ReconnectTimer = null;
    this.EventsCallback = new Map();
    this.AwaitingAuth = new Map();
    this.Authed = false;
    this.connect();
  }

  async connect() {
    try {
      if (this.Info === undefined) {
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
          this.Info = data;
        }
      }
    } catch (e) {
      console.warn("Could not load relay information", e);
    }

    if (this.IsClosed) {
      this._UpdateState();
      return;
    }

    this.IsClosed = false;
    this.Socket = new WebSocket(this.Address);
    this.Socket.onopen = () => this.OnOpen();
    this.Socket.onmessage = e => this.OnMessage(e);
    this.Socket.onerror = e => this.OnError(e);
    this.Socket.onclose = e => this.OnClose(e);
  }

  Close() {
    this.IsClosed = true;
    if (this.ReconnectTimer !== null) {
      clearTimeout(this.ReconnectTimer);
      this.ReconnectTimer = null;
    }
    this.Socket?.close();
    this._UpdateState();
  }

  OnOpen() {
    this.ConnectTimeout = DefaultConnectTimeout;
    this._InitSubscriptions();
    console.log(`[${this.Address}] Open!`);
  }

  OnClose(closeEv) {
    if (!this.IsClosed) {
      this.ConnectTimeout = this.ConnectTimeout * 2;
      console.log(
        `[${this.Address}] Closed (${closeEv.reason}), trying again in ${(this.ConnectTimeout / 1000)
          .toFixed(0)
          .toLocaleString()} sec`
      );
      this.ReconnectTimer = setTimeout(() => {
        this.Connect();
      }, this.ConnectTimeout);
      this.Stats.Disconnects++;
    } else {
      console.log(`[${this.Address}] Closed!`);
      this.ReconnectTimer = null;
    }
    this._UpdateState();
  }

  OnMessage(msgEv) {
    if (msgEv.data.length > 0) {
      const msg = JSON.parse(msgEv.data);
      const tag = msg[0];
      switch (tag) {
        case "AUTH": {
          this._OnAuthAsync(msg[1]);
          this.Stats.EventsReceived++;
          this._UpdateState();
          break;
        }
        case "EVENT": {
          this._OnEvent(msg[1], msg[2]);
          this.Stats.EventsReceived++;
          this._UpdateState();
          break;
        }
        case "EOSE": {
          this._OnEnd(msg[1]);
          break;
        }
        case "OK": {
          // feedback to broadcast call
          console.debug(`${this.Address} OK: `, msg);
          const id = msg[1];
          if (this.EventsCallback.has(id)) {
            const cb = unwrap(this.EventsCallback.get(id));
            this.EventsCallback.delete(id);
            cb(msg);
          }
          break;
        }
        case "NOTICE": {
          console.warn(`[${this.Address}] NOTICE: ${msg[1]}`);
          break;
        }
        default: {
          console.warn(`Unknown tag: ${tag}`);
          break;
        }
      }
    }
  }

  OnError(ev) {
    console.error(ev);
    this._UpdateState();
  }

  SendEvent(ev) {
    if (!this.Settings.write) {
      return;
    }
    const req = ["EVENT", ev.ToObject()];
    this._SendJson(req);
    this.Stats.EventsSent++;
    this._UpdateState();
  }

  async SendAsync(e, timeout = 5000) {
    return new Promise(resolve => {
      if (!this.Settings.write) {
        resolve();
        return;
      }
      const t = setTimeout(() => {
        resolve();
      }, timeout);
      this.EventsCallback.set(e.Id, () => {
        clearTimeout(t);
        resolve();
      });

      const req = ["EVENT", e.ToObject()];
      this._SendJson(req);
      this.Stats.EventsSent++;
      this._UpdateState();
    });
  }

  /**
   * Subscribe to data from this connection
   */
  AddSubscription(sub) {
    if (!this.Settings.read) {
      return;
    }
    // check relay supports search
    if (sub.Search && !this.SupportsNip(Nips.Search)) {
      return;
    }
    if (this.Subscriptions.has(sub.Id)) {
      return;
    }
    this._SendSubscription(sub);
    this.Subscriptions.set(sub.Id, sub);
  }

  /**
   * Remove a subscription
   */
  RemoveSubscription(subId) {
    if (this.Subscriptions.has(subId)) {
      const req = ["CLOSE", subId];
      this._SendJson(req);
      this.Subscriptions.delete(subId);
      return true;
    }
    return false;
  }

  /**
   * Hook status for connection
   */
  StatusHook(fnHook) {
    const id = uuid();
    this.StateHooks.set(id, fnHook);
    return () => {
      this.StateHooks.delete(id);
    };
  }

  GetState() {
    if (this.HasStateChange) {
      this.LastState = Object.freeze({ ...this.CurrentState });
      this.HasStateChange = false;
    }
    return this.LastState;
  }

  SupportsNip(n) {
    return this.Info?.supported_nips?.some(a => a === n) ?? false;
  }

  _UpdateState() {
    this.CurrentState.connected = this.Socket?.readyState === WebSocket.OPEN;
    this.CurrentState.events.received = this.Stats.EventsReceived;
    this.CurrentState.events.send = this.Stats.EventsSent;
    this.CurrentState.avgLatency =
      this.Stats.Latency.length > 0 ? this.Stats.Latency.reduce((acc, v) => acc + v, 0) / this.Stats.Latency.length : 0;
    this.CurrentState.disconnects = this.Stats.Disconnects;
    this.CurrentState.info = this.Info;
    this.CurrentState.id = this.Id;
    this.Stats.Latency = this.Stats.Latency.slice(-20); // trim
    this.HasStateChange = true;
    this._NotifyState();
  }

  _NotifyState() {
    const state = this.GetState();
    for (const [, h] of this.StateHooks) {
      h(state);
    }
  }

  _InitSubscriptions() {
    for (const p of this.Pending) {
      this._SendJson(p);
    }
    this.Pending = [];

    for (const [, s] of this.Subscriptions) {
      this._SendSubscription(s);
    }
    this._UpdateState();
  }

  _SendSubscription(sub) {
    if (!this.Authed && this.AwaitingAuth.size > 0) {
      this.Pending.push(sub.ToObject());
      return;
    }

    let req = ["REQ", sub.Id, sub.ToObject()];
    if (sub.OrSubs.length > 0) {
      req = [...req, ...sub.OrSubs.map(o => o.ToObject())];
    }
    sub.Started.set(this.Address, new Date().getTime());
    this._SendJson(req);
  }

  _SendJson(obj) {
    if (this.Socket?.readyState !== WebSocket.OPEN) {
      this.Pending.push(obj);
      return;
    }
    const json = JSON.stringify(obj);
    this.Socket.send(json);
  }

  _OnEvent(subId, ev) {
    if (this.Subscriptions.has(subId)) {
      const tagged = {
        ...ev,
        relays: [this.Address],
      };
      this.Subscriptions.get(subId)?.OnEvent(tagged);
    } else {
      // console.warn(`No subscription for event! ${subId}`);
      // ignored for now, track as "dropped event" with connection stats
    }
  }

  async _OnAuthAsync(challenge) {
    const authCleanup = () => {
      this.AwaitingAuth.delete(challenge);
    };
    this.AwaitingAuth.set(challenge, true);
    const authEvent = await System.nip42Auth(challenge, this.Address);
    return new Promise(resolve => {
      if (!authEvent) {
        authCleanup();
        return Promise.reject("no event");
      }

      const t = setTimeout(() => {
        authCleanup();
        resolve();
      }, 10_000);

      this.EventsCallback.set(authEvent.Id, (msgs) => {
        clearTimeout(t);
        authCleanup();
        if (msgs.length > 3 && msgs[2] === true) {
          this.Authed = true;
          this._InitSubscriptions();
        }
        resolve();
      });

      const req = ["AUTH", authEvent.ToObject()];
      this._SendJson(req);
      this.Stats.EventsSent++;
      this._UpdateState();
    });
  }

  _OnEnd(subId) {
    const sub = this.Subscriptions.get(subId);
    if (sub) {
      const now = new Date().getTime();
      const started = sub.Started.get(this.Address);
      sub.Finished.set(this.Address, now);
      if (started) {
        const responseTime = now - started;
        if (responseTime > 10_000) {
          console.warn(`[${this.Address}][${subId}] Slow response time ${(responseTime / 1000).toFixed(1)} seconds`);
        }
        this.Stats.Latency.push(responseTime);
      } else {
        console.warn("No started timestamp!");
      }
      sub.OnEnd(this);
      this._UpdateState();
    } else {
      console.warn(`No subscription for end! ${subId}`);
    }
  }

  _VerifySig(rawEv) {
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
  //
}
