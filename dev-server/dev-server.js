/* eslint-disable no-console */
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackDevConfig = require('../config/webpack.dev.conf');
const lessBuilder = require('../config/less-builder');

const app = express();
const compiler = webpack(webpackDevConfig);

console.log('Starting Dev server...');
(async function main() {
  // // bind webpack and hot reload
  const middleware = webpackDevMiddleware(compiler, {
    logTime: true,
    stats: 'minimal',
    publicPath: webpackDevConfig.output.publicPath,
  });
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler, {
    log: false, path: '/__webpack_hmr', heartbeat: 10 * 1000,
  }));

  // start server
  lessBuilder.watch(path.resolve(__dirname, './_index.less'));
  // listen to 8081 for view page, this way loader and view will be on
  // different domain.
  app.listen(8081);
  app.listen(8080, () => {
    console.log('Dev server running on http://localhost:8080');
    console.log('Webpack bundles are compiling...');
  });
}());
