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
  async (channelId) => {
    const { channelMessagesPath } = routes;
    const res = await axios.get(channelMessagesPath(channelId));
    const lastMessages = res.data.data.map((m) => m.attributes);
    console.log(lastMessages, 'getMessagesAsync');
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
      const missedMessages = differenceBy(state.messages, lastMessages, 'id');
      console.log(missedMessages, 'fulfilled');
      state.messages.push(...missedMessages);
    },
  },
});

export { addMessageAsync, getMessagesAsync };
export const { addMessage, addMissedMessages } = messageSlice.actions;
export const getMessages = (state) => state.messages.messages;

export default messageSlice.reducer;
