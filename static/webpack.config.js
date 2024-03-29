// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// var CompressionPlugin = require('compression-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = {
  mode: 'development',
  entry: ['./src/index.js'],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(jpe?g|png|gif)$/i, //to support eg. background-image property
        loader: 'file-loader',
        query: {
          name: '[name].[ext]',
          publicPath: './static/src/styles/images'
          // outputPath: 'images/'
          //the images will be emmited to public/assets/images/ folder
          //the images will be put in the DOM <style> tag as eg. background: url(assets/images/image.png);
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, //to support @font-face rule
        loader: 'url-loader',
        query: {
          limit: '10000',
          name: '[name].[ext]',
          outputPath: 'fonts/'
          //the fonts will be emmited to public/assets/fonts/ folder
          //the fonts will be put in the DOM <style> tag as eg. @font-face{ src:url(assets/fonts/font.ttf); }
        }
      },
      {
        test: /\.scss$/,
        loaders: [
          {
            loader: 'style-loader' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          },
          {
            loader: 'sass-loader' // compiles Sass to CSS
          }
        ]
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|ico)$/,
        loader: 'url-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './static'
  },
  optimization: {
    minimize: false
  },
  plugins: (() => {
    // overload -p flag in $ webpack -p
    // for more info on $ webpack -p see: https://webpack.github.io/docs/cli.html#production-shortcut-p
    if (process.argv.indexOf('-p') !== -1) {
      return [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production')
          }
        }),
        new UglifyJSPlugin({
          sourceMap: true
        }),

        // note that webpack's -p shortcut runs the UglifyJsPlugin (https://github.com/webpack/docs/wiki/optimization)
        // but for some reason leaves in one multiline comment while removing the rest,
        // so have to set comments: false here to remove all the comments
        // new webpack.optimization.minimize({
        //   output: {
        //     comments: false
        //   }
        // })
        // new webpack.optimize.DedupePlugin(), //dedupe similar code
        // new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
        // new CompressionPlugin({
        //   //<-- Add this
        //   asset: '[path].gz[query]',
        //   algorithm: 'gzip',
        //   test: /\.js$|\.css$|\.html$/,
        //   threshold: 10240,
        //   minRatio: 0.8
        // })
        new BundleAnalyzerPlugin()
      ];
    }
    return [];
  })()
};
