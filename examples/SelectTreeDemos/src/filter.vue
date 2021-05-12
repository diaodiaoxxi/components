<template>
  <div class="tree-demo" style="width: 500px;">
    <!-- <h-input v-model="value" placeholder="请输入..." style="width: 300px"></h-input>
    <p>:filterValue="value" </p>
    <u-tree :treeData="treeData" :filterValue="value" ></u-tree>
    <p>:filterValue="value" && isTreeFilter</p>
    <u-tree :treeData="treeData" :filterValue="value" isTreeFilter showCheckbox ></u-tree>
    <p>:filterValue="value" && isTreeFilter && filterNodeMethod</p>
    <u-tree :treeData="treeData2" :filterValue="value" isTreeFilter :filterNodeMethod="filterNodeMethod" ></u-tree>
    <p>:filterValue="value" && filterNodeMethod</p>
    <u-tree :treeData="treeData2" :filterValue="value" :filterNodeMethod="filterNodeMethod" ></u-tree> -->
    <p>单选</p>
    <h-button @click="setvalue">set value</h-button>
     <u-select v-model="value1" filterable labelKey="title" valueKey="id">
        <u-select-tree defaultExpandAll :treeData="treeData"></u-select-tree>
        <!-- <u-select-tree defaultExpandAll :treeData="treeData" showCheckedStrategy="SHOW_PARENT"></u-select-tree> -->
        <!-- <u-select-tree defaultExpandAll :treeData="treeData" showCheckedStrategy="SHOW_CHILD"></u-select-tree> -->
    </u-select>
    <br> <br>
    <u-select v-model="value1" filterable labelKey="title" valueKey="id">
        <u-select-tree defaultExpandAll :filterNodeMethod="filterNodeMethod"  :treeData="treeData"></u-select-tree>
        <!-- <u-select-tree defaultExpandAll :treeData="treeData" showCheckedStrategy="SHOW_PARENT"></u-select-tree> -->
        <!-- <u-select-tree defaultExpandAll :treeData="treeData" showCheckedStrategy="SHOW_CHILD"></u-select-tree> -->
    </u-select>

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
      value1: '',
    }
  },
  methods: {
    filterNodeMethod ({ value, data, node }) {
      // console.log(value, data, node)
      if (value === '') return
      // console.log(data.title.includes(value))
      if (!node.title.includes(value)) return true
      return false
    },
    setvalue () {
      this.value1 = '0-1-0-1'
    }
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
