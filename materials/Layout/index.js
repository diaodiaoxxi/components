
// 工具会对浏览器兼容性做处理，理论上组件库应该无需关注
// 暂时还没有找到 @vue/cli 在打包库时禁止注入 polyfills 的办法
import 'core-js/stable/promise/finally'
/* styles 样式
--------------------------- */
import './styles/icon/iconfont.css'
import './styles/index.scss'

import Layout from './src/Layout.vue'
import LayoutBody from './src/LayoutBody.vue'
import LayoutSidebar from './src/LayoutSidebar.vue'
import LayoutContent from './src/LayoutContent.vue'
import {
  Navbar,
  FullMenu,
  DrawerMenu,
  CookMenu,
  Topbar,
  TopbarCtrlItem,
  TopbarCtrlSplit,
  TopbarMenuGroup,
  TopbarMenuItem,
} from './components/index'

import Vue from 'vue'
import draggable from 'vuedraggable'
import Menu from '@packages/Menu/index.js'
import Select from '@packages/Select/index.js'
import Tooltip from '@packages/Tooltip'

// fixed: ie 下 clearInterval 不能清除 null undefined
// http://dev.hundsun.com/frame/pms/workbench?bug_id=HUIII-89
function isIE (version) {
  var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined'
  var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode)
  var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent)
  if (version === 11) {
    return isIE11
  }
  if (version === 10) {
    return isIE10
  }
  return isIE11 || isIE10
}

if (isIE()) {
  window.__hui_clearInterval = window.clearInterval
  window.clearInterval = function (id) {
    if (!id) {
      return
    }
    window.__hui_clearInterval(id)
  }
  console.log(window.__hui_clearInterval, window.clearInterval)
}

Vue.component('hLayoutDrag', draggable)
Vue.use(Tooltip, {})
Vue.use(Select, {
  SELECT_CONFIG: {
    PREFIX: 'h-layout',
  }
})

Vue.use(Menu, {
  CONFIG: {
    PREFIX: 'h-layout',
    ICON: {
      star: 'layout-iconfont h-layout-icon-star',
      skin: 'layout-iconfont h-layout-icon-skin',
      fullmenu: 'layout-iconfont h-layout-icon-fullmenu',
      reload: 'layout-iconfont h-layout-icon-reload',
      lock: 'layout-iconfont h-layout-icon-lock',
      unlock: 'layout-iconfont h-layout-icon-unlock',
      logout: 'layout-iconfont h-layout-icon-logout',
      check: 'layout-iconfont h-layout-icon-check',
      menuFold: 'layout-iconfont h-layout-icon-menu-fold',
      menuUnfold: 'layout-iconfont h-layout-icon-menu-unfold',
      starOutline: 'layout-iconfont h-layout-icon-star-outline',
      worktable: 'layout-iconfont h-layout-icon-worktable',
      // fullmenu sidebar
      smile: 'layout-iconfont h-layout-icon-smile',
      search: 'layout-iconfont h-layout-icon-search',
      left: 'layout-iconfont h-layout-icon-arrow-left',
      right: 'layout-iconfont h-layout-icon-arrow-right',
      close: 'layout-iconfont h-layout-icon-close',
      arrowDown: 'layout-iconfont h-layout-icon-arrow-down',
      more: 'layout-iconfont h-layout-icon-ellipsis',
      circle: 'layout-iconfont h-layout-icon-submenu-circle'
    }
  }
})

const components = {
  LayoutHead: Topbar,
  LayoutHeadCtrlItem: TopbarCtrlItem,
  LayoutHeadCtrlSplit: TopbarCtrlSplit,
  LayoutHeadMenuGroup: TopbarMenuGroup,
  LayoutHeadMenuItem: TopbarMenuItem,
  // ----------------
  LayoutBody,
  LayoutSidebar,
  LayoutNavbar: Navbar,
  LayoutContent,
  FullMenu,
  DrawerMenu,
  CookMenu,
}

// const CONFIG = {}

Layout.install = function (Vue, options) {
  Vue.component('Layout', Layout)
  Object.keys(components).forEach(key => {
    const component = components[key]
    Vue.component(`${key}`, component)
  })
}

export default Layout
export {
  Topbar as LayoutHead,
  TopbarCtrlItem as LayoutHeadCtrlItem,
  TopbarCtrlSplit as LayoutHeadCtrlSplit,
  TopbarMenuGroup as LayoutHeadMenuGroup,
  TopbarMenuItem as LayoutHeadMenuItem,

  LayoutBody,
  LayoutSidebar,
  LayoutContent,
  Navbar as LayoutNavbar,
  FullMenu,
  DrawerMenu,
  CookMenu,
}
