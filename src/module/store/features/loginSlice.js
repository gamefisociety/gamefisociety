import { createSlice } from '@reduxjs/toolkit';
import * as secp from "@noble/secp256k1";
import { DefaultRelays } from "nostr/Const";

const PrivateKeyItem = "prikey";
const PublicKeyItem = "pubkey";

// export const DefaultImgProxy = {
//   url: "https://imgproxy.snort.social",
//   key: "a82fcf26aa0ccb55dfc6b4bd6a1c90744d3be0f38429f21a8828b43449ce7cebe6bdc2b09a827311bef37b18ce35cb1e6b1c60387a254541afa9e5b4264ae942",
//   salt: "a897770d9abf163de055e9617891214e75a9016d748f8ef865e6ffbcb9ed932295659549773a22a019a5f06d0b440c320be411e3fddfe784e199e4f03d74bd9b",
// };

export const InitState = {
  useDb: "redux",
  loggedOut: undefined,
  publicKey: undefined,
  privateKey: undefined,
  newUserKey: false,
};

const LoginSlice = createSlice({
  name: "Login",
  initialState: InitState,
  reducers: {
    init: (state, action) => {
      // console.log('init login slice', state, action);
      state.useDb = action.payload;
      //process privatekey
      state.privateKey = window.localStorage.getItem(PrivateKeyItem) ?? undefined;
      if (state.privateKey) {
        window.localStorage.removeItem(PublicKeyItem);
        state.publicKey = secp.utils.bytesToHex(secp.schnorr.getPublicKey(state.privateKey));
        state.loggedOut = false;
      } else {
        state.loggedOut = true;
      }
      //process pubkey
      const pubKey = window.localStorage.getItem(PublicKeyItem);
      if (pubKey && !state.privateKey) {
        state.publicKey = pubKey;
        state.loggedOut = false;
      }
    },
    setPrivateKey: (state, action) => {
      state.loggedOut = false;
      state.privateKey = action.payload;
      window.localStorage.setItem(PrivateKeyItem, action.payload);
      console.log('setPrivateKey', action.payload);
      state.publicKey = secp.utils.bytesToHex(secp.schnorr.getPublicKey(action.payload));
    },
    setGeneratedPrivateKey: (state, action) => {
      state.loggedOut = false;
      state.newUserKey = true;
      state.privateKey = action.payload;
      window.localStorage.setItem(PrivateKeyItem, action.payload);
      state.publicKey = secp.utils.bytesToHex(secp.schnorr.getPublicKey(action.payload));
      // console.log('setGeneratedPrivateKey', action.payload);
    },
    setPublicKey: (state, action) => {
      window.localStorage.setItem(PublicKeyItem, action.payload);
      state.loggedOut = false;
      state.publicKey = action.payload;
    },
    logout: state => {
      // const relays = { ...state.relays };
      // Object.assign(state, InitState);
      // state.loggedOut = true;
      // window.localStorage.clear();
      // state.relays = relays;
      // window.localStorage.setItem(RelayListKey, JSON.stringify(relays));
    },
  },
});

export const {
  init,
  setPrivateKey,
  setGeneratedPrivateKey,
  setPublicKey,
  logout,
} = LoginSlice.actions;

export default LoginSlice.reducer;
