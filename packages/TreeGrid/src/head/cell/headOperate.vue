
<template>
  <div class="operate-list" v-if="isOperate">
    <!-- <div :class="[prefixCls + '-sort', 'operate-item']" v-if="column.sortable">
      <Sort :column="column" :prefixCls="prefixCls" :index="index"></Sort>
    </div>
    <div class="operate-item" v-if="isPopperShow(column)">
      <filter-popper
        :column="column"
        :prefixCls="prefixCls"
        :index="index"
      ></filter-popper>
    </div> -->
    <div :class="[prefixCls + '-column-edit', 'operate-item']" v-if="column.columnEdit && editType=='columnEdit' && !column.render" @click="handleToggleEdit($event)">
      <Icon :class="editClass" @mousedown.stop="handleClick"></Icon>
    </div>
    <div :class="[prefixCls + '-self-define']" v-if="hasSlot">
      <slot name="default"></slot>
    </div>
  </div>
</template>
<script>
import { Icon } from 'h_ui/dist/h_ui.min.js'
// import Sort from './sort'
// import FilterPopper from './filter'
import PropTypes from '@hui/shared-utils/vue-types'
import Mixin from '../../mixin'
import { TABLE_ICON } from '../../config'
export default {
  components: {
    // Sort,
    // FilterPopper,
    Icon
  },
  mixins: [Mixin],
  props: {
    column: PropTypes.object,
    index: PropTypes.number,
    prefixCls: PropTypes.string
  },
  inject: {
    tableRoot: { default: () => {} },
    tableData: { default: () => {} },
    tableProps: { default: () => {} },
  },
  data () {
    return {
      TABLE_ICON
    }
  },
  computed: {
    editType () {
      return this.tableProps.editType
    },
    hasSlot () {
      return this.column.renderHeadOperate
    },
    isOperate () {
      return this.column._renderHeadOperate || this.column.columnEdit
      // return this.column._renderHeadOperate || this.column.sortable || this.isPopperShow(this.column) || this.column.columnEdit
    },
    editClass () {
      return [
        this.column._isColumnEdit ? TABLE_ICON.save : TABLE_ICON.edit,
      ]
    }
  },
  methods: {
    patchOtherOperate () {
      if (this.hasSlot) {
        this.$slots.default = this.column.renderHeadOperate(this.$createElement)
      }
    },
    handleClick (event) {
      event.stopPropagation()
    },
    handleToggleEdit (event) {
      event.stopPropagation()
      this.column._isColumnEdit = !this.column._isColumnEdit
      // this.tableRoot.columnHandleEdit(this.column._isColumnEdit)
    }
  },
  created () {
    this.patchOtherOperate()
  },
  beforeUpdate () {
    this.patchOtherOperate()
  }

}
</script>
