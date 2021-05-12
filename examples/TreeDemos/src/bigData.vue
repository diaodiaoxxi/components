<template>
  <div style="width: 300px;">
    <h-button @click="checkedKeys = setcheckedKeys">setvalue-checkedKeys</h-button>
    <h-button @click="selectedKeys = setselectedKeys">setvalue-selectedKeys</h-button>
    <h-button @click="forceUpdate">forceUpdate</h-button>
    <h-button @click="changepositionKey">positionKey</h-button>
    <br>
    <!-- <h-button @click="editnode('add')">addnode</h-button>
    <h-button @click="editnode('edit')">editnode</h-button>
    <h-button @click="editnode('del')">delnode</h-button>
    <h-button @click="forceUpdate">forceUpdate</h-button> -->
    <h-switch v-model="onlyScroll"></h-switch>
    <br />
    <h-input v-model="value" @on-enter="enter" placeholder="请输入..." style="width: 300px"></h-input>
    <p>getAllTreeNodes</p>
    <h-button @click="getAllTreeNodes">getAllTreeNodes</h-button>
    <!-- <u-tree ref="tree" :expandedKeys.sync="expandedKeys"  :expandLevel="1" virtual isTreeFilter :treeData="treeData1" showCheckbox></u-tree> -->

    <!-- <u-tree ref="tree"
    v-model="checkedKeys"
    :expandedKeys.sync="expandedKeys"
    :filterValue="filterValue"
    multiple isTreeFilter  :expandLevel="1"
    virtual :treeData="treeData1" showCheckbox></u-tree> -->

    <!-- <u-tree ref="tree" multiple isTreeFilter :expandLevel="1" virtual :treeData="treeData1" showCheckbox blockDirectory ></u-tree> -->

    <u-tree ref="tree" :maxHeight="250" :filterValue="filterValue" :expandLevel="1" virtual isTreeFilter :renderMenu="renderContent" :treeData="treeData1" showCheckbox></u-tree>

    <!-- <u-tree ref="tree" :filterValue="value" :expandLevel="1" :positionKey="positionKey" virtual isTreeFilter :treeData="treeData1" showCheckbox></u-tree> -->
    <!-- <u-tree ref="tree" virtual @on-expand="expand" :expandLevel="11" :filterValue="value" isTreeFilter :filterNodeMethod="filterNodeMethod" :treeData="treeData1" showCheckbox></u-tree>
    <u-tree ref="tree1" :onlyScroll="onlyScroll" :expandLevel="1" :maxHeight="500" v-model="checkedKeys" virtual @on-expand="expand" :filterValue="value" isTreeFilter :filterNodeMethod="filterNodeMethod" :treeData="treeData1" showCheckbox></u-tree>
    <br>
    <u-tree ref="tree1" :onlyScroll="onlyScroll" :maxHeight="800" v-model="checkedKeys" virtual @on-expand="expand" :filterValue="value" isTreeFilter :filterNodeMethod="filterNodeMethod" :treeData="treeData2" showCheckbox></u-tree>
    <u-tree ref="tree" virtual @on-expand="expand" :expandLevel="11" :filterValue="value" isTreeFilter :filterNodeMethod="filterNodeMethod" :treeData="bigData" showCheckbox></u-tree> -->

  </div>
</template>

<script>

var treeData1 = [
  {
    title: 'title-0-0',
    id: '0-0',
    children: [],
    levels: 1
  },

]

var treeData2 = Object.keys(Array.apply(null, { length: 1000 })).map((v, index) => {
  return {
    title: 'title-' + index,
    id: '0-' + index,
    children: [],
    levels: 2
  }
})

function newChildren (obj) {
  let num = obj.levels
  if (obj.levels === 1) num = 300
  if (obj.levels >= 2) num = obj.levels
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
xunhuan(treeData2)
function xunhuan (element) {
  element.forEach(item => {
    item.children = newChildren(item)
    if (item.levels <= 1) xunhuan(item.children)
  })
}
console.log('treeData1----->', treeData1)

// import bigData from './data.js'
export default {
  data () {
    return {
      value: '',
      onlyScroll: false,
      treeData1: treeData1,
      // bigData,
      checkedKeys: ['0-0-0', '0-0-1-1', '0-0-1-2'],
      selectedKeys: ['0-0', '0-0-1-2', '0-0-1-1'],
      setcheckedKeys: ['0-0-0', '0-0-5-0'],
      setselectedKeys: ['0-0-1-1', '0-0-1-2'],
      expandedKeys: ['0-0-0', '0-0-0-2', '0-0-1-2'],
      // expandedKeys: ['0-0-1', '0-0-0-2'],
      positionKey: '0-0-68-0',
      filterValue: '',
    }
  },
  mounted () {
    // this.$refs.tree.rebuildTreeData.forEach(v => {
    //   console.log(11111)
    // })
    // setTimeout(() => {
    //   this.expandedKeys = ['0-0', '0-0-1']
    // }, 1000);
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
    },
    forceUpdate () {
      this.treeData1[0].title = 'hhhhhhh'
      this.$refs.tree.treeForceUpdate()
    },
    changepositionKey () {
      this.$refs.tree.nodePosition('0-0-390-0')
    },
    enter () {
      this.filterValue = this.value
      if (this.value === '') {
        if (this.positionKey !== '0-0-58-0') this.positionKey = '0-0-58-0'
        this.$refs.tree.propsForceUpdate('positionKey')
      }
    },
    getAllTreeNodes () {
      const data = this.$refs.tree.getAllTreeNodes()
      console.log('data=======>', data)
    },
    renderContent (h, { root, node, data }) {
      // console.log(root, node, data)
      return h(
        'span',
        {
          style: {
            display: 'inline-block',
            width: '100%'
          },
          on: {
            click: () => {
              console.log(111111)
            }
          }
        },
        [
          h('span', [
            h('h-icon', {
              props: {
                name: 'ios-paper-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          })
        ]
      )
    },
  }
}
</script>

<style>
</style>
