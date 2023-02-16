import { v4 as uuid } from "uuid";

export default class Subscriptions {

  constructor(subraw) {
    this.Id = uuid();
    this.Ids = subraw?.ids ? new Set(subraw.ids) : undefined;
    this.Authors = subraw?.authors ? new Set(subraw.authors) : undefined;
    this.Kinds = subraw?.kinds ? new Set(subraw.kinds) : undefined;
    this.ETags = subraw?.["#e"] ? new Set(subraw["#e"]) : undefined;
    this.PTags = subraw?.["#p"] ? new Set(subraw["#p"]) : undefined;
    this.DTags = subraw?.["#d"] ? new Set(["#d"]) : undefined;
    this.RTags = subraw?.["#r"] ? new Set(["#r"]) : undefined;
    this.Search = subraw?.search ?? undefined;
    this.Since = subraw?.since ?? undefined;
    this.Until = subraw?.until ?? undefined;
    this.Limit = subraw?.limit ?? undefined;
    this.OnEvent = () => {
      console.warn(`No event handler was set on subscription: ${this.Id}`);
    };
    this.OnEnd = () => undefined;
    this.childSubs = [];
    this.Started = new Map();
    this.Finished = new Map();
  }

  AddSubscription(sub) {
    this.childSubs.push(sub);
  }

  IsFinished() {
    return this.Started.size === this.Finished.size;
  }

  ToObject() {
    const ret = {};
    if (this.Ids) {
      ret.ids = Array.from(this.Ids);
    }
    if (this.Authors) {
      ret.authors = Array.from(this.Authors);
    }
    if (this.Kinds) {
      ret.kinds = Array.from(this.Kinds);
    }
    if (this.ETags) {
      ret["#e"] = Array.from(this.ETags);
    }
    if (this.PTags) {
      ret["#p"] = Array.from(this.PTags);
    }
    if (this.HashTags) {
      ret["#t"] = Array.from(this.HashTags);
    }
    if (this.DTags) {
      ret["#d"] = Array.from(this.DTags);
    }
    if (this.RTags) {
      ret["#r"] = Array.from(this.RTags);
    }
    if (this.Search) {
      ret.search = this.Search;
    }
    if (this.Since !== null) {
      ret.since = this.Since;
    }
    if (this.Until !== null) {
      ret.until = this.Until;
    }
    if (this.Limit !== null) {
      ret.limit = this.Limit;
    }
    return ret;
  }
  //
}
