<template>
  <!-- TODO 搜索框依赖 single-select 后期单独处理 -->
  <div :class="`${prefix}-right-item ${prefix}-ctrl-search`">
    <h-layout-select
      ref="select"
      :class="{
        'is-has-value': this.query
      }"
      v-bind="selectProps"
      v-on="$listeners"
      style="width:200px;"
      filterable
      placeholder=""
      highLightQuery
      notAutoFocus
      filterMethod="label"
      :isArrow="false"
      :widthAdaption="false"
      :dropWidth="296"
      :auto-placement="false"
      @on-change="selectMenu"
      @query-change="queryChange"
    >
      <!-- :value="selectValue" -->
      <template slot="append">
        <i v-show="this.query" :class="[icon.searchClear, `${prefix}-ctrl-search-clear-icon`]" @click.stop.prevent="clearQuery"></i>
        <i :class="[icon.search, `${prefix}-ctrl-search-icon`]"></i>
      </template>

      <h-layout-select-block
        :data="searchItemList"
        :option-component="SearchItem"
        :optionHeight="32"
        :remain="5"
      >
        <SearchHistory v-if="useHistory" slot="dropHead"></SearchHistory>
      </h-layout-select-block>
    </h-layout-select>
  </div>
</template>

<script>
import CONFIG from '../config'
import SearchItem from './MenuBlockSearchItem'
import SearchHistory from './MenuSearchHistory'
import PropTypes from '@hui/shared-utils/vue-types'
import { omit, get } from '@hui/shared-utils'
export default {
  Name: 'LayoutMenuItemSearch',
  components: {
    SearchHistory,
  },
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
    filterFn: PropTypes.func.def(item => item),
    useHistory: PropTypes.bool.def(false),
  },
  data () {
    this.prefix = 'h-layout-head'
    this.icon = this.CONFIG.ICON
    return {
      SearchItem: SearchItem,
      query: ''
    }
  },
  computed: {
    isInLayout () {
      return this.layout && this.layout._isVue
    },
    menuItemMap () {
      return this.layout.$data.menuItemMap
    },
    searchItemList () {
      const list = Object.keys(this.menuItemMap).map(key => {
        return {
          label: this.menuItemMap[key].title,
          value: this.menuItemMap[key].uuid,
          originalValue: this.menuItemMap[key],
        }
      })
      return list.filter(this.filterFn)
    },
    selectProps () {
      return omit(this.$props, ['filterFn'])
    },
  },
  methods: {
    clearQuery () {
      if (get(this.$refs, 'select.onClearSelect')) {
        this.$refs.select.onClearSelect()
      }
    },
    queryChange (val) {
      this.query = val
    },
    selectMenu (optionVal, optionsValObj) {
      const menu = optionsValObj?.originalValue
      if (!menu) {
        return
      }
      if (this.isInLayout) {
        this.layout.sidebarSelect(menu)
      }
    },
  },
}
</script>
