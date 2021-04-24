import { combineReducers } from '@reduxjs/toolkit';
import channelReducer from './channelSlice.js';
import messageReducer from './messageSlice.js';
import modalReducer from './modalSlice.js';

export default combineReducers({
  channels: channelReducer,
  modals: modalReducer,
  messages: messageReducer,
});
