<template>
  <div class="h-layout-tabbar">
    <NavTabs mode="keep-width" v-bind="$attrs" v-on="tabEventMap">
      <template slot="contextmenuItem" slot-scope="{tabInfo}">
          <slot name="contextmenuItem" :tabInfo="tabInfo"></slot>
      </template>
    </NavTabs>
  </div>
</template>
<script>
import NavTabs from '@packages/NavTabs'
import { pick } from '@hui/shared-utils'
const NAV_TABS_CONFIG = {
  PREFIX: 'h',
  ICON: {
    left: 'layout-iconfont h-layout-icon-arrow-left',
    right: 'layout-iconfont h-layout-icon-arrow-right',
    close: 'layout-iconfont h-layout-icon-close',
  },
}

export default {
  name: 'LayoutTabbar',
  components: { NavTabs },
  inheritAttrs: false,
  provide () {
    return { NAV_TABS_CONFIG }
  },
  inject: { layout: { default: {} } },
  data () {
    return {}
  },
  computed: {
    isInLayout () {
      return this.layout && this.layout._isVue
    },
    tabEventMap () {
      if (this.isInLayout) {
        const events = [
          'click',
          'before-close',
          'close',
          'before-close-all',
          'close-all',
          'before-close-other',
          'close-other',
          'refresh-page',
        ]
        const layoutEventList = events.map(item => `tab-${item}`)
        const eventMap = pick(this.$listeners, layoutEventList)
        const layoutEventMap = {}
        Object.keys(eventMap).forEach(key => {
          const name = key.replace('tab-', '')
          layoutEventMap[name] = eventMap[key]
        })
        return Object.assign(
          layoutEventMap,
          pick(this.$listeners, ['input', 'update:defaultTab', 'update:default-tab']),
        )
      }
      return this.$listeners
    },
  },
}
</script>
