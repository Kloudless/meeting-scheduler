const FriendlyErrorWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');
const path = require('path');

const generateConfig = require('./webpack.base.conf.js');

const devServerContentPath = path.resolve(__dirname, '../dev-server/');

const devWebpackConfig = generateConfig({
  mode: 'development',
  entry: {
    index: [path.resolve(devServerContentPath, 'index.js')],
    // build this embed page from src but hosted it on dev-server/embed
    'embed/index': [path.resolve(__dirname, '../src/embed/index.js')],
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
    new FriendlyErrorWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['Your application is running here: http://localhost:8080'],
      },
    }),
  ],
});

devWebpackConfig.devServer = {
  hot: true,
  inline: true,
  clientLogLevel: 'none', // prevent HMR messages spamming browser console
  compress: true,
  overlay: {
    warnings: false,
    errors: true,
  },
  contentBase: devServerContentPath,
  publicPath: '/',
  port: 8080,
  quiet: true, // necessary for FriendlyErrorsPlugin
};

module.exports = devWebpackConfig;
