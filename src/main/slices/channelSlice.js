/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import { remove } from 'lodash-es';

const channelSlice = createSlice({
  name: 'channelData',
  initialState: {
    loading: 'idle',
    error: null,
    channels: [],
    currentChannelId: '',
  },
  reducers: {
    addChannel(state, action) {
      const { channelData } = action.payload;
      state.currentChannelId = channelData.id;
      state.channels.push(channelData);
    },

    addChannelId(state, action) {
      const { id } = action.payload;
      state.currentChannelId = id;
    },

    removeChannel(state, action) {
      const defaultChannel = state.channels.find((ch) => ch.name === 'general');
      const { channelId } = action.payload;
      if (state.currentChannelId === channelId) {
        state.currentChannelId = defaultChannel.id;
      }
      remove(state.channels, (ch) => ch.id === channelId);
    },

    renameChannel(state, action) {
      const { channelId, channelName } = action.payload;
      const currentChannel = state.channels.find((channel) => channel.id === channelId);
      currentChannel.name = channelName;
    },
  },
});

export const {
  addChannel,
  addChannelId,
  removeChannel,
  renameChannel,
} = channelSlice.actions;

export default channelSlice.reducer;
export const getChannels = (state) => state.channels.channels;
export const getCurrentChannelId = (state) => state.channels.currentChannelId;