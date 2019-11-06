const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseConfig = require('./webpack.base.conf.js');
const merge = require('./merge-strategy');

const distPath = path.resolve(__dirname, '../dist/');
const scripts = {
  loader: [path.resolve(__dirname, '../src/loader.js')],
  embed: [path.resolve(__dirname, '../src/embed/index.js')],
};

const loaderOutputConfig = {
  path: distPath,
  filename: '[name].js',
  publicPath: './',
  library: ['Kloudless', 'scheduler'],
  libraryTarget: 'umd',
  libraryExport: 'default',
};

const prodConfig = merge(baseConfig, {
  mode: 'production',
  optimization: {
    minimize: false,
  },
});

const prodMinifiedConfig = merge(prodConfig, {
  optimization: {
    minimize: true,
  },
});

const builds = [
  // loader
  merge(prodConfig, {
    entry: {
      'meeting-scheduler': scripts.loader,
    },
    output: loaderOutputConfig,
  }),
  // loader, minimized
  merge(prodMinifiedConfig, {
    entry: {
      'meeting-scheduler.min': scripts.loader,
    },
    plugins: [
      // output the test page to dist/test/ for `npm run dist-test` command
      new HtmlWebpackPlugin({
        filename: '../test/dist/index.html',
        template: path.resolve(__dirname, '../dev-server/index.ejs'),
        templateParameters: {
          distTest: true,
        },
        // chunks need to be manually inserted in ejs template for dist-test
        chunks: [],
      }),
    ],
    output: loaderOutputConfig,
  }),
  // embed page, minimized
  merge(prodMinifiedConfig, {
    module: {
      rules: [
        {
          test: path.resolve(__dirname, '../node_modules/@vue/devtools'),
          use: 'null-loader',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, '../src/embed/index.html'),
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
      }),
    ],
    entry: {
      index: scripts.embed,
    },
    output: {
      path: path.resolve(distPath, './scheduler'),
      filename: '[name].js',
      publicPath: './',
    },
  }),
  // test_launch.js for dist-test
  merge(prodMinifiedConfig, {
    entry: {
      test_launch: path.resolve(__dirname, '../dev-server/test_launch.js'),
    },
    output: {
      path: path.resolve(distPath, '../test/dist/'),
      filename: '[name].js',
      publicPath: './',
    },
  }),
];

module.exports = builds;
