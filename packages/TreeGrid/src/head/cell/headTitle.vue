<template>
  <div
    :class="[titleClass, ellipsisClass]"
    v-on:mousedown="mousedown($event, column, index)"
    v-on:mouseout="mouseout($event, column, index)"
    v-on:mousemove="mousemove($event, column, index)"
    v-on:mouseup="mouseup($event, column, index)"
  >
    <ToolTip v-if="column.labelTip" :transfer="true" placement="top" :content="column.labelTip">
      <i
        ref="info-circle-filled"
        name="info-circle-filled"
        :class="[
          prefixCls + '-label-tip',
          TABLE_ICON.tip
        ]"
      ></i>
    </ToolTip>

    <template v-if="column.type === 'expand'"></template>
    <render-header
      v-else-if="column.renderHeader"
      :render="column.renderHeader"
      :column="column"
      :index="index"
    ></render-header>
    <template v-else>
      <Checkbox
        class="span-cell"
        v-if="column.type === 'selection' && !column.title && this.tableProps.headSelection"
        size="large"
        @mousedown.native.stop="handleClick"
        :value="isSelectAll"
        @on-change="selectAll"
        :indeterminate="isIndeterminate"
      ></Checkbox>
      <div
        v-else
        class="span-cell"
        :class="ellipsisClass"
        :title="column.headerTooltip ? column.title : ''"
      >{{ column.title || "#" }}</div>
    </template>

  </div>
</template>
<script>
import ToolTip from '@packages/Tooltip'
import PropTypes from '@hui/shared-utils/vue-types'
import { off, addClass, removeClass } from '@hui/shared-utils'

