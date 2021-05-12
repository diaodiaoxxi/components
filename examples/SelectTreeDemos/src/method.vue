<template>
  <div class="tree-demo" style="width: 500px;">
    loading: <h-switch v-model="loading"></h-switch>
    <h-button @click="disabled = !disabled">disabled: {{disabled}}</h-button>
    <h-button @click="readonly = !readonly">readonly: {{readonly}}</h-button>
    <p>drop = false</p>
    <h-button @click="selecttreeFocus(0, false)">selecttreeFocus-0</h-button>
    <h-button @click="selecttreeFocus(1, false)">selecttreeFocus-1</h-button>
    <h-button @click="selecttreeFocus(3, false)">selecttreeFocus-3</h-button>
    <h-button @click="selecttreeFocus(4, false)">selecttreeFocus-4</h-button>

    <p>drop = true</p>
    <h-button @click="selecttreeFocus(0, true)">selecttreeFocus-0</h-button>
    <h-button @click="selecttreeFocus(1, true)">selecttreeFocus-1</h-button>

    <h-button @click="selecttreeFocus(3, true)">selecttreeFocus-3</h-button>
    <h-button @click="selecttreeFocus(4, true)">selecttreeFocus-4</h-button>

    <p>单选</p>

    <u-select v-model="value" ref="selecttree0" @on-blur="blur" @on-focus="focus" :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <p>filterable</p>
    <u-select v-model="value1" ref="selecttree1" @on-blur="blur" @on-focus="focus" @on-change="change" filterable :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <p>多选</p>

    <u-select v-model="value3" multiple ref="selecttree3" @on-blur="blur" @on-focus="focus" :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <p>filterable</p>

    <u-select v-model="value4" multiple ref="selecttree4"  @on-blur="blur" @on-focus="focus" @on-change="change" filterable :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
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
      loading: true,
      formInline: {
        user: '',
        users: ''
      },
      disabled: false,
      readonly: false,
      // value: "",
      treeData: treeData,
      treeData1: [],
      selectedKeys: ['0-0', '0-0-0-0', '0-0-1-2'],
      setselectedKeys: ['0-0-1-1', '0-0-1-2'],
      value: '0-0-1-0',
      value1: '',
      value3: [],
      value4: [],
    }
  },
  methods: {
    selecttreeFocus (num, bol) {
      this.$refs[`selecttree${num}`].onFocus(bol)
      setTimeout(() => {
        this.$refs[`selecttree${num}`].onBlur(bol)
      }, 3000)
    },
    setValue () {
      if (this.value === '0-0-1-0') return this.value = '0-0-1-1'
      this.value = '0-0-1-0'
    },
    change () {
      console.log('触发了 on-change 事件')
    },
    blur () {
      console.log('触发了 on-blur 事件')
    },
    focus () {
      console.log('触发了 on-focus 事件')
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
