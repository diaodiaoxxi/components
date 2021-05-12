<template>
  <div :class="`${drawerPrefix}-group`">
    <slot></slot>
  </div>
</template>

<script>
import CONFIG from '@materials/Layout/components/config'

export default {
  name: 'TopbarMenuGroup',
  inject: {
    CONFIG: { default: () => CONFIG },
  },
  data () {
    this.prefix = 'h' || this.CONFIG.PREFIX
    this.drawerPrefix = `${this.prefix}-user-drawer`
    return {}
  },
}
</script>

<style>

</style>
