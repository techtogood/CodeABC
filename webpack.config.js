/**
 * 保留webpack的方式是为了dev时可以在不兼容es module的客户端调试
 */
const HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require("path");
var pathToPhaser = path.join(__dirname, "/node_modules/phaser/");
var phaser = path.join(pathToPhaser, "dist/phaser.js");
var webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

function getCleanWebpack() {
  return process.env.NODE_ENV === 'production' ? [new CleanWebpackPlugin()] : [];
}

module.exports = (env, argv) => ({
  entry: "./src/game.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[hash:7].js"
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: './loader/hackVite-loader.js', exclude: "/node_modules/" },
      { test: /\.ts$/, loader: "ts-loader", exclude: "/node_modules/" },
      { test: /phaser\.js$/, loader: "expose-loader?Phaser" },
      {
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          // dynamicTyping: true,
          // header: true,
          skipEmptyLines: true
        }
      },
      {
        test: /\.(jpg|png|gif|bmp|jpeg|mp3|wav|mp4|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // name: '[path][name].[ext]',
              limit: 0,
              outputPath: './static/',
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.json$/,
        type: 'javascript/auto',
        use: [
          {
            loader: 'file-loader',
            options: {
              // name: '[path][name].[ext]',
              outputPath: './static/',
              esModule: false
            }
          }
        ]
      }
    ]
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, 'loader'), 'node_modules']
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./public"),
    // contentBase: [path.join(__dirname, "./dist"), path.join(__dirname, "./")],
    host: "0.0.0.0",
    port: 8000,
    open: false,
    hot: true,
    useLocalIp: true
  },
  plugins: [
    ...getCleanWebpack(),
    new webpack.DefinePlugin({
      "process.env.BUILDTOOLS": "'webpack'"
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new CopyPlugin([
      { from: "public", to: "./" },
    ]),
  ],
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      '@': path.resolve(__dirname, "src"),
      phaser: phaser
    }
  },
  devtool: 'none'
});