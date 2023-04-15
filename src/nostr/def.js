
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

export var ReportingType = {
  NUDITY: "nudity",
  PROFANITY: "profanity",
  ILLEGAL: "illegal",
  SPAM: "spam",
  IMPERSONATION: "impersonation",
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
  ChannelCreate: 40, //NIP-28
  ChannelSet: 41, //NIP-28
  ChannelMessage: 42, //NIP-28
  ChannelHideMessage: 43, //NIP-28
  ChannelMuteUser: 44, //NIP-28
  Reporting: 1984, //NIP-56
  ZapNode: 9734,
  MuteList: 10000, // NIP-51
  PinList: 10001, // NIP-51
  Relays: 10002, // NIP-65
  Auth: 22242, // NIP-42
  PubkeyLists: 30000, // NIP-51a
  NoteLists: 30001, // NIP-51b
  TagLists: 30002, // NIP-51c
  LongForm: 30023, //NIP-23
  ZapRequest: 9734, // NIP 57
  ZapReceipt: 9735, // NIP 57
};