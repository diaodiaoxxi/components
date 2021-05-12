<script>
import PropTypes from '@hui/shared-utils/vue-types'
import Mixin from './mixin'
import { getScrollBarSize } from '@hui/shared-utils'
export default {
  mixins: [Mixin],
  props: {
    columns: PropTypes.array,
    columnsWidth: PropTypes.object,
    head: PropTypes.bool,
    isScrollY: PropTypes.bool,
    fixed: PropTypes.oneOfType([Boolean, String])
  },
  render () {
    const initColgroupVnode = (columns = []) => {
      const cols = columns.map(column => {
        const width = this.setCellWidth(column)
        return <col width={width }></col>
      })
      let scrollBarCol
      if (this.head && this.isScrollY && this.fixed != 'left') {
        scrollBarCol = <col width={ getScrollBarSize() }></col>
      }
      return <colgroup>{cols}{scrollBarCol}</colgroup>
    }
    return (
      initColgroupVnode(this.columns)
    )
  }
}
</script>
