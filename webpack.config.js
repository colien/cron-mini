var path = require("path");

module.exports = {
  entry: "./src/cronActuator.js",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "./cron-mini.min.js",
    library: "CronMini",
    libraryTarget: "umd",
    globalObject: "self",
  },
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-object-assign"],
          },
        },
      },
    ],
  },
  plugins: [],
};