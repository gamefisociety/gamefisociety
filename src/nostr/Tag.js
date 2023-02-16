import { unwrap } from "nostr/Util";

export default class Tag {

  constructor(tags, index) {
    this.Original = tags;
    this.Key = tags[0];
    this.Index = index;
    this.Invalid = false;
    if (this.Key === 'e') {
      this.Event = tags[1];
      this.Relay = tags.length > 2 ? tags[2] : undefined;
      this.Marker = tags.length > 3 ? tags[3] : undefined;
      if (!this.Event) {
        this.Invalid = true;
      }
    } else if (this.Key === 'p') {
      this.PubKey = tags[1];
      if (!this.PubKey) {
        this.Invalid = true;
      }
    } else if (this.Key === 'd') {
      this.DTag = tags[1];
    } else if (this.Key === 't') {
      this.Hashtag = tags[1];
    } else if (this.Key === 'delegation') {
      this.PubKey = tags[1];
    }
  }

  ToObject() {
    switch (this.Key) {
      case "e": {
        let ret = ["e", this.Event, this.Relay, this.Marker];
        const trimEnd = ret.reverse().findIndex(a => a !== undefined);
        ret = ret.reverse().slice(0, ret.length - trimEnd);
        return ret;
      }
      case "p": {
        return this.PubKey ? ["p", this.PubKey] : null;
      }
      case "t": {
        return ["t", unwrap(this.Hashtag)];
      }
      case "d": {
        return ["d", unwrap(this.DTag)];
      }
      default: {
        return this.Original;
      }
    }
  }
  //
}
