import LayoutWorktable from './Worktable.vue'

// const CONFIG = {}
let hLayout
LayoutWorktable.install = function (Vue, options) {
  hLayout = Vue.component('Layout')
  if (!hLayout) { throw Error('请先安装hLayout框架') }
  Vue.component('LayoutWorktable', LayoutWorktable)
}

export default LayoutWorktable
