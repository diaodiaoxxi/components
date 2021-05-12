<template>
  <div ref="sidebar" class="h-layout-sidebar" :class="{ 'is-collapse': isSCollapse }">
    <div ref="body" class="h-layout-sidebar-body">
      <!-- menuProps: 'defaultActive', 'defaultOpeneds' is from sidebarMixins -->
      <h-layout-menu
        class="h-layout-sidebar-main-menu"
        v-bind="menuProps"
        :collapse="isCollapse"
        :unique-opened="true"
      >
        <s-menu-item
          v-for="(item,index) in value"
          ref="menuItem"
          :key="item.uuid"
          :data="item"
          :active="submenuDrawer.data"
          @hook:mounted="menuItemMounted(item,index)"
          @hook:destoryed="menuItemDestoryed(item,index)"
          @clickItem="handleClickItem"
        ></s-menu-item>
      </h-layout-menu>
    </div>

    <!-- 抽屉式菜单 折叠时的二级菜单 -->
    <transition name="zoom-in-left">
      <s-submenu-drawer
        ref="drawer"
        v-show="submenuDrawer.show"
        v-bind="menuProps"
        :data="submenuDrawer.data"
        @clickItem="handleClickDrawerItem"
      ></s-submenu-drawer>
    </transition>

    <div
      class="h-layout-sidebar-expand"
      :class="{ 'is-collapse': isCollapse }"
      @click.prevent.stop="expandSiderbar"
    >
      <i name="icon-collapse" :class="isCollapse ? icon.menuUnfold : icon.menuFold"></i>
    </div>
  </div>
</template>
<script>
import SMenuItem from './MenuItem'
import SSubmenuDrawer from './SubmenuDrawer'
import { cloneDeep, omit, isEmpty } from '@hui/shared-utils/index'
import clickoutside from '@hui/directives/clickoutside'
import SidebarMixin from '../SidebarMixin'
import Hover from '@hui/shared-utils/lib/hover'
const menuItemInstMap = {}
export default {
  directives: { clickoutside },
  components: { SMenuItem, SSubmenuDrawer },
  mixins: [SidebarMixin],
  data () {
    // isCollapse: false,
    // isSCollapse: false,
    // is from SidebarMixin
    return {
      activeMenuItemDom: null,
      submenuDrawer: {
        show: false,
        currentDom: null,
        data: {},
        clock: null,
      },
    }
  },
  computed: {},
  watch: {},
  methods: {
    // expandSiderbar is from SidebarMixin
    hideSubMenuDrawer () {
      // closeDrawerAfterClick is from sidebarMixin
      if (this.closeDrawerAfterClick && this.submenuDrawer.show) {
        this.submenuDrawer.show = false
      }
    },
    handleClickDrawerItem (item) {
      if (this.isInLayout) {
        this.layout.sidebarSelect(item)
        this.hideSubMenuDrawer()
        return
      }
      this.$emit('select', cloneDeep(item))
      this.hideSubMenuDrawer()
    },
    handleClickItem (item) {
      if (this.isInLayout) {
        this.layout.sidebarSelect(item)
        return
      }
      this.$emit('select', cloneDeep(item))
    },
    menuItemMounted (menuItem, index) {
      const menuItemComInst = this.$refs.menuItem[index]
      const menuItemDom = menuItemComInst.$el
      if (!this.isCollapse) {
        return
      }
      if (isEmpty(menuItem.children)) {
        return
      }
      menuItemInstMap[index] = new Hover({
        popperRef: menuItemDom,
        popperWrap: this.$refs.drawer.$el,
        hoverType: 'delay',
        tolerance: 0,
        handleEnter: () => {
          this.submenuDrawer.show = true
          this.submenuDrawer.data = menuItem
          this.activeMenuItemDom = menuItemDom
        },
        handleLeave: (hoverInst) => {
          if (hoverInst?.popperRef !== this.activeMenuItemDom) {
            return
          }
          this.submenuDrawer.data = {}
          this.submenuDrawer.show = false
        }
      })
      menuItemInstMap[index].init()
    },
    menuItemDestoryed (item, index) {
      const hoverInst = menuItemInstMap[index]
      if (hoverInst && hoverInst instanceof Hover && hoverInst.destory) {
        hoverInst.destory()
        omit(menuItemInstMap, [index])
      }
    }
  },
  mounted () { },
}
</script>
