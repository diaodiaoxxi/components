<script>
import PropTypes from '@hui/shared-utils/vue-types'
import {
  // uuid,
  isObject,
  get,
  noop,
  // defaultsDeep
} from '@hui/shared-utils/index'

// /**
//  * 没有uuid的时添加 uuid 与 default icon
//  * @param value 侧边栏数据
//  * @returns {*[]}
//  */
// export const formatDefaultSidebarData = function (value) {
//   const getPath = (path, i) => {
//     return path === '' ? `${i}` : `${path}.children.${i}`
//   }
//   const format = (mutiMenuList = [], path = '') => {
//     return mutiMenuList.map((item, i) => {
//       defaultsDeep(item, {
//         uuid: uuid(), // 无uuid 时添加 uuid
//         icon: this.defaultIconCls, // 首层无icon 时添加defaultIcon
//         isFavour: false // isFavour 未定义
//       })
//       if (!item.icon) {
//         item.icon = this.defaultIconCls
//       }
//       if (item.children) {
//         item.children = format(item.children, getPath(path, i))
//       }
//       return item
//     })
//   }
//   return format(value)
// }
export default {
  name: 'LayoutSidebar',
  props: {
    defaultActive: PropTypes.oneOfType([String, Object]).def(undefined),
    value: PropTypes.array.def([]),
    defaultIconCls: PropTypes.string.def('layout-iconfont h-layout-icon-smile'),
    defaultFullMenuTab: PropTypes.any.def(undefined),
    fullMenuTabs: PropTypes.array.def([]),
    fullMenuData: PropTypes.array.def([]),
    fullMenuFavourItemList: PropTypes.array.def([]),
    cookMenuHorizontal: PropTypes.bool.def(false),
  },
  provide () {
    return {
      layoutSidebar: this,
    }
  },
  inject: {
    layout: { default: {} },
  },
  data () {
    return {}
  },
  computed: {
    sidebarType () {
      return this.layout.store.sidebarType
    },
    defaultActiveUuid () {
      return isObject(this.defaultActive) ? get(this.defaultActive, 'uuid') : this.defaultActive
    },
  },
  render () {
    // pick(this.$listeners,['select','add-favour','remove-favour'])
    const options = {
      on: this.$listeners,
    }
    const fullMenu = () => (
      <FullMenu
        defaultActive={this.defaultActiveUuid}
        defaultTab={this.defaultFullMenuTab}
        value={this.fullMenuData}
        tabs={this.fullMenuTabs}
        favourItemList={this.fullMenuFavourItemList}
        {...options}
      ></FullMenu>
    )
    const drawerMenu = () => (
      <DrawerMenu
        defaultActive={this.defaultActiveUuid}
        value={this.value}
        {...options}
      ></DrawerMenu>
    )

    // cookMenuHorizontal: PropTypes.bool.def(false)
    const cookMenu = () => (
      <CookMenu
        defaultActive={this.defaultActiveUuid}
        value={this.value}
        horizontal={this.cookMenuHorizontal}
        {...options}
      ></CookMenu>
    )
    const menuMap = {
      fullMenu,
      drawerMenu,
      cookMenu,
    }
    const fn = get(menuMap, this.sidebarType) || noop
    return fn()
  },
}
</script>
