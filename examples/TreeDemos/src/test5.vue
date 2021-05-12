<template>
  <div class="tree-demo" style="width: 500px;">
    <u-tree ref="tree" :treeData="treeData2" showCheckbox @on-load="load" :load-data="autoloadData"></u-tree>
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
                // id: item.id + '-0-1',
                // id: item.id + '1', // 先加载data中本身出现重复key 测试
                id: '0-0-0', // 新增数据与treeData数据的存在重复的key值 测试
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
    load (value, eventObj) {
      const { status, msg } = eventObj
      console.log('load value, eventObj----->', value, eventObj)
      console.log(status ? '加载成功' : '加载失败')
      console.log('msg=====>', msg)
      if (!status) {
        alert('异步加载失败：' + msg)
      }
    },
    expand () {
      this.$refs.tree.nodeExpand(true, '0-0-1-1')
    }
  }
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
