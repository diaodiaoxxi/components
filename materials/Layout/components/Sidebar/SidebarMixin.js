import PropTypes from '@hui/shared-utils/vue-types'
import LAYOUT_SIDEBAR_CONFIG from '../config'
import { pick } from '@hui/shared-utils/index'
const noop = () => {}
export default {
  provide () {
    return {
      LAYOUT_SIDEBAR_CONFIG: this.LAYOUT_SIDEBAR_CONFIG,
    }
  },
  inject: {
    LAYOUT_SIDEBAR_CONFIG: { default: () => LAYOUT_SIDEBAR_CONFIG },
    layout: {
      default: () => {
        return { setCollapse: noop }
      }
    },
  },
  props: {
    defaultActive: PropTypes.string.def(''),
    defaultOpeneds: PropTypes.array,
    value: PropTypes.array.def([]),
    closeDrawerAfterClick: PropTypes.bool.def(true), // 点击 drawerSidebar 折叠状态下 子菜单抽屉 内条目是否关闭 子菜单抽屉
    horizontal: PropTypes.bool.def(false), // 菜谱菜单是否水平排列
  },
  data () {
    this.prefix = 'h' || this.LAYOUT_SIDEBAR_CONFIG.PREFIX
    this.icon = this.LAYOUT_SIDEBAR_CONFIG.ICON
    this.prefixCls = `${this.prefix}-layout-sidebar`
    this.layoutPrefixCls = `${this.prefix}-layout`
    const initCollapse = this.layout.isCollapse || false
    return {
      isCollapse: initCollapse,
      isSCollapse: initCollapse, // 确保 menu 动画先执行,
    }
  },
  computed: {
    menuProps () {
      return pick(this, ['defaultActive', 'defaultOpeneds'])
    },
    isInLayout () {
      return this.layout && this.layout._isVue
    }
  },
  watch: {
    isCollapse (val) {
      this.layout.setCollapse(val)
    },
  },
  methods: {
    expandSiderbar () {
      this.isCollapse = !this.isCollapse
      // this.$nextTick(() => {
      //   this.isSCollapse = this.isCollapse
      // })
      const sleep = time => new Promise(resolve => setTimeout(resolve, time))
      this.$nextTick()
        .then(() => sleep(80))
        .then(() => {
          this.isSCollapse = this.isCollapse
        })
    },
  },
}
