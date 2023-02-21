import { createSlice } from '@reduxjs/toolkit';
import { dbCache } from 'db/DbCache';

const InitState = {
  usersflag: 0,
  follows: [], //save key
};

const db = dbCache();

const UsersSlice = createSlice({
  name: "Users",
  initialState: InitState,
  reducers: {
    setUsersFlag: (state, action) => {
      // console.log('setUsersFlag', state.follows, state.usersflag);
      state.usersflag = 1;
    },
    setUsers: (state, action) => {
      const existing = new Set(state.follows);
      console.log('existing aaa', existing);
      //
      action.payload.map((item) => {
        let flag = existing.has(item.pubkey);
        if (flag) {
          const src = db.getMetaData(item.pubkey);
          if (src && src.content && src.content.created_at && item.content.created_at && item.content.created_at > src.content.created_at) {
            db.updateMetaData(item.pubkey, item.content);
          }
        } else {
          existing.add(item.pubkey);
          db.updateMetaData(item.pubkey, item.content);
        }
      });
      state.follows = Array.from(existing);
      //
      console.log('setUsers before', db.getAll());
    },
    follow(state, action) {

    },
    unfollow(state, action) {

    },
  },
});

export const {
  setUsersFlag,
  setUsers
} = UsersSlice.actions;

export default UsersSlice.reducer;
