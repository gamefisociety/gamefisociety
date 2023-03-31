import {
  configureStore
} from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
import dialogReducer from './features/dialogSlice';
import loginReducer from './features/loginSlice';
import profileReducer from './features/profileSlice';
import societyReducer from './features/societySlice';
import ipfsReducer from './features/ipfsSlice';
import { enableMapSet } from 'immer';

enableMapSet();

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    dialog: dialogReducer,
    login: loginReducer,
    profile: profileReducer,
    society: societyReducer,
    ipfs: ipfsReducer
  },
});