/* eslint-disable no-param-reassign */

import _ from 'lodash';
import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import routes from '../routes.js';

const updateChannels = createAsyncThunk(
  'channelData/updateChannels',
  async (getAuthHeader, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(routes.currentDataPath(), { headers: getAuthHeader() });
      return data;
    } catch (err) {
      return rejectWithValue(new Error('errors.serverError'));
    }
  },
);

const channelSlice = createSlice({
  name: 'channelData',
  initialState: {
    channels: [],
    currentChannelId: null,
  },
  reducers: {
    addChannel(state, action) {
      const { channelData } = action.payload;
      state.channels.push(channelData);
    },

    setCurrentChannelId(state, action) {
      const { id } = action.payload;
      state.currentChannelId = id;
    },

    removeChannel(state, action) {
      const { channelId } = action.payload;
      if (state.currentChannelId === channelId) {
        const defaultChannel = state.channels[0].id;
        state.currentChannelId = defaultChannel;
      }
      _.remove(state.channels, (ch) => ch.id === channelId);
    },

    renameChannel(state, action) {
      const { channelId, channelName } = action.payload;
      const currentChannel = state.channels.find((channel) => channel.id === channelId);
      currentChannel.name = channelName;
    },
  },
  extraReducers: {
    [updateChannels.fulfilled]: (state, action) => {
      const currentChannel = state.currentChannelId;
      state.channels = action.payload.channels;
      state.currentChannelId = currentChannel ?? action.payload.currentChannelId;
    },
  },
});

const getChannels = (state) => state.channels.channels;
const getCurrentChannel = (state) => state.channels.channels
  .find((channel) => channel.id === state.channels.currentChannelId);
const getChannelsNames = (state) => state.channels.channels.map((ch) => ch.name);

export const {
  addChannel,
  setCurrentChannelId,
  removeChannel,
  renameChannel,
} = channelSlice.actions;

export {
  getChannels,
  getCurrentChannel,
  getChannelsNames,
  updateChannels,
};

export default channelSlice.reducer;
