<template>
  <div class="tree-demo" style="width: 500px; margin-bottom: 500px;">
    <div>单选 </div>
    <p>labelKey="title" valueKey="id"</p>
    <p>value======> {{value1}}</p>
    <u-select v-model="value1" :disabled="disabled" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <p>labelKey="title" valueKey="title"</p>
    <p>value======> {{value2}}</p>
    <u-select v-model="value2" :disabled="disabled" labelKey="title" valueKey="title">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <p>labelKey="id" valueKey="id"</p>
    <p>value======> {{value3}}</p>
    <u-select v-model="value3" :disabled="disabled" labelKey="id" valueKey="id">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <p>labelKey="id" valueKey="title"</p>
    <p>value======> {{value4}}</p>
    <u-select v-model="value4" :disabled="disabled" labelKey="id" valueKey="title">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <div>多选</div>
    <p>labelKey="title" valueKey="id"</p>
    <p>value======> {{value5}}</p>
    <u-select v-model="value5" multiple :disabled="disabled" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <p>labelKey="title" valueKey="title"</p>
    <p>value======> {{value6}}</p>
    <u-select v-model="value6" multiple :disabled="disabled" labelKey="title" valueKey="title">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <p>labelKey="id" valueKey="id"</p>
    <p>value======> {{value7}}</p>
    <u-select v-model="value7" multiple :disabled="disabled" labelKey="id" valueKey="id">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <p>labelKey="id" valueKey="title"</p>
    <p>value======> {{value8}}</p>
    <u-select v-model="value8" multiple :disabled="disabled" labelKey="id" valueKey="title">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <p>isString && selectPaste && labelKey="title" valueKey="title"</p>
    <p>value======> {{value10}}</p>
    <u-select v-model="value10" isString selectPaste multiple filterable :disabled="disabled" labelKey="title" valueKey="title">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

  </div>
</template>

<script>
var treeData = [
  {
    title: 'title-0-0',
    id: '0-0',
    disabled: true,
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
      disabled: false,
      // value: "",
      treeData: treeData,
      treeData1: [],
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      value6: '',
      value7: '',
      value8: '',
      value9: '',
      value10: '',
    }
  },
  methods: {
    selecttreeFocus (num) {
      this.$refs[`selecttree${num}`].onFocus()
      setTimeout(() => {
        this.$refs[`selecttree${num}`].onBlur()
      }, 3000)
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
