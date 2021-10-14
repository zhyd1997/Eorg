const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPluginv = require("fork-ts-checker-webpack-plugin")

module.exports = {
  context: __dirname,
  entry: path.resolve("./src/index.tsx"),
  plugins: [
    new CleanWebpackPlugin(),
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
    new ForkTsCheckerWebpackPluginv({
      eslint: {
        files: './src/**/*.{ts,tsx,js,jsx}' // required - same as command `eslint ./src/**/*.{ts,tsx,js,jsx} --ext .ts,.tsx,.js,.jsx`
      }
    })
  ],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[contenthash].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  module: {
    rules: [
      { test: /\.tsx?$/,include: path.resolve(__dirname, 'src'), loader: "ts-loader", options: {
        transpileOnly: true,
      } },
      { test: /\.css$/i, use: ["style-loader", "css-loader"] },
      { test: /\.svg$/,include: path.resolve(__dirname, 'src'), use: ["@svgr/webpack"] },
    ],
  },
};
