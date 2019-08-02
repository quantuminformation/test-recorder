var path = require("path");
var webpack = require("webpack");
var WebpackBuildNotifierPlugin = require("webpack-build-notifier");
var HtmlWebpackPlugin = require("html-webpack-plugin");


const PATHS = {
  src: path.join(__dirname, './src'),
  build: path.join(__dirname, './dist')
};

module.exports = {

  entry: {
    "app": PATHS.src + '/index.ts'
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'awesome-typescript-loader'

        }]
      },
      {
        test: /\.p?css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1, url: false
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      }
    ]  },
  resolve: {
    // you can now require('file') instead of require('file.js')
    extensions: ['.ts', '.js','.pcss']
  },
  plugins: [
    new WebpackBuildNotifierPlugin({
      title: "My Project Webpack Build"
    }),
    new HtmlWebpackPlugin({
      title: 'Webpack boilerplate',
      hash: true,
      filename: 'index.html',
      template: 'index.html'
    })
  ]
};
