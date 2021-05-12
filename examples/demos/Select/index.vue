<template>
  <div class="demo-select">
    <h2>Select-demo</h2>
    <div class="demo-wrap">
      <router-link
        v-for="f in demos"
        v-text="f.description || f.name"
        :key="f.name"
        :to="`/selectDemo/${f.name}`"
      ></router-link>
    </div>
    <router-view class="demo-content"></router-view>
  </div>
</template>
<script>
import demos from './_select.json'

export default {
  name: 'SelectDemos',
  zhName: '选择器示例',
  data () {
    return {
      demos
    }
  },
  mounted () {
    console.log('123')
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
