<script>
/**
 * 侧边栏菜单封装
 * @props data.uuid
 * @props data.icon
 * @props data.title
 * @props data.children  data[]
 */
import SidebarMixin from '../SidebarMixin.js'
import get from 'lodash/get'
export default {
  name: 'SidebarMenuItem',
  mixins: [SidebarMixin],
  inject: {
    rootMenu: { default: () => {} }
  },
  props: {
    data: Object,
    active: Object,
    isSubmenu: Boolean,
  },
  data () {
    this.itemsMap = {}
    return {}
  },
  computed: {
    level () {
      // 获取菜单 data 层级深度
      function getDepth (value) {
        const children = get(value, 'children')
        return Array.isArray(children) && children.length !== 0
          ? 1 + Math.max(...children.map(getDepth))
          : 0
      }
      return getDepth(this.data)
    },
    isHover () {
      return this.active && this.active === this.data
    }
  },
  methods: {
    handleItemClick (e, item) {
      this.$emit('clickItem', item)
    }
  },
  render () {
    this.itemsMap = {}
    const { ICON } = this.LAYOUT_SIDEBAR_CONFIG
    const iconNode = (() => {
      // 折叠的抽屉盒内
      if (this.isSubmenu) {
        return (
          <i slot="icon" class={ICON.circle}></i>
        )
      }
      if (this.data.icon) {
        return (
          <i slot="icon" class={this.data.icon}></i>
        )
      }
      return null
    })()

    if (this.level == 0) {
      return (
        <h-layout-menu-item
          index={this.data.uuid}
          nativeOnClick={(e) => {
            this.handleItemClick(e, this.data)
          }}
        >
          {iconNode}
          <span slot="title" vTitle={this.data.title}>{this.$slots.title || this.data.title}</span>
        </h-layout-menu-item>
      )
    }

    const renderMenuItem = children => {
      return children.map(item => {
        const children = get(item, 'children')
        if (Array.isArray(children) && children.length !== 0) {
          return (
            <h-layout-submenu index={item.uuid} icon={ICON.circle} title={item.title} isHover={this.isHover}>
              {renderMenuItem(item.children)}
            </h-layout-submenu>
          )
        }
        this.itemsMap[item.uuid] = item
        return (
          <h-layout-menu-item
            index={item.uuid}
            icon={ICON.circle}
            title={item.title}
            nativeOnClick={(e) => {
              this.handleItemClick(e, item)
            }}
          />
        )
      })
    }

    return (
      <h-layout-submenu popperType="disabled" index={this.data.uuid} itemsMap={this.itemsMap} isHover={this.isHover}>
        {iconNode}
        <span slot="title" vTitle={this.data.title}>{this.$slots.title || this.data.title}</span>
        {renderMenuItem(this.data.children)}
      </h-layout-submenu>
    )
  }
}
</script>
