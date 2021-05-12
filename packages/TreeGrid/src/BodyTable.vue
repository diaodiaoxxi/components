<script>

import { getContentHeightScrolled, getContentWidthScrolled, hasClass, getScrollBarSize } from '@hui/shared-utils'
import PropTypes from '@hui/shared-utils/vue-types'
import { TABLE_ICON } from './config'
import BodyRow from '../src/body/BodyRow'
import ColGroup from './ColGroup'
import { mergeProps } from '@hui/shared-utils'
import VirtualList from './TableVirtualScroll'
import { uuid } from '@hui/shared-utils/index'
export default {
  name: 'GirdBody',
  props: {
    columnsWidth: PropTypes.object,
    columns: PropTypes.array,
    prefixCls: PropTypes.string,
    bigData: PropTypes.object,
    data: PropTypes.array,
    draggable: PropTypes.bool,
    fixed: PropTypes.string,
    styleObject: PropTypes.object,
    bodyAlgin: PropTypes.string,
    showTitle: PropTypes.bool,
    sum: PropTypes.bool,
    size: PropTypes.sNumber,
    multiLevel: PropTypes.array,
    tableClassName: PropTypes.oneOfType([Array, String]),
  },
  data () {
    this.uuid = uuid()
    return {
      TABLE_ICON,
      scrollBarWidth: getScrollBarSize(),
      buttomNum: null,
      topNum: null,
      lastScrollTop: 0,
      horizontalToBottom: null
    }
  },
  methods: {
    hideColumnFilter () {
      this.columns.forEach(col => (col._filterVisible = false))
    },
    handleBodyScroll (event) {
      if (hasClass(event.target, `${this.prefixCls + '-fixed-body'}`)) return
      if (hasClass(event.target, `${this.prefixCls + '-summary-body'}`)) return
      if (this.showHeader) { this.$refs.header.scrollLeft = event.target.scrollLeft }
      this.hideColumnFilter()
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
      this.lastScrollTop = event.target.scrollTop
    },
  },
  render () {
    const bodyProps = mergeProps({
      style: this.bodyStyle,
      class: this.tableClassName,
      on: {
        scroll: (e) => { if (!this.fixed) this.handleBodyScroll(e) }
      },
    })
    const rootScrollEle = document.querySelector('[data-hui-table="basic-tbody"]')
    const bigDataTbodyProps = {
      props: {
        dataSources: this.data,
        dataComponent: BodyRow,
        dataKey: '_rowid',
        prefixCls: this.prefixCls,
        tableStyle: this.styleObject,
        rootScrollEle,
        ...this.bigData,
        extraProps: {
          columns: this.columns,
          prefixCls: this.prefixCls,
          draggable: this.draggable,
          fixed: this.fixed,
          styleObject: this.styleObject,
          bodyAlgin: this.bodyAlgin,
          showTitle: this.showTitle,
          sum: this.sum,
          size: this.bigData.size,
          columnsWidth: this.columnsWidth,
          virtual: true,
          multiLevel: this.multiLevel,
          uuid: this.uuid
        },
      }
    }
    return (
      <div {...bodyProps} data-hui-table="basic-tbody" >
        <VirtualList {...bigDataTbodyProps} style={this.styleObject} ref={this.fixed ? 'fixedTbody' : 'tbody'}>
          <ColGroup columnsWidth={this.columnsWidth} slot="header" fixed={this.fixed} columns={this.columns}></ColGroup>
        </VirtualList>
      </div>
    )
  }
}
</script>
