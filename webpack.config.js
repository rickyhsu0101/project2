const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: {
    login: './public/assets/js/pages/login.js',
    register: './public/assets/js/pages/register.js',
    profile: './public/assets/js/pages/profile.js',
    chat: './public/assets/js/pages/chat.js',
    home: './public/assets/js/pages/home.js',
    groups: './public/assets/js/pages/groups.js',
    group: './public/assets/js/pages/group.js',
    newgroup: './public/assets/js/pages/newgroup.js',
    '404': './public/assets/js/pages/404.js'
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
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
  }
};
