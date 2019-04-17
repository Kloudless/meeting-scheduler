const FriendlyErrorWebpackPlugin = require('friendly-errors-webpack-plugin');

const webpack = require('webpack');
const path = require('path');

const generateConfig = require('./webpack.base.conf.js');

const devServerContentPath = path.resolve(__dirname, '../dev-server/');

const devWebpackConfig = generateConfig({
  mode: 'development',
  entry: {
    index: [path.resolve(devServerContentPath, 'index.js')],
    'embed/index': [path.resolve(devServerContentPath, 'embed/index.js')],
  },
  output: {
    path: devServerContentPath,
    filename: '[name].js',
    publicPath: './',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
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
