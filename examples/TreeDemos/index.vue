<template>
  <div class="demo-tree">
    <h2>Tree-demo</h2>
    <div class="demo-wrap">
      <router-link
        v-for="f in demos"
        v-text="f.description || f.name"
        :key="f.name"
        :to="`/treeDemo/${f.name}`"
      ></router-link>
    </div>
    <router-view class="demo-content"></router-view>
  </div>
</template>
<script>
import demos from './_tree.json'

export default {
  name: 'TreeDemos',
  data () {
    return {

      demos
    }
  }
}
</script>
<style lang="scss">
.demo-tree,
.demo-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
