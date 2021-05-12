<template>
  <div>
    {{console.log('render')}}
    <h-button @click="del">{{test}}</h-button>
    {{test}}
  </div>
</template>

<script>
export default {
  data () {
    return {
      test: 1,
      timeover: 0,
      console,
    }
  },
  methods: {
    del () {
      this.timeover = Date.now()
      console.log('del=====记录任务开始时间', this.timeover)
      this.test++
      this.$nextTick(() => {
        console.log('del other===== 1', Date.now() - this.timeover)
        // this.nodeEdit(type, key, data, { outside: false, validkeyDel: validkey })
        // this.createFlatteEntities() // 重新更新FlatteEntities数据
        // console.log('del other===== 2', Date.now() - this.timeover)
        let s = 0
        for (var i = 0; i < 2000000000; i++) {
          s = s + 1
        }
        console.log(2)
        console.log('del other===== 2', Date.now() - this.timeover)
        this.$nextTick(() => {
          console.log('del other===== 3', Date.now() - this.timeover)
          let s = 0
          for (var i = 0; i < 4000000000; i++) {
            s = s + 1
          }
          console.log('del other===== 4', Date.now() - this.timeover)
        })
      })

      setTimeout(() => {
        console.log('setTimeout 1')
        this.test = this.test + 1
      }, 0)
      setTimeout(() => {
        console.log('setTimeout 2')
        this.test = this.test + 1
      }, 13)
    }
  },
  updated () {
    console.log('del ===== updated', Date.now() - this.timeover)
  },
  mounted () {
    // setTimeout(() => {
    //   this.del()
    // }, 2000)
  },
}
</script>

<style>

</style>
