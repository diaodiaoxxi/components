<template>
  <div class="tree-demo" style="width: 500px;">
    <p>常规/基本</p>
    <u-tree :treeData="treeData"></u-tree>
    <p>blockNode</p>
    <u-tree blockNode :treeData="treeData"></u-tree>
    <p>formatValue</p>
    <u-tree formatValue="title" showCheckbox :treeData="treeData" ></u-tree>
     <p>blockDirectory</p>
    <u-tree formatValue="title" @on-click="textClick" :selectable="true" showCheckbox  blockDirectory :treeData="treeData" ></u-tree>
    <p>blockDirectory && :selectable="false"</p>
    <u-tree formatValue="title" @on-click="textClick" :selectable="false" showCheckbox  blockDirectory :treeData="treeData" ></u-tree>
    <p>blockDirectory</p>
    <u-tree formatValue="title" @on-click="textClick" blockDirectory :treeData="treeData" ></u-tree>
  </div>
</template>

<script>
var treeData = [
  {
    title: 'title-0-0----title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0title-0-0',
    id: '0-0',
    className: 'title-0-0XXXXXX',
    disabled: false,
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
    textClick ({ event, node }) {
      console.log(event, node)
    }
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
