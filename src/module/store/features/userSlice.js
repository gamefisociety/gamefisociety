import { createSlice } from '@reduxjs/toolkit';

// let dd = new Map();
// dd.set('1', {
//   pubkey: '123',
//   create_at: 1000,
//   content: {
//     name: 'dd'
//   }
// });
const InitState = {
  followsData: 0,
  follows: [], //save key
  followsUpdate: 0,
  metaDatas: {}
};

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
      // console.log('user setFollows', state.follows);
    },
    updateMetadata: (state, action) => {
      // const map1 = new Map(Object.entries(state.metaDatas));
      // console.log('user setFollows', map1);
    }
  },
});

export const {
  setUsersFlag,
  setFollows,
  updateMetadata
} = UsersSlice.actions;

export default UsersSlice.reducer;
