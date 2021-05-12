<template>
  <div
    ref="sidebar"
    class="h-layout-sidebar is-has-fullmenu"
    :class="{ 'is-collapse': isSCollapse }"
  >
    <div
      class="h-layout-sidebar-head h-layout-sidebar-fullmenu"
      :class="{ 'is-collapse': isSCollapse, 'is-active': fullmenuDrawer.show }"
      @mouseenter="handleHover"
      @click="toggleFullmenu"
    >
      <span class="h-layout-sidebar-fullmenu-title">{{ $t('hui.frameLayout.fullMenu') }}</span>
      <i class="h-layout-sidebar-fullmenu-icon" :class="icon.fullmenu"></i>
    </div>

    <!-- 全部菜单-收藏项菜单 -->
    <div class="h-layout-sidebar-body">
      <!-- menuProps is from sidebarMixins -->
      <transition name="fade" mode="out-in">
        <h-layout-menu
          v-if="isCollapse"
          class="h-layout-sidebar-main-menu"
          key="collapse"
          v-bind="menuProps"
          :collapse="isCollapse"
          :unique-opened="true"
        >
          <h-layout-menu-item
            v-for="item in favourMenuList"
            :key="item.uuid"
            :index="item.uuid"
            :title="item.title"
            :icon="item.icon || icon.smile"
            @click.native.stop.prevent="handleSelect(item, 'favourMenu')"
          >
            <i
              v-tooltip="$t('hui.frameLayout.delFavour')"
              name="close"
              :class="[icon.close, `${prefixCls}-icon-close`]"
              @click.stop="removeFavour(item)"
              @mouseenter.stop=""
            ></i>
          </h-layout-menu-item>
        </h-layout-menu>
        <!-- collapse 更新后会更新 menu ul li dom 导致 drag sortable 失效，利用 v-if remount drag 组件 -->
        <h-layout-drag
          v-else
          v-model="favourMenuList"
          key="open"
          tag="h-layout-menu"
          class="h-layout-sidebar-main-menu"
          :componentData="{ props: { ...menuProps, collapse: isCollapse, uniqueOpend: true } }"
          :setData="() => {}"
          :move="noop"
          @end="noop"
        >
          <h-layout-menu-item
            v-for="item in favourMenuList"
            :key="item.uuid"
            :index="item.uuid"
            :title="item.title"
            :icon="item.icon || icon.smile"
            @click.native.stop.prevent="handleSelect(item, 'favourMenu')"
          >
            <i
              v-tooltip="$t('hui.frameLayout.delFavour')"
              name="close"
              :class="[icon.close, `${prefixCls}-icon-close`,`${layoutPrefixCls}-menu-item-foot-icon`]"
              @click.stop="removeFavour(item)"
              @mouseenter.stop=""
            ></i>
            <i
              v-tooltip="$t('hui.frameLayout.moveFavour')"
              name="drag"
              :class="[icon.drag, `${prefixCls}-icon-drag`,`${layoutPrefixCls}-menu-item-foot-icon`]"
              @mouseenter.stop=""
            ></i>
          </h-layout-menu-item>
        </h-layout-drag>
      </transition>
    </div>

    <!-- 全部菜单-抽屉窗口 -->
    <transition name="zoom-in-left">
      <div
        ref="drawer"
        v-show="fullmenuDrawer.show"
        class="h-layout-sidebar-fullmenu-drawer h-layout-sidebar-drawer is-auto"
        :class="{ 'is-collapse': isSCollapse }"
      >
        <h-layout-cook-popper
          ref="cookPopper"
          class="is-full is-has-tabs"
          mode="drawer"
          :value="fullmenuDrawer.data"
          :defaultActive="fullmenuDrawer.defaultActive"
          @toggle-favor="toggleFavourMenuItem"
          @click-item="handleSelect($event, 'popper')"
        >
          <div class="h-layout-sidebar-fullmenu-tabs" slot="tabs">
            <SNavTabs
              ref="navTabs"
              ctrlMode="auto"
              :defaultTab="defaultTab"
              :value="tabs"
              :closable="false"
              :useContextmenu="false"
              @click="handleTabClick"
            ></SNavTabs>
          </div>
          <i
            class="h-layout-sidebar-fullmenu-drawer-close"
            :class="icon.close"
            @click="toggleFullmenu(false)"
          ></i>
        </h-layout-cook-popper>
      </div>
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
import PropTypes from '@hui/shared-utils/vue-types'
import SNavTabs from '@packages/NavTabs'
import SidebarMixin from '../SidebarMixin'
import { get, filterPrivate } from '@hui/shared-utils'

