// @ts-check

import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';
import run from './init.jsx';

const env = process.env.NODE_ENV;
if (env !== 'production') {
  localStorage.debug = 'chat:*';
}

const socket = io();

const virtualDom = run({ socket });
const element = document.getElementById('chat');

const { render } = ReactDOM;
render(virtualDom, element);
