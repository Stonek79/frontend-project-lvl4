/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove';
import { fetchAddMessage, fetchRemoveChannel } from './services';

const messageSlice = createSlice({
  name: 'messageData',
  initialState: {
    loading: 'idle',
    error: null,
    messages: [],
  },
  reducers: {
    addMessage(state, action) {
      const { messageData } = action.payload;
      state.messages.push(messageData);
    },
  },

  extraReducers: {
    [fetchAddMessage.pending]: (state) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.error = null;
      }
    },
    [fetchAddMessage.fulfilled]: (state) => {
      if (state.loading === 'pending') {
        state.loading = 'idle';
        state.error = null;
      }
    },
    [fetchAddMessage.rejected]: (state, action) => {
      const { message } = action.error;
      if (state.loading === 'pending') {
        state.loading = 'idle';
        state.error = message;
      }
    },

    [fetchRemoveChannel.pending]: (state) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.error = null;
      }
    },
    [fetchRemoveChannel.fulfilled]: (state, action) => {
      if (state.loading === 'pending') {
        state.loading = 'idle';
        state.error = null;
        const { channelId } = action.payload;
        remove(state.messages, (m) => m.channelId === channelId);
      }
    },
    [fetchRemoveChannel.rejected]: (state, action) => {
      const { message } = action.error;
      if (state.loading === 'pending') {
        state.loading = 'idle';
        state.error = message;
      }
    },
  },
});

export const { addMessage } = messageSlice.actions;
export const getMessages = (state) => state.messages.messages;

export default messageSlice.reducer;
