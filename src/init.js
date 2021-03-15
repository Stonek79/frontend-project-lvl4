import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import ChatBox from './components/App.jsx';
import { addChannel, addMessage, addChannelId } from './reducers';


export default (gon) => {
    const { channels, messages, currentChannelId } = gon;

    const middleware = getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
        thunk: true,
    });

    const reducer ={
        addChannel, addMessage, addChannelId,
    };

    const preloadedState = {
        addChannel: channels, addMessage: messages, addChannelId: currentChannelId,
    };

    const store = configureStore({
        reducer,
        middleware,
        devTools: process.env.NODE_ENV !== 'production',
        preloadedState,
    });

    render(
    <Provider store={store}>
        <ChatBox gon={gon} />
    </Provider>,
    document.getElementById('chat'),
    );
};