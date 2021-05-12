<script>
import PropTypes from '@hui/shared-utils/vue-types'
import { getScrollBarSize, typeOf } from '@hui/shared-utils'
import HeadRow from './head/headRow'
import ColGroup from './ColGroup'
export default {
  name: 'GirdHead',
  //   mixins: [Mixin, Locale],
  components: { HeadRow, ColGroup },
  inject: {
    tableRoot: { default: () => {} },
    tableData: { default: () => {} }
  },
  props: {
    prefixCls: PropTypes.string,
    styleObject: PropTypes.object,
    columns: PropTypes.array,
    objData: PropTypes.object,
    data: PropTypes.array, // rebuildData for sort or filter
    columnsWidth: PropTypes.object,
    fixed: PropTypes.oneOfType([Boolean, String]).def(false),
    canDrag: PropTypes.bool,
    canMove: PropTypes.bool,
    headAlgin: PropTypes.string,
    minWidth: PropTypes.sNumber,
    minDragWidth: PropTypes.sNumber,
    multiLevel: PropTypes.array,
    titleEllipsis: PropTypes.bool,
    headerClassName: PropTypes.oneOfType([Array, String])
  },
  data () {
    return {
      draggingColumn: null,
      moveingColumn: null,
      dragging: false,
      dragState: {},
      moveState: {},
      moveing: false,
      cloumnsLeft: {},
      multiData: null,
      isCurrent: true,
      sortIndex: 0,
      beginLocation: {},
      operateStyle: [],
      height: '30px',
      scrollBarWidth: getScrollBarSize(),
      isIndeterminate: false
    }
  },
  computed: {
    table () {
      return this.tableData
    },
    styles () { // 深拷贝
      const style = Object.assign({}, this.styleObject)
      const width = parseInt(this.styleObject.width)
      style.width = `${width}px`
      return style
    },
    leftCloneMultiLevel () {
      if (!this.cloneMultiLevel || this.cloneMultiLevel.length == 0) return null
      const data = []
      this.cloneMultiLevel.forEach(cols => {
        const data2 = []
        cols.forEach(item => {
          if (item.fixed && item.fixed === 'left') {
            data2.push(item)
          }
        })
        data.push(data2)
      })
      return data
    },
    rightCloneMultiLevel () {
      if (!this.cloneMultiLevel || this.cloneMultiLevel.length == 0) return null
      const data = []
      this.cloneMultiLevel.forEach(cols => {
        const data2 = []
        cols.forEach(item => {
          if (item.fixed && item.fixed === 'right') {
            data2.push(item)
          }
        })
        data.push(data2)
      })
      return data
    },
    cloneMultiLevel () {
      if (!this.multiLevel || this.multiLevel.length == 0) return null
      const data = []
      let left = []
      let right = []
      let center = []
      if (typeOf(this.multiLevel[0]) != 'array') {
        data[0] = []
        this.multiLevel.forEach(cols => {
          if (!cols.hiddenCol && cols.hiddenCol != 'false') {
            if (cols.fixed && cols.fixed === 'left') {
              left.push(cols)
            } else if (cols.fixed && cols.fixed === 'right' && right.length == 0) {
              right.push(cols)
            } else {
              if (cols.fixed) cols.fixed = undefined
              center.push(cols)
            }
          }
        })
        data[0] = left.concat(center).concat(right)
      } else {
        this.multiLevel.forEach(cols => {
          left = []
          right = []
          center = []
          cols.forEach(item => {
            if (!item.hiddenCol && item.hiddenCol != 'false') {
              if (item.fixed && item.fixed === 'left') {
                left.push(item)
              } else if (item.fixed && item.fixed === 'right' && right.length == 0) {
                right.push(item)
              } else {
                if (item.fixed) item.fixed = undefined
                center.push(item)
              }
            }
          })
          data.push(left.concat(center).concat(right))
        })
      }

      return data.length > 0 ? data : null
    },
  },
  mounted () {
    // this.getLeftWidth()
    //  this.changeMultiData(this.multiLevel);
    this.multiData = this.multiLevel
    // on(window, 'resize', this.getLeftWidth)
  },
  methods: {
    handleMouseWheel () {},
    changeWidth (dragWidth, id, columnWidth, obj) {
      this.$emit('on-change-width', dragWidth, id, columnWidth, obj)
    },
    ellipsisClass (column, titleEllipsis) {
      return {
        [`${this.prefixCls}-cell-ellipsis`]: true
      }
    },
    aliCls (item) {
      return [
        {
          [`${item.className}`]: item.className,
          [`${this.prefixCls}-column-${item.align}`]: item.align
        }
      ]
    }
  },
  watch: {
    columns: {
      deep: true,
      handler () {
        // this.getLeftWidth()
      }
    },
    multiLevel (val) {
      this.multiData = this.multiLevel
    }
  },
  beforeDestroy () {
    // off(window, 'resize', this.getLeftWidth)
  },
  render () {
    const cloneMultiLevel = this.fixed ? (this.fixed == 'right' ? this.rightCloneMultiLevel : this.leftCloneMultiLevel) : this.cloneMultiLevel
    return (
      <div class={this.headerClassName} ref="header">
        <table
          cellspacing="0"
          cellpadding="0"
          border="0"
          class="table-header"
          style={this.styles}
          ref="tHead"
        >
          <ColGroup columns={this.columns} isScrollY={this.table.isScrollY} fixed={this.fixed} head={true} columnsWidth={this.columnsWidth}></ColGroup>
          <thead>
            {
              cloneMultiLevel && cloneMultiLevel.map((colItem, inx) => {
                return (
                  <tr key={inx}>
                    {
                      colItem.map((multi, index) => {
                        return (
                          <th
                            colspan={multi.cols || 1}
                            rowspan={multi.rows || 1}
                            key={index}
                            class={this.aliCls(multi)}
                            style={ { height: multi.fixedTheadHeight + 'px' }}
                          >
                            <div class={[this.prefixCls + '-cell', this.aliCls(multi)]}>
                              <span class={this.ellipsisClass(multi)}>{ multi.title }</span>
                            </div>
                          </th>
                        )
                      })
                    }
                  </tr>
                )
              })
            }
            <HeadRow
              columns={this.columns}
              prefixCls={this.prefixCls}
              data={this.data}
              objData={this.objData}
              titleEllipsis={this.titleEllipsis}
              headAlgin={this.headAlgin}
              fixed={this.fixed}
              { ...{ on: { 'on-change-width': this.changeWidth } }}
            ></HeadRow>
          </thead>
        </table>
      </div>
    )
  }
}
</script>
