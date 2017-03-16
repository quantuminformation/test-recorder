var path = require("path");
var webpack = require("webpack");
var WebpackBuildNotifierPlugin = require("webpack-build-notifier");
var fontMagician = require('postcss-font-magician')

const PATHS = {
  src: path.join(__dirname, './src'),
  build: path.join(__dirname, './build')
};

module.exports = {

  entry: {
    "smart-terminal": PATHS.src + '/SmartTerminal.ts'
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
    library: 'SmartTerminal',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: "source-map",
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.p?css$/,
        loaders: [
          'style-loader',
          'css-loader?importLoaders=1,url=false',
          'postcss-loader'
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
