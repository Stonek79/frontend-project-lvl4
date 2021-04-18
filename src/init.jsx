import { configureStore, unwrapResult } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import Cookies from 'js-cookie';
import faker from 'faker';
import App from './components/App.jsx';
import rootReducer from './slices/index.js';
import Context from './Context.jsx';
import { addMessage, getMessagesAsync } from './slices/messageSlice.js';
import { addChannel, removeChannel, renameChannel } from './slices/channelSlice.js';

export default (props, socket) => {
  if (!Cookies.get('username')) {
    Cookies.set('username', faker.name.findName());
  }
  const user = Cookies.get('username');
  const contextValues = {
    user,
  };

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

  socket.on('reconnect', () => {
    console.log(socket.connected);
    const channelId = store.getState().channels.currentChannelId;
    try {
      store.dispatch(getMessagesAsync(channelId))
        .then(unwrapResult);
      console.log('reconnect');
    } catch (err) {
      console.log(err.message, 'err reconnect');
    }
  });

  socket.on('newChannel', ({ data }) => {
    const { attributes } = data;
    store.dispatch(addChannel({ channelData: attributes }));
  });

  socket.on('removeChannel', ({ data }) => {
    store.dispatch(removeChannel({ channelId: data.id }));
  });

  socket.on('renameChannel', ({ data }) => {
    const { id, attributes } = data;
    const { name } = attributes;
    store.dispatch(renameChannel({ channelId: id, channelName: name }));
  });

  socket.on('newMessage', ({ data }) => {
    const { attributes } = data;
    store.dispatch(addMessage({ messageData: attributes }));
  });

  return (
    <Provider store={store}>
      <Context.Provider value={contextValues}>
        <App />
      </Context.Provider>
    </Provider>
  );
};
