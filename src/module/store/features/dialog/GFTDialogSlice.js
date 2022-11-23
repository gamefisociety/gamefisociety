import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchOpen } from './GFTDialogAPi';

const initialState = {
  isOpenConnect:false,
  status:'idle'
};

export const incrementAsync = createAsyncThunk(
  'Dialog/isOpenConnetd',
  async (value) => {
    const response = await fetchOpen(value);
    return response.data;
  }
);

export const diloagSlice = createSlice({
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

export const { increment, decrement, setIsOpen } = diloagSlice.actions;


export const isOpen = (state) => state.dialog.isOpenConnect;


export default diloagSlice.reducer;
