import { createSlice } from "@reduxjs/toolkit";
import * as secp from "@noble/secp256k1";
import { DefaultRelays } from "nostr/Const";

const RelayListKey = "last-relays";

// export const DefaultImgProxy = {
//   url: "https://imgproxy.snort.social",
//   key: "a82fcf26aa0ccb55dfc6b4bd6a1c90744d3be0f38429f21a8828b43449ce7cebe6bdc2b09a827311bef37b18ce35cb1e6b1c60387a254541afa9e5b4264ae942",
//   salt: "a897770d9abf163de055e9617891214e75a9016d748f8ef865e6ffbcb9ed932295659549773a22a019a5f06d0b440c320be411e3fddfe784e199e4f03d74bd9b",
// };
export const InitState = {
  useDb: "redux",
  newUserKey: false,
  relays: [],
  curRelay: '',
  latestRelays: 0,
  profile: {},
  loaded: 0, //时间戳
  created: 0, //时间戳
  follows: [],
  followsUpdate: 0,
};

const ProfileSlice = createSlice({
  name: "Profile",
  initialState: InitState,
  reducers: {
    initRelays: (state, action) => {
      const lastRelayList = window.localStorage.getItem(RelayListKey);
      let tmp_relays = [];
      if (lastRelayList) {
        tmp_relays = JSON.parse(lastRelayList);
      } else {
        tmp_relays = DefaultRelays;
      }
      state.relays = tmp_relays;
      state.curRelay = tmp_relays[0];
      console.log('lastRelayList', tmp_relays);
    },
    setRelays: (state, action) => {
      console.log('action setRelays', action.payload);
      state.relays = action.payload;
      window.localStorage.setItem(RelayListKey, JSON.stringify(state.relays));
    },
    setCurRelay: (state, action) => {
      state.curRelay = { ...action.payload };
    },
    setProfile: (state, action) => {
      state.profile = { ...action.payload };
    },
    setFollows: (state, action) => {
      state.followsUpdate = action.payload.create_at;
      state.follows = action.payload.follows.concat();
    },
  },
});

export const {
  initRelays,
  setRelays,
  setCurRelay,
  setProfile,
  setFollows,
} = ProfileSlice.actions;

export default ProfileSlice.reducer;
