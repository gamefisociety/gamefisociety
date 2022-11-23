import {
  configureStore
} from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
import dialogReducer from './features/dialog/GFTDialogSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    dialog: dialogReducer,
  },
});