import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import Cookies from 'js-cookie';
import faker from 'faker';
import axios from 'axios';
import differenceBy from 'lodash/differenceBy';
import App from './components/App.jsx';
import rootReducer from './slices/index.js';
import Context from './Context.jsx';
import routes from './routes.js';
import {
  fetchAddMessage,
  fetchCreateChannel,
  fetchRemoveChannel,
  fetchRenameChannel,
} from './slices/services.jsx';

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
      loading: 'idle',
      error: null,
    },
    messages: {
      messages,
      loading: 'idle',
      error: null,
    },
  };

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  socket.io.on('reconnect', () => {
    const currentChenId = store.getState().channels.currentChannelId;
    const currentStateMessages = store.getState().messages.messages
      .filter((m) => m.channelId === currentChenId);

    axios.get(routes.channelMessagesPath(currentChenId))
      .then((req) => {
        const allChannwlMessages = req.data.data.map((m) => m.attributes);
        const missedMessages = differenceBy(allChannwlMessages, currentStateMessages, 'id');
        missedMessages.forEach((m) => store.dispatch(fetchAddMessage({ messageData: m })));
      })
      .catch((e) => console.log(e, 'socketConnect'));
  });

  socket.on('newChannel', ({ data: { attributes } }) => {
    store.dispatch(fetchCreateChannel({ channelData: attributes }));
  });

  socket.on('removeChannel', ({ data }) => {
    store.dispatch(fetchRemoveChannel({ channelId: data.id }));
  });

  socket.on('renameChannel', ({ data }) => {
    const { id, attributes } = data;
    const { name } = attributes;
    store.dispatch(fetchRenameChannel({ channelId: id, channelName: name }));
  });

  socket.on('newMessage', ({ data: { attributes } }) => {
    store.dispatch(fetchAddMessage({ messageData: attributes }));
  });

  return (
    <Provider store={store}>
      <Context.Provider value={contextValues}>
        <App />
      </Context.Provider>
    </Provider>
  );
};
