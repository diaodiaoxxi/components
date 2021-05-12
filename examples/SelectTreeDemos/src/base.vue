<template>
  <div class="tree-demo" style="width: 500px;">
    <h-button @click="setValueNull">setValue null</h-button>
    <p>showTitle</p>
    <h-button @click="showTitle = !showTitle">showTitle：{{showTitle}}</h-button>
    <p>单选</p>
    <h-button @click="setValue(1)">setValue-1</h-button>
    <h-button @click="setValue(2)">setValue-2</h-button>
    <p>多选</p>
    <h-button @click="setValue1(3)">setValue-3</h-button>
    <h-button @click="setValue1(4)">setValue-4</h-button>
    <h-button @click="setValue1(5)">setValue-5</h-button>
    <p>disabled && readonly</p>
    <h-button @click="disabled = !disabled">disabled: {{disabled}}</h-button>
    <h-button @click="readonly = !readonly">readonly: {{readonly}}</h-button>
    <h-button @click="clearable = !clearable">clearable: {{clearable}}</h-button>
    <h-button @click="isArrow = !isArrow">isArrow: {{isArrow}}</h-button>

    <p>单选</p>
    <u-select v-model="value2" ref="selecttree0" :clearable="clearable" :showTitle="showTitle" :isArrow="isArrow"  @on-paste="paste" @on-blur="blur" @on-focus="focus" @on-change="change" @on-click="click" :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll @on-expand="expand" @on-inside-select="select" :treeData="treeData"></u-select-tree>
    </u-select>

    <p>filterable</p>
    <u-select v-model="value2" ref="selecttree0" :clearable="clearable" :showTitle="showTitle" :isArrow="isArrow" filterable  @on-paste="paste" @on-blur="blur" @on-focus="focus" @on-change="change" @on-click="click" :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll @on-expand="expand" @on-inside-select="select" :treeData="treeData"></u-select-tree>
    </u-select>

    <p>多选</p>
    <u-select v-model="value3" multiple ref="selecttree0" :clearable="clearable" :showTitle="showTitle" :isArrow="isArrow"  @on-paste="paste" @on-blur="blur" @on-focus="focus" @on-change="change" @on-click="click" :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll @on-expand="expand" @on-inside-select="select" :treeData="treeData"></u-select-tree>
    </u-select>

    <p>filterable</p>
    <u-select v-model="value4" multiple ref="selecttree0" :clearable="clearable" :showTitle="showTitle" :isArrow="isArrow" filterable  @on-paste="paste" @on-blur="blur" @on-focus="focus" @on-change="change" @on-click="click" :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll @on-expand="expand" @on-inside-select="select" :treeData="treeData"></u-select-tree>
    </u-select>

    <p>multHeadType="text" && filterable</p>
    <u-select v-model="value5" multiple multHeadType="text" :clearable="clearable" :showTitle="showTitle" :isArrow="isArrow" filterable @on-paste="paste" @on-blur="blur" @on-focus="focus" @on-change="change" @on-click="click" :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <p>multHeadType="text"</p>
    <u-select v-model="value5" multiple multHeadType="text" :clearable="clearable" :showTitle="showTitle" :isArrow="isArrow" @on-paste="paste" @on-blur="blur" @on-focus="focus" @on-change="change" @on-click="click" :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
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
        title: 'title-0-0-0title-0-0XXXXXXtitle-0-0XXXXXXtitle-0-0XXXXXXtitle-0-0XXXXXXtitle-0-0XXXXXXtitle-0-0XXXXXXtitle-0-0XXXXXXtitle-0-0XXXXXXtitle-0-0XXXXXXtitle-0-0XXXXXXtitle-0-0XXXXXXtitle-0-0XXXXXX',
        id: '0-0-0',
        className: 'title-0-0XXXXXX',
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
      showTitle: true,
      clearable: false,
      isArrow: true,
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
      value1: '0-0-1-0',
      value2: '0-0-1-0',
      value3: ['0-0-0'],
      value4: ['0-0-0'],
      value5: ['0-0-0']
    }
  },
  methods: {
    selecttreeFocus (num, bol) {
      this.$refs[`selecttree${num}`].onFocus(bol)
      setTimeout(() => {
        this.$refs[`selecttree${num}`].onBlur(bol)
      }, 3000)
    },
    setValue (num) {
      if (this[`value${num}`] === '0-0-1-0') return this[`value${num}`] = '0-0-1-1'
      this[`value${num}`] = '0-0-1-0'
    },
    setValue1 (num) {
      if (this[`value${num}`][0] === '0-0-1-0') return this[`value${num}`] = ['0-0-0']
      this[`value${num}`] = ['0-0-1-0', '0-0']
    },
    setValueNull () {
      this.value1 = ''
      this.value2 = ''
      this.value3 = ''
      this.value4 = ''
      this.value5 = []
      this.value6 = []
      this.value7 = []
      this.value8 = []
    },
    change (val, { objVal }) {
      console.log('触发了 on-change 事件', val, objVal)
    },
    blur (event) {
      console.log('触发了 on-blur 事件')
    },
    focus (event) {
      console.log('触发了 on-focus 事件')
    },
    click (event) {
      console.log('触发了 on-click 事件')
    },
    paste (text, { event }) {
      console.log('触发了 on-paste 事件', text, event)
    },
    expand (keys, event) {
      console.log('触发了 on-expand 事件', keys, event)
    },
    select (keys, event) {
      console.log('触发了 on-inside-select 事件', keys, event)
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
