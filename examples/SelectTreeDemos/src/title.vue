<template>
  <div class="tree-demo" style="width: 500px;">
    <h-button @click="showTitle = !showTitle">showTitle: {{showTitle}}</h-button>

    <p>showTitle = {{showTitle}}</p>
    <u-select v-model="value" labelKey="title" valueKey="id">
      <u-select-tree :showTitle="showTitle" defaultExpandAll :treeData="treeData"></u-select-tree>
    </u-select>
    <u-select v-model="value" labelKey="id" valueKey="id">
      <u-select-tree :showTitle="showTitle" defaultExpandAll :treeData="treeData"></u-select-tree>
    </u-select>
    <p>showTitle = {{showTitle}} && renderTextTips【 String 】</p>
    <u-select v-model="value" labelKey="title" valueKey="id">
      <u-select-tree :showTitle="showTitle" renderTextTips="id" defaultExpandAll :treeData="treeData"></u-select-tree>
    </u-select>

    <p>showTitle = {{showTitle}} && renderTextTips【 Array 】</p>
    <u-select v-model="value" labelKey="title" valueKey="id">
      <u-select-tree :showTitle="showTitle" :renderTextTips="['id', 'title']" defaultExpandAll :treeData="treeData"></u-select-tree>
    </u-select>

    <p>showTitle = {{showTitle}} && renderTextTips【 Function 】</p>
    <u-select v-model="value" filterabl labelKey="title" valueKey="id">
      <u-select-tree :showTitle="showTitle" :renderTextTips="renderTextTips"  defaultExpandAll :treeData="treeData"></u-select-tree>
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
        // showTitle: (index == 1) ? true : false,
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
      showTitle: false,
      // value: "",
      treeData: treeData,
      treeData1: [],
      selectedKeys: ['0-0', '0-0-0-0', '0-0-1-2'],
      setselectedKeys: ['0-0-1-1', '0-0-1-2'],
      value: '0-0-1-0',
      value2: ['0-0-1-0'],
      value3: '0-0-1-0'
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
    renderTextTips (item) {
      // return 'title--------->'+ item.title + /n+  item.id
      return `title------->${item.title} \/n id---------->${item.id}`
    },
  },
  mounted () {
    setTimeout(() => {
      // this.showTitle = !this.showTitle
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