import { Checkbox } from 'h_ui/dist/h_ui.min.js'
import renderHeader from '../../header'
import { TABLE_ICON } from '../../config'
import { PREFIX } from '../../config'
// import Icon from '@/components/Icon/Icon.vue'
export default {
  inject: {
    tableRoot: { default: () => {} },
    tableData: { default: () => {} },
    tableProps: { default: () => {} }
  },
  props: {
    data: PropTypes.array,
    objData: PropTypes.object,
    column: PropTypes.object,
    prefixCls: PropTypes.string,
    index: PropTypes.sNumber,
    titleEllipsis: PropTypes.bool
  },
  components: { Checkbox, renderHeader, ToolTip },
  computed: {
    columns () {
      return this.tableData.cloneColumns
    },
    table () {
      return this.tableRoot
    },
    titleClass () {
      return `${this.prefixCls}-head-title`
    },
    ellipsisClass () {
      return [
        // `${this.prefixCls}-head-title`,
        {
          [`${this.prefixCls}-cell-ellipsis`]: true
          // this.titleEllipsis && this.titleEllipsis != 'false'
        }
      ]
    },
    isSelectAll () {
      let isSelectAll = true
      let allDisable = true
      if (!this.data.length) isSelectAll = false
      isSelectAll = !this.data.some(val => {
        if (!this.objData[val._rowid]) return
        return !this.objData[val._rowid]._isChecked && !this.objData[val._rowid]._isDisabled
      })
      allDisable = !this.data.some(val => {
        if (!this.objData[val._rowid]) return
        return !this.objData[val._rowid]._isDisabled
      })
      if (isSelectAll && allDisable) isSelectAll = false
      return isSelectAll
    },
    isIndeterminate () {
      let isIndeterminate = false
      const someSelect = this.data.some(val => {
        if (!this.objData[val._rowid]) return
        return !!this.objData[val._rowid]._isChecked
      }
      ) // 是否有选中
      isIndeterminate = !this.isSelectAll && someSelect && !this.tableProps.checkStrictly
      return isIndeterminate
    },
  },
  data () {
    return {
      sortIndex: 0,
      TABLE_ICON,
      cloumnsLeft: {},
      beginLocation: {}
    }
  },
  watch: {
    columns: {
      deep: true,
      handler () {
        this.getLeftWidth()
      }
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.getLeftWidth)
  },
  methods: {
    handleClick (event) {
      event.stopPropagation()
    },
    selectAll () {
      const status = !this.isSelectAll
      this.table.selectAll(status)
    },
    handleSort (index) {
      if (!this.column.sortable) return
      let type = this.column._sortType
      switch (this.column._sortType) {
        case 'normal': type = 'asc'; break
        case 'asc': type = 'desc'; break
        case 'desc': type = 'normal'; break
        default: type = 'normal'; break
      }
      const _index = this.column._index
      this.table.handleSort(_index, type)
      this.sortIndex = index
    },
    getLeftWidth () {
      this.$nextTick(() => {
        for (let i = 0; i < this.columns.length; i++) {
          let leftWidth = 0
          for (let j = 0; j < i; j++) {
            leftWidth = leftWidth + this.columns[j]._width
          }
          this.cloumnsLeft[i] = leftWidth
        }
      })
    },
    mousedown (event, column, index) {
      this.beginLocation.clientX = event.clientX
      this.beginLocation.clientY = event.clientY
      if (this.$isServer) return
      if (!column || (column && column.fixed)) return
      const _this = this
      if (!this.tableProps.canMove) return
      if (this.moveingColumn) {
        this.moveing = true
        addClass(document.body, 'useSelect')
        this.table.moveProxyVisible = true
        const dom = this.findObj(event, 'TH').cloneNode(true)
        dom.width = column._width
        addClass(dom, 'move-proxy-th')
        const table = this.table
        const tableEl = table.$el
        const targetEl = this.$parent.$parent.$el
        const tableLeft = tableEl.getBoundingClientRect().left
        const tableTop = tableEl.getBoundingClientRect().top
        const columnEl = targetEl.querySelector(`th.${PREFIX}-ui-${column.__id}`)
        const columnRect = columnEl.getBoundingClientRect()
        addClass(columnEl, 'noclick')
        this.moveState = {
          startMouseLeft: event.clientX,
          startLeft: columnRect.left - tableLeft - 1,
          tableLeft
        }
        const moveProxy = table.$refs.moveProxy
        const resizeProxy = table.$refs.resizeProxy
        moveProxy.style.left = this.moveState.startLeft + 'px'
        moveProxy.style.top = event.clientY - tableTop - 20 + 'px'
        // table.setMoveProxy(index);
        moveProxy.appendChild(dom)
        let resizeIndex = Number(index)
        let resizeLeft
        const handleMouseMove = event => {
          document.body.style.cursor = 'pointer'
          this.table.resizeProxyVisible = true
          const deltaLeft = event.clientX - this.moveState.startMouseLeft
          const moveLeft = this.moveState.startLeft + deltaLeft
          if (deltaLeft > 0) {
            let changeRight = this.cloumnsLeft[index] + deltaLeft
            changeRight = changeRight + column._width
            for (const i in _this.cloumnsLeft) {
              if (changeRight > _this.cloumnsLeft[i] + 30) {
                resizeIndex = Number(i)
              }
            }
            const $th = targetEl.querySelectorAll('th')
            const thRight = $th[resizeIndex].getBoundingClientRect().right
            resizeLeft = thRight - tableLeft - 1
          }
          if (deltaLeft < 0) {
            const changeLeft = this.cloumnsLeft[index] + deltaLeft
            for (const i in _this.cloumnsLeft) {
              if (changeLeft > _this.cloumnsLeft[i] - 50) {
                resizeIndex = Number(i)
              }
            }
            const $th = targetEl.querySelectorAll('th')
            const thLeft = $th[resizeIndex].getBoundingClientRect().left
            resizeLeft = thLeft - tableLeft - 1
          }
          moveProxy.style.left = moveLeft + 'px'
          moveProxy.style.top = event.clientY - tableTop - 20 + 'px'
          resizeProxy.style.left = resizeLeft + 'px'
        }

        const handleMouseUp = () => {
          if (_this.moveing) {
            this.table.sortCloumn(index, resizeIndex, column._index)
            document.body.style.cursor = ''
            removeClass(document.body, 'useSelect')
            _this.moveing = false
            _this.moveingColumn = null
            _this.moveState = {}
            moveProxy.removeChild(dom)
            table.resizeProxyVisible = false
            table.moveProxyVisible = false
          }

          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)

          setTimeout(function () {
            removeClass(columnEl, 'noclick')
          }, 0)
        }
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      }
    },
    mousemove (event, column, index) {
      if (!column) return
      if (column.children && column.children.length > 0) return
      const target = this.findObj(event, 'TH')
      if (this.tableProps.canMove) {
        this.moveMove(event, target, column)
      }
    },
    moveMove (event, target, column) {
      if (!this.moveing && !this.dragging) {
        const rect = target.getBoundingClientRect()
        const bodyStyle = document.body.style
        if (
          rect.right - event.pageX > 8 &&
          rect.right - event.pageX < rect.width
        ) {
          bodyStyle.cursor = 'pointer'
          this.moveingColumn = column
        } else if (!this.moveing) {
          if (!this.tableProps.canDrag) bodyStyle.cursor = ''
          this.moveingColumn = null
        }
      }
    },
    mouseup (event, column, index) {
      // 拖拽表头排序不触发
      if (
        this.isDrag(
          this.beginLocation.clientX,
          this.beginLocation.clientY,
          event.clientX,
          event.clientY
        )
      ) return false
    },
    isDrag (x1, y1, x2, y2) {
      if (Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) <= 1) {
        return false
      }
      return true
    },
    mouseout () {
      if (this.$isServer) return
      document.body.style.cursor = ''
    },
    findObj (e, name) {
      var obj = e.target
      while (obj && obj.tagName != name) {
        obj = obj.parentElement
      }
      return obj
    },
  }
}
</script>
