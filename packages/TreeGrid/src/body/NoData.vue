<template>
  <div
    :class="[prefixCls + '-tip']"
    ref="tip"
    v-show="((!!localeNoDataText && (!data || data.length === 0)) || (!!localeNoFilteredDataText && (!data || data.length === 0)))"
    @scroll="handleBodyScroll"
    :style="tipTableStyle"
  >
    <table cellspacing="0" cellpadding="0" border="0" ref="tipBody">
      <tbody>
          <tr>
              <td :style="{'height':tableStyle.height,'width': tipStyle.width}">
                <slot name="nodata">
                  <span v-html="localeNoDataText" v-if="!data || data.length == 0">22222</span>
                  <span v-html="localeNoFilteredDataText" v-else>111111</span>
                </slot>
              </td>
          </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import {
  getContentHeightScrolled,
  getContentWidthScrolled,
  getScrollBarSize
} from '@hui/shared-utils'
import Locale from '@hui/shared-utils/vue-mixins/locale'
import PropTypes from '@hui/shared-utils/vue-types'
// import { mergeProps } from '@hui/shared-utils'
import { mapTableProps } from '../util'
export default {
  name: 'noData',
  props: {
    prefixCls: PropTypes.string,
    data: PropTypes.array,
    // bodyStyle: PropTypes.object,
    filterFlag: PropTypes.bool,
    isScrollX: PropTypes.bool,
    // ...TableProps
  },
  inject: {
    tableRoot: { default: () => {} },
    tableData: { default: () => {} },
    tableProps: { default: () => {} }
  },
  data () {
    return {
      scrollBarWidth: getScrollBarSize(),
      buttomNum: null,
      noDataAdaptiveBodyHeight: 0,
      // isScrollX: false
    }
  },
  mixins: [Locale],
  computed: {
    ...mapTableProps({
      noDataText: 'noDataText',
      noFilteredDataText: 'noFilteredDataText',
      maxHeight: 'maxHeight',
      noDataHeight: 'noDataHeight',
      height: 'height',
    }),
    localeNoDataText () {
      if (this.noDataText === undefined) {
        return this.t('i.table.noDataText')
      } else {
        return this.noDataText
      }
    },
    localeNoFilteredDataText () {
      if (this.noFilteredDataText === undefined) {
        return this.t('i.table.noFilteredDataText')
      } else {
        return this.noFilteredDataText
      }
    },
    table () {
      return this.tableData
    },
    tipStyle () {
      const style = {}
      if (this.tableWidth !== 0) {
        const width =
          this.tableWidth < this.initWidth
            ? this.initWidth - 1
            : this.tableWidth
        style.width = `${width}px`
      }
      return style
    },
    tipTableStyle () {
      const style = {}
      const bodyHeight = this.table.bodyHeight
      const noDataBodyHeight = this.table.noDataBodyHeight
      let height = 0
      let minHeight = 47
      if (bodyHeight !== 0 || this.maxHeight || this.noDataHeight) {
        // add a height to resolve scroll bug when browser has a scrollBar in fixed type and height prop
        if (this.noDataHeight && this.data.length === 0) height = noDataBodyHeight
        if (this.maxHeight) style.maxHeight = `${bodyHeight}px`
        if (this.height || this.maxHeight || bodyHeight) height = bodyHeight
      } else {
        height = this.noDataAdaptiveBodyHeight
        const scrollWidth = this.isScrollX ? this.scrollBarWidth : 0
        minHeight = this.noDataAdaptiveBodyHeight + scrollWidth
      }
      height = height < minHeight ? minHeight : height
      style.minHeight = `${minHeight}px`
      style.height = `${height}px`
      return style
    },
    tableStyle () {
      const style = {}
      const bodyHeight = this.table.bodyHeight
      const noDataBodyHeight = this.table.noDataBodyHeight
      let height = 0
      if (bodyHeight !== 0 || this.maxHeight || this.noDataHeight) {
        // add a height to resolve scroll bug when browser has a scrollBar in fixed type and height prop
        if (this.noDataHeight && this.data.length === 0) height = noDataBodyHeight
        if (this.maxHeight) style.maxHeight = `${bodyHeight}px`
        if (this.height || this.maxHeight || bodyHeight) height = bodyHeight
      } else {
        height = this.noDataAdaptiveBodyHeight
      }
      style.height = `${height}px`
      return style
    },
    tableWidth () {
      return this.table.tableWidth
    },
    initWidth () {
      return this.table.initWidth
    }
  },
  updated: function () {
    this.$nextTick(function () {
      this.noDataAdaptiveBodyHeight = this.$refs.tipBody.clientHeight
    })
  },
  methods: {
    handleBodyScroll (event) {
      const oldBottomNum = this.buttomNum
      this.buttomNum = getContentHeightScrolled(event.target, this.scrollBarWidth)
      this.horizontalToBottom = getContentWidthScrolled(
        event.target,
        this.scrollBarWidth
      )

      this.topNum = event.target.scrollTop
      if (oldBottomNum !== null && this.buttomNum !== null) {
        this.$emit(
          'on-scroll',
          this.buttomNum,
          this.topNum,
          this.lastScrollTop !== event.target.scrollTop ? 'y' : 'x',
          event.target.scrollLeft,
          this.horizontalToBottom,
          event
        )
      }
      //   this.lastScrollTop = event.target.scrollTop;
    }
  },
  watch: {
    data: {
      handler (val, oldVal) {
      },
      deep: true
    }
  }
}
</script>
