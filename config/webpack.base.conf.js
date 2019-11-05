const path = require('path');

const nodeModulePath = path.resolve(__dirname, '../node_modules/');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./common');

const isDevelopment = process.env.NODE_ENV === 'development';

const styleLoaders = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      hmr: isDevelopment,
    },
  },
  'css-loader',
  { loader: 'postcss-loader' },
];

module.exports = {
  resolve: {
    extensions: ['.vue', '.js'],
    modules: common.resolvePaths,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: [
          nodeModulePath,
        ],
        loader: 'eslint-loader',
        options: {
          /* eslint-disable-next-line */
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true, // emitError: true in prod
        },
      },
      {
        test: /\.js$/,
        use: [
          'babel-loader',
        ],
      },
      // place .vue rule just for VueLoader plugin to work
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader',
      },
      {
        test: /\.css$/,
        use: styleLoaders.slice(),
      },
      // Vuetify components import styl files for component styles
      {
        test: /\.styl$/,
        use: styleLoaders.concat(['stylus-loader']),
      },
      {
        test: /\.less$/,
        use: styleLoaders.concat(['less-loader']),
      },
      {
        test: /\.png$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
      {
        test: /\.woff$/,
        loader: 'url-loader',
        options: {
          limit: 75 * 1024,
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  devtool: '#source-map',
  optimization: {
    noEmitOnErrors: true,
  },
  performance: {
    maxEntrypointSize: 10 * 1024 * 1024,
    maxAssetSize: 10 * 1024 * 1024,
  },
};
