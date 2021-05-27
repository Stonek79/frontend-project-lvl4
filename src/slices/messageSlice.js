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
      .addCase(updateChannels, (state, action) => {
        const { channelId } = action.payload;
        _.remove(state.messages, (m) => m.channelId === channelId);
      });
  },
});

export const getMessages = (state) => state.messages.messages;

export const { addMessage, addMissedMessages } = messageSlice.actions;

export default messageSlice.reducer;
