<template>
  <div class="h-layout-main" :class="{ 'is-collapse': bodyCollapse }">
    <slot name="sidebar" />
    <div class="h-layout-main-container">
      <slot name="navbar" />
      <slot name="content" />
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'LayoutBody',
  inject: {
    layout: { default: {} }
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: true
    },
  },
  computed: {
    bodyCollapse () {
      return this.layout.isCollapse
    }
  }
}
</script>
