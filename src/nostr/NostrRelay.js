import { DefaultConnectTimeout } from "nostr/Const";
import NostrFactory from 'nostr/NostrFactory';

const NostrRelay = () => {

  const listenProcers = new Map();

  const buildKey = (addr, flag) => {
    let key = addr + '-' + flag;
    return key;
  }

  const addListen = (key, client, callback) => {
    if (listenProcers.get(key)) {
      return false;
    }
    let procer = {
      key: key,
      client: client,
      callback: callback
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
      const msg = JSON.parse(e.data);
      let tmpKey = buildKey(e.origin, msg[1]);
      let procer = listenProcers.get(tmpKey);
      const tag = msg[0];
      //
      // console.log('relay msg', e.origin, msg);
      //
      if (tag === 'AUTH') {
        if (procer && procer.callback) {
          procer.callback(tag, client, msg[1]);
        }
      } else if (tag === 'EVENT') {
        if (procer && procer.callback) {
          procer.callback(tag, client, msg[2]);
        }
      } else if (tag === 'COUNT') {
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
        // console.log('OK MSG msg', msg, e, procer, listenProcers);
        if (procer) {
          if (procer.callback) {
            procer.callback(tag, client, {
              eventid: msg[1],
              ret: msg[2]
            });
          }
          removeListen(procer);
        }
      } else if (tag === 'NOTICE') {
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
      // console.warn("Could not load relay information", e);
    } finally {
      if (flag === true) {
        // console.log('Find relay and try to connect!');
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
    if (client.PendingList.length <= 0) {
      return;
    }
    if (!client.Settings.write) {
      client.PendingList = [];
      return;
    }
    client.PendingList.map(req => {
      const json = JSON.stringify(req);
      client.Socket.send(json);
    });
    client.PendingList = [];
  }

  const SendEvent = (client, ev, callback) => {
    if (!client.Settings.write) {
      return;
    }
    let tmpkey = buildKey(client.addr, ev.Id);
    addListen(tmpkey, client, callback);
    const req = ["EVENT", NostrFactory.formateEvent(ev)];
    if (client.Socket?.readyState === WebSocket.OPEN) {
      _SendReal(client, req);
    } else {
      client.PendingList.push(req);
    }
    client.Stats.EventsSend++;
    _UpdateState(client);
  }

  const SendSub = (client, sub, callback) => {
    if (!client.Settings.read) {
      return;
    }
    let tmpkey = buildKey(client.addr, sub[1]);
    addListen(tmpkey, client, callback);
    //
    if (client.Socket?.readyState === WebSocket.OPEN) {
      _SendReal(client, sub);
    } else {
      client.PendingList.push(sub);
    }
  }

  const SendClose = (client, subId) => {
    console.log('SendClose:', client.addr, subId);
    const req = ["CLOSE", subId];
    if (client.Socket?.readyState === WebSocket.OPEN) {
      _SendReal(client, req);
    } else {
      client.PendingList.push(req);
    }
  }

  const SendAuth = (client, auth) => {
    if (!client.Settings.read) {
      return;
    }
    // let req = ["AUTH", NostrFactory.formateSub(auth)];
    // if (client.Socket?.readyState === WebSocket.OPEN) {
    //   console.log('SendAuth direction', req);
    //   _SendReal(client, req);
    // } else {
    //   console.log('SendAuth cache', req);
    //   client.PendingList.push(req);
    // }
  }

  const SupportsNip = (client, n) => {
    return client.info?.supported_nips?.some(nipId => nipId === n) ?? false;
  }

  const _UpdateState = (client) => {
    client.Stats.connected = client.Socket?.readyState === WebSocket.OPEN;
  }

  return {
    Connect: Connect,
    Close: Close,
    SendEvent: SendEvent,
    SendSub: SendSub,
    SendClose: SendClose,
    SupportsNip: SupportsNip,
  }
};

export default NostrRelay;
