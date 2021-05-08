/* eslint-disable no-new */
// @ts-check

import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
import Rollbar from 'rollbar';

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';
import run from './init.jsx';

const start = async () => {
  new Rollbar({
    accessToken: '7722b0d8cbea4e2192181105f50b92b4',
    captureUncaught: true,
    captureUnhandledRejections: true,
    enabled: process.env.NODE_ENV === 'production',
  });

  if (process.env.NODE_ENV !== 'production') {
    localStorage.debug = 'chat:*';
  }

  const url = window.location.origin;
  const socket = io(url);

  const virtualDom = await run(socket);
  const element = document.getElementById('chat');
  console.log(virtualDom, 'virtualDom');
  console.log(element, 'element');

  ReactDOM.render(virtualDom, element);
};

start();
