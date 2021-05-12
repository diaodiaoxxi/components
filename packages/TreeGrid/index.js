
import './styles/index.scss'

import TABLE_CONFIG from './src/config'
import TreeGrid from './src/TreeGrid'
import PackageInstall from '@hui/shared-utils/lib/package-config'

export const components = {
  TreeGrid
}

TreeGrid.install = function (Vue, options) {
  const c = new PackageInstall({
    defaultConfig: TABLE_CONFIG, // 默认配置
    components, // 覆盖 config 的组件
    Vue, // vue 模板
    installOptions: options, // vue install options
    configKey: 'TABLE_CONFIG' // config 在 install options 中的 key
  })
  c.install()
}

export default TreeGrid
export {
  TreeGrid
}
