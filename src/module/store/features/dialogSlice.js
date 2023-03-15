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
  isDrawer: false,
  isPost: false,
  targetPost: null,
  placeDrawer: 'right',
  cardDrawer: 'follow'
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
    }

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
  setDrawer
}
  = dialogSlice.actions;

// export const isOpen = (state) => state.dialog.isOpenConnect;
// export const isMenuWallet = (state) => state.dialog.isOpenMenuWallet;
// export const isCheckIn = (state) => state.dialog.isOpenCheckIn;
// export const isMintAvatar = (state) => state.dialog.isOpenMintAvatar;

export default dialogSlice.reducer;
