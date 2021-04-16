/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove';
import { fetchCreateChannel, fetchRemoveChannel, fetchRenameChannel } from './services';

const chSlice = createSlice({
  name: 'channelData',
  initialState: {
    loading: 'idle',
    error: null,
    channels: [],
    currentChannelId: '',
  },
  reducers: {
    addChannelId(state, action) {
      const { id } = action.payload;
      state.currentChannelId = id;
    },
  },
  extraReducers: {
    [fetchCreateChannel.pending]: (state) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.error = null;
      }
    },
    [fetchCreateChannel.fulfilled]: (state, action) => {
      const { channelData } = action.payload;
      if (state.loading === 'pending') {
        state.loading = 'idle';
        state.error = null;
        state.channels.push(channelData);
      }
    },
    [fetchCreateChannel.rejected]: (state, action) => {
      const { message } = action.error;
      if (state.loading === 'pending') {
        state.loading = 'idle';
        state.error = message;
      }
    },

    [fetchRenameChannel.pending]: (state) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.error = null;
      }
    },
    [fetchRenameChannel.fulfilled]: (state, action) => {
      if (state.loading === 'pending') {
        state.loading = 'idle';
        state.error = null;
        const { channelId, channelName } = action.payload;
        const currentChannel = state.channels.find((channel) => channel.id === channelId);
        currentChannel.name = channelName;
      }
    },
    [fetchRenameChannel.rejected]: (state, action) => {
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
        const defaultChannel = state.channels.find((ch) => ch.name === 'general');
        const { channelId } = action.payload;
        if (state.currentChannelId === channelId) {
          state.currentChannelId = defaultChannel.id;
        }
        remove(state.channels, (ch) => ch.id === channelId);
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

export const {
  addChannel,
  addChannelId,
  removeChannel,
  renameChannel,
} = chSlice.actions;

export default chSlice.reducer;
export const getChannels = (state) => state.channels.channels;
export const getCurrentChannelId = (state) => state.channels.currentChannelId;
