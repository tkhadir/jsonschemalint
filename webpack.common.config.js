var webpack = require('webpack');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
var path = require('path');

var babelOptions = {
  presets: [
    ["env", {
      "targets": {
        "browsers": ["last 2 versions"]
      }
    }]
  ]
};

module.exports = {
  cache: true,
  entry: {
    app: './src/app.js',
    main: './src/main.ts',
    vendor: './src/vendor.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].[chunkhash].js'
  },
  stats: {
    // Configure the console output
    colors: true,
    modules: true,
    reasons: true
  },
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    alias: {
      '@angular/upgrade/static': '@angular/upgrade/bundles/upgrade-static.umd.js'
    }
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions
          }
        ]
      },
      { test: /\.css$/, loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader' })},
      { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'file-loader?name=fonts/[name].[ext]' },
    ]
  },
  plugins: [
    new WebpackMd5Hash(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor']
    }),
    new CopyWebpackPlugin([
      { from: 'www' }
    ]),
    new HtmlWebpackPlugin({
      template: 'html-loader!./www/index.html',
    }),
    new ExtractTextPlugin('[name].[chunkhash].css'),
    new webpack.ProvidePlugin({
      'Promise': 'es6-promise' // Thanks Aaron (https://gist.github.com/Couto/b29676dd1ab8714a818f#gistcomment-1584602)
    }),
    new ngAnnotatePlugin({add: true}),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'src/service-worker.js'),
      filename: 'service-worker.js'
    })
  ],
  node: {
    fs: 'empty'
  },
  profile: true
};