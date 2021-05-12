<template>
  <div class="tree-demo" style="width: 500px;">
    <p>showCheckbox</p>
    <u-tree ref="tree" style="height: 300px;" class="showCheckbox-tree" :treeData="treeData"  defaultExpandAll @on-check="check" showCheckbox></u-tree>
    <h-button @click="nodeCheck">nodeCheck外部调用</h-button>
    <u-tree ref="tree2" disabled v-model="checkedKeys"  :treeData="treeData" @on-check="check" showCheckbox></u-tree>
    <h-button @click="nodeCheck2">nodeCheck外部调用</h-button>
    <p>showCheckbox && checkStrictly</p>
    <u-tree :treeData="treeData" showCheckbox checkStrictly></u-tree>
    <p>showCheckbox && isBoxRight</p>
    <u-tree style="width: 400px;" :treeData="treeData" :selectable="false" showCheckbox isBoxRight></u-tree>
    <p>showCheckbox && isBoxRight && titleMaxWidth="500"</p>
    <u-tree style="width: 400px;" titleMaxWidth="500" :treeData="treeData" showCheckbox isBoxRight></u-tree>
     <p>showCheckbox && isBoxRight && titleMaxWidth="300"</p>
    <u-tree style="width: 400px;" titleMaxWidth="300" :treeData="treeData" showCheckbox isBoxRight></u-tree>
    <p>showCheckbox && v-model="checkedKeys" </p>
    <h-button @click="checkedKeys = setcheckedKeys">setvalue-checkedKeys</h-button>
    <div>checkedKeys= {{checkedKeys}}</div>
    <u-tree v-model="checkedKeys" :treeData="treeData" showCheckbox></u-tree>
    <div>checkStrictly && checkedKeys= {{checkedKeys2}}</div>
    <u-tree v-model="checkedKeys2" :treeData="treeData" checkStrictly showCheckbox></u-tree>

    <p>@check="on-check" 节点title-0-0-0-0设置selectable: false</p>
    <u-tree v-model="checkedKeys" @on-check="check" :treeData="treeData" showCheckbox></u-tree>
    <p>@check="on-check" && selectable=false</p>
    <u-tree v-model="checkedKeys" :selectable="false" @on-check="check" :treeData="treeData" showCheckbox></u-tree>

  </div>
</template>

<script>
var treeData = [
  {
    title: 'title-0-0',
    id: '0-0',
    disableCheckbox: true,
    children: [
      {
        title: 'title-0-0-0',
        id: '0-0-0',
        disableClick: true,
        children: [
          { title: 'title-0-0-0-0', id: '0-0-0-0', selectable: false, disabled: true },
          { title: 'title-0-0-0-1', id: '0-0-0-1' },
          { title: 'title-0-0-0-2', id: '0-0-0-2' }
        ]
      },
      {
        title: 'title-0-0-1',
        id: '0-0-1',
        disableCheckbox: true,
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
    id: '0-2',
    disableCheckbox: true
  }
]

export default {
  data () {
    return {
      value: '',
      treeData: treeData,
      // checkedKeys: ["0-0-0", "0-0-1-1", "0-0-1-2"],
      checkedKeys: ['0-2', '0-1-0-0', '0-1-0-1', '0-1-0-2'],
      setcheckedKeys: ['0-0-1-1', '0-0-1-2'],
      checkedKeys2: ['0-0-0', '0-0-1-1', '0-0-1-2']
    }
  },
  methods: {
    check (value, eventObj) {
      console.log('check=============>', value, eventObj)
    },
    nodeCheck () {
      this.$refs.tree.nodeCheck(true, '0-0-0-1')
      this.$refs.tree.nodeCheck(true, '0')
      // this.$refs.tree.nodeCheck(true, '0-0-0')
    },
    nodeCheck2 () {
      this.$refs.tree2.nodeCheck(true, '0-0-0')
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
.showCheckbox-tree{
  border: 1px solid #ddd;
  height: 600px;
  overflow: auto;
}
</style>
