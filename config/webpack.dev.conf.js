const FriendlyErrorWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');
const path = require('path');

const generateConfig = require('./webpack.base.conf.js');

const devServerContentPath = path.resolve(__dirname, '../dev-server/');

const devWebpackConfig = generateConfig({
  mode: 'development',
  entry: {
    app: [path.resolve(devServerContentPath, 'index.js')],
  },
  output: {
    path: devServerContentPath,
    filename: '[name].js',
    publicPath: './',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(devServerContentPath, 'index.html'),
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
