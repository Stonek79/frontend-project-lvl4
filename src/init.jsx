/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import i18next from 'i18next';
import { configureStore } from '@reduxjs/toolkit';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';

import App from './components/App.jsx';
import ApiContext from './context/ApiContext.jsx';
import resources from './resources/index.js';
import rootReducer from './slices/index.js';
import { socketActions as actions } from './constants.js';
import { addMessage } from './slices/messageSlice.js';
import {
  addChannel, removeChannel, renameChannel, setCurrentChannelId, updateChannels,
} from './slices/channelSlice.js';

export default async (socket) => {
  const store = configureStore({
    reducer: rootReducer,
  });

  const i18n = i18next.createInstance();
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
    });

  const socketHandler = (action) => (data) => new Promise((response, reject) => {
    const timer = setTimeout(() => reject(Error('errors.netError')), 3000);
    socket.volatile.emit(action, data, (r) => {
      if (r.status === 'ok') {
        clearTimeout(timer);
        response(r);
      }
    });
  });

  const api = {
    sendMessage: socketHandler(actions.newMessage),
    addChannel: socketHandler(actions.newChannel),
    renameChannel: socketHandler(actions.renameChannel),
    removeChannel: socketHandler(actions.removeChannel),
  };

  socket.on(actions.connect, () => {
    socket.sendBuffer = [];
    const id = store.getState().channels.currentChannelId;
    store.dispatch(updateChannels());
    store.dispatch(setCurrentChannelId({ id }));
  });

  socket.on(actions.newChannel, (data) => {
    store.dispatch(addChannel({ channelData: data }));
  });

  socket.on(actions.removeChannel, (data) => {
    store.dispatch(removeChannel({ channelId: data.id }));
  });

  socket.on(actions.renameChannel, (data) => {
    const { id, name } = data;
    store.dispatch(renameChannel({ channelId: id, channelName: name }));
  });

  socket.on(actions.newMessage, (data) => {
    store.dispatch(addMessage({ messageData: data }));
  });

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ApiContext.Provider value={api}>
          <App />
        </ApiContext.Provider>
      </I18nextProvider>
    </Provider>
  );
};
