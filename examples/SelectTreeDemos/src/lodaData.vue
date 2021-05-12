<template>
  <div class="tree-demo" style="width: 500px;">

    <!-- <u-tree :treeData="treeData2" virtual :filterValue="value" :filterNodeMethod="filterNodeMethod"  showCheckbox :expandLevel="2" :renderMenu="renderContent" titleMaxWidth="150" :load-data="autoloadData1" blockNode ></u-tree> -->

    <u-tree :treeData="treeData2" disabled :expandLevel="2" showCheckbox @on-load="load" :load-data="autoloadData"></u-tree>

    <u-tree :treeData="treeData2" showCheckbox @on-load="load" :load-data="autoloadData"></u-tree>

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
      let text = ''
      const arr = new Array(item.level).fill('x')
      arr.forEach(v => (text = text + v))
      setTimeout(() => {
        let data = [
          {
            title: 'autoLoad-children' + item.id + text,
            id: item.id + '0',
            loading: false,
            children: []
          },
          {
            title: 'autoLoad-children' + +item.id,
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
      console.log('value, eventObj----->', value, eventObj)
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
