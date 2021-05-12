<template>
  <label :class="wrapClasses" @click="onClick($event)">
    <span :class="checkboxClasses">
      <span :class="innerClasses"></span>
    </span>
  </label>
</template>
<script>
import { PREFIX } from '../config'
const prefixCls = `${PREFIX || 'h'}-checkbox`
export default {
  name: 'Checkbox',
  props: {
    value: null,
    disabled: {
      type: Boolean,
      default: false
    },
    indeterminate: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'default'
    },
  },
  computed: {
    wrapClasses () {
      return [
        `${prefixCls}-wrapper`,
        {
          [`${prefixCls}-group-item`]: this.group || this.inGroup,
          [`${prefixCls}-wrapper-checked`]: !!this.value,
          [`${prefixCls}-wrapper-disabled`]: this.disabled,
          [`${prefixCls}-${this.size}`]: !!this.size
        }
      ]
    },
    checkboxClasses () {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-checked`]: this.value,
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-indeterminate`]: this.indeterminate
        }
      ]
    },
    innerClasses () {
      return [
        `${prefixCls}-inner`,
      ]
    },
  },
  methods: {
    onClick ($event) {
      this.$emit('click', !this.value, $event)
    }
  },
}
</script>
