<template>
  <div class="tree-demo" style="width: 500px;">
    <h-input v-model="value" placeholder="请输入..." style="width: 300px"></h-input>
    <p>:filterValue="value" </p>
    <u-tree :treeData="treeData" :filterValue="value" ></u-tree>
    <p>:filterValue="value" && isTreeFilter</p>
    <u-tree :treeData="treeData" :filterValue="value" defaultExpandAll isTreeFilter showCheckbox ></u-tree>
    <p>:filterValue="value" && isTreeFilter && filterNodeMethod</p>
    <u-tree :treeData="treeData2" :filterValue="value" isTreeFilter :filterNodeMethod="filterNodeMethod" ></u-tree>
    <p>:filterValue="value" && filterNodeMethod</p>
    <u-tree :treeData="treeData2" :filterValue="value" :filterNodeMethod="filterNodeMethod" ></u-tree>
     <p>:filterValue="value" && isTreeFilter && checkStrictly </p>
    <u-tree :treeData="treeData" :filterValue="value" checkStrictly defaultExpandAll isTreeFilter showCheckbox ></u-tree>

  </div>
</template>

<script>
var treeData = [
  {
    title: 'title-0-0',
    id: '0-0',
    children: [
      {
        title: 'title-0-0-0',
        id: '0-0-0',
        children: [
          { title: 'title-0-0-0-0-xxx', id: '0-0-0-0', disabled: true, },
          { title: 'title-0-0-0-1', id: '0-0-0-1' },
          { title: 'title-0-0-0-2', id: '0-0-0-2' }
        ]
      },
      {
        title: 'title-0-0-1xx',
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
    title: 'title-0-1xxxx',
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

var treeData2 = [
  {
    title: 'title-0-0',
    id: '0-0',
    children: [
      {
        title: 'title-0-0-0',
        id: '0-0-0',
        children: []
      },
      {
        title: 'title-0-0-1',
        id: '0-0-1',
        children: [
          {
            title: 'title-0-0-1-0-xxx',
            id: '0-0-1-0',
            leaf: true
          },
          {
            title: 'title-0-0-1-1-xxxx',
            id: '0-0-1-1'
          },
          {
            title: 'title-0-0-1-2',
            id: '0-0-1-2',
            children: [
              {
                title: 'title-0-0-1-2-0',
                id: '0-0-1-2-0'
              },
              {
                title: 'title-0-0-1-2-1',
                id: '0-0-1-2-1'
              }
            ]
          }
        ]
      },
      {
        title: 'title-0-0-2',
        id: '0-0-2',
        leaf: true
      }
    ]
  }
]

export default {
  data () {
    return {
      value: '',
      treeData: treeData,
      treeData2,
    }
  },
  methods: {
    filterNodeMethod ({ value, data, node }) {
      console.log(value, data, node)
      if (value === '') return
      // console.log(data.title.includes(value))
      if (node.title.includes(value)) return true
      return false
    },
  }
}
</script>

<style lang="scss">
.tree-demo{
  &>p{
    font-weight: 600;
    font-size: 14px;
    margin-top: 20px;
  }
}
</style>
