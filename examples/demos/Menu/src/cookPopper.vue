<template>
  <div>
    <CookPopper ref="cook" :value="value"  mode="drawer" @toggle-favor="onToggleFavor"></CookPopper>
  </div>
</template>
<script>
import { CookPopper } from '@packages/Menu'
const mock = require('../../../mock/bizMenus.json')
export default {
  components: { CookPopper },
  data () {
    return {
      value: mock.children,
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    onToggleFavor (info) {
      console.log(info)
    }
  },
  mounted () {
    // // this.$refs.cook.query = '系统'
    // mock.children[0].children[0].children[4].isFavour = true
    mock.children[0].children[0].isFavour = true
  }
}
</script>
<style>
.line {
  margin: 10px 0;
  border: 1px solid #ddd;
}
</style>
