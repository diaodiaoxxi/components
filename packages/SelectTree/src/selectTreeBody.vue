<script>
import Tree from '@packages/Tree/index'
import { PREFIX, SELECT_TREE_CONFIG } from '../config'
import { defaultPropsValue, treeProps } from './selectTreeProps'
import { getOptionProps, initDefaultProps } from '@hui/shared-utils'
import { mapSelectProps, mapSelectData, formatSelectorValue } from '../utils'
const prefixCls = `${PREFIX || 'h'}-select-tree-body`
const noop = () => {}

// const showCheckedStrategy = {
//   SHOW_ALL: 'SHOW_ALL',
//   SHOW_PARENT: 'SHOW_PRANT',
//   SHOW_CHILD: 'SHOW_CHILD',
//   SHOW_HALF_ALL: 'SHOW_HALF_ALL',
// }

function TreeBodyProps () {
  return {
    currentValue: null,
  }
}

export default {
  /* 默认对外开放名称为u-select-tree */
  name: 'SelectTreeBody',
  data () {
    return {
      singleValue: []
    }
  },
  props: initDefaultProps(treeProps, defaultPropsValue),
  inject: {
    selectProps: { default: () => ({}) },
    selectData: { default: () => ({}) },
    onClearSelect: { default: () => ({}) },
    setSelectValue: { default: () => noop },
    getValue: { default: () => noop },
    setFormat: { default: () => noop },
  },
  computed: {
    ...mapSelectProps({
      multiple: 'multiple',
      filterable: 'filterable',
      valueKey: 'valueKey',
      labelKey: 'labelKey',
      value: 'value',
      isString: 'isString',
      // showTitle: 'showTitle'
    }),
    ...mapSelectData({
      query: 'searchQuery',
      focusIndex: 'focusIndex',
      singleInfo: 'singleInfo',
      multiInfo: 'multiInfo',
      hotKey: 'hotKey',
      common: 'common',
      childInstance: 'childInstance',
    }),
  },
  mounted () {
    // console.log('Tree---->', Tree, this)
    const { $children: children } = this
    const tree = children[0]
    this.childInstance.body = this
    this.childInstance.list = tree

    /* select外部 事件重新定义传值 */
    this.hotKey.navigateOptions = tree.navigateOptions
    this.hotKey.selectAll = tree.selectAll
    this.hotKey.unselectAll = tree.unselectAll
    this.hotKey.onKeydownEnter = tree.onKeydownEnter
    this.hotKey.allowKeyToExpand = tree.allowKeyToExpand
    this.common.removeTag = (option) => {
      tree.nodeCheck(false, option.value, { force: true })
    }

    this.selectData.flatData = tree.rebuildTreeData
    this.getValue()
  },
  methods: {
    stopEvent (e) {
      if (e) {
        e.stopPropagation()
        e.preventDefault()
      }
    },
    onTreeNodeClick (event) {
      // console.log('onTreeNodeClick')
      // this.stopEvent(event)
    },
    arrEqual (a, b, type) {
      // 判断数组的长度
      if (a.length !== b.length) {
        return false
      } else {
        if (a.length === 0 && b.length === 0) return true
        // 循环遍历数组的值进行比较
        const bArr = b.map(v => v[type])
        for (let i = 0; i < a.length; i++) {
          if (!bArr.includes(a[i][type])) {
            return false
          }
        }
        return true
      }
    },
    onSelectedKeysChange (keys, valueList) {
      const { multiple, valueKey, labelKey } = this
      const list = formatSelectorValue({ keys, valueList }, { ...this.$props, multiple }, { valueKey, labelKey })
      // console.log(list, this.singleInfo.currentOption, JSON.stringify(list[0]), JSON.stringify(this.singleInfo.currentOption))
      // 排除一些不必要的事件重复赋值 触发
      // console.log(this.singleInfo.currentOption)
      const currentOptionArr = this.singleInfo.currentOption.value === undefined ? [] : [this.singleInfo.currentOption]
      // console.log(this.arrEqual(list, currentOptionArr, 'value'))
      if (this.arrEqual(list, currentOptionArr, 'value')) return
      this.setSelectValue(list[0] || {})
    },
    onCheckedKeysChange (keys, valueList) {
      const { multiple, valueKey, labelKey } = this
      const list = formatSelectorValue({ keys, valueList }, { ...this.$props, multiple }, { valueKey, labelKey })
      // console.log(this.arrEqual(list, this.multiInfo.currentOptions, 'value'))
      if (this.arrEqual(list, this.multiInfo.currentOptions, 'value')) return

      this.setSelectValue(list)
    },
  },
  render (h) {
    // console.log('======= selectTreeBody render =======')
    const classes = [prefixCls]
    // console.log(this.$props)
    const { multiple, value, query, filterable, isString, showTitle, valueKey, labelKey } = this
    const treeProps = {}

    if (multiple) {
      treeProps.checkedKeys = value
    } else {
      treeProps.selectedKeys = value
    }
    const { virtual } = this.$props
    const treeBodyProps = {
      style: {
        maxHeight: '196px',
        overflow: virtual ? 'hidden' : 'auto'
      },
    }
    // if (!virtual) Object.assign(treeBodyProps.style, { overflow: 'auto' })
    const treeAllProps = {
      props: {
        ...this.$props,
        ...treeProps,
        isTreeBody: true,
        formatValue: valueKey,
        formatLabel: labelKey,
        blockDirectory: true,
        selectable: !multiple,
        showCheckbox: multiple,
        filterValue: filterable ? query : undefined,
        isTreeFilter: filterable,
        maxHeight: 196,
        isString: multiple ? isString : false,
        showTitle: showTitle,
        alwaysSelect: true,
      },
      on: {
        // 'on-click': ({event, node}) => {
        //   console.log('onClick', event, node)
        //   // this.onTreeNodeClick({event, node})
        // },
        'on-select': (keys, obj) => {
          this.$emit('on-inside-select', keys, obj)
        },
        'on-expand': (keys, obj) => {
          this.$emit('on-expand', keys, obj)
        },
        'on-check': (keys, obj) => {
          // console.log('on-check----->', keys, obj)
          this.onCheckedKeysChange(keys, obj.nodes)
          this.$emit('on-inside-select', keys, obj)
        },
        'update:selectedKeys': (keys, obj) => {
          // console.log('update:selectedKeys', keys, obj)
          this.onSelectedKeysChange(keys, obj.nodes)
        },
        'on-selectedKeys-change': (keys, obj) => {
          // console.log('on-selectedKeys-change----->', keys, obj)
          this.onSelectedKeysChange(keys, obj)
        },
        'on-checkedKeys-change': (keys, obj) => {
          // console.log('on-checkedKeys-change----->', keys, obj)
          this.onCheckedKeysChange(keys, obj)
        }
      },
    }
    return (
      <div class={classes} {...treeBodyProps} ref="select-tree-body" onClick={this.onTreeNodeClick}>
        <Tree {...treeAllProps}></Tree>
      </div>
    )
  },
}
</script>
