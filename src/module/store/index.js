import {
  configureStore
} from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
import dialogReducer from './features/dialog/GFTDialogSlice';
import userReducer from './features/userSlice';
import loginReducer from './features/loginSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    dialog: dialogReducer,
    user: userReducer,
    login: loginReducer
  },
});