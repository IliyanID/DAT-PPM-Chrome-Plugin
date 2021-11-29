const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {content_script:'./content_script/main.ts',popup:'./plugin-container/popup.ts',background:'./background-runners/background.ts' },
  module: {
    rules: [{ test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ }], // do not forget to change/install your own TS loader
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: true }),
    new HtmlWebpackPlugin({ template: 'plugin-container/header.html' }),
  ],
  output: {  filename: '[name].js', path: path.resolve(__dirname, 'public') }, // chrome will look for files under dist/* folder
};