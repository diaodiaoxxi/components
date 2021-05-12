<template>
  <div style="width: 500px;">
    <h-button @click="checkedKeys = setcheckedKeys">setvalue-checkedKeys</h-button>
    <h-button @click="selectedKeys = setselectedKeys">setvalue-selectedKeys</h-button>
    <br />
    <h-input v-model="value" placeholder="请输入..." style="width: 300px"></h-input>
    <h-button @click="disabled = !disabled">disabled: {{disabled}}</h-button>

    <p>单选</p>
    <u-select v-model="value" clearable filterable :disabled="disabled" labelKey="title" valueKey="id">
      <u-select-tree :expandLevel="3" :treeData="testBigData" virtual></u-select-tree>
    </u-select>

    <!-- <u-select v-model="value" :disabled="disabled" labelKey="title" valueKey="id">
      <u-select-tree :expandLevel="3" :treeData="treeData1" virtual></u-select-tree>
    </u-select>

    <p>filterable</p>
    <u-select ref="selecttree" v-model="value" filterable :disabled="disabled" labelKey="title" valueKey="id">
      <u-select-tree virtual :expandLevel="3" :treeData="treeData1" ></u-select-tree>
    </u-select>

    <p>多选</p>

    <u-select  v-model="value2" filterable multiple :maxTagCount="3" :disabled="disabled" labelKey="title" valueKey="id">
      <u-select-tree virtual :expandLevel="3" :treeData="treeData1"></u-select-tree>
    </u-select>

    <p>isString && loading</p>
    <h-switch v-model="loading">loading</h-switch>
    <u-select isString v-model="value3" filterable multiple  :loading="loading" :maxTagCount="3" :disabled="disabled" labelKey="title" valueKey="id">
      <u-select-tree virtual :expandLevel="3" showCheckedStrategy="SHOW_CHILD" :treeData="treeData1"></u-select-tree>
      <div slot="emptyList"> NOT - FONUND</div>
    </u-select>

      <p>widthAdaption && maxDropWidth="600"</p>
     <u-select v-model="value4" style="width: 300px;" widthAdaption maxDropWidth="600" filterable :maxTagCount="3" :disabled="disabled" labelKey="title" valueKey="id">
      <u-select-tree virtual :expandLevel="3" :treeData="testBigData"></u-select-tree>
    </u-select> -->

  </div>
</template>

<script>

// var treeData1 = [
//   {
//     title: "title-0-0",
//     id: "0-0",
//     children: [],
//     levels: 1
//   },
//   {
//     title: "title-0-1",
//     id: "0-1",
//     children: [],
//     levels: 1
//   },
// ];

import bigData from './getAcceptTypeTree.json'

var treeData1 = Object.keys(Array.apply(null, { length: 2 })).map((v, index) => {
  return {
    title: 'title-0-' + index,
    id: '0-' + index,
    children: [],
    levels: 1
  }
})

function newChildren (obj) {
  let num = 199
  if (obj.levels <= 1) num = obj.levels
  return Object.keys(Array.apply(null, { length: num }))
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
    if (item.levels <= 1) xunhuan(item.children)
  })
}
console.log('treeData1----->', treeData1)
console.log('bigdata', bigData)
console.log('bigdata', JSON.parse(bigData.json_string))
const num = 10
const testBigDataChild = []
Object.keys(Array.apply(null, { length: num })).forEach(item => {
  testBigDataChild.push(...JSON.parse(bigData.json_string)[0].children)
})
function xunhuan2 (item, index) {
  item.id = `${item.id}_${index}`
  item.title = `${item.title}_${index}`
  if (index % 5 === 0) item.title = `${item.title}_${index}_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
  item.disabled = false
  item.disabled = item.children && item.children.length > 0
  item.children && item.children.forEach(v => {
    xunhuan2(v, index)
  })
}
testBigDataChild.forEach((item, index) => {
  xunhuan2(item, index)
})
console.log('bigdata', testBigDataChild)
var testBigData = JSON.parse(bigData.json_string)
testBigData[0].children = testBigDataChild
// import bigData from './data.js'
export default {
  data () {
    return {
      formInline: {
        user: '',
        users: ''
      },
      loading: false,
      disabled: false,
      value: '6121_0',
      value2: [],
      value3: '0-0-0,0-0-1,0-2',
      // value3: '6121,3996,5462',
      // value3: '',
      value4: '',
      treeData1: treeData1,
      testBigData: [],
      // bigData,
      checkedKeys: ['0-0-0', '0-0-1-1', '0-0-1-2'],
      selectedKeys: ['0-0', '0-0-1-2', '0-0-1-1'],
      setcheckedKeys: ['0-0-1-1', '0-0-1-2'],
      setselectedKeys: ['0-0-1-1', '0-0-1-2'],
      expandedKeys: ['0-0-1', '0-0-0-2', '0-0-1-2']
      // expandedKeys: ['0-0-1', '0-0-0-2']
    }
  },
  mounted () {
    // this.$refs.tree.rebuildTreeData.forEach(v => {
    //   console.log(11111)
    // })
    setTimeout(() => {
      // this.testBigData = JSON.parse(bigData.json_string)
      this.testBigData = testBigData
    }, 2000)
  },
  methods: {
    expand (value, eventObj) {
      console.log('value------>', value, eventObj)
    },
    filterNodeMethod ({ value, data, node }) {
      // console.log(value, data, node)
      if (value === '') return
      // console.log(data.title.includes(value))
      if (node.title.includes(value)) return true
      return false
    },
  }
}
</script>

<style>
</style>
