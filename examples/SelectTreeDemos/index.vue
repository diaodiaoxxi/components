<template>
  <div class="demo-select-tree">
    <h2>selectTree-demos</h2>
    <div class="demo-wrap">
      <router-link
        v-for="f in demos"
        v-text="f.description || f.name"
        :key="f.name"
        :to="`/selectTreeDemo/${f.name}`"
      ></router-link>
    </div>
    <router-view class="demo-content"></router-view>
  </div>
</template>
<script>
import demos from './_selectTree.json'

export default {
  name: 'selectTreeDemos',
  data () {
    return {

      demos
    }
  }
}
</script>
<style lang="scss">
.demo-select-tree,
.demo-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
