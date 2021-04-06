import { combineReducers } from '@reduxjs/toolkit';
import channelReducer from './channelSlice';
import messageReducer from './messageSlice';
import modalReducer from './modalSlice';

export default combineReducers({
  channels: channelReducer,
  modals: modalReducer,
  messages: messageReducer,
});
