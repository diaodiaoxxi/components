<script>
import PropTypes from '@hui/shared-utils/vue-types'
// import { deepCopy } from '@hui/shared-utils'
// import { formatdata } from './util'
// import CellContent from './body/BodyCell'
import ColGroup from './ColGroup'
import mixin from './mixin'
import Cell from './expand'
// import TransferDom from '@hui/directives/transfer-dom'
// import cellSelect from '@packages/Select';
export default {
  name: 'TableSummary',
  mixins: [mixin],
  inject: {
    tableRoot: { default: () => {} },
    tableData: { default: () => {} }
  },
  components: { ColGroup, Cell },
  props: {
    columns: PropTypes.array,
    data: PropTypes.array,
    prefixCls: PropTypes.string,
    bodyAlgin: PropTypes.string,
    sum: PropTypes.bool,
    styleObject: PropTypes.object,
    fixed: PropTypes.oneOfType([Boolean, String]).def(false),
  },
  computed: {
    table () {
      return this.tableRoot
    },
  },
  methods: {
  },
  render () {
    const row = this.data[0]
    return (
      <table style={this.styleObject} cellspacing='0' cellpadding='0' border='0'>
        <ColGroup columns={this.columns} isScrollY={this.table.isScrollY} fixed={this.fixed} head={true} columnsWidth={this.table.columnsWidth}></ColGroup>
        <tbody>
          <tr>
            {
              this.columns.map((column, cellIndex) => {
                let cell = null
                // if ((this.sum && (column.isSum || column.type == 'index' || column.type == 'selection')) || !this.sum) {
                //   cell = (
                //     <cell-content
                //       fixed={this.fixed}
                //       prefixCls={this.prefixCls}
                //       row={this.data[0]}
                //       column={column}
                //       sum={this.sum}
                //       columnIndex={cellIndex}
                //     ></cell-content>
                //   )
                // }
                if ((this.sum && (column.isSum || column.type == 'index' || column.type == 'selection')) || !this.sum) {
                  if (column.render) {
                    cell = (
                      <Cell
                        row={this.data[0]}
                        column={this.column}
                        index={cellIndex}
                        sum={this.sum}
                        render={column.render}>
                      </Cell>)
                  } else {
                    if ((column.type === 'index' && this.sum && cellIndex == 0) || (column.type === 'selection' && this.sum && cellIndex == 0)) {
                      cell = '汇总'
                    } else {
                      cell = this.data[0][column.key]
                    }
                  }
                }
                return (<td
                  key={cellIndex}
                  class={this.alignCls(column, {}, cellIndex)}>
                  <div class={ [`${this.prefixCls}-cell-ellipsis`]}>
                    {cell}
                  </div>
                </td>)
              })
            }
            {
              this.table.isScrollY && this.fixed != 'left' && <th
                class="gutter"
                style= {{ width: this.table.scrollBarWidth + 'px', borderRight: 0, borderBottom: 0, backgroundColor: '#fff' }}
              >
              </th>
            }
          </tr>
        </tbody>
      </table>)
  }
}
</script>
