// postcss 用来处理css 问题，例如 autoprefixer  css3新属性，自动加前缀的功能，
// 都需要postcss.config.js中进行配置， 然后在对应的 配置文件用引入 postcss-loader 插件
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
