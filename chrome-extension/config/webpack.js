const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
  entry: {
    content: path.join(__dirname, '..', 'src', 'content.js'),
    background: path.join(__dirname, '..', 'src', 'background.js'),
    popup: path.join(__dirname, '..', 'src', 'popup.js')
  },
  output: {
    path: path.join(__dirname, '..', 'build'),
    filename: '[name].bundle.js'
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.js$/,
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          presets: [
            require.resolve('babel-preset-react-app'),
            require.resolve('babel-preset-preact')
          ],
          compact: true
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          Object.assign(
            {
              fallback: require.resolve('style-loader'),
              use: [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    minimize: true,
                    sourceMap: true
                  }
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-flexbugs-fixes'),
                      autoprefixer({
                        browsers: [
                          '>1%',
                          'last 4 versions',
                          'Firefox ESR',
                          'not ie < 9' // React doesn't support IE8 anyway
                        ],
                        flexbox: 'no-2009'
                      })
                    ]
                  }
                }
              ]
            },
            {}
          )
        )
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new ExtractTextPlugin({
      filename: 'style.css'
    }),
    new CopyWebpackPlugin(
      [
        { from: 'assets', to: 'assets' },
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'public', to: '' }
      ],
      {}
    )
  ].concat(
    isProduction
      ? [
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
              comparisons: false
            },
            output: {
              comments: false,
              ascii_only: true
            },
            sourceMap: true
          })
        ]
      : []
  )
};
