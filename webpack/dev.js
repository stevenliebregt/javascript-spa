const merge = require('webpack-merge');
const common = require('./common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    port: 9000
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: './src/index.html',
      inject: 'head',
    }),
    new ScriptExtHtmlWebpackPlugin({
      defer: 'app.bundle.js'
    }),
  ],
});
