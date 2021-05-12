<template>
  <table-tr
    :draggable="draggable"
    :row="source"
    :key="source._index"
    :prefix-cls="prefixCls"
    :columns="columns"
    tabindex="-1"
    @mouseenter.native.stop="handleMouseIn(source._rowid, $event, source._index)"
    @mouseleave.native.stop="handleMouseOut(source._rowid, $event, source._index)"
    @click.native="clickCurrentRow(source, $event, source._index)"
    @dblclick.native.stop="dblclickCurrentRow(source._rowid, $event, source._index)"
    v-if="show(source)"
  >
    <template v-for="(column, colIndex) in columns">
      <td
        :key="colIndex"
        v-bind="getSpan(source, column, index, colIndex)"
        v-if="showWithSpan(source, column, index, colIndex)"
        :style="{ height: size + 'px', ...fixStyle(column, colIndex) }"
        :class="alignCls(column, source, colIndex)"
      >
        <!-- :fixed="fixed" -->
        <table-cell
          v-if="
            (sum && (column.isSum || column.type == 'index' || column.type == 'selection')) || !sum
          "
          :fixed="fixed"
          :prefix-cls="prefixCls"
          :row="source"
          :key="column._columnKey"
          :column="column"
          :natural-index="index"
          :index="source._index"
          :showTitle="showTitle"
          :checked="rowChecked(source)"
          :disabled="rowDisabled(source)"
          :expanded="rowExpanded(source)"
          :sum="sum"
          :columnIndex="colIndex"
        >
          <!-- {{ objData[source._rowid].childrenId? objData[source._rowid].childrenId.length : 0}} -->
          <!-- {{ source._index}} -->
          <!-- <div :class="classesTd(column)" style="display: inline"> -->
          <template>
            <!-- {{column}} -->
            <span v-if="column._treeNode" :style="indentCls(source._level)">
              <span class="expand-icon">
                <!-- qqqq -->
                <Icon
                  v-if="showArrow(source)"
                  name="play_fill"
                  :class="iconClass(source)"
                  @click.native.stop="handleToggleExpand(source)"
                ></Icon>
                <Icon
                  v-else-if="source.leaf + '' !== 'true' && source.loading + '' === 'true'"
                  name="load-c"
                  :class="[PREFIX + '-load-loop']"
                ></Icon>
              </span>
            </span>
          </template>
          <!-- <template v-if="column.type === 'index'">{{source._index + 1}}</template> -->
          <!-- <template v-if="column.type === 'selection'">
                <Checkbox :size="calcCheckboxSize(column.checkboxSize)" :value="rowChecked(source._index)" @click.native.stop="handleClickTr($event,source._index,rowChecked(source._index))" @on-change="toggleSelect(source._index)" :disabled="rowDisabled(source._index)"></Checkbox>
            </template> -->
          <!-- </div> -->
          <!-- {{ objData[source._rowid]._isShow}} -->
        </table-cell>
      </td>
    </template>
  </table-tr>
