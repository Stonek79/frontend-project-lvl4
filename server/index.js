// @ts-check

import 'regenerator-runtime/runtime';
import path from 'path';
import Pug from 'pug';
import socket from 'socket.io';
import fastify from 'fastify';
import pointOfView from 'point-of-view';
import fastifyStatic from 'fastify-static';
import addRoutes from './routes.js';

const isProduction = process.env.NODE_ENV === 'production';

const setUpViews = (app) => {
  const domain = isProduction ? '' : 'http://localhost:8080';
  app.register(pointOfView, {
    engine: {
      pug: Pug,
    },
    defaultContext: {
      assetPath: (filename) => `${domain}/assets/${filename}`,
    },
    templates: path.join(__dirname, 'views'),
  });
};

const setUpStaticAssets = (app) => {
  const pathPublic = isProduction
    ? path.join(__dirname, 'public')
    : path.join(__dirname, '..', 'dist', 'public');
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};


export const rollbar = new Rollbar({
  accessToken: '624e36580fb24db4a79e4d4185d3bb2b',
  captureUncaught: true,
  captureUnhandledRejections: true
});

import Rollbar from 'rollbar';

export default (options = {}) => {
  const app = fastify({ logger: true, prettyPrint: true });
try {
  setUpViews(app);
  setUpStaticAssets(app);

  const io = socket(app.server);

  addRoutes(app, io, options.state || {});

  return app;
} catch(e) {
  rollbar.error('The error is ', e);
}
};
