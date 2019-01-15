const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const generateConfig = require('./webpack.base.conf.js');

const distPath = path.resolve(__dirname, '../dist/');
const scriptPath = path.resolve(__dirname, '../src/MeetingScheduler.js');


const prodConfig = {
  mode: 'production',
  entry: {
    'meeting-scheduler': [scriptPath],
  },
  output: {
    path: distPath,
    filename: '[name].js',
    publicPath: './',
    library: ['Kloudless', 'scheduler'],
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  optimization: {
    minimize: false,
  },
};

const minProdConfig = Object.assign({}, prodConfig, {
  entry: {
    'meeting-scheduler.min': [scriptPath],
  },
  optimization: {
    minimize: true,
  },
});

module.exports = [generateConfig(prodConfig), generateConfig(minProdConfig)];
