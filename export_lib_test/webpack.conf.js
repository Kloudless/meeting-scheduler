'use strict'
const webpack = require('webpack')
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './main.js'
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: [
      'node_modules'
    ]
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader'
        }
      ]
    }]
  },
  devServer: {
    compress: true
  },
  devtool: "eval-source-map",
  plugins: [
    new webpack.DefinePlugin({
      'KLOUDLESS_APP_ID': JSON.stringify(process.env.KLOUDLESS_APP_ID),
      'KLOUDLESS_API_KEY': JSON.stringify(process.env.KLOUDLESS_API_KEY)
    })
  ]
}
