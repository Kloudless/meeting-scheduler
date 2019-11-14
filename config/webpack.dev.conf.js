const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const baseConfig = require('./webpack.base.conf.js');
const merge = require('./merge-strategy');

const devServerContentPath = path.resolve(__dirname, '../dev-server/');

const devWebpackConfig = merge(baseConfig, {
  mode: 'development',
  entry: {
    index: [
      'webpack-hot-middleware/client?reload=true&quiet=true',
      path.resolve(devServerContentPath, 'index.js'),
    ],
    // build this embed page from src but hosted it on dev-server/scheduler
    'scheduler/index': [
      'webpack-hot-middleware/client?reload=true&quiet=true',
      path.resolve(__dirname, '../src/embed/index.js'),
    ],
  },
  output: {
    path: devServerContentPath,
    filename: '[name].js',
    // must be '/' here for HtmlWebpackPlugin to inject correct resource path
    // https://github.com/jantimon/html-webpack-plugin/issues/1009
    publicPath: '/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'scheduler/index.html',
      template: path.resolve(__dirname, '../src/embed/index.html'),
      chunks: ['scheduler/index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(devServerContentPath, 'index.ejs'),
      templateParameters: {
        distTest: false,
      },
      chunks: ['index'],
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(devServerContentPath, '_index.less'),
        to: path.resolve(devServerContentPath, 'scheduler/index.less'),
      },
    ]),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../node_modules/less/dist/less.js'),
        to: path.resolve(devServerContentPath, 'scheduler/less.js'),
      },
    ]),
  ],
});

module.exports = devWebpackConfig;
