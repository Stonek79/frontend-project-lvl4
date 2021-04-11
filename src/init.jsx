import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import Cookies from 'js-cookie';
import faker from 'faker';
import axios from 'axios';
import differenceBy from 'lodash/differenceBy';
import App from './components/App.jsx';
import rootReducer from './slices/index.js';
import {
  addChannel, removeChannel, renameChannel,
} from './slices/channelSlice';
import { addMessage } from './slices/messageSlice';
import Context from './Context.jsx';
import routes from './routes.js';

export default (props, socket) => {
  if (!Cookies.get('username')) {
    Cookies.set('username', faker.name.findName());
  }
  const user = Cookies.get('username');
  const contextValues = {
    user,
  };

  const { channels, messages, currentChannelId } = props;
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

  socket.on('connect', async () => {
    console.log(socket.connected, store.getState(), 'reconnect');
    const currentId = store.getState().channels.currentChannelId;
    const currentMessages = store.getState().messages.messages
      .filter((m) => m.channelId === currentId);
    const req = await axios.get(routes.channelMessagesPath(currentId));
    const newMessages = differenceBy(currentMessages, req.data.data.map((m) => m.attributes), 'id');
    newMessages.forEach((m) => store.dispatch(addMessage({ messageData: m.attributes })));
    console.log(store.getState(), newMessages, 'stor');
  });

  socket.on('connect', () => {
    console.log(socket.connected, 'connect');
  });

  socket.on('newChannel', ({ data: { attributes } }) => {
    store.dispatch(addChannel({ channelData: attributes }));
  });

  socket.on('removeChannel', ({ data: { id } }) => {
    store.dispatch(removeChannel({ channelId: id }));
  });

  socket.on('renameChannel', ({ data }) => {
    const { id, attributes } = data;
    const { name } = attributes;
    store.dispatch(renameChannel({ channelId: id, channelName: name }));
  });

  socket.on('newMessage', ({ data: { attributes } }) => {
    store.dispatch(addMessage({ messageData: attributes }));
  });

  return (
    <Provider store={store}>
      <Context.Provider value={contextValues}>
        <App />
      </Context.Provider>
    </Provider>
  );
};
