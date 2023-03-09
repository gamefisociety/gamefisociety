import * as secp from "@noble/secp256k1";
import { DefaultConnectTimeout } from "nostr/Const";
import NostrFactory from 'nostr/NostrFactory';

const NostrRelay = () => {

  const listenProcers = new Map();

  const buildKey = (addr, subid) => {
    let key = addr + '-' + subid;
    return key;
  }

  const addListen = (key, client, once, callback) => {
    if (listenProcers.get(key)) {
      return false;
    }
    let procer = {
      key: key,
      client: client,
      once: once,
      callback: callback,
      cache: []
    };
    listenProcers.set(key, procer);
  }

  const removeListen = (procer) => {
    listenProcers.delete(procer.key);
  }

  const Connect = async (client) => {

    // open Function
    const innerOnOpen = () => {
      client.Stats.connected = client.Socket?.readyState === WebSocket.OPEN;
      client.ConnectTimeout = DefaultConnectTimeout;
      console.log(`[${client.addr}] Open!`);
      SendPending(client);
    }

    const innerOnClose = (e) => {
      console.log(`[${client.addr}] Close!`, e);
      client.Stats.connected = client.Socket?.readyState === WebSocket.OPEN;
      if (!client.IsClosed) {
        //reconnect time ervey time * 2
        client.Stats.Disconnects++;
        client.ConnectTimeout = client.ConnectTimeout * 2;
        client.ReconnectTimer = setTimeout(() => {
          Connect(client);
        }, client.ConnectTimeout);
      } else {
        console.log(`[${client.Address}] Closed!`);
      }
    }

    const innerOnError = (e) => {
      console.log(`[${client.addr}] Error!`, e);
      client.Stats.connected = client.Socket?.readyState === WebSocket.OPEN;
    }

    const innerOnMsg = (e) => {
      if (e.data.length <= 0) {
        return;
      }
      // process msg
      const msg = JSON.parse(e.data);
      let tmpKey = buildKey(e.origin, msg[1]);
      let procer = listenProcers.get(tmpKey);
      if (!procer) {
        return;
      }
      // console.log('OnMessage', tmpKey, msg);
      const tag = msg[0];
      if (tag === 'AUTH') {
        if (procer && procer.callback) {
          procer.callback(tag, client, msg[1]);
        }
      } else if (tag === 'EVENT') {
        if (procer && procer.callback) {
          procer.callback(tag, client, msg[2]);
        }
      } else if (tag === 'EOSE') {
        if (procer) {
          if (procer && procer.callback) {
            procer.callback(tag, client, msg[1]);
          }
        }
      } else if (tag === 'OK') {
        console.log(`Relay [${this.Address}] OK: ${msg[1]}`);
        if (procer && procer.callback) {
          procer.callback(tag, client, msg[1]);
        }
        if (procer.once === 0) {
          removeListen(procer);
        }
      } else if (tag === 'NOTICE') {
        console.log(`Relay [${this.Address}] NOTICE: ${msg[1]}`);
        if (procer && procer.callback) {
          procer.callback(tag, client, msg[1]);
        }
        // console.warn(`[${this.Address}] NOTICE: ${msg[1]}`);
      } else {
        // console.warn(`Unknown tag: ${tag}`);
      }
    }


    let flag = false;
    try {
      if (client.info === null) {
        const u = new URL(client.addr);
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
          client.info = data;
          flag = true;
        } else {
          flag = false;
        }
      } else {
        //reconnect
        flag = true;
      }
    } catch (e) {
      console.warn("Could not load relay information", e);
    } finally {
      if (flag === true) {
        console.log('Find relay and try to connect!');
        if (client.IsClosed) {
          _UpdateState(client);
        } else {
          client.IsClosed = false;
          client.Socket = new WebSocket(client.addr);
          // on open
          client.Socket.onopen = innerOnOpen;
          // on error
          client.Socket.onerror = innerOnError;
          //on close
          client.Socket.onclose = innerOnClose;
          //on msg
          client.Socket.onmessage = innerOnMsg;
        }
      }
      return new Promise((resolve, reject) => {
        resolve(flag);
      });
    }
  }

  //manul close relays
  const Close = (client) => {
    client.IsClosed = true;
    if (client.ReconnectTimer !== null) {
      clearTimeout(client.ReconnectTimer);
      client.ReconnectTimer = null;
    }
    client.Socket?.close();
    client.Stats.connected = client.Socket?.readyState === WebSocket.OPEN;
  }

  /**
   * Next send msg
   * 
  */
  const _SendReal = (client, req) => {
    const json = JSON.stringify(req);
    client.Socket.send(json);
  }

  const SendPending = (client) => {
    // console.log('SendPending', client);
    if (client.PendingList.length <= 0) {
      return;
    }
    if (!client.Settings.write) {
      client.PendingList = [];
      return;
    }
    client.PendingList.map(req => {
      console.log('pendding msg', req);
      const json = JSON.stringify(req);
      client.Socket.send(json);
    });
    client.PendingList = [];
  }

  const SendToRelay = (client, ev, once, callback) => {
    let tmpkey = buildKey(client.addr, ev.Id);
    addListen(tmpkey, client, once, callback)
    if (ev.type === "EVENT") {
      SendEvent(client, ev);
    } else if (ev.type === "SUB") {
      SendSub(client, ev);
    } else if (ev.type === "CLOSE") {
      SendClose(client, ev);
    }
  }

  const SendEvent = (client, ev) => {
    if (!client.Settings.write) {
      return;
    }
    const req = ["EVENT", NostrFactory.formateEvent(ev)];
    if (client.Socket?.readyState === WebSocket.OPEN) {
      console.log('SendEvent direction', req);
      _SendReal(client, req);
    } else {
      console.log('SendEvent cache', ev);
      client.PendingList.push(req);
    }
    client.Stats.EventsSent++;
    _UpdateState(client);
  }

  const SendSub = (client, sub) => {
    if (!client.Settings.read) {
      return;
    }
    let req = NostrFactory.buildReq(sub);
    if (client.Socket?.readyState === WebSocket.OPEN) {
      console.log('SendSub direction', req);
      _SendReal(client, req);
    } else {
      console.log('SendSub cache', req);
      client.PendingList.push(req);
    }
  }

  const SendClose = (client, subId) => {
    // if (!client.Settings.write) {
    //   return;
    // }
    const req = ["CLOSE", subId];
    if (client.Socket?.readyState === WebSocket.OPEN) {
      // console.log('SendClose direction');
      _SendReal(client, req);
    } else {
      // console.log('SendClose cache');
      client.PendingList.push(req);
    }
  }


  const SendAuth = (client, auth) => {
    if (!client.Settings.read) {
      return;
    }
    let req = ["AUTH", NostrFactory.formateSub(auth)];
    if (client.Socket?.readyState === WebSocket.OPEN) {
      console.log('SendAuth direction', req);
      _SendReal(client, req);
    } else {
      console.log('SendAuth cache', req);
      client.PendingList.push(req);
    }
  }
  // if (!this.Authed && this.AwaitingAuth.size > 0) {
  //   this.Pending.push(sub.ToObject());
  //   return;
  // }
  // let req = ["REQ", sub.Id, sub.ToObject()];
  // if (sub.OrSubs.length > 0) {
  //   req = [...req, ...sub.OrSubs.map(o => o.ToObject())];
  // }
  // sub.Started.set(this.Address, new Date().getTime());
  // this._SendJson(req);

  const SupportsNip = (client, n) => {
    return client.info?.supported_nips?.some(nipId => nipId === n) ?? false;
  }

  const _UpdateState = (client) => {
    client.Stats.connected = client.Socket?.readyState === WebSocket.OPEN;
  }

  const _VerifySig = (rawEv) => {
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

  return {
    Connect: Connect,
    Close: Close,
    SendToRelay: SendToRelay,
    SendEvent: SendEvent,
    SendSub: SendSub,
    SendClose: SendClose,
    SupportsNip: SupportsNip,
  }
};

export default NostrRelay;
