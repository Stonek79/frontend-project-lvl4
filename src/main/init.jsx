import { configureStore, unwrapResult } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import rootReducer from './slices/index.js';
import { addMessage, getMessagesAsync } from './slices/messageSlice.js';
import { addChannel, removeChannel, renameChannel } from './slices/channelSlice.js';

const ChatRender = (props, socket) => {
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

  // TODO реализовать новый реконнект
  socket.io.on('reconnect', async () => {
    const channelId = store.getState().channels.currentChannelId;
    try {
      await store.dispatch(getMessagesAsync(channelId))
        .then(unwrapResult);
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
      <App />
    </Provider>
  );
};

export default ChatRender;
