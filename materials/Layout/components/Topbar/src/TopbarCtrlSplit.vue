<template>
  <div
    :class="`${prefix}-right-item ${prefix}-ctrl-separator`"
    style="padding: 0 6px;"
  ></div>
</template>

<script>
import CONFIG from '@materials/Layout/components/config'
export default {
  name: 'TopbarCtrlSplit',
  inject: {
    CONFIG: { default: () => CONFIG },
  },
  data () {
    this.prefix = 'h' || this.CONFIG.PREFIX
    return {}
  },
}
</script>

<style></style>
