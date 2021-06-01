/* eslint-disable no-param-reassign */

import _ from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

import { removeChannel, updateChannels } from './channelSlice.js';

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

  extraReducers: (builder) => {
    builder
      .addCase(removeChannel, (state, action) => {
        const { channelId } = action.payload;
        _.remove(state.messages, (m) => m.channelId === channelId);
      })
      .addCase(updateChannels.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
      });
  },
});

export const getCurrentChannelMessages = (state) => {
  const { messages } = state.messages;
  const { currentChannelId } = state.channels;
  return messages.filter((message) => message.channelId === currentChannelId);
};

export const { addMessage, addMissedMessages } = messageSlice.actions;

export default messageSlice.reducer;
