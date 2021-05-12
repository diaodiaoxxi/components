<template>
  <div style="width: 500px; margin-bottom: 200px;">
    <p class="demo-title">editnode</p>
    <h-button @click="editnode('add')">addnode</h-button>
    <h-button @click="editnode('edit')">editnode</h-button>
    <h-button @click="editnode('del')">delnode</h-button>
    <p class="demo-title">treeForceUpdate</p>
    <h-button @click="forceUpdate">forceUpdate</h-button>
    <p class="demo-title">treeForceUpdate</p>
    <h-button @click="changepositionKey">positionKey</h-button>
    <p class="demo-title">nodeExpand</p>
    <h-button @click="nodeExpand">nodeExpand</h-button>
    <p>:filterValue="value"</p>
    <h-input v-model="value" @on-enter="enter" placeholder="请输入..." style="width: 300px"></h-input>
    <br>
    <p>getAllTreeNodes</p>
    <h-button @click="getAllTreeNodes">getAllTreeNodes</h-button>

    <h-button @click="setTreeData">set tree data</h-button>

    <!-- <u-tree ref="tree1"
      v-model="checkedKeys"
      :renderMenu="renderDel"
      :expandLevel="1"
      :maxHeight="500"
      :expandedKeys.sync="expandedKeys"
      virtual
      :treeData="dataTest"
      ></u-tree> -->

    <u-tree
      showCheckbox
      @on-check="check"
      ref="tree1"
      :renderMenu="renderDel"
      :expandLevel="6"
      :maxHeight="250"
      :formatValue="formatValue"
      :expandedKeys.sync="expandedKeys"
      :treeData="treeData2"
      :filterValue="filterValue"
      isTreeFilter
      blockNode
      virtual
    ></u-tree>

    <!-- <u-tree
      ref="tree1"
      style="maxheight: 500px; overflow: auto"
      virtual
      :renderMenu="renderDel"
      :treeData="treeData2"
    ></u-tree> -->

    <!-- <u-tree ref="tree1" virtual v-model="checkedKeys" :renderMenu="renderDel" :expandedKeys.sync="expandedKeys" :expandLevel="1" :maxHeight="500" :filterValue="filterValue" isTreeFilter :treeData="dataTest" showCheckbox></u-tree> -->

    <!-- <u-tree ref="tree1" virtual v-model="checkedKeys" :renderMenu="renderDel" :expandLevel="1" :maxHeight="500" :filterValue="filterValue" isTreeFilter :treeData="dataTest" showCheckbox></u-tree> -->

    <!-- <u-tree ref="tree1" virtual  :maxHeight="500" :filterValue="filterValue" isTreeFilter :treeData="treeData2" showCheckbox></u-tree> -->

    <!-- <u-tree ref="tree1" style="height: 300px; overflow: auto;" multiple :expandedKeys.sync="expandedKeys"  :filterValue="filterValue" isTreeFilter :treeData="treeData2" showCheckbox></u-tree> -->

    <!-- <u-tree ref="tree1" :positionKey="positionKey" :maxHeight="800" virtual :filterValue="filterValue" isTreeFilter :treeData="treeData2" showCheckbox></u-tree> -->

    <!-- <u-tree ref="tree1" :onlyScroll="onlyScroll" :expandLevel="1" :maxHeight="800"  virtual :treeData="treeData2" showCheckbox></u-tree> -->
  </div>
</template>

<script>
// import { deepCopy } from
// import dataTest from './dataTest.json'
import dataTest from './dataTest2.json'

const deepCopy = require('lodash/cloneDeep')
console.log('data==========>', dataTest)

var treeData2 = Object.keys(Array.apply(null, { length: 1 })).map((v, index) => {
  // return '0-' + index
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
  if (obj.levels > 6) num = 2
  return Object.keys(Array.apply(null, { length: num })).map((item, index) => {
    return {
      title: `${obj.title}-${index}`,
      id: `${obj.id}-${index}`,
      levels: obj.levels + 1,
      children: [],
      test: 'test'
    }
  })
}
xunhuan(treeData2)
function xunhuan (element) {
  element.forEach((item) => {
    item.children = newChildren(item)
    if (item.levels <= 11) xunhuan(item.children)
  })
}

export default {
  data () {
    return {
      value: '1',
      onlyScroll: false,
      treeData2: treeData2,
      // treeData2: Object.freeze(treeData2),
      // dataTest: Object.freeze(dataTest),
      dataTest: dataTest,
      // treeData2: [],
      positionKey: '0-2-0-0',
      filterValue: '',
      timeout: null,
      expandedKeys: ['0-0', '0-2-0-0'],
      // checkedKeys: ['0-0', '0-2-0-0'],
      checkedKeys: [],
      // formatValue: 'uid',
      formatValue: 'id'

    }
  },
  methods: {
    editnode (type) {
      console.log(this.$refs.tree1)
      if (type === 'add') {
        // this.$refs.tree1.nodeEdit('add', '0-0-0-0', [{ title: "title-add", id: "0-add", }])
        const res = this.$refs.tree1.nodeEdit('add', '0-30-0', [
          { title: 'title-add-0', id: '0-add-0' },
          { title: 'title-add-1', id: '0-add-1' },
        ])
        console.log(res)
        // alert(res.msg)
        this.$nextTick(() => {
          this.$refs.tree1.nodePosition('0-add-0')
        })
      }
      if (type === 'edit') {
        const res = this.$refs.tree1.nodeEdit('edit', '0-0-0-0', {
          title: 'title-edit',
          id: '0-edit',
        })
        console.log(res)
        // alert(res.msg)
        this.$nextTick(() => {
          this.$refs.tree1.nodePosition('0-edit')
        })
      }

      if (type === 'del') {
        // const res = this.$refs.tree1.nodeEdit('del', '0-2')
        const res = this.$refs.tree1.nodeEdit('del', ['0-0-0-0', '0-0-0-0-1', '0-0-0-0-0-0', '0-0-0-0-0-1', '0-0-0-0-2', '0-0-0-0-4', '0-0-0-1-0', '0-add-0'])

        console.log(res)
        // alert(res.msg)
      }
    },
    renderDel (h, { root, node, data }) {
      return h(
        'span',
        {
          on: {
            click: () => {
              console.log('click', root, node, data)
              const key = data.item[this.formatValue]
              this.$refs.tree1.nodeEdit('del', key)
            },
          },
        },
        'del',
      )
    },
    forceUpdate () {
      this.treeData2[0].title = 'hhhhhhh'
      this.$refs.tree1.treeForceUpdate()
    },
    enter () {
      this.filterValue = this.value
      if (this.value === '') {
        if (this.positionKey !== '0-58-0-0') this.positionKey = '0-58-0-0'
        this.$refs.tree1.propsForceUpdate('positionKey')
      }
    },
    changepositionKey () {
      this.$refs.tree1.nodePosition('0-2-0-99')
    },
    nodeExpand () {
      this.$refs.tree1.nodeExpand(true, '0-0-0')
    },
    getAllTreeNodes () {
      const data = this.$refs.tree1.getAllTreeNodes()
      console.log('data=======>', data)
    },
    setTreeData () {
      const data = deepCopy(treeData2)
      console.log('data', 1)
      this.$set(this, 'treeData2', data)
    },
    check (checkedKeys, eventobj) {
      console.log('checkedKeys, eventobj', checkedKeys, eventobj)
    }
  },
  created () {
    // setTimeout(() => {
    //   this.treeData2 = treeData2
    //   this.$nextTick(() => {
    //     this.getAllTreeNodes()
    //   })
    // }, 300)
  },
  mounted () {
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
