/* eslint-disable no-param-reassign */

import _ from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

const channelSlice = createSlice({
  name: 'channelData',
  initialState: {
    channels: [],
    currentChannelId: '',
  },
  reducers: {
    addChannel(state, action) {
      const { channelData } = action.payload;
      state.currentChannelId = channelData[0].id;
      state.channels.push(...channelData);
    },

    addChannelId(state, action) {
      const { id } = action.payload;
      state.currentChannelId = id;
    },

    removeChannel(state, action) {
      const defaultChannel = state.channels.find((ch) => ch.id === 1);
      const { channelId } = action.payload;
      if (state.currentChannelId === channelId) {
        state.currentChannelId = defaultChannel.id;
      }
      _.remove(state.channels, (ch) => ch.id === channelId);
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

const getChannels = (state) => state.channels.channels;
const getCurrentChannelId = (state) => state.channels.currentChannelId;

export { getChannels, getCurrentChannelId };

export default channelSlice.reducer;
