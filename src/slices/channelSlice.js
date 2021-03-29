/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove';

const chatReducers = createSlice({
  name: 'channelsData',
  initialState: {
    channels: [],
    currentChannelId: '',
  },
  reducers: {
    addChannel(state, action) {
      state.channels.push(action.payload);
    },

    addChannelId(state, action) {
      state.currentChannelId = action.payload;
    },

    removeChannel(state, action) {
      remove(state.channels, (ch) => ch.id === action.payload);
    },

    renameChannel(state, action) {
      const { id, attributes: { name } } = action.payload;
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
} = chatReducers.actions;

export default chatReducers;
