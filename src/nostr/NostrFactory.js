import { v4 as uuid } from "uuid";
import { EventKind } from "nostr/def";
import { DefaultConnectTimeout } from "nostr/Const";

const NostrFactory = {

  createRelay: (addr, read, write) => {
    let relay = {};
    relay.Id = uuid();
    relay.status = {};
    relay.addr = addr;
    relay.Socket = null;
    relay.PendingList = [];
    relay.Settings = {
      read: read,
      write: write,
    };
    relay.ConnectTimeout = DefaultConnectTimeout;
    relay.StateHooks = new Map();
    relay.HasStateChange = true;
    relay.Stats = {};
    relay.IsClosed = false;
    relay.ReconnectTimer = null;
    relay.AwaitingAuth = new Map();
    relay.Authed = false;
    relay.info = null;
    relay.TmpData = {}
    return relay;
  },

  createEvent: (pubKey) => {
    let ev = {};
    ev.Original = null;
    ev.Id = '';
    ev.PubKey = pubKey ? pubKey : "";
    ev.CreatedAt = Math.floor(new Date().getTime() / 1000);
    ev.Kind = EventKind.Unknown;
    ev.Tags = [];
    ev.Content = "";
    ev.Signature = "";
    return ev;
  },

  createFilter: () => {
    let filter = {};
    filter.ids = undefined;
    filter.authors = undefined;
    filter.kinds = undefined;
    filter['#e'] = undefined;
    filter['#p'] = undefined;
    filter.since = undefined;
    filter.until = undefined;
    filter.limit = undefined;
    return filter;
  },


  formateEvent: (ev) => {
    // console.log('formate event', ev);
    return {
      id: ev.Id,
      pubkey: ev.PubKey,
      created_at: ev.CreatedAt,
      kind: ev.Kind,
      tags: ev.Tags,
      content: ev.Content,
      sig: ev.Signature,
    };
  },

  formateSub: (sub) => {
    // console.log('formate sub', sub);
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
    let rets = [];
    rets.push(ret);
    return ret;
  },

  formateAuth: (ev) => {
    let ret = {
      id: ev.Id,
      pubkey: ev.PubKey,
      created_at: ev.CreatedAt,
      kind: ev.Kind,
      tags: ev.Tags.sort((a, b) => a.Index - b.Index)
        .map(a => a.ToObject())
        .filter(a => a !== null), //<string[][] >
      content: ev.Content,
      sig: ev.Signature,
    }
    return ret;
  },

}

export default NostrFactory;