/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: webpack基础配置
 * @Date: 2019-02-28 17:06:22
 * @LastEditTime: 2019-02-28 17:12:55
 */

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const devMode = process.env.NODE_ENV !== 'production'
const OptimizeCSSAssertsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackplugin = require('clean-webpack-plugin')

module.exports = {
  entry: './src',
  output: {
    path: path.resolve(__dirname, '../lib'),
    publicPath: '/',
    libraryTarget: 'umd',
    filename: '[name].[hash:5].js',
    umdNamedDefine: true
  },
  mode: 'production',
  devtool: false,
  module: {
    rules: [{
      test: /\.(js|es6)$/,
      use: [{
        loader: 'babel-loader?cacheDirectory' // 通过cacheDirectory选项开启支持缓存
      }],
      exclude: path.resolve(__dirname, 'node_modules')
    },
    {
      test: /\.(sc|sa|c)ss$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      }, {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          sourceMap: true,
          plugins: loader => [
            // 可以配置多个插件
            require('autoprefixer')({
              browsers: [
                'last 10 Chrome versions',
                'last 5 Firefox versions',
                'Safari >= 6',
                'ie > 8'
              ]
            })
          ]
        }
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }] // use的顺序从右往左
    },
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          // 具体配置见插件官网
          limit: 10000,
          name: '[name]-[hash:5].[ext]',
          outputPath: 'img/' // outputPath所设置的路径，是相对于 webpack 的输出目录。
          // publicPath 选项则被许多webpack的插件用于在生产模式下更新内嵌到css、html文件内的 url , 如CDN地址
        }
      }, {
        loader: 'url-loader',
        options: {
          // 具体配置见插件官网
          limit: 10000,
          name: '[name]-[hash:5].[ext]',
          outputPath: 'img/' // outputPath所设置的路径，是相对于 webpack 的输出目录。
          // publicPath 选项则被许多webpack的插件用于在生产模式下更新内嵌到css、html文件内的 url , 如CDN地址
        }
      }, {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true,
            quality: 65
          },
          // optipng.enabled: false will disable optipng
          optipng: {
            enabled: false
          },
          pngquant: {
            quality: '65-90',
            speed: 4
          },
          gifsicle: {
            interlaced: false
          },
          // the webp option will enable WEBP
          webp: {
            quality: 75
          }
        }
      }
      ]
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        // 文件大小小于limit参数，url-loader将会把文件转为DataUR
        limit: 10000,
        name: '[name]-[hash:5].[ext]',
        output: 'fonts/'
        // publicPath: '', 多用于CDN
      }
    }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash:5].css', // 设置输出的文件名
      chunkFilename: devMode ? '[id].css' : '[id].[hash:5].css'
    }),
    new CleanWebpackplugin(['./**'], {
      root: path.resolve(__dirname, '../lib'),
      verbose: true,
      dry: false
    })
  ],
  optimization: {
    minimizer: [
      // 压缩CSS
      new OptimizeCSSAssertsPlugin({}),
      // 压缩JS
      new UglifyJsPlugin({
        // 有很多可以配置
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          output: {
            // 删除所有的注释
            comments: false,
            // 最紧凑的输出
            beautify: false
          },
          compress: {
            // 删除所有的 `console` 语句
            // 还可以兼容ie浏览器
            drop_console: true,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true
          }
        }
      })
    ]
  }
}
