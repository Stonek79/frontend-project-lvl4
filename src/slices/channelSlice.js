/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove';

const channelSlice = createSlice({
  name: 'channelData',
  initialState: {
    channels: [],
    currentChannelId: '',
  },
  reducers: {
    addChannel(state, action) {
      const { channelData } = action.payload;
      state.channels.push(channelData);
    },

    addChannelId(state, action) {
      const { id } = action.payload;
      state.currentChannelId = id;
    },

    removeChannel(state, action) {
      const { id } = action.payload;
      if (state.currentChannelId === id) {
        state.currentChannelId = 1;
      }
      remove(state.channels, (ch) => ch.id === id);
    },

    renameChannel(state, action) {
      const { id, name } = action.payload;
      const currentChannel = state.channels.find((channel) => channel.id === id);
      currentChannel.name = name;
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
