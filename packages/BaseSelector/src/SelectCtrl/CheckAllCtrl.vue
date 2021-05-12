<template>
  <div :class="[prefixCls + '-ctrl-check-all']">
    <u-button
      size="small"
      type="primary"
      @click.stop="selectAll($event,isSelectFilter)"
      >全选</u-button
    >
    <u-button
      size="small"
      :style="{ marginLeft: '5px' }"
      @click.stop="unselectAll($event,isSelectFilter)"
      >反选</u-button
    >
  </div>
</template>
<script>
import { PropTypes } from '@hui/shared-utils'
import { SELECT_CONFIG } from '../config'
export default {
  name: 'SelectCheckAll',
  props: {
    isSelectFilter: PropTypes.bool.def(false)
  },
  inject: {
    SELECT_CONFIG: { default: () => SELECT_CONFIG },
    selectProps: { default: () => ({}) },
    selectData: { default: () => ({}) },
    selectAll: { default: () => ({}) },
    unselectAll: { default: () => ({}) },
    setClearQuery: { default: () => ({}) }
  },
  data () {
    const { PREFIX } = this.SELECT_CONFIG
    const prefixCls = `${PREFIX || 'h'}-selector`
    return {
      prefixCls
    }
  },
  created () {
    // 关闭清除 query
    if (this.isSelectFilter) {
      this.setClearQuery(['optionSelected'])
    }
  }
}
</script>
