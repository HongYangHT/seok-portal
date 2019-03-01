const path = require('path')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackplugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    index: path.resolve(__dirname, '../src')
  },
  mode: 'production',
  devtool: 'cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: '[name].js',
    // 你的 library 暴露为所有的模块定义下都可运行的方式。它将在 CommonJS, AMD 环境下运行，或将模块导出到 global 下的变量
    /**
     *
     *(function webpackUniversalModuleDefinition(root, factory) {
        if (typeof exports === 'object' && typeof module === 'object')
          module.exports = factory();
        else if (typeof define === 'function' && define.amd)
          define([], factory);
        else if (typeof exports === 'object')
          exports["MyLibrary"] = factory();
        else
          root["MyLibrary"] = factory();
      })(typeof self !== 'undefined' ? self : this, function () {
        return _entry_return_; // 此模块返回值，是入口 chunk 返回的值
      });
     */
    libraryTarget: 'umd',
    /**
     * 静态文件将已publicPath为相对地址
     * publicPath: "https://cdn.example.com/assets/", // CDN（总是 HTTPS 协议）
       publicPath: "//cdn.example.com/assets/", // CDN (协议相同)
       publicPath: "/assets/", // 相对于服务(server-relative)
       publicPath: "assets/", // 相对于 HTML 页面
       publicPath: "../assets/", // 相对于 HTML 页面
       publicPath: "", // 相对于 HTML 页面（目录相同）
     */
    publicPath: '',
    sourceMapFilename: '[name].[chunkhash].map',
    // 当设置了libraryTarget为umd时，需要设置umdNamedDefine 为true
    umdNamedDefine: true
  },
  module: {
    // 忽略构建时，webpack解析相关的库
    noParse: function (lib) {
      return /jquery|lodash|moment/.test(lib)
    },
    rules: [
      {
        test: /\.(js|es6)$/,
        // 这里没有提供options 因为提供了babelrc，而且这里使用的是babel 7
        use: [{
          loader: 'babel-loader?cacheDirectory' // 通过cacheDirectory选项开启支持缓存
        }],
        exclude: path.resolve(__dirname, 'node_modules')
      }
    ]
  },
  plugins: [
    new CleanWebpackplugin(['./**'], {
      root: path.resolve(__dirname, '../lib'),
      verbose: true,
      dry: false
    })
  ],
  optimization: {
    minimizer: [
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
