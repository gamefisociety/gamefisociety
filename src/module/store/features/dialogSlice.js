import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchOpen } from './dialog/GFTDialogAPi';

const initialState = {
  isOpenConnect: false,
  isOpenMenuWallet: false,
  isOpenCheckIn: false,
  isOpenMintAvatar: false,
  isOpenLogin: false,
  status: 'idle',
  isOpenMenuLeft: true,
  isBottomDrawer: false,
  bottomPage: null,
  isRightDrawer: true,
  rightPage: null,
  isDrawer: false,
  isPost: false,
  targetPost: null,
  //
  placeDrawer: 'right',
  cardDrawer: 'follow',
  relayDrawer: null,
  followDrawer: [],
  followType:"",
  chatPubKey: null,
};

export const incrementAsync = createAsyncThunk(
  'Dialog/isOpenConnetd',
  async (value) => {
    const response = await fetchOpen(value);
    return response.data;
  }
);

export const dialogSlice = createSlice({
  name: 'Dialog',
  initialState,
  reducers: {
    increment: (state) => {
      state.isOpenConnect = true;
    },
    decrement: (state) => {
      state.isOpenConnect = false;
    },
    setIsOpen: (state, action) => {
      state.isOpenConnect = action.payload;
    },
    setIsOpenWallet: (state, action) => {
      state.isOpenMenuWallet = action.payload;
    },
    setOpenCheckIn: (state, action) => {
      state.isOpenCheckIn = action.payload;
    },
    setOpenMintAvatar: (state, action) => {
      state.isOpenMintAvatar = action.payload;
    },
    setOpenLogin: (state, action) => {
      state.isOpenLogin = action.payload;
    },
    setOpenMenuLeft: (state, action) => {
      state.isOpenMenuLeft = action.payload;
    },
    setPost: (state, action) => {
      state.isPost = action.payload.post;
      state.targetPost = action.payload.target;
    },
    setDrawer: (state, action) => {
      state.isDrawer = action.payload.isDrawer;
      state.placeDrawer = action.payload.placeDrawer;
      state.cardDrawer = action.payload.cardDrawer;
      if (action.payload.relayDrawer) {
        state.relayDrawer = { ...action.payload.relayDrawer }
      }
      if (action.payload.followDrawer) {
        state.followDrawer = action.payload.followDrawer.concat();
      }
      if(action.payload.followType){
        state.followType = action.payload.followType;
      }
      if (action.payload.chatPubKey) {
        state.chatPubKey = action.payload.chatPubKey;
      } else {
        state.chatPubKey = null;
      }
    },
    setBottomDrawer: (state, action) => {
      state.isBottomDrawer = action.payload.bottomDrawer;
      state.bottomPage = action.payload.page;
    },
    setRightDrawer: (state, action) => {
      state.isRightDrawer = action.payload.rightDrawer;
      state.rightPage = action.payload.page;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isOpenConnect = action.payload;
      });
  },
});

export const {
  increment,
  decrement,
  setIsOpen,
  setOpenLogin,
  setIsOpenWallet,
  setOpenCheckIn,
  setOpenMintAvatar,
  setOpenMenuLeft,
  setPost,
  setDrawer,
  setBottomDrawer,
  setRightDrawer,
}
  = dialogSlice.actions;

// export const isOpen = (state) => state.dialog.isOpenConnect;
// export const isMenuWallet = (state) => state.dialog.isOpenMenuWallet;
// export const isCheckIn = (state) => state.dialog.isOpenCheckIn;
// export const isMintAvatar = (state) => state.dialog.isOpenMintAvatar;

export default dialogSlice.reducer;
