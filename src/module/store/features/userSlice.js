import { createSlice } from '@reduxjs/toolkit';
import { dbCache } from 'db/DbCache';

const InitState = {
  followsData: 0,
  follows: [], //save key
  followsUpdate: 0,
};

const db = dbCache();

const UsersSlice = createSlice({
  name: "Users",
  initialState: InitState,
  reducers: {
    setUsersFlag: (state, action) => {
      // console.log('setUsersFlag', state.follows, state.usersflag);
      state.followsData = 1;
    },
    setFollows: (state, action) => {
      //
      if (action.payload.create_at > state.followsUpdate) {
        state.followsUpdate = action.payload.create_at;
        state.follows = action.payload.follows.concat();
      }
      console.log('user setFollows', state.follows);
    },
  },
});

export const {
  setUsersFlag,
  setFollows,
} = UsersSlice.actions;

export default UsersSlice.reducer;

      // action.payload.map((item) => {
      //   let flag = existing.has(item.pubkey);
      //   if (flag) {
      //     const src = db.getMetaData(item.pubkey);
      //     if (src && src.content && src.content.created_at && item.content.created_at && item.content.created_at > src.content.created_at) {
      //       db.updateMetaData(item.pubkey, item.content);
      //     }
      //   } else {
      //     existing.add(item.pubkey);
      //     db.updateMetaData(item.pubkey, item.content);
      //   }
      // });
      // state.follows = Array.from(existing);
      // console.log('setUsers before', db.getAll());