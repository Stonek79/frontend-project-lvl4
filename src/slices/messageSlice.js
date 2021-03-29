/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove';
import chatReducers from './channelSlice';

const messageReducers = createSlice({
  name: 'message',
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
  },

  extraReducers: {
    [chatReducers.actions.removeChannel]: (state, action) => {
      remove(state.massages, (m) => m.channelId === action.payload);
    },
  },
});

export const { addMessage } = messageReducers.actions;

export default messageReducers;
