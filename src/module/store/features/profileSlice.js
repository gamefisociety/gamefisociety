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
  name: 'aaaa',
  display_name: 'bbbb',
  about: '',
  picture: '',
  website: '',
  banner: '',
  nip05: '',
  lud06: '',
  lud16: '',
  loaded: 0, //时间戳
  created: 0, //时间戳
};

const ProfileSlice = createSlice({
  name: "Profile",
  initialState: InitState,
  reducers: {
    initRelays: (state, action) => {
      const lastRelayList = window.localStorage.getItem(RelayListKey);
      if (lastRelayList) {
        state.relays = JSON.parse(lastRelayList);
      } else {
        state.relays = Object.fromEntries(DefaultRelays.entries());
      }
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
      console.log('reduce relays', state.relays);
    },
    removeRelay: (state, action) => {
      delete state.relays[action.payload];
      state.relays = { ...state.relays };
      window.localStorage.setItem(RelayListKey, JSON.stringify(state.relays));
    },
    setProfile: (state, action) => {
      state.name = action.payload.name ? action.payload.name : 'default';
      state.display_name = action.payload.display_name ? action.payload.display_name : 'default';
      state.about = action.payload.about ? action.payload.about : 'default';
      state.picture = action.payload.picture ? action.payload.picture : 'default';
      state.website = action.payload.website ? action.payload.website : 'default';
      state.banner = action.payload.banner ? action.payload.banner : 'default';
      state.nip05 = action.payload.nip05 ? action.payload.nip05 : 'default';
      state.lud06 = action.payload.lud06 ? action.payload.lud06 : 'default';
      state.lud16 = action.payload.lud16 ? action.payload.lud16 : 'default';
      state.loaded = 0;//时间戳
      state.created = action.payload.created_at ? action.payload.created_at : 'default';
    },
  },
});

export const {
  initRelays,
  setRelays,
  removeRelay,
  setProfile,
} = ProfileSlice.actions;

export default ProfileSlice.reducer;
