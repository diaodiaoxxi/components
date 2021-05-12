<template>
  <span
    :class="[prefixCls + '-sort']"
    v-if="column.sortable"
    @click="handleSort(index)"
  >
    <Icon name="sort-up" :class="ascStyle" @mousedown.native.stop="handleClick"></Icon>
    <Icon
      name="sort-down"
      :class="descStyle"
      @mousedown.native.stop="handleClick"
    ></Icon>
  </span>
</template>
<script>
import { Icon } from 'h_ui/dist/h_ui.min.js'
import PropTypes from '@hui/shared-utils/vue-types'
import { TABLE_ICON } from '../../config'
export default {
  inject: {
    tableRoot: { default: () => {} },
    tableData: { default: () => {} }
  },
  props: {
    column: PropTypes.object,
    prefixCls: PropTypes.string,
    index: PropTypes.sNumber
  },
  components: { Icon },
  data () {
    return {
      sortIndex: 0
    }
  },
  computed: {
    ascStyle () {
      return [
        TABLE_ICON.upSort,
        {
          on: this.column._sortType == 'asc'
        }
      ]
    },
    descStyle () {
      return [
        TABLE_ICON.downSort,
        {
          on: this.column._sortType == 'desc'
        }
      ]
    }
  },
  methods: {
    handleClick (event) {
      event.stopPropagation()
    },
    handleSort (index) {
      let type = this.column._sortType
      //   if (this.column._sortType === type) {
      //     type = 'normal'
      //   }
      switch (this.column._sortType) {
        case 'normal': type = 'asc'; break
        case 'asc': type = 'desc'; break
        case 'desc': type = 'normal'; break
        default: type = 'normal'; break
      }
      const _index = this.column._index
      this.tableRoot.handleSort(_index, type)
      this.sortIndex = index
    }
  }
}
</script>
