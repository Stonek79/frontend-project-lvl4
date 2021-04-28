import React from 'react';
import { configureStore, unwrapResult } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';

import App from './components/App.jsx';
import AppContext from './context/AppContext.jsx';
import rootReducer from './slices/index.js';
import { addMessage } from './slices/messageSlice.js';
import {
  addChannel, getStoreAsync, removeChannel, renameChannel,
} from './slices/channelSlice.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return {
      username: userId.username,
      authorization: { Authorization: `Bearer ${userId.token}` },
    };
  }

  return {};
};

export default () => {
  const url = window.location.origin;
  const socket = io(url);

  const store = configureStore({
    reducer: rootReducer,
  });

  const getCurrentStore = (id) => {
    const result = store.dispatch(getStoreAsync({ channelId: id, getAuthHeader }));
    unwrapResult(result);
    return result;
  };

  socket.io.on('reconnect', async () => {
    const channelId = store.getState().channels.currentChannelId;
    try {
      getCurrentStore(channelId);
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

  const contextValues = {
    socket,
    getAuthHeader,
    getCurrentStore,
  };

  return (
    <Provider store={store}>
      <AppContext.Provider value={contextValues}>
        <App />
      </AppContext.Provider>
    </Provider>
  );
};
