<template>
  <h-layout-option v-bind="$props" :value="searchItem">
    <div :class="_getCls('item')">
      <span :class="_getCls('item-text')"   v-html="hLabel"></span>
      <i
        v-if="_canFavour(searchItem.originalValue)"
        :class="[
          ICON.star,
          _getCls('item-icon'),
          {
            'is-favour': searchItem.originalValue.isFavour,
          },
        ]"
        @click.stop="toggleFavor"
      ></i>
    </div>
  </h-layout-option>
</template>
<script>
import { get } from '@hui/shared-utils'
const CONFIG = {
  PREFIX: 'h',
  ICON: {
    star: 'layout-iconfont h-layout-icon-star',
  },
}
export default {
  name: 'LayoutHeadSearchItem',
  inject: {
    CONFIG: { default: () => CONFIG },
    layout: {
      default: () => {
        return {}
      },
    },
    selectData: {
      default () {
        return {}
      }
    }
  },
  props: {
    label: String,
    value: String,
    selected: Boolean,
    isFocused: Boolean,
    optionTexts: Array,
    // menuItem
    originalValue: Object,
  },
  data () {
    const prefix = 'h-layout-head'
    this.ICON = this.CONFIG.ICON
    this.prefixCls = `${prefix}-search-item`
    return {}
  },
  computed: {
    isInLayout () {
      return this.layout && this.layout._isVue
    },
    searchItem () {
      return get(this.$props, ['originalValue'])
    },
    hLabel () {
      const parsedQuery = this.selectData.query.replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1')
      return this.createHighLightLabel(parsedQuery, this.label, true)
    }
  },
  methods: {
    _getCls (element = '') {
      const prefix = this.CONFIG.PREFIX
      return `${prefix}-layout-head-search-${element}`
    },
    _canFavour (item = {}) {
      return item.canFavour || item.canFavour == undefined
    },
    createHighLightLabel (searchValue, label, highLightQuery = false) {
      const prefixCls = this.prefixCls
      if (!highLightQuery) {
        return
      }
      if (typeof label != 'string') {
        throw new Error('label must be string')
      }
      const index = label.indexOf(searchValue)
      const beforeStr = label.substr(0, index)
      const afterStr = label.substr(index + searchValue.length)
      const title =
        index > -1 && searchValue && searchValue.trim()
          ? `${beforeStr}<span class="${prefixCls}-hlight">${searchValue}</span>${afterStr}`
          : `${label}`
      return title
    },
    toggleFavor (item) {
      const menu = this.searchItem.originalValue
      if (this.isInLayout) {
        if (menu.isFavour) {
          this.layout.removeFavour(menu)
        } else {
          this.layout.addFavour(menu)
        }
      }
    },
  },
}
</script>
