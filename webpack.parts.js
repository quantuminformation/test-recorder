exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg)$/,
        include,
        exclude,

        use: {
          loader: 'file-loader',
          options,
        },
      },
    ],
  },
});


const BabiliPlugin = require('babili-webpack-plugin')

exports.minifyJavaScript = () => ({
  plugins: [
    new BabiliPlugin(),
  ],
});
