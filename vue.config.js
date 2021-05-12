const path = require('path')
const webpack = require('webpack')
const resolve = function (dir) {
  return path.join(__dirname, dir)
}
const defaultEntry = process.env.INDEX_ENTER
module.exports = {
  pages: {
    index: {
      entry: defaultEntry || 'examples/main.js',
      template: 'examples/public/index.html',
      filename: 'index.html'
    }
  },
  outputDir: 'dist-example',
  css: {
    requireModuleExtension: true,
    sourceMap: true,
    loaderOptions: {
      css: {
        // 注意：以下配置在 Vue CLI v4 与 v3 之间存在差异。
        // Vue CLI v3 用户可参考 css-loader v1 文档
        // https://github.com/webpack-contrib/css-loader/tree/v1.0.1
        modules: {
          localIdentName: '[local]__[hash:base64:8]'
        },
        localsConvention: 'camelCaseOnly'
      },
      // 开启 scss sourcemap
      sass: {
        sassOptions: {
          outputStyle: 'compressed',
        },
        sourceMap: true,
      },
    }
  },

  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'))
    config.resolve.alias.set('@materials', resolve('materials'))
    config.resolve.alias.set('@packages', resolve('packages'))
    config.resolve.alias.set('@examples', resolve('examples'))
    config.module.rules.delete('eslint')
    // https://babel.docschina.org/docs/en/next/options/#rootmode
    // 修改 babel rootmode
    config.module
      .rule('js')
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        rootMode: 'upward'
      })
  },
  devServer: {
    // host: '127.0.0.1',
    // port: 8086,
    proxy: {
      '/g/hsxone.omc/v': {
        target: 'http://10.20.36.96:8088',
        changeOrigin: true,
        logLevel: 'debug',
        // pathRewrite: {
        //   '^/api/': '/'
        // }
      }
    }
  },
  configureWebpack: {
    externals: [
      function (context, request, callback) {
        // 移除 h_ui 1.0
        const isProdEnv = process.env.NODE_ENV == 'production'
        if (/^h_ui/.test(request) && isProdEnv) {
          return callback(null, 'h_ui')
        }
        // 继续下一步且不外部化引用
        callback()
      }
    ],
    plugins: [
      // 解决moment打包的时候把所有的语言都打包进去的问题
      new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /(zh-cn)\.js/),
    ]
  }
}
