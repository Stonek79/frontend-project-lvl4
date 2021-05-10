/* eslint-disable no-new */
// @ts-check

import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
import Rollbar from 'rollbar';

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';
import init from './init.jsx';

const start = async () => {
  new Rollbar({
    accessToken: process.env.ROLLBAR_KEY,
    captureUncaught: true,
    captureUnhandledRejections: true,
    enabled: process.env.NODE_ENV === 'production',
  });

  if (process.env.NODE_ENV !== 'production') {
    localStorage.debug = 'chat:*';
  }

  const url = window.location.origin;
  const socket = io(url);

  const virtualDom = await init(socket);

  const element = document.getElementById('chat');

  ReactDOM.render(virtualDom, element);
};

start();
