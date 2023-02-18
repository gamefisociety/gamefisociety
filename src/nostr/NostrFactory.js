import { v4 as uuid } from "uuid";
import { EventKind } from "nostr/def";

const NostrFactory = {

  createRelay: (addr, read, write) => {
    let relay = {};
    relay.Id = uuid();
    relay.status = {};
    relay.addr = addr;
    relay.Socket = null;
    relay.PendingList = [];
    relay.SubSupports = new Map();
    relay.Settings = {
      read: read,
      write: write,
    };
    relay.ConnectTimeout = null;
    relay.StateHooks = new Map();
    relay.HasStateChange = true;
    relay.Stats = {};
    relay.CurrentState = {
      connected: false,
      disconnects: 0,
      avgLatency: 0,
      events: {
        received: 0,
        send: 0,
      },
    };
    // relay.LastState = Object.freeze({ ...this.CurrentState });
    relay.IsClosed = false;
    relay.ReconnectTimer = null;
    relay.EventsCallback = new Map();
    relay.AwaitingAuth = new Map();
    relay.Authed = false;
    relay.info = null;
    return relay;
  },

  createEvent: (pubKey) => {
    let ev = {};
    ev.type = "EVENT";
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

  createSub: () => {
    let sub = {};
    sub.type = "SUB";
    sub.Id = uuid();
    sub.Ids = undefined;
    sub.Authors = undefined;
    sub.Kinds = undefined;
    sub.ETags = undefined;
    sub.PTags = undefined;
    sub.DTags = undefined;
    sub.Search = undefined;
    sub.Since = null;
    sub.Until = null;
    sub.Limit = null;
    sub.childs = [];
    sub.Started = new Map();
    sub.Finished = new Map();
    return sub;
  },

  formateEvent: (ev) => {
    // console.log('formate event', ev);
    return {
      id: ev.Id,
      pubkey: ev.PubKey,
      created_at: ev.CreatedAt,
      kind: ev.Kind,
      tags: ev.Tags.sort((a, b) => a.Index - b.Index)
        .map(a => a.ToObject())
        .filter(a => a !== null), //<string[][] >
      content: ev.Content,
      sig: ev.Signature,
    };
  },

  formateSub: (sub) => {
    console.log('formate sub', sub);
    const ret = {};
    if (sub.Ids) {
      ret.ids = Array.from(sub.Ids);
    }
    if (sub.Authors) {
      ret.authors = Array.from(sub.Authors);
    }
    if (sub.Kinds) {
      ret.kinds = Array.from(sub.Kinds);
    }
    if (sub.ETags) {
      ret["#e"] = Array.from(sub.ETags);
    }
    if (sub.PTags) {
      ret["#p"] = Array.from(sub.PTags);
    }
    if (sub.HashTags) {
      ret["#t"] = Array.from(sub.HashTags);
    }
    if (sub.DTags) {
      ret["#d"] = Array.from(sub.DTags);
    }
    if (sub.Search) {
      ret.search = sub.Search;
    }
    if (sub.Since !== null) {
      ret.since = sub.Since;
    }
    if (sub.Until !== null) {
      ret.until = sub.Until;
    }
    if (sub.Limit !== null) {
      ret.limit = sub.Limit;
    }
    return ret;
  }
  //!
}

export default NostrFactory;