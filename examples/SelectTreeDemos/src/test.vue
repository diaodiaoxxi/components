<template>
  <div class="tree-demo" style="width: 500px;">
    <p>单选</p>
    <h-button @click="setValue(1)">setValue-1</h-button>
    <h-button @click="setValue(2)">setValue-2</h-button>
    <p>多选</p>
    <h-button @click="setValue1(3)">setValue-3</h-button>
    <h-button @click="setValue1(4)">setValue-4</h-button>
    <p>disabled && readonly</p>
    <h-button @click="disabled = !disabled">disabled: {{disabled}}</h-button>
    <h-button @click="readonly = !readonly">readonly: {{readonly}}</h-button>
    <h-button @click="clearable = !clearable">clearable: {{clearable}}</h-button>

    <h-button @click="filterTypeChange">filterType: {{filterType}}</h-button>

    <p>单选</p>
    <u-select v-model="value1" ref="selecttree0" :clearable="clearable" @on-paste="paste" @on-blur="blur" @on-focus="focus" @on-change="change" @on-click="click" @on-clear-select="clear" :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll :filterType="filterType" @on-expand="expand" @on-inside-select="select" :treeData="treeData"></u-select-tree>
    </u-select>

    <p>filterable</p>
    <u-select v-model="value2" ref="selecttree0" :clearable="clearable" filterable  @on-paste="paste" @on-blur="blur" @on-focus="focus" @on-change="change" @on-click="click" @on-clear-select="clear" :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll :filterType="filterType" @on-expand="expand" @on-inside-select="select" :treeData="treeData"></u-select-tree>
    </u-select>

    <p>多选</p>
    <u-select v-model="value3" multiple ref="selecttree0" :clearable="clearable"  @on-paste="paste" @on-blur="blur" @on-focus="focus" @on-change="change" @on-click="click" @on-clear-select="clear" :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll :filterType="filterType" @on-expand="expand" @on-inside-select="select" :treeData="treeData"></u-select-tree>
    </u-select>

    <p>filterable</p>
    <u-select v-model="value4" multiple ref="selecttree0" :clearable="clearable" filterable  @on-paste="paste" @on-blur="blur" @on-focus="focus" @on-change="change" @on-click="click" @on-clear-select="clear" :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll :filterType="filterType" checkStrictly @on-expand="expand" @on-inside-select="select" :treeData="treeData"></u-select-tree>
    </u-select>

    <p>isString</p>
    <u-select v-model="value5" multiple isString ref="selecttree0" :clearable="clearable"  @on-paste="paste" @on-blur="blur" @on-focus="focus" @on-change="change" @on-click="click" @on-clear-select="clear" :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll :filterType="filterType" @on-expand="expand" @on-inside-select="select" :treeData="treeData"></u-select-tree>
    </u-select>
  </div>
</template>

<script>

var treeData = [
  {
    title: 'title-0-0',
    id: 0,
    disabled: true,
    children: [
      {
        title: 'title-0-0-0',
        id: 1,
        children: [
          { title: 'title-0-0-0-0', id: 2 },
          { title: 'title-0-0-0-1', id: 3 },
          { title: 'title-0-0-0-2', id: 4 },
          // { title: "title-0-0-0-2", id: "0-0-0-2" , selectable: false }
        ]
      },
      {
        title: 'title-0-0-1',
        id: 5,
        children: [
          { title: 'title-0-0-1-0', id: 6 },
          { title: 'title-0-0-1-1', id: 7 },
          {
            title: 'title-0-0-1-2',
            id: 17,
            children: [
              { title: 'title-0-0-1-2-0', id: 8 },
              { title: 'title-0-0-1-2-1', id: 9 },
              { title: 'title-0-0-1-2-2', id: 10 }
            ]
          }
        ]
      },
      {
        title: 'title-0-0-2',
        id: 11
      }
    ]
  },
  {
    title: 'title-0-1',
    id: 12,
    children: [
      { title: 'title-0-1-0-0', id: 13 },
      { title: 'title-0-1-0-1', id: 14 },
      { title: 'title-0-1-0-2', id: 15 }
    ]
  },
  {
    title: 'title-0-2',
    id: 16
  }
]

export default {
  data () {
    return {
      filterType: 'filter',
      clearable: false,
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
      value1: 1,
      // value2: 2,
      value2: '',
      value3: [2, 3],
      value4: [4],
      value5: '2,3,4'
    }
  },
  methods: {
    filterTypeChange () {
      if (this.filterType === 'search') return this.filterType = 'filter'
      this.filterType = 'search'
    },
    selecttreeFocus (num, bol) {
      this.$refs[`selecttree${num}`].onFocus(bol)
      setTimeout(() => {
        this.$refs[`selecttree${num}`].onBlur(bol)
      }, 3000)
    },
    setValue (num) {
      if (this[`value${num}`] === 1) return this[`value${num}`] = 2
      this[`value${num}`] = 1
    },
    setValue1 (num) {
      if (this[`value${num}`][0] === 1) return this[`value${num}`] = [3]
      this[`value${num}`] = [1, 0]
    },
    change (val, { objVal }) {
      console.log('触发了 on-change 事件', val, objVal)
    },
    blur (event) {
      console.log('触发了 on-blur 事件', event)
    },
    focus (event) {
      console.log('触发了 on-focus 事件', event)
    },
    click (event) {
      console.log('触发了 on-click 事件', event)
    },
    paste (text, { event }) {
      console.log('触发了 on-paste 事件', text, event)
    },
    expand (keys, event) {
      console.log('触发了 on-expand 事件', keys, event)
    },
    select (keys, event) {
      console.log('触发了 on-inside-select 事件', keys, event)
    },
    clear () {
      console.log('触发了 on-clear-select 事件')
    },
  },
}
</script>
