import { configureStore, unwrapResult } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import ChatBox from './components/ChatBox.jsx';
import rootReducer from './slices/index.js';
import { addMessage } from './slices/messageSlice.js';
import {
  addChannel, getStoreAsync, removeChannel, renameChannel,
} from './slices/channelSlice.js';

const ChatRender = (props, socket, getAuthHeader) => {
  const { channels, messages, currentChannelId } = props;
  const preloadedState = {
    channels: {
      channels,
      currentChannelId,
    },
    messages: {
      messages,
    },
  };

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  socket.io.on('reconnect', async () => {
    console.log(socket.connected, 'reconnected');
    const channelId = store.getState().channels.currentChannelId;

    try {
      const result = await store.dispatch(getStoreAsync({ channelId, getAuthHeader }));
      console.log(result, 'new store');
      unwrapResult(result);
    } catch (err) {
      console.log(err.message);
    }
  });

  socket.on('newChannel', (data) => {
    store.dispatch(addChannel({ channelData: data }));
  });

  socket.on('removeChannel', (data) => {
    store.dispatch(removeChannel({ channelId: data.id }));
  });

  socket.on('renameChannel', (data) => {
    const { id, name } = data;
    store.dispatch(renameChannel({ channelId: id, channelName: name }));
  });

  socket.on('newMessage', (data) => {
    store.dispatch(addMessage({ messageData: data }));
  });

  return (
    <Provider store={store}>
      <ChatBox />
    </Provider>
  );
};

export default ChatRender;