const NAV_TABS_CONFIG = {
  PREFIX: 'h',
  ICON: {
    left: 'layout-iconfont h-layout-icon-arrow-left',
    right: 'layout-iconfont h-layout-icon-arrow-right',
    close: 'layout-iconfont h-layout-icon-close',
  },
}

export default {
  name: 'LayoutFullmenu',
  components: { SNavTabs },
  props: {
    defaultTab: PropTypes.any.def(''),
    tabs: PropTypes.array.def([]),
    value: PropTypes.array.def([]),
    favourItemList: PropTypes.array.def([]),
    trigger: PropTypes.oneOf(['hover', 'click']).def('click'), // 全部菜单触发方式
    sidebarTip: PropTypes.any.def(),
  },
  mixins: [SidebarMixin],
  provide () {
    return {
      NAV_TABS_CONFIG,
    }
  },
  data () {
    // isCollapse: false,
    // isSCollapse: false,
    // is from SidebarMixin
    const { ICON } = this.LAYOUT_SIDEBAR_CONFIG
    return {
      icon: ICON,
      fullmenuDrawer: {
        show: false,
        data: this.value,
        defaultActive: this.defaultActive,
      },
      favourMenuList: this.favourItemList,
    }
  },
  computed: {},
  watch: {
    // isCollapse: is from SidebarMixin
    'fullmenuDrawer.show' (val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.cookPopper.computerSearch()
          this.$refs.navTabs.handleResize()
        })
      } else {
        this.$refs.cookPopper.setQuery('')
      }
    },
    value (v) {
      this.fullmenuDrawer.data = v
    },
    defaultActive (v) {
      this.fullmenuDrawer.defaultActive = v
    },
    favourItemList (list) {
      this.favourMenuList = list
    },
  },
  methods: {
    // expandSiderbar is from SidebarMixin
    toggleFullmenu (force) {
      if (typeof force == 'boolean') {
        this.fullmenuDrawer.show = force
        return
      }
      if (this.trigger == 'hover') {
        if (this.fullmenuDrawer.show) {
          this.fullmenuDrawer.show = !this.fullmenuDrawer.show
        }
        return
      }
      this.fullmenuDrawer.show = !this.fullmenuDrawer.show
    },
    handleHover () {
      if (this.trigger == 'click') {
        return
      }
      this.fullmenuDrawer.show = true
    },

    toggleFavourMenuItem (popMenuItem, detail) {
      // 在 Layout 组件下使用
      // isInLayout is from SidebarMixin
      if (this.isInLayout) {
        if (popMenuItem.isFavour) {
          this.layout.addFavour(popMenuItem)
          return
        }
        this.layout.removeFavour(popMenuItem)
        return
      }
      // 单独使用
      const menuItem = get(this.fullmenuDrawer.data, detail.path)
      menuItem._path = detail.path
      menuItem.isFavour = popMenuItem.isFavour
      if (menuItem.isFavour) {
        const isExist = this.favourMenuList.find(m => m.uuid === menuItem.uuid)
        if (!isExist) {
          this.favourMenuList.push(menuItem)
          this.$emit('update:favourItemList', this.favourMenuList)
          this.$emit('add-favour', filterPrivate(menuItem), 'fromFullMenu')
        }
        return
      }
      this.favourMenuList = this.favourMenuList.filter(m => m.uuid !== menuItem.uuid)
      this.$emit('update:favourItemList', this.favourMenuList)
      this.$emit('remove-favour', filterPrivate(menuItem), 'fromFullMenu')
    },
    // 收藏移除
    removeFavour (menuItem) {
      menuItem.isFavour = false
      // 在 Layout 组件下使用
      // isInLayout is from SidebarMixin
      if (this.isInLayout) {
        this.layout.removeFavour(menuItem)
        return
      }
      // 单独使用
      this.favourMenuList = this.favourMenuList.filter(menuItem => menuItem.isFavour)
      this.$emit('update:favourItemList', this.favourMenuList)
      this.$emit('remove-favour', filterPrivate(menuItem), 'fromFullMenu')
    },
    handleTabClick (item) {
      if (this.isInLayout) {
        this.layout.fullMenuTabClick(item)
        return
      }
      this.$emit('click-full-menu-tab', item, this.favourMenuList)
    },
    handleSelect (item, itemPlace) {
      this.fullmenuDrawer.defaultActive = item.uuid
      if (this.isInLayout) {
        this.layout.sidebarSelect(item)
        return
      }
      this.$emit('select', item, 'favourMenu')
    },
    noop () {},
  },
  mounted () {},
}
</script>
