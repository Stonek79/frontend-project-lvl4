// @ts-check

import { render } from 'react-dom';
import { io } from 'socket.io-client';

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';
import run from './init.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const url = window.location.origin;
const socket = io(url);

const element = document.getElementById('chat');
const virtualDom = run({ socket });

render(virtualDom, element);
