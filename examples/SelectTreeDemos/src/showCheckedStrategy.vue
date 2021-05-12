<template>
  <div class="tree-demo" style="width: 500px; margin-bottom: 500px;">
    <h-button @click="disabled = !disabled">disabled: {{disabled}}</h-button>
     <h-button @click="setValue">setValue</h-button>
    <h-button @click="selecttreeFocus">selecttreeFocus</h-button>
    <h-input></h-input>

    <p>单选</p>

    <p>showCheckedStrategy='SHOW_ALL'</p>
    <u-select v-model="value1" multiple filterable  labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll filterType="search" showCheckedStrategy='SHOW_ALL' :treeData="treeData"></u-select-tree>
    </u-select>

    <p>showCheckedStrategy='SHOW_PARENT'</p>
    <u-select v-model="value2" multiple filterable  labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll showCheckedStrategy='SHOW_PARENT' :treeData="treeData"></u-select-tree>
    </u-select>

     <p>showCheckedStrategy='SHOW_CHILD'</p>
    <u-select v-model="value3" multiple filterable  labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll showCheckedStrategy='SHOW_CHILD' :treeData="treeData"></u-select-tree>
    </u-select>

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
          { title: 'title-0-0-0-2', id: '0-0-0-2' },
          // { title: "title-0-0-0-2", id: "0-0-0-2" , selectable: false }
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
      loading: true,
      formInline: {
        user: '',
        users: ''
      },
      disabled: true,
      // value: "",
      treeData: treeData,
      treeData1: [],
      selectedKeys: ['0-0', '0-0-0-0', '0-0-1-2'],
      setselectedKeys: ['0-0-1-1', '0-0-1-2'],
      // value: '0-0-1-0',
      // value2: ['0-0-1-0', '0-0-0-0', '0-0-0', '0-1'],
      // value3: '0-0-1-0',
      value1: [],
      value2: [],
      value3: []
    }
  },
  methods: {
    selecttreeFocus () {
      this.$refs.selecttree.onFocus()
    },
    setValue () {
      if (this.value === '0-0-1-0') return this.value = '0-0-1-1'
      this.value = '0-0-1-0'
    },
    change () {
      console.log('触发了 on-change 事件')
    }
  },
  mounted () {
    setTimeout(() => {
      // this.disabled = !this.disabled
      this.treeData1 = treeData
      this.loading = false
    }, 5000)
  },
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
