const path = require('path');
const webpack = require('webpack');


const loadersPath = path.resolve(__dirname, 'loaders');
const srcPath = path.resolve(__dirname, '../src/');
const testPath = path.resolve(__dirname, '../test/');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostCssDiscardFontFace = require('postcss-discard-font-face');
const CssNano = require('cssnano');
const AutoPrefixer = require('autoprefixer');

function generateConfig(env = {}) {
  const devMode = env.mode === 'development';

  const cssMinifier = (env.optimization && env.optimization.minimize)
    ? [CssNano()] : [];

  const styleLoaders = [
    devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => [
          PostCssDiscardFontFace(['woff']),
          AutoPrefixer(),
        ].concat(cssMinifier),
      },
    },
  ];

  return {
    mode: env.mode,
    entry: env.entry,
    resolve: {
      extensions: ['.js'],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
      },
      modules: [srcPath, path.resolve(__dirname, '../node_modules/')],
    },
    output: env.output,
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          include: [srcPath, testPath],
          loader: 'eslint-loader',
          options: {
            /* eslint-disable-next-line */
            formatter: require('eslint-friendly-formatter'),
            emitWarning: true, // emitError: true in prod
          },
        },
        {
          test: /kloudless-authenticator\/src\/auth-widget.js$/,
          use: [
            'babel-loader',
            path.resolve(loadersPath, 'auth-widget-remove-polyfill-loader.js'),
          ],
        },
        {
          test: /\.js$/,
          include: [srcPath, testPath],
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
          test: /index\.js$/,
          include: [path.resolve(srcPath, 'components')],
          use: [
            'vue-loader',
            path.resolve(loadersPath, 'vuize-loader.js'),
            'babel-loader',
          ],
        },
        {
          test: /\.pug$/,
          loader: 'pug-plain-loader',
        },
        {
          test: /\.css$/,
          use: styleLoaders,
        },
        {
          test: /\.scss$/,
          loader: styleLoaders.concat(['sass-loader']),
        },
        {
          test: /\.(png|jpe?g|gif)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 75 * 1024,
          },
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: `"${env.mode}"`,
        },
        KLOUDLESS_APP_ID: JSON.stringify(process.env.KLOUDLESS_APP_ID),
        BASE_URL: JSON.stringify(
          process.env.BASE_URL || 'https://api.kloudless.com',
        ),
        // used in authenticator js
        DEBUG: 'false',
      }),
    ].concat(env.plugins),
    devtool: '#source-map',
    optimization: Object.assign({
      noEmitOnErrors: true,
    }, env.optimization),
    performance: {
      maxEntrypointSize: 10 * 1024 * 1024,
      maxAssetSize: 10 * 1024 * 1024,
    },
  };
}

module.exports = generateConfig;
