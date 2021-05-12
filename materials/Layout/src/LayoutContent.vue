<template>
  <section class="h-layout-content">
    <slot></slot>
  </section>
</template>
<script>
export default {
  name: 'LayoutContent',
  computed: {},
  watch: {},
  mounted () {}
}
</script>
<style lang="scss">
.h-layout-content {
  width: 100%;
  height: 100%;
  padding: 0 8px 8px;
  overflow:auto;
}
</style>
