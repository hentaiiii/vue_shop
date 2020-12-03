module.exports = {
  chainWebpack: config => {
    // 重新配置打包入口
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {

      config.entry('app').clear().add('./src/main-prod.js')

      // 外部cdn引入
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      // 首页内容定制
      config.plugin('html').tap(args => {
        console.log(args)
        // console.log(args[0])
        args[0].isProd = true
        args[0].title = '电商后台管理系统'
        return args
      })
    })


    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')

      // 首页内容定制
      config.plugin('html').tap(args => {
        console.log(args)
        args[0].isProd = false
        args[0].title = 'dev-电商后台管理系统'
        return args
      })

    })
  }
}