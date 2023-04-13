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
    relay.Stats = {};
    relay.IsClosed = false;
    relay.ReconnectTimer = null;
    relay.info = null;
    relay.canSub = true;
    relay.canWrite = true;
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
    filter['#t'] = undefined;
    filter['#r'] = undefined;
    filter['#d'] = undefined;
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

  BuildNFTTag: () => {
    let ret = {};
    return ret;
  },

  BuildLongFormTag: (subject, title) => {
    let ret = {};
    ret['d'] = subject;
    ret['title'] = title;
    ret['published_at'] = Math.floor(Date.now() / 1000).toString();
    return ret;
  }

}

export default NostrFactory;