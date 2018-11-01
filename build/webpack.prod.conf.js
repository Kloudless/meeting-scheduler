'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const variables = require('../config/variables');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
  entry: {
    'kloudless-meeting-scheduler': './src/MeetingScheduler.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    library: 'Kloudless',
    libraryTarget: 'umd',
    libraryExport: 'Kloudless',
    umdNamedDefine: true,
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true,
      minimize: false,
    })
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin(
      Object.assign({
        'process.env': require('../config/prod.env'),
      }, variables),
    ),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('[name].css'),
      // set the following option to `true` if you want to extract CSS from
      // codesplit chunks into this main css file as well.
      // This will result in *all* of your app's CSS being loaded upfront.
      allChunks: false,
    }),
  ]
});


// TODO: copy the config and make a version to generate minified js/css
// need a better way to handle it when we upgrade webpack / clean configs
const minBuildWebpackConfig = Object.assign({}, webpackConfig)
minBuildWebpackConfig.entry = Object.assign({}, minBuildWebpackConfig.entry);
minBuildWebpackConfig.entry['kloudless-meeting-scheduler.min'] =
minBuildWebpackConfig.entry['kloudless-meeting-scheduler'];
delete minBuildWebpackConfig.entry['kloudless-meeting-scheduler'];

// minimize js
minBuildWebpackConfig.plugins = minBuildWebpackConfig.plugins.concat([]);
minBuildWebpackConfig.plugins.unshift(
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    parallel: true,
  }),
);

minBuildWebpackConfig.plugins.unshift(
  new OptimizeCSSPlugin({
    cssProcessorOptions: config.build.productionSourceMap
      ? { safe: true, map: { inline: false } }
      : { safe: true }
  }),
);


module.exports = [webpackConfig, minBuildWebpackConfig];
