<template>
  <div style="width: 500px;">
    <p class="demo-title">editnode</p>
    <h-button @click="editnode('add')">addnode</h-button>
    <h-button @click="editnode('edit')">editnode</h-button>
    <h-button @click="editnode('del')">delnode(批量删除)</h-button>
    <p class="demo-title">propsForceUpdate</p>
    <h-button @click="forceUpdate">forceUpdate</h-button>
    <p class="demo-title">positionKey</p>
    <h-button @click="changepositionKey">positionKey</h-button>
    <p class="demo-title">nodeExpand</p>
    <h-button @click="nodeExpand">nodeExpand</h-button>
    <p>:filterValue="value"</p>
    <h-input
      v-model="value"
      @on-enter="enter"
      placeholder="请输入..."
      style="width: 300px"
    ></h-input>
    <br />
    <u-tree
      ref="tree1"
      virtual
      v-model="checkedKeys"
      :expandedKeys.sync="expandedKeys"
      :maxHeight="500"
      :filterValue="filterValue"
      :renderMenu="renderDel"
      isTreeFilter
      :treeData="treeData2"
      showCheckbox
    ></u-tree>
    <!-- <u-tree ref="tree1" style="height: 300px; overflow: auto;" multiple :expandedKeys.sync="expandedKeys"  :filterValue="filterValue" isTreeFilter :treeData="treeData2" showCheckbox></u-tree> -->
  </div>
</template>

<script>
var treeData2 = Object.keys(Array.apply(null, { length: 3 })).map(
  (v, index) => {
    return {
      title: 'title-' + '0-' + index,
      id: '0-' + index,
      children: [],
      levels: 1,
    }
  }
)

function newChildren (obj) {
  const num = obj.levels
  // if (obj.levels === 1) num = 40
  return Object.keys(Array.apply(null, { length: num })).map(
    (item, index) => {
      return {
        title: `${obj.title}-${index}`,
        id: `${obj.id}-${index}`,
        levels: obj.levels + 1,
        children: [],
      }
    }
  )
}
xunhuan(treeData2)
function xunhuan (element) {
  element.forEach((item) => {
    item.children = newChildren(item)
    if (item.levels <= 5) xunhuan(item.children)
  })
}

export default {
  data () {
    return {
      value: '1',
      onlyScroll: false,
      treeData2,
      positionKey: '0-68-0-0',
      filterValue: '',
      timeout: null,
      expandedKeys: ['0-0', '0-2-0-0'],
      checkedKeys: ['0-2-0-0'],
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
        alert(res.msg)
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
        alert(res.msg)
        this.$nextTick(() => {
          this.$refs.tree1.nodePosition('0-edit')
        })
      }

      if (type === 'del') {
        // const res = this.$refs.tree1.nodeEdit('del', '0-2')
        const res = this.$refs.tree1.nodeEdit('del', ['0-0', '0-0-0-0', '0-0-0-0-1', '0-0-0-0-0', '0-0-0-0-2', '0-0-0-1-0', '0-add-0'])

        console.log(res)
        alert(res.msg)
      }
    },
    forceUpdate () {
      this.treeData2[0].title = 'hhhhhhh'
      this.$refs.tree1.propsForceUpdate('treeData')
      this.$nextTick(() => {
        this.$refs.tree1.nodePosition('0-0')
      })
    },
    enter () {
      this.filterValue = this.value
    },
    changepositionKey () {
      this.$refs.tree1.nodePosition('0-11-0-0')
    },
    nodeExpand () {
      this.$refs.tree1.nodeExpand(true, '0-0-0')
      this.$nextTick(() => {
        this.$refs.tree1.nodePosition('0-0-0')
      })
    },
    renderDel (h, { root, node, data }) {
      return h(
        'span',
        {
          on: {
            click: () => {
              console.log('click', root, node, data)
              const key = data.item.id
              this.$refs.tree1.nodeEdit('del', key)
            },
          },
        },
        'del',
      )
    },
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
