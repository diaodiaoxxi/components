<template>
  <div ref="sidebar" class="h-layout-sidebar" :class="{ 'is-collapse': isSCollapse }" data-hui-type="menuWrap">
    <div ref="body" class="h-layout-sidebar-body" >
      <!-- menuProps is from sidebarMixins -->
      <h-layout-menu
        class="h-layout-sidebar-main-menu"
        data-hui-type="menu"
        v-bind="menuProps"
        :collapse="isCollapse"
        :style="{ marginRight: marginRight }"
      >
        <!-- :unique-opened="true" -->
        <template v-for="item in value">
          <h-layout-cook-submenu
            v-if="Array.isArray(item.children) && item.children.length > 0"
            :key="item.uuid"
            :index="item.uuid"
            :icon="item.icon"
            :title="item.title"
            :value="item.children"
            :favourItemList="item.favourItemList"
            :getScrollWrap="getScrollWrap"
            :horizontal="horizontal"
            @click-item="handleItemClick"
            @add-favour="handleFavourAdd"
            @remove-favour="handleFavourRemove"
          ></h-layout-cook-submenu>

          <h-layout-menu-item
            v-else
            :key="item.uuid"
            :index="item.uuid"
            :icon="item.icon"
            :title="item.title"
            :hasAfterLine="false"
            @click.native="handleItemClick(item)"
          ></h-layout-menu-item>
        </template>
      </h-layout-menu>
    </div>

    <!-- TODO cook-submenu 每个插入浮窗 大批量菜单数据影响性能 后期优化-->

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
import clickoutside from '@hui/directives/clickoutside'
import SidebarMixin from '../SidebarMixin'
import { filterPrivate } from '@hui/shared-utils/index'
import { getScrollbarWidth } from '@hui/shared-utils/index'

export default {
  directives: { clickoutside },
  mixins: [SidebarMixin],
  data () {
    // isCollapse: false,
    // isSCollapse: false,
    // is from SidebarMixin
    return {
      marginRight: 0,
    }
  },
  methods: {
    // expandSiderbar is from SidebarMixin
    handleItemClick (item) {
      if (this.isInLayout) {
        this.layout.sidebarSelect(item)
        return
      }
      this.$emit('select', filterPrivate(item))
    },
    handleFavourAdd (item) {
      if (this.isInLayout) {
        this.layout.addFavour(item)
        return
      }
      this.$emit('add-favour', filterPrivate(item), 'fromCookMenu')
    },
    handleFavourRemove (item) {
      if (this.isInLayout) {
        this.layout.removeFavour(item)
        return
      }
      this.$emit('remove-favour', filterPrivate(item), 'fromCookMenu')
    },
    getScrollWrap () {
      return this.$refs.body
    },
    // 修复出现滚动条时浮窗滚动条出现偏差
    computedSidebar () {
      const width = getScrollbarWidth()
      const isScrollY = this.$refs.body.scrollHeight > this.$refs.body.offsetHeight
      if (isScrollY) {
        this.marginRight = `-${width}px`
      }
    },
  },
  mounted () {
    // on(document, 'mousemove', mouseMoveDocument)
    this.computedSidebar()
  },
  updated () {
    this.computedSidebar()
  },
  destroyed () {
    // off(document, 'mousemove', mouseMoveDocument)
  },
}
</script>
