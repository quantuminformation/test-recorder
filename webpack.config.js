const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
var WebpackBuildNotifierPlugin = require("webpack-build-notifier");

const parts = require('./webpack.parts');

const PATHS = {
  src: path.join(__dirname, './src'),
  build: path.join(__dirname, './chrome-extension')
};

const commonConfig = merge([
  {
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
      ],
    },
    resolve: {
      // you can now require('file') instead of require('file.js')
      extensions: ['.ts', '.js', '.pcss']
    },

    plugins: [
      new WebpackBuildNotifierPlugin({
        title: "My Project Webpack Build"
      }),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(require("./package.json").version),
      })
    ]
  },
]);


const productionConfig = merge([
  parts.loadImages({
    options: {
      name: '[name].[ext]',
    },
  }),
  parts.minifyJavaScript()
]);

const developmentConfig = merge([
  parts.loadImages(),

]);

module.exports = (env) => {
  console.log('env', env);

  if (env === 'production') {
    console.log('using prod config')
    return merge(commonConfig, productionConfig);
  }
  console.log('using dev')

  return merge(commonConfig, developmentConfig);
};
