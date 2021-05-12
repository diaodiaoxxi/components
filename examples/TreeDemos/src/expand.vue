<template>
  <div class="tree-demo" style="width: 500px;">
    <h-button @click="editnode('add')">addnode</h-button>
    <h-button @click="editnode('edit')">editnode</h-button>
    <h-button @click="editnode('del')">delnode</h-button>
    <p>:expandedKeys.sync="expandedKeys"</p>
    <h-button @click="expandedKeys = setexpandedKeys">setvalue-checkedKeys</h-button>
    <u-tree ref="tree1" :treeData="treeData" :expandedKeys.sync="expandedKeys"></u-tree>
    <!-- <u-tree :treeData="treeData"></u-tree> -->
    <p>:expandLevel="1"</p>
    <u-tree :treeData="treeData" :expandLevel="1"></u-tree>
    <p> defaultExpandAll</p>
    <u-tree :treeData="treeData" defaultExpandAll></u-tree>
    <p> defaultExpandAll && :expandedKeys.sync="expandedKeys" && :expandLevel="1"</p>
    <u-tree :treeData="treeData" defaultExpandAll :expandedKeys.sync="expandedKeys" :expandLevel="1"></u-tree>
    <p>:expandedKeys.sync="expandedKeys" && :expandLevel="1" </p>
    <u-tree :treeData="treeData" :expandedKeys.sync="expandedKeys"  :expandLevel="1"></u-tree>
    <p>事件：@expand</p>
    <u-tree :treeData="treeData" @on-expand="expand" defaultExpandAll :expandedKeys.sync="expandedKeys"></u-tree>
    <p>方法：@nodeExpand</p>
    <h-button @click="nodeExpand">nodeExpand</h-button>
    <!-- <u-tree ref="tree" :treeData="treeData" showCheckbox @on-expand="expand" :expandedKeys.sync="expandedKeys"></u-tree> -->
     <u-tree ref="tree" :treeData="treeData" showCheckbox @on-expand="expand"></u-tree>
    <p>优先级：</p>
    <!-- <u-tree :treeData="treeData" :expandLevel="1"></u-tree> -->

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
        // expand: true,
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
      expandedKeys: ['0-0-1', '0-0-0-0', '0-0-1-0'],
      setexpandedKeys: ['0-0-1', '0-1']
    }
  },
  methods: {
    expand (value, event) {
      console.log('expand===========>', value, event)
    },
    nodeExpand () {
      this.$refs.tree.nodeExpand(true, '0-0-0')
      // this.$refs.tree.nodeExpand(false, "0-0-0")
      // this.$refs.tree.nodeExpand(true, "0-0-0")
      // this.$refs.tree.nodeExpand(true, "0-0-1")
      // this.$refs.tree.nodeExpand(true, "0-0-1-244")
    },
    editnode (type) {
      console.log(this.$refs.tree1)
      if (type === 'add') {
        // this.$refs.tree1.nodeEdit('add', '0-0-0-0', [{ title: "title-add", id: "0-add", }])
        this.$refs.tree1.nodeEdit('add', '0-2', [{ title: 'title-add-0', id: '0-add-0', }, { title: 'title-add-1', id: '0-add-1', }])
      }
      if (type === 'edit') {
        this.$refs.tree1.nodeEdit('edit', '0-0-0', { title: 'title-edit', id: '0-edit', })
      }
      if (type === 'del') {
        this.$refs.tree1.nodeEdit('del', '0-2')
      }
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
