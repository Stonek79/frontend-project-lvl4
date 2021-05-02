/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import axios from 'axios';

import i18n from './i18n';
import App from './components/App.jsx';
import AppContext from './context/AppContext.jsx';
import rootReducer from './slices/index.js';
import { addMessage } from './slices/messageSlice.js';
import {
  addChannel, removeChannel, renameChannel, updateChannels,
} from './slices/channelSlice.js';
import routes from './routes';

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

export default (prop) => {
  const { socket } = prop;
  const store = configureStore({
    reducer: rootReducer,
  });

  const updateCurrentStore = (data, id) => {
    const { channels, currentChannelId, messages } = data;
    const currentId = id ?? currentChannelId;
    store.dispatch(updateChannels({ channels, currentChannelId: currentId, messages }));
  };

  console.log(socket, 'socket');
  console.log(prop, 'prop');
  console.log(prop.on, 'propOn');

  socket.on('reconnect', async () => {
    const { authorization } = getAuthHeader();
    const { data } = await axios.get(routes.currentData(), { headers: authorization });
    const { channels: { currentChannelId } } = store.getState();

    try {
      updateCurrentStore(data, currentChannelId);
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
    updateCurrentStore,
  };

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <AppContext.Provider value={contextValues}>
          <App />
        </AppContext.Provider>
      </I18nextProvider>
    </Provider>
  );
};
