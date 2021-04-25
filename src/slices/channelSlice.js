/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { remove } from 'lodash-es';
import routes from '../routes.js';

const getStoreAsync = createAsyncThunk(
  'channelData/getStoreAsync',
  async ({ channelId, getAuthHeader }) => {
    const { currentData } = routes;
    const { authorization } = getAuthHeader();
    const res = await axios.get(currentData(), { headers: authorization });
    const currentStore = res.data.data;
    return { currentStore, channelId };
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
      const isCurrentChannel = state.channels.find((channel) => channel.id === channelId);
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

export default channelSlice.reducer;
export { getStoreAsync };
export const getChannels = (state) => state.channels.channels;
export const getCurrentChannelId = (state) => state.channels.currentChannelId;
