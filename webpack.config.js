module.exports = {
  context: __dirname + "/lib",
  entry: "./main.js",
  output: {
    path: __dirname + "/dist",
    filename: "emberTestRecorder.js"
  },
  devtool: "#source-map",
  module: {
    loaders: [
      // Transpile any JavaScript file:
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  },
  resolve: {
    // you can now require('file') instead of require('file.js')
    extensions: ['', '.js', '.json']
  }
}
