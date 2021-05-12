<template>
<div style="width: 500px;">
<h-button @click="setValue">setValue</h-button>
<p>:filterValue="value"</p>
<h-input v-model="value" @on-enter="enter" placeholder="请输入..." style="width: 300px"></h-input>
<br>
<p>filterType="search"</p>
<p>{{checkedKeys}}</p>
<u-tree ref="tree1" virtual v-model="checkedKeys" :selectedKeys.sync="selectedKeys" filterType="search" :load-data="autoloadData" :expandedKeys.sync="expandedKeys" :filterValue="filterValue" isTreeFilter :treeData="treeData3" showCheckbox></u-tree>
<p>filterType="filter"</p>
<p>{{checkedKeys2}}</p>
<u-tree ref="tree1" virtual v-model="checkedKeys2" :selectedKeys.sync="selectedKeys" filterType="filter" :load-data="autoloadData" :expandedKeys.sync="expandedKeys" :filterValue="filterValue" isTreeFilter :treeData="treeData3" showCheckbox></u-tree>
<!-- <u-tree ref="tree1" style="height: 300px; overflow: auto;" multiple :expandedKeys.sync="expandedKeys" :filterValue="filterValue" isTreeFilter :treeData="treeData2" showCheckbox></u-tree> -->
</div>
</template>

<script>

var treeData2 = Object.keys(Array.apply(null, { length: 300 })).map((v, index) => {
  return {
    title: 'title-' + '0-' + index,
    id: '0-' + index,
    children: [],
    levels: 1
  }
})
var treeData3 = [
  {
    title: 'title-0-0',
    id: '0-0',
    disabled: true,
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
            title: 'title-0-0-1-0-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            id: '0-0-1-0',
            leaf: true
          },
          {
            title: 'title-0-0-1-1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            id: '0-0-1-1'
          },
          {
            title: 'title-0-0-1-2-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            id: '0-0-1-2'
          }
        ]
      },
      {
        title: 'title-0-0-2',
        id: '0-0-2',
        leaf: true
      }
    ]
  },
  {
    title: 'title-9-9',
    id: '9-9',
    leaf: false,
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

function newChildren (obj) {
  const num = obj.levels
  // if (obj.levels === 1) num = 40
  return Object.keys(Array.apply(null, { length: num }))
    .map((item, index) => {
      return {
        title: `${obj.title}-${index}`,
        id: `${obj.id}-${index}`,
        levels: obj.levels + 1,
        children: []
      }
    })
}
xunhuan(treeData2)
function xunhuan (element) {
  element.forEach(item => {
    item.children = newChildren(item)
    if (item.levels <= 2) xunhuan(item.children)
  })
}

export default {
  data () {
    return {
      selectedKeys: ['0-0-0-0', '0-0-0-0-1'],
      value: '1',
      onlyScroll: false,
      treeData3,
      treeData2,
      positionKey: '0-68-0-0',
      filterValue: '',
      timeout: null,
      expandedKeys: ['0-0', '0-1-0-0'],
      checkedKeys: ['0-0', '0-1-0-0', '0-0-0-0-1'],
      checkedKeys2: ['0-0', '0-1-0-0'],
    }
  },
  methods: {
    setValue () {
      this.checkedKeys = ['0-0', '0-1-0-0', '0-0-0-0-1']
      this.checkedKeys2 = ['0-0', '0-1-0-0']
    },
    autoloadData (item, callback) {
      let text = ''
      const arr = new Array(item.level).fill('x')
      arr.forEach(v => (text = text + v))
      const data = ['', '', ''].map((v, index) => {
        return {
          title: 'autoLoad-children' + item.id + '-' + index,
          id: item.id + '-' + index,
          loading: false,
          children: [],
          leaf: !(index >= 0 && index < 500)
        }
      })
      setTimeout(() => {
        callback(data)
      }, 2000)
    },
    load (value, eventObj) {
      console.log('value, eventObj----->', value, eventObj)
    },

    enter () {
      this.filterValue = this.value
    },
  },
}
</script>
