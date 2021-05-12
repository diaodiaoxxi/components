import {
  getScrollBarSize
} from '@hui/shared-utils'
// import { isIE } from './util'
import { PREFIX } from './config'
export default {
  inject: {
    tableData: { default: () => ({}) },
  },
  methods: {
    alignCls (column, row = {}, index) {
      let cellClassName = ''
      if (row.cellClassName && column.key && row.cellClassName[column.key]) {
        cellClassName = row.cellClassName[column.key]
      }
      return [
        `${PREFIX}-ui-${column.__id}`,
        `${PREFIX}-ui-${column.key}`,
        {
          [`${cellClassName}`]: cellClassName, // cell className
          [`${column.className}`]: column.className, // column className
          [`${this.prefixCls}-column-${column.align}`]: column.align,
          [`${this.prefixCls}-head-column-${this.headAlgin}`]: this.headAlgin,
          [`${this.prefixCls}-body-column-${this.bodyAlgin}`]: this.bodyAlgin,
          [`${this.prefixCls}-head-border-bold`]: this.tableData.lastScrollTop != 0,
          [`${this.prefixCls}-hidden`]: (this.fixed === 'left' && column.fixed !== 'left') || (this.fixed === 'right' && column.fixed !== 'right') || (!this.fixed && (column.fixed && (column.fixed === 'left' || column.fixed === 'right'))),
          // [`${this.prefixCls}-fix-left`]: !(isIE() || this.multiLevel) && column.fixed == 'left',
          // [`${this.prefixCls}-fix-right`]: !(isIE() || this.multiLevel) && column.fixed == 'right',
          // [`${this.prefixCls}-fix-right-first`]: !(isIE() || this.multiLevel) && column.fixed == 'right',
          // [`${this.prefixCls}-fix-left-last`]: !(isIE() || this.multiLevel) && column.fixed == 'left' && this.leftLastColumn()
        }
      ]
    },
    leftLastColumn () {
      let lastInx = false
      for (var i = this.columns.length - 1; i >= 0; i--) {
        if (this.columns[i].fixed == 'left') {
          lastInx = true
          return lastInx
        }
      }
    },
    isPopperShow (column) {
      return column.filters && ((!this.fixed && !column.fixed) || (this.fixed === 'left' && column.fixed === 'left') || (this.fixed === 'right' && column.fixed === 'right'))
    },
    setCellWidth (column, index, top) {
      if (!this.columnsWidth) return
      let width = ''
      if (column.width) {
        width = column.width
      } else if (this.columnsWidth[column._index]) {
        width = this.columnsWidth[column._index].width
      }
      // when browser has scrollBar,set a width to resolve scroll position bug
      // if (this.columns.length === index + 1 && top && this.$parent.bodyHeight !== 0
      //   && this.$parent.data.length>0 && this.$parent.bodyRealHeight > this.$parent.bodyHeight
      //   && this.$parent.tableWidth+1>=this.$parent.initWidth-this.$parent.scrollBarWidth) {
      // //   width += this.$parent.scrollBarWidth;
      // }
      // when fixed type,reset first right fixed column's width
      // if (this.fixed === 'right' && this.sum) {
      //   // const firstFixedIndex = this.columns.findIndex((col) => col.fixed === 'right');
      //   const firstFixedIndex = findIndex(this.columns, (col) => col.type === 'action')
      //   if (firstFixedIndex === index) width += this.$parent.scrollBarWidth
      // }
      if (width === '0') width = ''
      return width
    },
    fixStyle (column, index, flag = false) {
      const style = {}
      let left = 0
      if (column.fixed == 'right' && flag && this.tableRoot.isScrollY) {
        style.right = `${getScrollBarSize()}px`
      }
      if (column.fixed == 'left') {
        for (let i = 0; i < index; i++) {
          left += this.columns[i] ? (this.columns[i].width || this.columns[i]._width) : 0
        }
        style.left = `${left}px`
      }
      return style
    },
  }
}
