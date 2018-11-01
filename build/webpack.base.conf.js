'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf');

function resolveFromRoot (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolveFromRoot('src'),
    },
    modules: [
      'src', 'node_modules'
    ]
  },
  module: {
    rules: [
      ...(config.dev.useEslint? [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolveFromRoot('src'), resolveFromRoot('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: !config.dev.showEslintErrorsInOverlay
        }
      }] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolveFromRoot('src'), resolveFromRoot('test')],
      },
      {
        test: /kloudless-authenticator\/src\/auth-widget.js$/,
        use: [
          'babel-loader',
          path.resolve(__dirname, './auth-widget-remove-polyfill-loader.js'),
        ]
      },
      // vue component folders.
      {
        test: /index\.js$/,
        include: [path.resolve(__dirname, '../src/components')],
        use: [
          {
            loader: 'vue-loader',
            options: vueLoaderConfig
          },
          path.resolve(__dirname, './vuize-loader.js'),
          'babel-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 60 * 1024,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      }
    ]
  },
}
