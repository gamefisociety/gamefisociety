import { createSlice } from '@reduxjs/toolkit';

/**
 * Medatadata event content
 */
export var UserMetadata = {
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
};

const InitState = { users: {} };

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
