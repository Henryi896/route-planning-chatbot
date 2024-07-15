const { defineConfig } = require('@vue/cli-service')
module.exports = {
  devServer: {
    proxy: 'https://api.anthropic.com/'
  },
  chainWebpack: config => {
    config.externals({
      'my-app-settings': 'myAppSettings'
    })
  }
}
module.exports = defineConfig({
  transpileDependencies: true,
})
