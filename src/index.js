// @ts-check

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import run from './init';
import '../assets/application.scss';

import gon from 'gon';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

run(gon);