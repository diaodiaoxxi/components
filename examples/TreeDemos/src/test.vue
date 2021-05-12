<template>
  <div class="tree-demo" style="width: 500px;">
    <p class="demo-title">:expandedKeys.sync="expandedKeys"</p>
    <h-button @click="expandedKeys = setexpandedKeys" >setvalue-expandedKeys</h-button >
    <h-button @click="nodeExpand">nodeExpand</h-button>
    <h-button @click="nodeCheck">nodeCheck</h-button>
    <p>showCheckbox=true</p>
    <u-tree ref="tree1" :treeData="treeData" @on-check="check" multiple @on-expand="expand" showCheckbox></u-tree>
     <p>showCheckbox=true &&  checkStrictly</p>
    <u-tree ref="tree2" :treeData="treeData" checkStrictly @on-check="check" multiple @on-expand="expand" showCheckbox></u-tree>
    <p>showCheckbox=false</p>
    <u-tree ref="tree3" :treeData="treeData"  @on-check="check" multiple @on-expand="expand"></u-tree>

  </div>
</template>

<script>
var treeData = [
  {
    title: 'title-0-0',
    id: '0-0',
    selectable: 'false',
    children: [
      {
        title: 'title-0-0-0',
        id: '0-0-0',
        selectable: 'false',
        children: [
          { title: 'title-0-0-0-0', id: '0-0-0-0' },
          { title: 'title-0-0-0-1', id: '0-0-0-1' },
          { title: 'title-0-0-0-2', id: '0-0-0-2' },
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
      expandedKeys: ['0-0-1', '0-0-0-0', '0-0-1-0'],
      setexpandedKeys: ['0-0-1', '0-1'],
    }
  },
  methods: {
    expand (value, event) {
      console.log('触发了on-expand', value, event)
      console.log('触发了on-expand')
    },
    nodeExpand () {
      // this.$refs.tree.nodeExpand(true, '0-0-0-0')
      this.$refs.tree1.nodeExpand(true, '0-0-0')
      this.$refs.tree2.nodeExpand(true, '0-0-0')
      this.$refs.tree3.nodeExpand(true, '0-0-0')
    },
    check (keys, eventObj) {
      console.log('check====>', keys, eventObj)
    },
    nodeCheck () {
      this.$refs.tree1.nodeCheck(true, '0-0-0')
      this.$refs.tree2.nodeCheck(true, '0-0-0')
    },
  },
}
</script>

<style>
  .demo-title {
    background: #ddd;
    padding: 3px;
    border-radius: 3px;
    padding-left: 15px;
    font-weight: 600;
  }
</style>
