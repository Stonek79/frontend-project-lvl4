/* eslint-disable no-param-reassign */

import _ from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

const defaultChannelId = 1;
const channelSlice = createSlice({
  name: 'channelData',
  initialState: {
    channels: [],
    currentChannelId: defaultChannelId,
  },
  reducers: {
    addChannel(state, action) {
      state.channels.push(action.payload.channelData);
    },

    setCurrentChannelId(state, action) {
      const { id } = action.payload;
      state.currentChannelId = id;
    },

    removeChannel(state, action) {
      const defaultChannel = state.channels[0].id;
      const { channelId } = action.payload;
      if (state.currentChannelId === channelId) {
        state.currentChannelId = defaultChannel;
      }
      _.remove(state.channels, (ch) => ch.id === channelId);
    },

    renameChannel(state, action) {
      const { channelId, channelName } = action.payload;
      const currentChannel = state.channels.find((channel) => channel.id === channelId);
      currentChannel.name = channelName;
    },

    updateChannels(state, action) {
      const { channels, currentChannelId } = action.payload;
      state.channels = channels;
      state.currentChannelId = currentChannelId;
    },
  },
});

const getChannels = (state) => state.channels.channels;
const getCurrentChannelId = (state) => state.channels.currentChannelId;

export const {
  addChannel,
  setCurrentChannelId,
  removeChannel,
  renameChannel,
  updateChannels,
} = channelSlice.actions;

export { getChannels, getCurrentChannelId };

export default channelSlice.reducer;
