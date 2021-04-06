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
      const { id } = action.payload;
      remove(state.messages, (m) => m.channelId === id);
    },
  },
});

export const { addMessage } = messageSlice.actions;

export default messageSlice.reducer;
