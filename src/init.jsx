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
import { addMessage } from './slices/messageSlice.js';
import { addChannel, removeChannel, renameChannel } from './slices/channelSlice.js';

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
        missedMessages.forEach((m) => store.dispatch(addMessage({ messageData: m })));
      })
      .catch((e) => console.log(e, 'socketConnect'));
  });

  socket.on('newChannel', ({ data }) => {
    const { attributes } = data;
    store.dispatch(addChannel({ channelData: attributes }));
  });

  socket.on('removeChannel', ({ data }) => {
    store.dispatch(removeChannel({ channelId: data.id }));
  });

  socket.on('renameChannel', ({ data }) => {
    const { id, attributes } = data;
    const { name } = attributes;
    store.dispatch(renameChannel({ channelId: id, channelName: name }));
  });

  socket.on('newMessage', ({ data }) => {
    const { attributes } = data;
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
