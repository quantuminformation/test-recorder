module.exports = {
  context: __dirname + "/lib",
  entry: {
    main: [
      __dirname + '/node_modules/babel-core/browser-polyfill.js',
      "./main.js",
    ]
  },
  output: {
    path: __dirname + "/dist",
    filename: "emberTestRecorder.js"
  },
  devtool: "#source-map",
  module: {
    noParse: [
      /\/babel-core\/browser-polyfill\.js$/
    ],
    loaders: [
      // Transpile any JavaScript file:
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      { test: /\.css$/, loader: "style-loader!css-loader" }

    ]
  },
  resolve: {
    // you can now require('file') instead of require('file.js')
    extensions: ['', '.js', '.json']
  }
}
