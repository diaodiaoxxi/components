
import { Tree, TreeNode } from '@packages/Tree/index'
import BaseSelector from '@packages/BaseSelector/index'
import SelectTreeBody from '@packages/SelectTree/index'


import Select2 from '@packages/Select/index.js'

import locale from './locale'

const prefix = 'u'
const HUI = {
  Select: BaseSelector,
  /* 与BaseSelector命名冲突 */

  Select2,
  Select2Block: Select2.SelectBlock,
  Select2CheckAll: Select2.CheckAllCtrl,
  Select2AddOption: Select2.CreateOptionCtrl,
  Option: Select2.Option,
  OptionGroup: Select2.OptionGroup,

  //
  Tree,
  TreeNode,

  //
  SelectTree: SelectTreeBody,
}
// console.log('NODE_ENV', process.env.NODE_ENV)
const install = function (Vue, opts = {}) {
  // TODO Local 拆分引用
  Vue.prototype.COMPONENT_PREFIX = prefix
  locale.use(opts.locale)
  locale.i18n(opts.i18n)
  Object.keys(HUI).forEach(key => {
    Vue.component(`${prefix}${key}`, HUI[key])
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

HUI.install = install
export { HUI as default, prefix }
