/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const sourcePath = path.join(__dirname, './');
const outPath = path.join(__dirname, './');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  context: sourcePath,
  entry: {
    app: './index.tsx',
  },
  output: {
    path: outPath,
    filename: 'bundle.js',
    publicPath: '/',
  },
  target: 'web',
  mode: 'development',
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
    mainFields: ['module', 'browser', 'main'],
    plugins: [new TsConfigPathsPlugin({})],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      { test: /\.(png|svg)$/, use: 'url-loader?limit=10000' },
      { test: /\.(jpg|gif|graphql|gql|ttf)$/, use: 'file-loader' },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ['css', 'graphql', 'javascript', 'typescript', 'json', 'html'],
    }),
    new HtmlWebpackPlugin({
      template: 'assets/index.html',
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^blob.*/,
      contextRegExp: /^blob.*/,
    }),
  ],
};
