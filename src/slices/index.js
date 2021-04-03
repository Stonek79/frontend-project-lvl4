import { combineReducers } from '@reduxjs/toolkit';
import channelsSlice from './channelsSlice';
import messageReducers from './messagesSlice';
import modalReducers from './modalsSlice';

export default combineReducers({
  channels: channelsSlice,
  modals: modalReducers,
  messages: messageReducers,
});
