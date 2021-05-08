/* eslint-disable react/destructuring-assignment */
import React from 'react';
import axios from 'axios';
import { configureStore } from '@reduxjs/toolkit';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import i18next from 'i18next';

import resources from './resources/resources.js';
import App from './components/App.jsx';
import AppContext from './context/AppContext.jsx';
import rootReducer from './slices/index.js';
import routes from './routes';
import { addMessage } from './slices/messageSlice.js';
import {
  addChannel, removeChannel, renameChannel, updateChannels,
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

export default async (socket) => {
  const store = configureStore({
    reducer: rootReducer,
  });

  const i18n = i18next.createInstance();
  await i18n
    .init({
      lng: 'ru',
      debug: false,
      resources,
      react: {
        useSuspense: false,
        wait: false,
      },
    });

  const updateCurrentStore = (data, id) => {
    const { channels, currentChannelId, messages } = data;
    const currentId = id ?? currentChannelId;
    store.dispatch(updateChannels({ channels, currentChannelId: currentId, messages }));
  };

  // console.log(socket, 'socket');

  socket.on('reconnect', async () => {
    const { authorization } = getAuthHeader();
    const { channels: { currentChannelId } } = store.getState();

    const { data } = await axios.get(routes.currentData(), { headers: authorization });

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
    getAuthHeader,
    socket,
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
