// @ts-check

import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';
import run from './init.jsx';

const start = async () => {
  const env = process.env.NODE_ENV;
  if (env !== 'production') {
    localStorage.debug = 'chat:*';
  }

  const socket = io();

  const virtualDom = await run(socket);
  const element = document.getElementById('chat');

  const { render } = ReactDOM;
  render(virtualDom, element);
};

start();
