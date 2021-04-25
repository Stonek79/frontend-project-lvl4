/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import { remove } from 'lodash-es';
import { getStoreAsync, removeChannel } from './channelSlice.js';

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
      remove(state.messages, (m) => m.channelId === channelId);
    },
    [getStoreAsync.fulfilled]: (state, action) => {
      const { currentStore } = action.payload;
      const messages = currentStore;
      state.messages.push(...messages);
    },
  },
});

export const { addMessage, addMissedMessages } = messageSlice.actions;
export const getMessages = (state) => state.messages.messages;

export default messageSlice.reducer;
