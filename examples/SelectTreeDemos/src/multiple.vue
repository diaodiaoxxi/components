<template>
  <div class="tree-demo" style="width: 500px; margin-bottom: 500px;">
     <!-- <h-button @click="setValue">setValue</h-button> -->
    <h-button @click="selecttreeFocus">selecttreeFocus</h-button>
    <h-button @click="selecttreeBlur">selecttreeBlur</h-button>
    <p>disabled && readonly</p>
    <h-button @click="disabled = !disabled">disabled: {{disabled}}</h-button>
    <h-button @click="readonly = !readonly">readonly: {{readonly}}</h-button>

    <p>width: 360px;</p>
    <u-select style="width: 120px;" v-model="value" clearable multiple filterable :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData"></u-select-tree>
    </u-select>

    <p>clearable</p>
    <u-select v-model="value" multiple  clearable :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData"></u-select-tree>
    </u-select>

    <p>multHeadType="text"</p>

    <p>multHeadType="text" && isArrow=false</p>
    <u-select v-model="value" multHeadType="text" :isArrow="false" multiple  clearable :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData"></u-select-tree>
    </u-select>

    <p>multHeadType="text" && clearable</p>
    <u-select v-model="value" multHeadType="text" multiple  clearable :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData"></u-select-tree>
    </u-select>

    <p>multHeadType="text"</p>
    <u-select v-model="value" multHeadType="text" multiple  :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData"></u-select-tree>
    </u-select>

    <p>multHeadType="text" && filterable</p>
     <u-select v-model="value" multHeadType="text" @on-change="change" filterable multiple  :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <p>maxTagPlaceholder（String）</p>
     <u-select v-model="value2" :maxTagPlaceholder="`还有 ${value2.length - 3} 个`" @on-change="change" filterable multiple :maxTagCount="3"  :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <!-- <p>maxTagPlaceholder（Function）</p>
     <u-select v-model="value2" :maxTagPlaceholder="maxTagPlaceholderFun" @on-change="change" filterable multiple :maxTagCount="3"  :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select> -->

     <p>filterable</p>
     <u-select ref="selecttree" v-model="value2"  @on-change="change" filterable multiple :maxTagCount="3"  :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <p>checkStrictly</p>

    <p>filterable && checkStrictly</p>
     <u-select v-model="value2"  @on-change="change" filterable multiple :maxTagCount="3"  :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll checkStrictly  :treeData="treeData"></u-select-tree>
    </u-select>

    <p>isString</p>

    <p>filterable && clearable && isString</p>
    <p>{{value3}}</p>
    <u-select v-model="value3" filterable multiple isString :maxTagCount="3"  clearable :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <p>multHeadType="text" && filterable && isString</p>
     <u-select v-model="value3" multHeadType="text" isString @on-change="change" filterable multiple  :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

    <p>selectPaste</p>
    <p>0-0,0-0-1,0-0-1-0</p>

    <p>filterable && selectPaste</p>
     <u-select ref="selecttree" v-model="value4" selectPaste placement="top"  @on-change="change" filterable multiple :maxTagCount="3"  :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

     <p>multHeadType="text" && filterable && isString && selectPaste </p>
     <u-select v-model="value5" multHeadType="text" selectPaste isString @on-change="change" filterable multiple  :disabled="disabled" :readonly="readonly" labelKey="title" valueKey="id">
      <u-select-tree  defaultExpandAll  :treeData="treeData"></u-select-tree>
    </u-select>

  </div>
</template>

<script>
// console.log("treeData1----->", treeData1);
var treeData = [
  {
    title: 'title-0-0',
    id: '0-0',
    children: [
      {
        title: 'title-0-0-0',
        id: '0-0-0',
        disabled: true,
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
      // value: ['0-0-1-0', '0-0-1-1'],
      // value2: ['0-0-1-0'],
      value: [],
      value2: [],
      value3: '0-0-1-0,0-0-0,0-0-0-1',
      value4: [],
      value5: '0-0-1-0,0-0-0,0-0-0-1',
    }
  },
  methods: {
    selecttreeFocus () {
      this.$refs.selecttree.onFocus()
      setTimeout(() => {
        this.selecttreeBlur()
      }, 3000)
    },
    selecttreeBlur () {
      this.$refs.selecttree.onBlur()
    },
    setValue () {
      if (this.value === '0-0-1-0') return this.value = '0-0-1-1'
      this.value = '0-0-1-0'
    },
    change (val) {
      console.log('触发了 on-change 事件', val)
    },
    maxTagPlaceholderFun ({ extraTagNum, extraTags }, h) {
      console.log('maxTagPlaceholderFun', extraTagNum, extraTags)
      return h(
        'div',
        {
          style: {
            display: 'inline-block',
            height: '26px'
          }
        },
        [
          h('span', [
            h('h-icon', {
              props: {
                name: 'ios-paper-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', extraTagNum + '个')
          ])
        ]
      )
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
