/* eslint-disable react/destructuring-assignment */
import React from 'react';
// import axios from 'axios';
import { configureStore } from '@reduxjs/toolkit';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import i18next from 'i18next';

import App from './components/App.jsx';
import ApiContext from './context/ApiContext.jsx';
import resources from './resources/index.js';
import rootReducer from './slices/index.js';

// import routes from './routes';
import { addMessage } from './slices/messageSlice.js';
import {
  addChannel, removeChannel, renameChannel,
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

  const api = {
    sendMessage: ({
      message, resetForm, setErrors, setSubmitting,
    }) => {
      if (socket.connected === false) {
        setErrors({ message: i18n.t('errors.netError') });
        return setSubmitting(false);
      }
      return socket.emit('newMessage', message, (r) => {
        if (r.status === 'ok') {
          resetForm();
        }
      });
    },
    addChannel: ({
      close, name, setErrors, setSubmitting,
    }) => {
      if (socket.connected === false) {
        setErrors({ channelName: i18n.t('errors.netError') });
        return setSubmitting(false);
      }
      return socket.emit('newChannel', { name }, (r) => {
        if (r.status === 'ok') {
          close();
        }
      });
    },
    renameChannel: ({
      id, close, name, setErrors, setSubmitting,
    }) => {
      if (socket.connected === false) {
        setErrors({ channelName: i18n.t('errors.netError') });
        return setSubmitting(false);
      }
      return socket.emit('renameChannel', { id, name }, (r) => {
        if (r.status === 'ok') {
          close();
        }
      });
    },
    removeChannel: ({
      close, id, setErrors, setSubmitting,
    }) => {
      if (socket.connected === false) {
        setErrors({ channelInfo: i18n.t('errors.netError') });
        return setSubmitting(false);
      }
      return socket.emit('removeChannel', { id }, (r) => {
        if (r.status === 'ok') {
          close();
        }
      });
    },
    reconnect: (func) => {
      socket.on('connect', () => {
        console.log(socket.connected, 'reconnect');
        return func;
      });
    },
  };

  // socket.on('reconnect', async () => { // не работает, поменять на socket.io.on
  //   const { authorization } = getAuthHeader();
  //   const { channels: { currentChannelId } } = store.getState();

  //   try {
  //     const { data } = await axios.get(routes.currentData(), { headers: authorization });
  //     updateCurrentStore(data, currentChannelId);
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // });

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
      <I18nextProvider i18n={i18n}>
        <ApiContext.Provider value={api}>
          <App />
        </ApiContext.Provider>
      </I18nextProvider>
    </Provider>
  );
};
