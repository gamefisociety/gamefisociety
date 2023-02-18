import { v4 as uuid } from "uuid";
import { EventKind } from "nostr/def";

const NostrFactory = {

  createEvent: (pubKey) => {
    let ev = {};
    ev.Original = null;
    ev.Id = "";
    ev.PubKey = pubKey ? pubKey : "";
    ev.CreatedAt = Math.floor(new Date().getTime() / 1000);
    ev.Kind = EventKind.Unknown;
    ev.Tags = [];
    ev.Content = "";
    ev.Signature = "";
    return ev;
  },

  createClient: (addr, read, write) => {
    let relay = {};
    relay.Id = uuid();
    relay.status = {};
    relay.addr = addr;
    relay.Socket = null;
    relay.PendingList = [];
    relay.PendingList = [];
    relay.SubSupports = new Map();
    relay.SubCallback = null;
    relay.SubInit = null;
    relay.Settings = {
      read: read,
      write: write,
    };
    relay.ConnectTimeout = null;
    relay.StateHooks = new Map();
    relay.HasStateChange = true;
    relay.CurrentState = {
      connected: false,
      disconnects: 0,
      avgLatency: 0,
      events: {
        received: 0,
        send: 0,
      },
    };
    relay.LastState = Object.freeze({ ...this.CurrentState });
    relay.IsClosed = false;
    relay.ReconnectTimer = null;
    relay.EventsCallback = new Map();
    relay.AwaitingAuth = new Map();
    relay.Authed = false;
  }
}

export default NostrFactory;