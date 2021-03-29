import { combineReducers } from '@reduxjs/toolkit';
import chatReducers from './channelSlice';
import messageReducers from './messageSlice';
import modalReducers from './modalSlice';

export default combineReducers({
  chat: chatReducers.reducer,
  modal: modalReducers.reducer,
  message: messageReducers.reducer,
});
