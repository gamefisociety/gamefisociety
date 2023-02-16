import { createSlice } from '@reduxjs/toolkit';

const InitState = {
  users: {
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
    pubkey: '',
    npub: ''
  }
};

const UsersSlice = createSlice({
  name: "Users",
  initialState: InitState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = UsersSlice.actions;

export default UsersSlice.reducer;
