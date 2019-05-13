const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const generateConfig = require('./webpack.base.conf.js');

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

const prodBaseConfig = {
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  optimization: {
    minimize: false,
  },
};

const prodConfig = generateConfig(prodBaseConfig);

const minProdConfig = generateConfig(Object.assign({}, prodBaseConfig, {
  optimization: {
    minimize: true,
  },
}));

const builds = [
  // loader
  {
    ...prodConfig,
    entry: {
      'meeting-scheduler': scripts.loader,
    },
    output: loaderOutputConfig,
  },
  // loader, minimized
  {
    ...minProdConfig,
    entry: {
      'meeting-scheduler.min': scripts.loader,
    },
    plugins: minProdConfig.plugins.concat([
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
    ]),
    output: loaderOutputConfig,
  },
  // embed page, minimized
  {
    ...minProdConfig,
    module: {
      rules: [
        ...minProdConfig.module.rules,
        {
          test: path.resolve(__dirname, '../node_modules/@vue/devtools'),
          use: 'null-loader',
        },
      ],
    },
    plugins: minProdConfig.plugins.concat([
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
    ]),
    entry: {
      index: scripts.embed,
    },
    output: {
      path: path.resolve(distPath, './scheduler'),
      filename: '[name].js',
      publicPath: './',
    },
  },
];

module.exports = builds;
