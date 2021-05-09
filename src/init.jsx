/* eslint-disable react/destructuring-assignment */
import React from 'react';
// import axios from 'axios';
import { configureStore } from '@reduxjs/toolkit';
// import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import App from './components/App.jsx';
import AppContext from './context/AppContext.jsx';
import rootReducer from './slices/index.js';
// import routes from './routes';
import { addMessage } from './slices/messageSlice.js';
import {
  addChannel, removeChannel, renameChannel, updateChannels,
} from './slices/channelSlice.js';
// import i18next from './i18n.js';
import './i18n.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return {
      username: userId.username,
      authorization: { Authorization: `Bearer ${userId.token}` },
    };
  }

  return {};
};

console.log('init module');
// const i18n = i18next.createInstance();

const Init = async (socket) => {
  console.log('init 1');

  const store = configureStore({
    reducer: rootReducer,
  });

  console.log('init 2');

  // const i18n = await i18next;

  console.log('init 3');
  const updateCurrentStore = (data, id) => {
    const { channels, currentChannelId, messages } = data;
    const currentId = id ?? currentChannelId;
    store.dispatch(updateChannels({ channels, currentChannelId: currentId, messages }));
  };

  console.log(socket.on, 'socket');

  // socket.on('reconnect', async () => {
  //   const { authorization } = getAuthHeader();
  //   const { channels: { currentChannelId } } = store.getState();

  //   const { data } = await axios.get(routes.currentData(), { headers: authorization });

  //   try {
  //     updateCurrentStore(data, currentChannelId);
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // });

  console.log('init 4');
  socket.on('newChannel', (data) => {
    console.log('init in newChannel');
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

  console.log('init 5');
  const contextValues = {
    getAuthHeader,
    socket,
    updateCurrentStore,
  };

  console.log('init run');
  return (
    <Provider store={store}>
      <AppContext.Provider value={contextValues}>
        {/* <I18nextProvider i18n={i18n}> */}
          <App />
        {/* </I18nextProvider> */}
      </AppContext.Provider>
    </Provider>
  );
};

export default Init;
