<template>
  <div :class="`${prefix}-right-item ${prefix}-ctrl-icon`">
    <slot></slot>
  </div>
</template>

<script>
import CONFIG from '@materials/Layout/components/config'
export default {
  name: 'TopbarCtrlItem',
  inject: {
    CONFIG: { default: () => CONFIG },
  },
  data () {
    this.prefix = 'h-layout-head' || this.CONFIG.PREFIX
    return {}
  },
}
</script>

<style></style>
