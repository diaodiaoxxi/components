<script>
import HeadCell from './headCell'
import PropTypes from '@hui/shared-utils/vue-types'
import { addClass, removeClass } from '@hui/shared-utils'
import { mergeProps } from '@hui/shared-utils'
import Mixin from '../mixin'
import { PREFIX } from '../config'
export default {
  props: {
    columns: PropTypes.array,
    index: PropTypes.sNumber,
    data: PropTypes.array,
    titleEllipsis: PropTypes.bool,
    objData: PropTypes.object,
    prefixCls: PropTypes.string,
    headAlgin: PropTypes.string,
    fixed: PropTypes.oneOfType([Boolean, String]).def(false)
  },
  mixins: [Mixin],
  components: { HeadCell },
  inject: {
    tableRoot: { default: () => {} },
    tableData: { default: () => {} },
    tableProps: { default: () => {} }
  },
  data () {
    return {
      beginLocation: {},
      cloumnsLeft: {},
    }
  },
  computed: {
    table () {
      return this.tableRoot
    }
  },
  watch: {
    columns: {
      deep: true,
      handler () {
      }
    },
    multiLevel (val) {
      this.multiData = this.multiLevel
    }
  },
  mounted () {
    //  this.changeMultiData(this.multiLevel);
    // this.multiData = this.multiLevel
  },
  methods: {
    mousedown (event, column, index) {
      this.beginLocation.clientX = event.clientX
      this.beginLocation.clientY = event.clientY
      if (this.$isServer) return
      if (!column || (column && column.fixed)) return
      const _this = this
      if (!this.tableProps.canDrag) return
      if (this.draggingColumn) {
        this.dragging = true
        this.table.resizeProxyVisible = true
        const table = this.table
        const tableEl = table.$el
        const tableLeft = tableEl.getBoundingClientRect().left // table距离左边的值

        // let keyWord = column.key? column.key : column.type
        const columnEl = this.$el.querySelector(`th.${PREFIX}-ui-${column.__id}`) // 拖拽的列元素
        const columnRect = columnEl.getBoundingClientRect()
        const minLeft = columnRect.left - tableLeft + this.tableProps.minDragWidth
        addClass(columnEl, 'noclick')
        this.dragState = {
          startMouseLeft: event.clientX, // 移动开始时鼠标的横坐标
          startLeft: columnRect.right - tableLeft, // 元素右边距离左边界的left值
          startColumnLeft: columnRect.left - tableLeft, // 元素左边距离左边界的left值
          tableLeft
        }

        const resizeProxy = table.$refs.resizeProxy
        resizeProxy.style.left = this.dragState.startLeft + 'px' // 移动left值

        document.onselectstart = function () {
          return false
        }
        document.ondragstart = function () {
          return false
        }

        const handleMouseMove = event => {
          document.body.style.cursor = 'col-resize'
          const deltaLeft = event.clientX - this.dragState.startMouseLeft // 移动距离
          const proxyLeft = this.dragState.startLeft + deltaLeft // 移动之后距离左边界的值

          resizeProxy.style.left = Math.max(minLeft, proxyLeft) + 'px'
        }

        const handleMouseUp = () => {
          if (_this.dragging) {
            const { startColumnLeft, startLeft } = _this.dragState
            const finalLeft = parseInt(resizeProxy.style.left, 10)
            const _column = table.columns.find(
              item => item.__id === column.__id
            )
            const dragWidth = finalLeft - startLeft // >0为输入框增大，<0为减小
            let columnWidth = 0
            if (_column) _column.width = columnWidth
            columnWidth = finalLeft - startColumnLeft
            _this.$emit(
              'on-change-width',
              dragWidth,
              column.__id,
              columnWidth,
              {
                index: index,
                key: column.key
              }

            )

            document.body.style.cursor = ''
            _this.dragging = false
            _this.draggingColumn = null
            _this.dragState = {}

            table.resizeProxyVisible = false
          }

          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
          document.onselectstart = null
          document.ondragstart = null

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
      if (this.tableProps.canDrag) {
        // moveDrag需传入event win7下FF60版本不可拖拽
        // if (lastInx == index) return
        this.moveDrag(event, target, column)
      }
    },
    moveDrag (event, target, column) {
      if (!column || (column && column.fixed)) return
      if (!this.dragging && !this.moveing) {
        const rect = target.getBoundingClientRect()
        const bodyStyle = document.body.style
        if (rect.width > 12 && rect.right - event.pageX < 8) {
          bodyStyle.cursor = 'col-resize'
          this.draggingColumn = column
        } else if (!this.dragging) {
          if (!this.tableProps.canMove) bodyStyle.cursor = ''
          this.draggingColumn = null
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
  },
  render () {
    const { columns, headAlgin, prefixCls, fixed } = this
    return (
      <tr class="cur-th">
        {
          columns.map((column, index) => {
            const headerProps = mergeProps({
              class: this.alignCls(column, {}, index),
              on: {
                mousedown: e => {
                  this.mousedown(e, column, index)
                },
                mouseout: e => {
                  this.mouseout(e, column, index)
                },
                mousemove: e => {
                  this.mousemove(e, column, index)
                },
                mouseup: e => {
                  this.mouseup(e, column, index)
                },
              }
            })
            const headerCellProps = mergeProps({
              class: [
                `${prefixCls}-cell`,
                {
                  [`${prefixCls}-hidden`]:
                        !fixed && column.fixed &&
                        (column.fixed === 'left' || column.fixed === 'right'),
                  [`${prefixCls}-head-column-${headAlgin}`]: headAlgin,
                }
              ]
            })
            return (
              <th { ...headerProps }>
                <HeadCell
                  {...headerCellProps}
                  column={column}
                  prefixCls={this.prefixCls}
                  data={this.data}
                  objData={this.objData}
                  index={index}
                  fixed={fixed}
                  titleEllipsis={this.titleEllipsis}
                ></HeadCell>
              </th>
            )
          })
        }
        { this.table.isScrollY && fixed != 'left' && <th
          class="gutter"
          style= {{ width: this.table.scrollBarWidth + 'px', borderRight: 0, borderBottom: 0, backgroundColor: '#fff' }}
        >
        </th>}

      </tr>
    )
  }
}
</script>
