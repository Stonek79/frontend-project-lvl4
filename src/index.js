// @ts-check

import { render } from 'react-dom';
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import './i18n.js';

import '../assets/application.scss';
import run from './init.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const element = document.getElementById('chat');
const virtualDom = run();

render(virtualDom, element);
