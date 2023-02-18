import { createSlice } from '@reduxjs/toolkit';
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
  relays: {},
  latestRelays: 0,
};

const ProfileSlice = createSlice({
  name: "Profile",
  initialState: InitState,
  reducers: {
    init: (state, action) => {
      //process relays
      const lastRelayList = window.localStorage.getItem(RelayListKey);
      if (lastRelayList) {
        state.relays = JSON.parse(lastRelayList);
      } else {
        state.relays = Object.fromEntries(DefaultRelays.entries());
      }
      console.log('relays init', state);
    },
    setRelays: (state, action) => {
      const relays = action.payload.relays;
      const createdAt = action.payload.createdAt;
      if (state.latestRelays > createdAt) {
        return;
      }
      // filter out non-websocket urls
      const filtered = new Map();
      for (const [k, v] of Object.entries(relays)) {
        if (k.startsWith("wss://") || k.startsWith("ws://")) {
          filtered.set(k, v);
        }
      }
      state.relays = Object.fromEntries(filtered.entries());
      state.latestRelays = createdAt;
      window.localStorage.setItem(RelayListKey, JSON.stringify(state.relays));
    },
    removeRelay: (state, action) => {
      delete state.relays[action.payload];
      state.relays = { ...state.relays };
      window.localStorage.setItem(RelayListKey, JSON.stringify(state.relays));
    },
  },
});

export const {
  init,
  setRelays,
  removeRelay,
} = ProfileSlice.actions;

export default ProfileSlice.reducer;
