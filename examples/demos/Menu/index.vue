<template>
  <div class="demo-select">
    <h2>menu-demos</h2>
    <div class="demo-wrap">
      <router-link
        v-for="f in demos"
        v-text="f.description || f.name"
        :key="f.name"
        :to="`/Menu/src/${f.name}`"
      ></router-link>
    </div>
    <router-view class="demo-content"></router-view>
  </div>
</template>
<script>
import demos from './_menu.json'

export default {
  name: 'MenuDemos',
  data () {
    return {
      demos
    }
  }
}
</script>
<style lang="scss">
.demo-select,
.demo-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
