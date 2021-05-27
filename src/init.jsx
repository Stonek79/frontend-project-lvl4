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
  addChannel, removeChannel, renameChannel, setCurrentChannelId,
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

  const reconnect = (func) => {
    func();
    socket.on('connect', () => {
      socket.sendBuffer = [];
      if (socket.connected) {
        const id = store.getState().channels.currentChannelId;
        const setChannelId = () => store.dispatch(setCurrentChannelId({ id }));
        func(setChannelId);
      }
    });
  };

  // const socketConnectionHandler = (action, data, func) => {
  //   if (!socket.connected) {
  //     throw new Error('errors.netError');
  //   }
  //   socket.volatile.emit(action, data, func);
  // };

  const socketHandler = (action, data) => new Promise((res, rej) => {
    const timer = setTimeout(() => rej(Error('errors.netError')), 3000);
    socket.volatile.emit(action, data, (r) => {
      if (r.status === 'ok') {
        clearTimeout(timer);
        res(r);
      }
    });
  });

  const api = {
    sendMessage: (arg) => socketHandler(actions.newMessage, arg),
    addChannel: (arg) => socketHandler(actions.newChannel, arg),
    renameChannel: (arg) => socketHandler(actions.renameChannel, arg),
    removeChannel: (arg) => socketHandler(actions.removeChannel, arg),
    reconnectSocket: (func) => reconnect(func),
  };

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
