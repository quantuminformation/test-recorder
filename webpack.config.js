var path = require("path");
var webpack = require("webpack");
var WebpackBuildNotifierPlugin = require("webpack-build-notifier");

const PATHS = {
  src: path.join(__dirname, './src'),
  build: path.join(__dirname, './build')
};

module.exports = {

  entry: {
    "test-recorder": PATHS.src
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
    library: 'TestRecorder',
    libraryTarget: 'umd',
    umdNamedDefine: true
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
    ]

  },
  resolve: {
    // you can now require('file') instead of require('file.js')
    extensions: ['.ts', '.js']
  },
  plugins: [
    new WebpackBuildNotifierPlugin({
      title: "My Project Webpack Build"
    })
  ]
};
