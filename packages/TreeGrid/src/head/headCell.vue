<script>
import PropTypes from '@hui/shared-utils/vue-types'
// import { mergeProps } from '@hui/shared-utils'
import HeadTitle from './cell/headTitle'
import HeadOperate from './cell//headOperate'
export default {
  props: {
    column: PropTypes.object,
    data: PropTypes.array,
    titleEllipsis: PropTypes.bool,
    objData: PropTypes.object,
    prefixCls: PropTypes.string,
    index: PropTypes.sNumber,
    headAlgin: PropTypes.string,
    fixed: PropTypes.oneOfType([Boolean, String]).def(false)

  },
  components: { HeadTitle, HeadOperate },
  methods: {
    cellClasses (column) {
      return [
        `${this.prefixCls}-cell`,
        {
          [`${this.prefixCls}-hidden`]:
            !this.fixed && column.fixed &&
            (column.fixed === 'left' || column.fixed === 'right'),
          [`${this.prefixCls}-head-column-${this.headAlgin}`]: this.headAlgin,
        }
      ]
    },
  },
  render () {
    const { data, titleEllipsis, objData, column, prefixCls, index } = this
    return (
      <div class={this.cellClasses(column)}>
        <HeadTitle data={data} titleEllipsis={titleEllipsis} objData={objData} column={column} prefixCls={prefixCls} index={index}></HeadTitle>
        <HeadOperate column={column} prefixCls={prefixCls} index={index}></HeadOperate>
      </div>
    )
  }
}
</script>
