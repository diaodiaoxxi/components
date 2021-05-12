<template>
  <div class="tree-demo" style="width: 500px;">
    <p>blockNode</p>
    <u-tree blockNode :treeData="treeData"></u-tree>
    <p>blockNode && titleMaxWidth = 200</p>
    <u-tree blockNode titleMaxWidth="200" :treeData="treeData"></u-tree>
     <p>blockNode && titleMaxWidth = 600</p>
    <u-tree blockNode titleMaxWidth="600" :treeData="treeData"></u-tree>
    <p>blockDirectory</p>
    <u-tree formatValue="title" showCheckbox  blockDirectory :treeData="treeData" ></u-tree>
    <p>blockDirectory && titleMaxWidth = 200</p>
    <u-tree formatValue="title" showCheckbox titleMaxWidth="200" blockDirectory :treeData="treeData" ></u-tree>
    <p>blockDirectory && titleMaxWidth = 600</p>
    <u-tree formatValue="title" showCheckbox titleMaxWidth="600" blockDirectory :treeData="treeData" ></u-tree>
     <p>isBoxRight && titleMaxWidth = 200</p>
    <u-tree formatValue="title" showCheckbox titleMaxWidth="200" isBoxRight :treeData="treeData" ></u-tree>
    <p>isBoxRight && titleMaxWidth = 600</p>
    <u-tree formatValue="title" showCheckbox titleMaxWidth="600" isBoxRight :treeData="treeData" ></u-tree>
    <p>isBoxRight</p>
    <u-tree formatValue="title" showCheckbox isBoxRight :treeData="treeData" ></u-tree>

  </div>
</template>

<script>
var treeData = [
  {
    title: 'title-0-0----title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0',
    id: '0-0',
    className: 'title-0-0',
    children: [
      {
        title: 'title-0-0-0',
        id: '0-0-0',
        children: [
          { title: 'title-0-0-0-0', id: '0-0-0-0' },
          { title: 'title-0-0-0-1', id: '0-0-0-1' },
          { title: 'title-0-0-0-2', id: '0-0-0-2' }
        ]
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
              { title: 'title-0-0-1-2-2', id: '0-0-1-2-2' }
            ]
          }
        ]
      },
      {
        title: 'title-0-0-2',
        id: '0-0-2'
      }
    ]
  },
  {
    title: 'title-0-1',
    id: '0-1',
    children: [
      { title: 'title-0-1-0-0', id: '0-1-0-0' },
      { title: 'title-0-1-0-1', id: '0-1-0-1' },
      { title: 'title-0-1-0-2', id: '0-1-0-2' }
    ]
  },
  {
    title: 'title-0-2',
    id: '0-2'
  }
]

export default {
  data () {
    return {
      value: '',
      treeData: treeData,
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
// .tree-demo-title{
//   font-weight: 600;
//   font-size: 14px;
//   margin-top: 20px;
// }
.tree-demo{
  &>p{
    font-weight: 600;
    font-size: 14px;
    margin-top: 20px;
  }
}
</style>
