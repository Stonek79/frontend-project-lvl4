/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove';
import { removeChannel } from './channelsSlice';

const messageReducers = createSlice({
  name: 'messagesData',
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage(state, action) {
      const { attributes } = action.payload;
      state.messages.push(attributes);
    },
  },

  extraReducers: {
    [removeChannel]: (state, action) => {
      const { id } = action.payload;
      remove(state.messages, (m) => m.channelId === id);
    },
  },
});

export const { addMessage } = messageReducers.actions;

export default messageReducers.reducer;
