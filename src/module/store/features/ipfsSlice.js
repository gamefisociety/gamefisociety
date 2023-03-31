import { createSlice } from '@reduxjs/toolkit';

export const InitState = {
  serviceProviders : ["fleek", "pinata"], //"infura", "fleek", "pinata"
  currentService: 'fleek',
  apiKey: '',
  apiSecret: ''
};

const LoginSlice = createSlice({
  name: "IPFSLogin",
  initialState: InitState,
  reducers: {
    setCurrentService(state, action) {
      let service = action.payload;
      if(state.serviceProviders.indexOf(service) > -1){
        state.currentService = service;
      }
    },
    setApiKey(state, action) {
      state.apiKey = action.payload;
    },
    setApiSecret(state, action) {
      state.apiSecret = action.payload;
    },
  },
});

export const {
  setCurrentService,
  setApiKey,
  setApiSecret,
} = LoginSlice.actions;

export default LoginSlice.reducer;
