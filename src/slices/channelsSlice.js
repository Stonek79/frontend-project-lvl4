/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove';

const channelsSlice = createSlice({
  name: 'channelsData',
  initialState: {
    channels: [],
    currentChannelId: '',
  },
  reducers: {
    addChannel(state, action) {
      const { attributes } = action.payload;
      state.channels.push(attributes);
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
} = channelsSlice.actions;

export default channelsSlice.reducer;
