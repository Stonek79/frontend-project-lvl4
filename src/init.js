import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { io } from "socket.io-client";

import App from './components/App.jsx';
import rootReducer, { addChannel, removeChannel, renameChannel, addMessage } from './reducers';

export default (gon) => {
  
  const middleware = getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
    thunk: true,
  });

  const preloadedState = {
    chat: gon,
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

  socket.on('removeChannel', ({ data: { id } }) => {
    store.dispatch(removeChannel({ channelId: id }));
  });

  socket.on('renameChannel', ({ data: { id, attributes } }) => {
    store.dispatch(renameChannel({ id, attributes }));
  });

  socket.on('newMessage', ({ data }) => {
    store.dispatch(addMessage(data.attributes));
  });

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('chat'),
  );
};