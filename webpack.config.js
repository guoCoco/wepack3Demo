const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const uglify = require('uglifyjs-webpack-plugin')
const htmlPlugin = require('html-webpack-plugin')
const extractTextPlugin = require('extract-text-webpack-plugin')
const purifyCSSPlugin = require('purifycss-webpack')
const entry = require('./config/entry_webpack.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')


// if(process.env.type === 'dev') {
//   var websit = {
//     publicPath: 'http://localhost:9090/'
//   }
// } else {
//   var websit = {
//     publicPath: 'https://baidu.com/'
//   }
// }
var websit = {
    publicPath: 'http://localhost:9090/'
  }

module.exports = {
  // entry: {
  //   entry: './src/entry.js'// 多入口配置
  //   // entry2: './src/entry2.js'
  // }, // 入口配置项
  entry: entry.path,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js', // 导出多入口文件
    publicPath: websit.publicPath //打包生产的路径为绝对路径
  }, // 出口配置项
  devtool: '#source-map',
  module: {
    rules:[
      {
        test: /\.css$/, // 找到css 文件
        // use: ['style-loader', 'css-loader']
        // loader: ['style-loader', 'css-loader']
        // use:[{ // 这种方式是css文件不分离，直接打包到js文件中
        //   loader: 'style-loader'
        // },{
        //   loader: 'css-loader'
        // }]
        use: extractTextPlugin.extract({ // 这种方式是将css 分离出来
          fallback: "style-loader",
          use: ["css-loader", 'postcss-loader']
        })
      },
      {
        test: /\.(png|jpg|gif)/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 5000,
            outputPath: 'images/'
          }
        }]
      },
      {
        test: /\.(htm|html)$/i,
        use: ['html-withimg-loader']
      },{
        test: /\.less$/,
        // use: [{ // 将less文件内容，打包到js文件中去，如何实现less 的分离，同css 分离一样
        //   loader: 'style-loader'
        // },{
        //   loader: 'css-loader'
        // },{
        //   loader: 'less-loader'
        // }]
        use: extractTextPlugin.extract({ // 这种方式是将css 分离出来
          fallback: "style-loader",
          use: [{
            loader: 'css-loader'
          },{
            loader: 'less-loader'
          }]
        })
      },{
        test: /\.scss$/,
          use: extractTextPlugin.extract({
            use: [{
              loader: 'css-loader'
            },{
              loader: 'sass-loader'
            }],
            fallback: 'style-loader'
          })
      },{
        test: /\.(jsx|js)/,
        use: {
          loader: 'babel-loader' // options选项如果不配置，或者内容比较多，需要放在babel的配置文件中，.babelrc文件
          // options: {
          //   presets: ['es2015', 'react']
          // }
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    // 抽离公共模块
    new webpack.optimize.CommonsChunkPlugin({
      name: ['jquery', 'vue'], //多入口抽离，这个是配置在入口配置项中的
      filename: 'assert/js/[name].js',
      minChunks: 2
    }),
    // new uglify(),
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new htmlPlugin({
      minify: {
        removeAttributeQuotes: true //把标签属性的引号去除，减小文件大小。。。，打包后的html文件, 没有引号
      },
      hash: true, // 避免缓存
      template: './src/index.html' // 注意一定要是相对路径
    }),
    new extractTextPlugin('css/index.css'), // 这个路径实在dist目录下
    new purifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html')) // 配置参数是 paths 不是path,否则打包报错
    }),
    new webpack.BannerPlugin('write by guokeke'),
    new CopyWebpackPlugin([{
      from: __dirname + '/src/public',
      to: './public'
    }]),
    new webpack.HotModuleReplacementPlugin() // 配置热更新插件
  ],
  devServer: { // 配置完需要 安装 webpack-dev-server ---热更新功能配置
    contentBase: path.resolve(__dirname, 'dist'),
    host: 'localhost', // 本机ip地址，服务器地址
    compress: true, // 是否使用服务器压缩
    port: 9090
  }, //配置webpack 开发服务
  watchOptions: { //打包热监控
    poll: 1000,
    aggregateTimeout: 600,
    ignored:/node_modules/,
  }
}
