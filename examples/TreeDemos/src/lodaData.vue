<template>
  <div class="tree-demo" style="width: 500px;">
   <h-input v-model="value" placeholder="请输入..." style="width: 300px"></h-input>
   <h-button @click="expand">expand</h-button>
    <!-- <u-tree :treeData="treeData2" virtual :filterValue="value" :filterNodeMethod="filterNodeMethod"  showCheckbox :expandLevel="2" :renderMenu="renderContent" titleMaxWidth="150" :load-data="autoloadData1" blockNode ></u-tree> -->

    <!-- <u-tree :treeData="treeData2" disabled :expandLevel="2" showCheckbox @on-load="load" :load-data="autoloadData"></u-tree> -->

    <u-tree ref="tree" :treeData="treeData2" showCheckbox :filterValue="value" isTreeFilter @on-load="load" :load-data="autoloadData"></u-tree>
    <!-- <p>---------</p> -->
    <!-- <u-tree ref="tree" :treeData="treeData2" :expandLevel="2" showCheckbox @on-load="load" :load-data="autoloadData"></u-tree> -->

  </div>
</template>

<script>
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
      treeData2,
      // expandedKeys: ['0-0-1', '0-0-0-2']
    }
  },
  methods: {
    autoloadData (item, callback) {
      console.log('item====>', item)
      let text = ''
      const arr = new Array(item.level).fill('x')
      arr.forEach(v => (text = text + v))
      setTimeout(() => {
        let data = [
          {
            title: 'autoLoad-children' + item.id + text,
            id: item.id + '0',
            loading: false,
            leaf: false,
            children: [
              {
                title: 'autoLoad-children' + item.id + text + '-0',
                id: item.id + '-0-1',
                // id: item.id + '1', // 新增数据与treeData数据的存在重复的key值 测试
                // id: '0-0-0', // 先加载data中本身出现重复key 测试
                loading: false,
                children: [],
                leaf: false
              }
            ]
          },
          {
            title: 'autoLoad-children' + item.id,
            id: item.id + '1',
            loading: false,
            children: [],
            leaf: true
          }
        ]
        item.level > 4 && (data = [])
        callback(data)
      }, 1000)
    },
    autoloadData1 (item, callback) {
      let text = ''
      // console.log(item);
      const arr = new Array(item.level).fill('x')
      arr.forEach(v => (text = text + v))
      // console.log("text---->", arr, text);
      // for(let i = 0; i<1000; i++){

      // }
      const data = new Array(10).fill('').map((v, index) => {
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
      }, 1000)
    },
    load (value, eventObj) {
      const { status, msg } = eventObj
      console.log('load value, eventObj----->', value, eventObj)
      console.log(status ? '加载成功' : '加载失败')
      console.log('msg=====>', msg)
      if (!status) {
        alert('异步加载失败：' + msg)
      }
    },
    faliLoad (msg) {

    },
    expand () {
      this.$refs.tree.nodeExpand(true, '0-0-1-1')
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
</style>
