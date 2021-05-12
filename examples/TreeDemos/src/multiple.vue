<template>
  <div class="tree-demo" style="width: 500px;">
    <p class="demo-title">multiple</p>
    <u-tree multiple :treeData="treeData"></u-tree>
    <p class="demo-title">multiple=false && alwaysSelect(单选有效)</p>
    <h-button @click="alwaysSelect =!alwaysSelect">alwaysSelect={{alwaysSelect}}</h-button>
    <u-tree ref="tree" :treeData="treeData" :alwaysSelect="alwaysSelect" @on-select="selectChange" :multiple="false" ></u-tree>
    <p class="demo-title">multiple && :selectedKeys.sync="selectedKeys"</p>
    <h-button @click="selectedKeys = setselectedKeys">setvalue-selectedKeys</h-button>
    <u-tree ref="tree" :treeData="treeData" @on-select="selectChange" multiple :selectedKeys.sync="selectedKeys" ></u-tree>
    <h-button @click="nodeSelect">nodeSelect</h-button>
    <u-tree ref="tree2" disabled :treeData="treeData" @on-select="selectChange" multiple :selectedKeys.sync="selectedKeys" ></u-tree>
    <h-button @click="nodeSelect2">nodeSelect</h-button>
    <u-tree ref="tree3" :treeData="treeData" multiple :selectedKeys.sync="selectedKeys" ></u-tree>
    <h-button @click="nodeSelect3">nodeSelect</h-button>
    <p class="demo-title">事件：@on-select</p>
    <u-tree :treeData="treeData" @on-select="selectChange" multiple :selectedKeys.sync="selectedKeys" ></u-tree>
    <p class="demo-title">事件：@on-right-click </p>
    <u-tree :treeData="treeData" @on-right-click="rightClick" multiple :selectedKeys.sync="selectedKeys" ></u-tree>
    <p class="demo-title">事件：@on-double-click && @on-click="sigleClick"</p>
    <u-tree :treeData="treeData" @on-double-click="doubleClick" @on-click="sigleClick" multiple :selectedKeys.sync="selectedKeys" ></u-tree>
    <p class="demo-title">事件：@on-mouseover</p>
    <u-tree :treeData="treeData" @on-mouseover="mouseover" multiple :selectedKeys.sync="selectedKeys" ></u-tree>
    <p class="demo-title">事件：@on-click</p>
    <u-tree :treeData="treeData" @on-click="sigleClick" multiple :selectedKeys.sync="selectedKeys" ></u-tree>

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
          { title: 'title-0-0-0-0', id: '0-0-0-0' },
          { title: 'title-0-0-0-1', id: '0-0-0-1' },
          { title: 'title-0-0-0-2', id: '0-0-0-2', selectable: false }
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
var treeData1 = [
  {
    title: 'title-0-0',
    id: '0-0',
    children: [],
    levels: 1
  }
]
function newChildren (obj) {
  let num = 3
  if (obj.levels <= 2) num = obj.levels
  return Array(num)
    .fill('')
    .map((item, index) => {
      return {
        title: `${obj.title}-${index}`,
        id: `${obj.id}-${index}`,
        levels: obj.levels + 1,
        // selectable: (index == 1) ? true : false,
        // disabled: (index == 1) ? true : false,
        // disableCheckbox: index == 2 ? true : false,
        children: []
      }
    })
}
xunhuan(treeData1)
function xunhuan (element) {
  element.forEach(item => {
    item.children = newChildren(item)
    if (item.levels <= 2) xunhuan(item.children)
  })
}
// console.log("treeData1----->", treeData1);

export default {
  data () {
    return {
      alwaysSelect: true,
      value: '',
      treeData: treeData,
      selectedKeys: ['0-0', '0-0-0-0', '0-0-1-2'],
      setselectedKeys: ['0-0-1-1', '0-0-1-2'],
    }
  },
  methods: {
    selectChange (value, eventObj) {
      console.log('selectChange===========>', value, eventObj)
    },
    rightClick ({ node, event }) {
      console.log('rightClick===========>', node, event)
    },
    doubleClick ({ node, event }) {
      console.log('doubleClick===========>', node, event)
    },
    sigleClick ({ node, event }) {
      console.log('sigleClick===========>', node, event)
    },
    mouseover ({ node, event }) {
      console.log('mouseover===========>', node, event)
    },
    nodeSelect () {
      this.$refs.tree.nodeSelect(true, '0-0-0')
    },
    nodeSelect2 () {
      this.$refs.tree2.nodeSelect(true, '0-0-0')
    },
    nodeSelect3 () {
      this.$refs.tree3.nodeSelect(true, '0-0-0-2')
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
.demo-title{
  background: #ddd;
  padding: 3px;
  border-radius: 3px;
  padding-left: 15px;
  font-weight: 600;
}
</style>
