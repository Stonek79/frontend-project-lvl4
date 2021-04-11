// @ts-check

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { render } from 'react-dom';
import { io } from 'socket.io-client';
import gon from 'gon';
import run from './init';
import '../assets/application.scss';
import './i18n';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const url = window.location.origin;
const socket = io(url);

const element = document.getElementById('chat');
const virtualDom = run(gon, socket);

render(virtualDom, element);
