/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { differenceBy, remove } from 'lodash-es';
import routes from '../../routes.js';
import { removeChannel } from './channelSlice.js';

const getMessagesAsync = createAsyncThunk(
  'messageData/getMessagesAsync',
  async (channelId) => {
    const { channelMessagesPath } = routes;
    const res = await axios.get(channelMessagesPath(channelId));
    const lastMessages = res.data.data.map((m) => m.attributes);
    return { lastMessages };
  },
);

const messageSlice = createSlice({
  name: 'messageData',
  initialState: {
    loading: 'idle',
    error: null,
    messages: [],
  },
  reducers: {
    addMessage(state, action) {
      const { messageData } = action.payload;
      state.messages.push(messageData);
    },
  },

  extraReducers: {
    [removeChannel]: (state, action) => {
      const { channelId } = action.payload;
      remove(state.messages, (m) => m.channelId === channelId);
    },
    [getMessagesAsync.fulfilled]: (state, action) => {
      const { lastMessages } = action.payload;
      const missedMessages = differenceBy(lastMessages, state.messages, 'id');
      state.messages.push(...missedMessages);
    },
  },
});

export { getMessagesAsync };
export const { addMessage, addMissedMessages } = messageSlice.actions;
export const getMessages = (state) => state.messages.messages;

export default messageSlice.reducer;
