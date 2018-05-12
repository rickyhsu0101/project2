const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: {
    login: './dev-Public/assets/js/pages/login.js',
    register: './dev-Public/assets/js/pages/register.js',
    profile: './dev-Public/assets/js/pages/profile.js'
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js'
  },
  module: {
    rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['env']
        }
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};