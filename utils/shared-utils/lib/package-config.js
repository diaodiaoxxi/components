import { get, defaultsDeep, camelCase } from './lodash'
/**
 *  单独引用安装组件安装时设置 注入 inject.CONFIG 设置 prefix,icon 图标设置
 * @param {object} options 组件 config.js 配置
 * @param {object} options.defaultConfig 默认配置
 * @param {object} options.components 覆盖 config 的组件
 * @param {object} options.Vue vue 模板
 * @param {object} options.installOptions vue install options
 * @param {string} options.configKey config 在 install options 中的 key
 */
export default class PackageInstall {
  constructor (options = {}) {
    this.defaultConfig = options.defaultConfig
    this.configKey = options.configKey || 'CONFIG'

    const optionConfig = get(options.installOptions, [this.configKey])
    this.config = defaultsDeep(optionConfig, this.defaultConfig)

    this.components = options.components
    this.Vue = options.Vue

    this.getPrefix = this.getPrefix.bind(this)
    this.changeInject = this.changeInject.bind(this)
  }

  /**
   * 格式化 数组类型的 inject
   * Normalize the inject map
   * normalizeMap(['test']) => {test:{default:()=>{}}}
   * @param {Array|Object} injectMap
   * @return {Object}
   */
  _normalizeInject (injectMap) {
    const injectFormated = {}
    if (Array.isArray(injectMap)) {
      injectMap.map(key => {
        injectFormated.key = { default: () => {} }
      })
      return injectFormated
    }
    return injectMap
  }

  /**
   * component inject 注入 CONFIG
   * @param {*} component 组件参数
   */
  changeInject (component) {
    const initConfig = this.config
    if (!component.inject) {
      component.inject = {}
    }
    component.inject = this._normalizeInject(component.inject)
    // TODO Select CONFIG Change to SELECT_CONFIG 需要兼容
    component.inject.CONFIG = { default: () => initConfig }
    return component
  }

  // 获取 prefix
  getPrefix () {
    return get(this.options, [this.configName, 'PREFIX']) || get(this.config, 'PREFIX') || ''
  }

  install () {
    const components = this.components
    const Vue = this.Vue
    Object.keys(components).forEach(key => {
      const prefix = this.getPrefix()
      const componentName = camelCase(`${prefix}${key}`)
      const component = this.changeInject(components[key])
      Vue.component(componentName, component)
    })
  }
}
