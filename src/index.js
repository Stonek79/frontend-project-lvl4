/* eslint-disable no-new */
// @ts-check

import ReactDOM from 'react-dom';
import Rollbar from 'rollbar';
import { io } from 'socket.io-client';

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';
import run from './init.jsx';

const start = async () => {
  const envy = process.env.NODE_ENV;

  new Rollbar({
    accessToken: process.env.ROLLBAR_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    enabled: envy === 'production',
  });

  if (envy !== 'production') {
    localStorage.debug = 'chat:*';
  }

  const url = window.location.origin;
  const socket = io(url);

  const virtualDom = await run(socket);
  const element = document.getElementById('chat');

  ReactDOM.render(virtualDom, element);
};

start();
