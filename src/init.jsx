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
import { actions } from './constants.js';
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

  const startReconnect = (f) => {
    socket.connect();
    setTimeout(() => {
      if (socket.connected) {
        const id = store.getState().channels.currentChannelId;
        const setChannelId = () => store.dispatch(setCurrentChannelId({ id }));
        console.log(socket.connected, id, 'connect');
        return f(setChannelId);
      }
      return startReconnect(f);
    }, 3000);
  };

  const reconnect = (func) => {
    socket.on('connect_error', () => {
      console.log(socket.disconnected, 'disconnect');
      return startReconnect(func);
    });
  };

  const socketConnectionHandler = (action, data, func) => {
    if (!socket.connected) {
      throw new Error('errors.netError');
    }
    socket.emit(action, data, func);
  };

  const api = {
    sendMessage: (arg, func) => socketConnectionHandler(actions.newMessage, arg, func),
    addChannel: (arg, func) => socketConnectionHandler(actions.newChannel, arg, func),
    renameChannel: (arg, func) => socketConnectionHandler(actions.renameChannel, arg, func),
    removeChannel: (arg, func) => socketConnectionHandler(actions.removeChannel, arg, func),
    reconnectSocket: (id, func) => reconnect(id, func),
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
