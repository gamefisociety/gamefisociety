
//
export var Nips = {
  Search: 50,
};

export class ClientState {

  constructor() {
    this.Latency = [];
    this.Subs = 0;
    this.SubsTimeout = 0;
    this.EventsReceived = 0;
    this.EventsSend = 0;
    this.Disconnects = 0;
  }
}

export var NostrList = {
  Muted: 0,
  Pinned: 1,
  Bookmarked: 2,
  Followed: 3,
};

export var EventKind = {
  Unknown: -1,
  SetMetadata: 0,
  TextNote: 1,
  RecommendServer: 2,
  ContactList: 3, // NIP-02
  DirectMessage: 4, // NIP-04
  Deletion: 5, // NIP-09
  Repost: 6, // NIP-18
  Reaction: 7, // NIP-25
  Relays: 10002, // NIP-65
  Auth: 22242, // NIP-42
  PubkeyLists: 30000, // NIP-51a
  NoteLists: 30001, // NIP-51b
  TagLists: 30002, // NIP-51c
  ZapRequest: 9734, // NIP 57
  ZapReceipt: 9735, // NIP 57
};