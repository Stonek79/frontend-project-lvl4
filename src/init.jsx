import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import Cookies from 'js-cookie';
import faker from 'faker';
import App from './components/App.jsx';
import rootReducer from './slices/index.js';
import { addChannel, removeChannel, renameChannel } from './slices/channelSlice';
import { addMessage } from './slices/messageSlice';
import UserNameContext from './UserNameContext.js';

if (!Cookies.get('username')) {
  Cookies.set('username', faker.name.findName());
}

export default ({ channels, messages, currentChannelId }, socket) => {
  const user = Cookies.get('username');

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
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState,
  });

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

  return (
    <Provider store={store}>
      <UserNameContext.Provider value={user}>
        <App />
      </UserNameContext.Provider>
    </Provider>
  );
};
