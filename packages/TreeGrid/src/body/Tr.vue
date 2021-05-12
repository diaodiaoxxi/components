<template>
    <!-- <tr v-if="draggable" data-drag="true"  tabindex="-1" name="arrow-move" draggable="true" @dragstart="dragStart($event, row._index)" :class="rowClasses(row._index)" @dragover.prevent="dragOver($event, row._index)" @drop.prevent="drop($event, row._index)" @dragend="dragEnd($event)"><slot></slot></tr> -->
    <tr tabindex="-1" @keydown="handleKey" :class="rowClasses(row._rowid)"><slot></slot></tr>
</template>
<script>
import Emitter from '@hui/shared-utils/vue-mixins/emitter'
import { findIndex } from '@hui/shared-utils'

export default {
  mixins: [Emitter],
  props: {
    row: Object,
    prefixCls: String,
    clickToSelect: Boolean,
    columns: Array
  },
  inject: {
    tableData: { default: () => ({}) },
    tableRoot: { default: () => ({}) }
  },
  computed: {
    objData () {
      return this.tableData.objData
    },
    table () {
      return this.tableRoot
    },
    draggable () {
      return findIndex(this.columns, col => col.type === 'drag') > -1
      // return false
    }
  },
  created () {
    const rowAutoLoad = Boolean(this.row.autoLoad)
    if (
      rowAutoLoad &&
      'loading' in this.row &&
      !this.row.loading &&
      !this.row.leaf &&
      this.table.loadData &&
      ((this.row.childrenId && this.row.childrenId.length == 0) ||
        !this.row.childrenId)
    ) {
      this.table.handleToggleExpand(this.row, true)
    }
  },
  methods: {
    handleKey (e) {
      if (e.keyCode === 40 || e.keyCode === 38) {
        e.preventDefault()
      }
    },
    dragStart (event, index) {
      const dataTransfer = event.dataTransfer
      dataTransfer.effectAllowed = 'move'
      dataTransfer.setData('text', '' + index)
      this.tableRoot.dragEl = event.currentTarget
    },
    drop (event, index) {
      if (!this.checkDragSource()) return
      const table = this.table
      const dataTransfer = event.dataTransfer
      const dragIndex = dataTransfer.getData('text')
      const data = table.rebuildData
      const dragItemIndex = data.findIndex(d => d._index == dragIndex)
      const dragItem = data[dragItemIndex]
      const dropIndex = data.findIndex(d => d._index == index)

      this.dispatch('Table', 'on-drag-drop', dragItemIndex, dropIndex)
      data.splice(dragItemIndex, 1)
      data.splice(dropIndex, 0, dragItem)
      table.rebuildData = [...data]
    },
    dragOver (event, index) {
      if (!this.checkDragSource()) return
      this.table.currDragOverIdx = index
    },
    dragEnd (event) {
      this.table.currDragOverIdx = null
      this.tableRoot.dragEl = null
    },
    /**
       * 检查拖拽的元素是否合法（只有表格行的拖拽列可以拖拽）
       */
    checkDragSource () {
      const dragEl = this.tableRoot.dragEl
      return dragEl && dragEl.dataset.drag === 'true'
    },
    rowClasses (rowId) {
      return [
          `${this.prefixCls}-row`,
          this.rowClsName(rowId),
          {
            [`${this.prefixCls}-row-checked`]: this.objData[rowId] && this.objData[rowId]._isChecked && !this.clickToSelect,
            [`${this.prefixCls}-row-highlight`]: this.objData[rowId] && this.objData[rowId]._isHighlight,
            [`${this.prefixCls}-row-hover`]: this.objData[rowId] && this.objData[rowId]._isHover,
            [`${this.prefixCls}-row-filterable`]: this.objData[rowId] && this.objData[rowId]._isMatched,
            [`${this.prefixCls}-row-dragover`]: this.table.currDragOverIdx === rowId
          }
      ]
    },
    rowClsName (rowId) {
      return this.table.rowClassName(this.objData[rowId], rowId)
    },
  }
}
</script>
