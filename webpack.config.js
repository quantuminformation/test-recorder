const path = require("path")
const merge = require("webpack-merge")
const webpack = require("webpack")
var WebpackBuildNotifierPlugin = require("webpack-build-notifier")

const PATHS = {
  src: path.join(__dirname, "./src"),
  build: path.join(__dirname, "./chrome-extension")
}

module.exports = {
  entry: {
    "test-recorder": PATHS.src
  },
  mode: 'development',

  output: {
    path: PATHS.build,
    filename: "[name].js",
    library: "TestRecorder",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "awesome-typescript-loader"
          }
        ]
      },
      {
        test: /\.p?css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              url: false
            }
          },
          {
            loader: "postcss-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    // you can now require('file') instead of require('file.js')
    extensions: [".ts", ".js", ".pcss"]
  },

  plugins: [
    new WebpackBuildNotifierPlugin({
      title: "My Project Webpack Build"
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require("./package.json").version)
    })
  ]
}
