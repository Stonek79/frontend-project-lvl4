import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes';

const { channelsPath, channelPath, channelMessagesPath } = routes;

const fetchCreateChannel = createAsyncThunk(
  'channelData/fetchCreateChannel',
  async (name) => {
    const { data } = await axios.post(channelsPath(), {
      data: { attributes: { name } },
    });
    return { channelData: data.data.attributes };
  },
  {
    condition: (name) => ((typeof name !== 'string') ? false : null),
  },
);

const fetchRenameChannel = createAsyncThunk(
  'channelData/fetchRenameChannel',
  async ({ currentChannalId, name }) => {
    const { data } = await axios.patch(channelPath(currentChannalId), {
      data: { attributes: { name } },
    });
    const { id, attributes } = data.data;
    const channelName = attributes.name;
    return { channelId: id, channelName };
  },
  {
    condition: ({ name }) => ((typeof name !== 'string') ? false : null),
  },
);

const fetchRemoveChannel = createAsyncThunk(
  'channelData/fetchRemoveChannel',
  async ({ currentId }) => {
    await axios.delete(channelPath(currentId));
    return { channelId: currentId };
  },
  {
    condition: ({ currentId }) => ((typeof currentId !== 'number') ? false : null),
  },
);

const fetchAddMessage = createAsyncThunk(
  'messageData/fetchAddMessage',
  async ({ channelId, message }) => {
    const { data } = await axios.post(channelMessagesPath(channelId), {
      data: { channelId, attributes: message },
    });
    return { messageData: data.data.attributes };
  },
  {
    condition: ({ message }) => ((!message) ? false : null),
  },
);

export {
  fetchCreateChannel,
  fetchRemoveChannel,
  fetchRenameChannel,
  fetchAddMessage,
};
