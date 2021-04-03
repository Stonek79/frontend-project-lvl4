import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import Cookies from 'js-cookie';
import faker from 'faker';
import App from './components/App.jsx';
import rootReducer from './slices/index.js';
import { addChannel, removeChannel, renameChannel } from './slices/channelsSlice';
import { addMessage } from './slices/messagesSlice';
import Context from './Context.js';

export default ({ channels, messages, currentChannelId }, socket) => {
  if (!Cookies.get('username')) {
    Cookies.set('username', faker.name.findName());
  }

  const user = Cookies.get('username');
  const values = {
    user,
  };

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
    store.dispatch(addChannel({ attributes }));
  });

  socket.on('removeChannel', ({ data: { id } }) => {
    store.dispatch(removeChannel({ id }));
  });

  socket.on('renameChannel', ({ data: { id, attributes: { name } } }) => {
    store.dispatch(renameChannel({ id, name }));
  });

  socket.on('newMessage', ({ data: { attributes } }) => {
    store.dispatch(addMessage({ attributes }));
  });

  return (
    <Provider store={store}>
      <Context.Provider value={values}>
        <App />
      </Context.Provider>
    </Provider>
  );
};
