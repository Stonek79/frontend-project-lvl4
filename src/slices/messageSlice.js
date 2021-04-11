/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove';
import { removeChannel } from './channelSlice';

const messageSlice = createSlice({
  name: 'messageData',
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage(state, action) {
      const { messageData } = action.payload;
      state.messages.push(messageData);
    },
  },

  extraReducers: {
    [removeChannel]: (state, action) => {
      const { channelId } = action.payload;
      console.log(state, action);
      remove(state.messages, (m) => m.channelId === channelId);
    },
  },
});

export const getMessages = (state) => state.messages.messages;
export const { addMessage } = messageSlice.actions;

export default messageSlice.reducer;
