import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import ChatBox from './components/App.jsx';
import chatReducers from './reducers';


export default (gon) => {
    const { channels, messages, currentChannelId } = gon;

    const middleware = getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
      thunk: true,
    });

    const roorReducer = combineReducers({
      toolkit: chatReducers,
    });

    const preloadedState = {
      toolkit: {channels, messages, currentChannelId},
    };

    const store = configureStore({
      reducer: roorReducer,
      middleware,
      devTools: process.env.NODE_ENV !== 'production',
      preloadedState,
    });

    render(
      <Provider store={store}>
        <ChatBox />
        </Provider>,
      document.getElementById('chat'),
    );
};