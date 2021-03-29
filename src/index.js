// @ts-check

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { render } from 'react-dom';
import { io } from 'socket.io-client';
import gon from 'gon';
import run from './init';
import '../assets/application.scss';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const { host } = window.location;
const socket = io(host);

render(
  run(gon, socket),
  document.getElementById('chat'),
);
