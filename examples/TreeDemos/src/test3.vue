<template>
  <div class="tree-demo" >
    <div style="width: 100px; background: #eee;">ahah</div>
    <div class="container" ref="container" :style="styles">
      <p class="p1" ref="p1">哈哈哈哈或或22222</p>
      <p class="p2" ref="p2">哈哈哈哈或或或或或或或或或或</p>
      <p class="p3" ref="p3">ssssssssssssssssssssssss</p>
      <p class="p4" ref="p4">1111111111111111111111111111111111</p>
    </div>
    <!-- <p class="demo-title">multiple=false</p>
    <u-tree multiple :treeData="treeData"></u-tree>

    <p class="demo-title">alwaysSelect</p>
    <u-tree :treeData="treeData" alwaysSelect ></u-tree>

    <p class="demo-title">multiple</p>
    <u-tree multiple :treeData="treeData"></u-tree>

    <p class="demo-title">:selectedKeys.sync="selectedKeys"</p>
    <p>{{selectedKeys}}</p>
    <h-button @click="selectedKeys = setselectedKeys" >setvalue-selectedKeys</h-button >
    <u-tree :treeData="treeData" multiple :selectedKeys.sync="selectedKeys" ></u-tree>

    <p class="demo-title">nodeSelect</p>
    <h-button @click="nodeSelect">nodeSelect</h-button>
    <u-tree ref="tree" :treeData="treeData" multiple :selectedKeys.sync="selectedKeys" ></u-tree>

    <h-button @click="nodeSelect3" >nodeSelect && 节点对象含有selectable: false</h-button >
    <u-tree ref="tree3" :treeData="treeData" multiple :selectedKeys.sync="selectedKeys" ></u-tree>

    <p class="demo-title">事件：@on-select</p>
    <u-tree :treeData="treeData" @on-select="selectChange" multiple :selectedKeys.sync="selectedKeys" ></u-tree> -->
  </div>
</template>

<script>
import elementResizeDetectorMaker from 'element-resize-detector'

var treeData = [
  {
    title: 'title-0-0',
    id: '0-0',
    children: [
      {
        title: 'title-0-0-0',
        id: '0-0-0',
        children: [
          { title: 'title-0-0-0-0', id: '0-0-0-0' },
          { title: 'title-0-0-0-1', id: '0-0-0-1' },
          { title: 'title-0-0-0-2', id: '0-0-0-2', selectable: false },
        ],
      },
      {
        title: 'title-0-0-1',
        id: '0-0-1',
        children: [
          { title: 'title-0-0-1-0', id: '0-0-1-0' },
          { title: 'title-0-0-1-1', id: '0-0-1-1' },
          {
            title: 'title-0-0-1-2',
            id: '0-0-1-2',
            children: [
              { title: 'title-0-0-1-2-0', id: '0-0-1-2-0' },
              { title: 'title-0-0-1-2-1', id: '0-0-1-2-1' },
              { title: 'title-0-0-1-2-2', id: '0-0-1-2-2' },
            ],
          },
        ],
      },
      {
        title: 'title-0-0-2',
        id: '0-0-2',
      },
    ],
  },
  {
    title: 'title-0-1',
    id: '0-1',
    children: [
      { title: 'title-0-1-0-0', id: '0-1-0-0' },
      { title: 'title-0-1-0-1', id: '0-1-0-1' },
      { title: 'title-0-1-0-2', id: '0-1-0-2' },
    ],
  },
  {
    title: 'title-0-2',
    id: '0-2',
  },
]

export default {
  data () {
    return {
      value: '',
      treeData: treeData,
      selectedKeys: ['0-0'],
      setselectedKeys: ['0-0-1-1', '0-0-1-2'],
      tableWidth: 0,
    }
  },
  computed: {
    styles () {
      return {
        width: this.tableWidth + 'px'
      }
    }
  },
  methods: {
    selectChange (value, eventObj) {
      alert('触发on-select')
      console.log('selectChange===========>', value, eventObj)
    },
    nodeSelect () {
      this.$refs.tree.nodeSelect(true, '0-0-0')
    },
    nodeSelect3 () {
      this.$refs.tree3.nodeSelect(true, '0-0-0-2')
    },
    getWidth (params) {
      console.log('========= updated ========')
      const p1 = this.$refs.p1
      const p2 = this.$refs.p2
      const p3 = this.$refs.p3
      const p4 = this.$refs.p4
      console.log('offsetWidth updated', p1.offsetWidth, p2.offsetWidth, p3.offsetWidth, p4.offsetWidth)
      const clientP1 = p1.getBoundingClientRect()
      const clientP2 = p2.getBoundingClientRect()
      const clientP3 = p3.getBoundingClientRect()
      const clientP4 = p4.getBoundingClientRect()
      debugger
      console.log(clientP1.width, clientP2.width, clientP3.width, clientP4.width)
      const realWidth = clientP1.width + clientP2.width + clientP3.width + clientP4.width
      this.tableWidth = p1.offsetWidth + p2.offsetWidth + p3.offsetWidth + p4.offsetWidth
      // this.tableWidth = realWidth
      console.log('tableWidth updated', this.tableWidth)
      console.log('realWidth updated', realWidth)
    },
    getWidth2 () {
      const p1 = this.$refs.p1
      const p2 = this.$refs.p2
      const p3 = this.$refs.p3
      const p4 = this.$refs.p4
      console.log('offsetWidth updated', p1.offsetWidth, p2.offsetWidth, p3.offsetWidth, p4.offsetWidth)
      const clientP1 = p1.getBoundingClientRect()
      const clientP2 = p2.getBoundingClientRect()
      const clientP3 = p3.getBoundingClientRect()
      const clientP4 = p4.getBoundingClientRect()
      const realWidth = clientP1.width + clientP2.width + clientP3.width + clientP4.width
      const tableWidth = p1.offsetWidth + p2.offsetWidth + p3.offsetWidth + p4.offsetWidth
      console.log(clientP1.width, clientP2.width, clientP3.width, clientP4.width)
      console.log('tableWidth updated', tableWidth)
      console.log('realWidth updated', realWidth)
      debugger
      this.$nextTick(() => {
        debugger
        this.tableWidth = tableWidth
      })
    }
  },
  updated () {
    console.log('========= updated ========')
    // this.getWidth()
  },
  mounted () {
    this.observer = elementResizeDetectorMaker({
      strategy: 'scroll',
      // debug: true
    })
    this.observer.listenTo(this.$refs.container, () => {
      setTimeout(() => {
        console.log('elementResizeDetectorMaker')
        this.getWidth2()
      }, 0)
    })
    this.getWidth2()
  },
}
</script>

<style lang="scss">
  .tree-demo{
      display: flex;
  }
  .demo-title {
    background: #ddd;
    padding: 3px;
    border-radius: 3px;
    padding-left: 15px;
    font-weight: 600;
  }
  .container{
    flex: 1;
    display: inline-block;
    // width: 100px;
    height: 40px;
    p{
      display: inline-block;
      height: 100%;
    }
    .p1{
      // width: 66.3px;
      background: rebeccapurple;
    }
    .p2{
      // width: 33.7px;
      background: red;
    }
    .p3{
      // width: 33.7px;
      background: blue;
    }
    .p4{
      // width: 33.7px;
      background: yellow;
    }
  }
</style>
