/* eslint-disable no-param-reassign */

import axios from 'axios';
import { remove } from 'lodash-es';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import routes from '../routes.js';

const getStoreAsync = createAsyncThunk(
  'channelData/getStoreAsync',
  async ({ channelId, getAuthHeader }) => {
    const { currentData } = routes;
    const { authorization } = getAuthHeader();
    const { data } = await axios.get(currentData(), { headers: authorization });
    return { currentStore: data, channelId };
  },
);

const channelSlice = createSlice({
  name: 'channelData',
  initialState: {
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
      const defaultChannel = state.channels.find((ch) => ch.id === 1);
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
  extraReducers: {
    [getStoreAsync.fulfilled]: (state, action) => {
      const { currentStore, channelId } = action.payload;
      const isCurrentChannel = currentStore.channels
        .map((channel) => channel.id).includes(channelId);
      state.channels = currentStore.channels;
      state.currentChannelId = isCurrentChannel ? channelId : 1;
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

export { getChannels, getCurrentChannelId, getStoreAsync };

export default channelSlice.reducer;
