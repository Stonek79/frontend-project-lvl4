// @ts-check

import { render } from 'react-dom';

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';
import socket from './socket.js';
import run from './init.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

console.log(socket, 'index');

const element = document.getElementById('chat');
const virtualDom = run(socket);

render(virtualDom, element);
