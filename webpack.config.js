var path = require('path');
 var webpack = require('webpack');
 module.exports = {
     entry: './public/assets/js/main.js',
     output: {
         path: path.resolve(__dirname, './public/assets/dist'),
         filename: 'app.bundle.js'
     },
     module: {
         rules: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['env']
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
 };