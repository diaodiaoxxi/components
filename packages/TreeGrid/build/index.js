const spawn = require('cross-spawn')
const path = require('path')

/** 配置文件覆盖 */
const VUE_CLI_CONTEXT = path.resolve(__dirname, '../../../')
const ENTRY = path.resolve(__dirname, '../index.js')
const OUTPUT = path.resolve(__dirname, '../dist')
const FILE_NAME = 'treegrid'

process.env.VUE_CLI_CONTEXT = VUE_CLI_CONTEXT
const ls = spawn(
  'npx',
  ['vue-cli-service', 'build', '--target', 'lib', '--name', `${FILE_NAME}`, '--dest', `${OUTPUT}`, `${ENTRY}`],
  {
    stdio: 'inherit',
    cwd: VUE_CLI_CONTEXT
  },
)

ls.on('close', code => {
  console.log('Layout 打包完成')
})
