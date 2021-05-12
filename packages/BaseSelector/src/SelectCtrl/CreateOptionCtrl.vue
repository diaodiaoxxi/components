<template>
  <div :class="[prefixCls + '-ctrl-create-option']" @click.stop="()=>{}">
    <u-input v-model="value"></u-input>
    <u-button
      size="small"
      :style="{ marginLeft: '5px' }"
      @click="onCreateOptions"
      >添加</u-button
    >
  </div>
</template>
<script>
import { SELECT_CONFIG } from '../config'
export default {
  name: 'SelectCheckAll',
  inject: {
    SELECT_CONFIG: { default: () => SELECT_CONFIG },
    selectProps: { default: () => ({}) },
    selectData: { default: () => ({}) },
    createOption: { default: () => {} }
  },
  data () {
    const { PREFIX } = this.SELECT_CONFIG
    const prefixCls = `${PREFIX || 'h'}-selector`
    return {
      prefixCls,
      value: ''
    }
  },
  methods: {
    onCreateOptions () {
      this.createOption({
        value: this.value
      })
    }
  }
}
</script>
