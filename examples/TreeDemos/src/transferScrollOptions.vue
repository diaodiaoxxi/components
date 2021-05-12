<template>
  <div style="width: 500px">
    <p class="demo-title">默认</p>
    <u-tree
      ref="tree1"
      :renderMenu="renderDel"
      :expandLevel="1"
      :maxHeight="500"
      :expandedKeys.sync="expandedKeys"
      :treeData="treeData2"
      blockNode
      virtual
    ></u-tree>
    <p class="demo-title">transferScrollOptions = { type: 'hide', disabled: false } </p>
    <u-tree
      ref="tree1"
      :renderMenu="renderDel"
      :expandLevel="1"
      :maxHeight="500"
      :expandedKeys.sync="expandedKeys"
      :treeData="treeData2"
      blockNode
      virtual
      :transferScrollOptions="{ type: 'hide', disabled: false }"
    ></u-tree>
  </div>
</template>

<script>
var treeData2 = Object.keys(Array.apply(null, { length: 5 })).map((v, index) => {
  return {
    title: 'title-' + '0-' + index,
    id: '0-' + index,
    children: [],
    levels: 1,
    srcObj: {
      cCreateUser: 'admin',
      cEnable: 'Y',
      cNodeName: 'job90',
      cProjectId: '001',
      iJobType: 0,
      iNodeType: 1,
      iSaveStatus: 1,
      lJobId: '16042871314064805',
      lNodeId: 14,
      lParentNodeId: 9,
      tCreateTime: 1604287090000,
    },
  }
})

function newChildren (obj) {
  let num = obj.levels
  if (obj.levels === 2) num = 100
  return Object.keys(Array.apply(null, { length: num })).map((item, index) => {
    return {
      title: `${obj.title}-${index}`,
      id: `${obj.id}-${index}`,
      levels: obj.levels + 1,
      children: [],
    }
  })
}
xunhuan(treeData2)
function xunhuan (element) {
  element.forEach((item) => {
    item.children = newChildren(item)
    if (item.levels <= 1) xunhuan(item.children)
  })
}

export default {
  data () {
    return {
      value: '1',
      onlyScroll: false,
      treeData2: treeData2,
      positionKey: '0-2-0',
      filterValue: '',
      timeout: null,
      expandedKeys: ['0-0', '0-2-0-0'],
      // checkedKeys: ['0-0', '0-2-0-0'],
      checkedKeys: [],
    }
  },
  methods: {
    renderDel (h, { root, node, data }) {
      return h(
        'span',
        {
          on: {
            click: () => {
              // console.log('click', root, node, data)
              const key = data.id
              this.$refs.tree1.nodeEdit('del', key)
            },
          },
        },
        'del',
      )
    },
  },
  mounted () {
    // console.log(this.treeData2)
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