</template>
<script>
import TableTr from './Tr'
import TableCell from './BodyCell'
import Mixin from '../mixin'
import PropTypes from '@hui/shared-utils/vue-types'
import { Icon } from 'h_ui/dist/h_ui.min.js'
// import Checkbox from '@/components/Checkbox/Checkbox.vue'
// import Icon from '../../../../hui-component/src/components/Icon/Icon.vue'
import { TABLE_ICON, PREFIX } from '../config'
export default {
  name: 'dynamic-size-item',
  components: { TableCell, TableTr, Icon },
  inject: {
    tableData: { default: () => ({}) },
    tableRoot: { default: () => ({}) },
  },
  mixins: [Mixin],
  props: {
    source: {
      type: Object,
      default () {
        return {}
      },
    },
    index: {
      type: Number,
    },
    // naturalIndex: PropTypes.sNumber,
    columns: PropTypes.array,
    prefixCls: PropTypes.string,
    draggable: PropTypes.bool,
    fixed: PropTypes.oneOfType([Boolean, String]).def(false),
    bodyAlgin: PropTypes.string,
    showTitle: PropTypes.bool,
    sum: PropTypes.bool,
    size: PropTypes.sNumber,
    columnsWidth: PropTypes.object,
    virtual: PropTypes.bool,
    multiLevel: PropTypes.array,
    spanMethod: PropTypes.func,
  },
  computed: {
    objData () {
      return this.tableRoot.objData
    },
    table () {
      return this.tableRoot
    },
    // index () {
    //   return this.virtual ? this.source.naturalIndex : this.naturalIndex
    // }
  },
  data () {
    return {
      TABLE_ICON,
      PREFIX
    }
  },
  methods: {
    classesTd (column) {
      return [
        `${this.prefixCls}-cell`,
        {
          [`${this.prefixCls}-cell-ellipsis`]: column.ellipsis && column.ellipsis != 'false',
        },
      ]
    },
    // 树节点展开按钮样式
    iconClass (row) {
      // let inx = this.indexAndId[id]
      return [
        TABLE_ICON.expand,
        `${this.prefixCls}-icon-click`,
        {
          [`${this.prefixCls}-icon-click-expanded`]: this.objData[row._rowid]._isExpand,
        },
      ]
    },
    // 树表格父节点按钮样式
    indentCls (level) {
      const style = {}
      style.marginLeft = 20 * (level - 1) + 'px'
      return style
    },
    // -- 显示与隐藏
    show (row) {
      return row._level == 1 || this.objData[row._rowid]._isShow
    },
    // 是否显示父节点图标
    showArrow (row) {
      return (
        (row.childrenId && row.childrenId.length != 0 && !row.leaf) ||
        ('loading' in row && !row.loading && !row.leaf && this.table.loadData)
      )
    },
    calcCheckboxSize (size) {
      return size || 'large'
    },
    handleToggleExpand (row) {
      this.table.handleToggleExpand(row)
    },
    handleClickTr () {},
    toggleSelect () {},
    rowChecked (row) {
      return this.objData[row._rowid] && this.objData[row._rowid]._isChecked
    },
    rowDisabled (row) {
      return this.objData[row._rowid] && this.objData[row._rowid]._isDisabled
    },
    rowExpanded (row) {
      return this.objData[row._rowid] && this.objData[row._rowid]._isExpand
    },
    handleMouseIn (rowId, event, rowKey) {
      event.stopPropagation()
      this.table.handleMouseIn(rowId, rowKey)
    },
    handleMouseOut (rowId, event, rowKey) {
      event.stopPropagation()
      this.table.handleMouseOut(rowId, rowKey)
    },
    clickCurrentRow (row, event) {
      event.stopPropagation()
      // const curIndex = this.virtual ? row.naturalIndex : this.naturalIndex
      if (this.sum || this.objData[row._rowid]._isDisabled) return
      // if (this.table.rowSelect) {
      //   this.table.toggleSelect(row, event, curIndex)
      // }
      this.table.clickCurrentRow(row, event, this.index)
    },
    dblclickCurrentRow (rowId, event, rowKey) {
      event.stopPropagation()
      // if (this.sum) return
      // const curIndex = this.virtual ? this.source.naturalIndex : this.naturalIndex
      // this.table.dblclickCurrentRow(rowId, curIndex)
    },
    getSpan (row, column, rowIndex, columnIndex) {
      const fn = this.spanMethod
      if (typeof fn === 'function') {
        const result = fn({
          row,
          column,
          rowIndex,
          columnIndex,
        })
        let rowspan = 1
        let colspan = 1
        if (Array.isArray(result)) {
          rowspan = result[0]
          colspan = result[1]
        } else if (typeof result === 'object') {
          rowspan = result.rowspan
          colspan = result.colspan
        }

        return {
          rowspan,
          colspan,
        }
      } else {
        return {}
      }
    },
    showWithSpan (row, column, rowIndex, columnIndex) {
      const result = this.getSpan(row, column, rowIndex, columnIndex)
      return !(
        ('rowspan' in result && result.rowspan === 0) ||
        ('colspan' in result && result.colspan === 0)
      )
    },
  },
}
</script>
