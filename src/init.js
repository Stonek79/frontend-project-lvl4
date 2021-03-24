import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { io } from "socket.io-client";
import Cookies from 'js-cookie';
import App from './components/App.jsx';
import rootReducer, { addChannel, removeChannel, renameChannel, addMessage } from './reducers';
import UserNameContext from './UserNameContext.js';
const faker = require('faker');

if (!Cookies.get('username')) {
  Cookies.set('username', faker.name.findName());
}

const user = Cookies.get('username');

export default ({ channels, messages, currentChannelId }) => {
  if (process.env.NODE_ENV !== 'production') {
    localStorage.debug = 'chat:*';
  }

  const middleware = getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
    thunk: true,
  });

  const preloadedState = {
    chat: {
      channels,
      currentChannelId,
    },
    message: {
      messages,
    },
  };

  const store = configureStore({
    reducer: rootReducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState,
  });

  const socket = io();

  socket.on('newChannel', ({ data }) => {
    store.dispatch(addChannel(data.attributes));
  });

  socket.on('removeChannel', ({ data }) => {
    store.dispatch(removeChannel(data.id));
  });

  socket.on('renameChannel', ({ data: { id, attributes } }) => {
    store.dispatch(renameChannel({ id, attributes }));
  });

  socket.on('newMessage', ({ data }) => {
    store.dispatch(addMessage(data.attributes));
  });

  render(
    <Provider store={store}>
      <UserNameContext.Provider value={user}>
        <App />
      </UserNameContext.Provider>
    </Provider>,
    document.getElementById('chat'),
  );
};