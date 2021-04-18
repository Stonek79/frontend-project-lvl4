/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import differenceBy from 'lodash/differenceBy';
import remove from 'lodash/remove';
import routes from '../routes';
import { removeChannel } from './channelSlice';

const addMessageAsync = createAsyncThunk(
  'messageData/addMessageAsync',
  async ({ channelId, message }) => {
    const { channelMessagesPath } = routes;
    await axios.post(channelMessagesPath(channelId), {
      data: { channelId, attributes: message },
    });
  },
);

const getMessagesAsync = createAsyncThunk(
  'messageData/getMessagesAsync',
  async ({ channelId }) => {
    const { channelMessagesPath } = routes;
    await axios.get(channelMessagesPath(channelId));
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
    addMissedMessages(state, action) {
      const { lastMessages } = action.payload;
      const missedMessages = differenceBy(state.messages, lastMessages, 'id');
      state.messages.push(...missedMessages);
    },
  },

  extraReducers: {
    [removeChannel]: (state, action) => {
      const { channelId } = action.payload;
      remove(state.messages, (m) => m.channelId === channelId);
    },
  },
});

export { addMessageAsync, getMessagesAsync };
export const { addMessage, addMissedMessages } = messageSlice.actions;
export const getMessages = (state) => state.messages.messages;

export default messageSlice.reducer;
