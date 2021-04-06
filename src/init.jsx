import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import rootReducer from './slices/index.js';
import { addChannel, removeChannel, renameChannel } from './slices/channelSlice';
import { addMessage } from './slices/messageSlice';
import Context from './Context.js';
import contextValues from './contextValues.js';

export default (props, socket) => {
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

  socket.on('newChannel', ({ data: { attributes } }) => {
    const channelData = { ...attributes };
    store.dispatch(addChannel({ channelData }));
  });

  socket.on('removeChannel', ({ data: { id } }) => {
    store.dispatch(removeChannel({ id }));
  });

  socket.on('renameChannel', ({ data }) => {
    const { id, attributes } = data;
    const { name } = attributes;
    store.dispatch(renameChannel({ id, name }));
  });

  socket.on('newMessage', ({ data: { attributes } }) => {
    const messageData = { ...attributes };
    store.dispatch(addMessage({ messageData }));
  });

  return (
    <Provider store={store}>
      <Context.Provider value={contextValues}>
        <App />
      </Context.Provider>
    </Provider>
  );
};
