const path = require('path')
const fs = require('fs-extra')
const Service = require('@vue/cli-service')
const assert = require('assert')
// const { error } = require('@vue/cli-shared-utils')

function findConfigUpwards (rootDir) {
  const ROOT_CONFIG_FILENAMES = [
    'vue.config.js',
  ]
  let dirname = rootDir
  while (true) {
    for (const filename of ROOT_CONFIG_FILENAMES) {
      if (fs.existsSync(path.join(dirname, filename))) {
        return dirname
      }
    }

    const nextDir = path.dirname(dirname)
    if (dirname === nextDir) break
    dirname = nextDir
  }

  return null
}

class HuiBuild extends Service {
  constructor (context, options) {
    const VUE_CLI_CONTEXT = findConfigUpwards(process.cwd())
    context = context || VUE_CLI_CONTEXT || process.cwd()
    super(VUE_CLI_CONTEXT, options)
  }

  run (args = {}) {
    // console.log('cwd:', process.cwd())
    // console.log('参数:', args)
    if (args.buildType == 'lib') {
      assert(args.libEntry !== undefined, '请输入 lib-entry 入口!')
      return this.lib(args.libEntry, args)
    }
    return this.dist(args)
  }

  dist (args) {
    const pkg = require(path.resolve(process.cwd(), './package.json'))
    const NAME = pkg.name.replace('@hui/', '')
    const ENTRY = path.resolve(process.cwd(), './index.js')
    const OUTPUT = path.resolve(process.cwd(), './dist')
    return super.run('build', {
      target: 'lib',
      name: NAME,
      entry: ENTRY,
      dest: OUTPUT,
      ...args
    })
      .catch(err => {
        return Promise.reject(err)
      })
  }

  async lib (libEntry, args) {
    const resolveFileName = function (dir) {
      return path.parse(dir).name
    }
    let langFiles = await fs.readdir(path.resolve(process.cwd(), libEntry))
    langFiles = langFiles.filter(item => item.includes('.vue'))
    console.log('lib files:', langFiles)
    const OUTPUT = path.resolve(process.cwd(), './lib')
    for (const langFile of langFiles) {
      const ENTRY = path.resolve(process.cwd(), libEntry, langFile)
      const NAME = (resolveFileName(ENTRY))
      super.run('build', {
        target: 'lib',
        name: NAME,
        entry: ENTRY,
        dest: OUTPUT,
        ...args
      })
        .then((code) => {
          console.log(`打包完成 ${langFile} ${code}`)

          fs.rename(
            path.resolve(process.cwd(), './lib', `${NAME}.umd.min.js`),
            path.resolve(process.cwd(), './lib', `${NAME}.js`)
          )

          fs.rename(
            path.resolve(process.cwd(), './lib', `${NAME}.umd.min.js.map`),
            path.resolve(process.cwd(), './lib', `${NAME}.js.map`)
          )

          console.log(`重命名 ${resolveFileName(langFile)}.umd.min.js 为 ${resolveFileName(langFile)}.js`)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    }
  }
}

const builder = new HuiBuild()

module.exports = builder
