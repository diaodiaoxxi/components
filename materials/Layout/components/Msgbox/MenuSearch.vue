<template>
  <div>
    <!-- TODO 搜索框依赖 single-select 后期单独处理 -->
    <div :class="`${prefix}-topbar-right-item ${prefix}-topbar-ctrl-search`">
      <hLayoutSelect
        v-bind="selectProps"
        v-on="$listeners"
        style="width:200px;"
        filterable
        placeholder=""
        valueKey="uuid"
        highLightQuery
        notAutoFocus
        filterMethod="label"
        :isArrow="false"
        :widthAdaption="true"
        :dropWidth="290"
        :auto-placement="false"
      >
        <!-- :value="selectValue" -->
        <i slot="append" :class="[icon.search, `${prefix}-topbar-ctrl-search-icon`]"></i>
        <hLayoutOption
          v-for="item in searchItemList"
          :key="item.uuid"
          :label="item.title"
          :value="item"
        >
          <template v-slot="slotProps">
            <SearchItem :data="slotProps"></SearchItem>
          </template>
        </hLayoutOption>
      </hLayoutSelect>
    </div>
  </div>
</template>

<script>
import CONFIG from '../config'
import SearchItem from './MenuSearchItem'
import { omit } from '@hui/shared-utils'
export default {
  Name: 'LayoutHeadSearch',
  components: { SearchItem },
  provide () {
    return {
      SELECT_CONFIG: {
        PREFIX: 'h-layout',
      },
    }
  },
  inject: {
    CONFIG: { default: () => CONFIG },
    layout: { default: () => {} },
  },
  inheritAttrs: false,
  props: {
    data: {
      type: Array,
      default () {
        return []
      },
    },
    filterFn: {
      type: Function,
      default () {
        return item => !!item
      },
    },
  },
  data () {
    this.prefix = 'h-layout-head'
    this.icon = this.CONFIG.ICON
    return {}
  },
  computed: {
    isInLayout () {
      return this.layout && this.layout._isVue
    },
    menuItemMap () {
      return this.layout.$data.menuItemMap
    },
    searchItemList () {
      const list = Object.keys(this.menuItemMap).map(key => this.menuItemMap[key])
      return list.filter(this.filterFn)
    },
    selectProps () {
      return omit(this.$props, ['filterFn'])
    }
  },
  methods: {},
}
</script>
