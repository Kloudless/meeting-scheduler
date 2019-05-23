const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');
const path = require('path');

const generateConfig = require('./webpack.base.conf.js');

const devServerContentPath = path.resolve(__dirname, '../dev-server/');

const devWebpackConfig = generateConfig({
  mode: 'development',
  entry: {
    index: [
      'webpack-hot-middleware/client?reload=true&quiet=true',
      path.resolve(devServerContentPath, 'index.js'),
    ],
    // build this embed page from src but hosted it on dev-server/embed
    'embed/index': [
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
      filename: 'embed/index.html',
      template: path.resolve(__dirname, '../src/embed/index.html'),
      chunks: ['embed/index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(devServerContentPath, 'index.ejs'),
      templateParameters: {
        distTest: false,
      },
      chunks: ['index'],
    }),
  ],
});

module.exports = devWebpackConfig;
