<script>
import {
  createRebuildTreeData,
  treeDataEcho,
  conductCheck,
  conductExpandParent,
  arrDel,
  arrAdd,
  duplicate,
  arrEqual,
} from '../util'
import {
  isStringFormat
} from '../format'
import TransferScroll from '@hui/directives/transfer-scroll'
// import virtualList from 'vue-virtual-scroll-list'
import virtualList from '../virtual'
import BaseMixin from '../BaseMixin'
import Emitter from '../emitter'
import { deepCopy, findComponentParent, getOptionProps, initDefaultProps } from '@hui/shared-utils'
import { defaultPropsValue, treeProps } from './TreeProps'
import TreeNode from './TreeNode'
import Node from './node'
import hotkeyMinix from './minix/hotkey'
import methodMinix from './minix/method'
import editMinix from './minix/edit'
import nodeMinix from './minix/node'
import { PREFIX } from '../config'
const prefixCls = `${PREFIX || 'h'}-tree`

function getWatch (keys = []) {
  const watch = {}
  keys.forEach(k => {
    watch[k] = function (value, oldValue) {
      // console.log(k, '------>', value, oldValue)
      // 当[]里面的值相同，则不异步更新
      // if (Object.prototype.toString.call(value) === '[object Array]' && arrEqual(value, oldValue)) return
      this.$set(this.needSyncKeys, k, true)
      // this.$set(this.needSyncKeys, `${k}Value`, value);
    }
  })
  return watch
}

export default {
  name: 'Tree',
  props: initDefaultProps(treeProps, defaultPropsValue),
  mixins: [BaseMixin, Emitter, hotkeyMinix, nodeMinix, methodMinix, editMinix],
  model: {
    prop: 'checkedKeys',
    event: 'on-check'
  },
  components: { virtualList },
  directives: { 'transfer-scroll': TransferScroll },
  data () {
    /* data中绑定的变量，均为内部私有属性，外部不允许随意访问 */
    const state = {
      prefixCls,
      rebuildTreeData: [],
      filterTreeData: [],
      halfCheckedKeys: [],
      newCheckedKeys: [],
      newSelectedKeys: [],
      newExpandedKeys: [],
      loadedKeys: [],
      loadingKeys: [],
      flatteEntities: new Map(),
      keyEntities: new Map(),
      realEntities: new Map(),
      checkEntities: new Map(),
      prevProps: null,
      needSyncKeys: {},
      range: {
        start: 0,
        end: null,
      },
      focusIndex: -1,
      scrollTop: 0,
      storageExpandObj: {}, // 存储点击后，展开的节点的children
      filterValueKeys: [],
      positionKey: 0,
      cacheBeforeFilterExpandKeys: [],
      /* 默认TransferScrollOption的配置项 */
      defaultTransferScrollOptions: { type: 'keep', disabled: false, onlyTransfer: false, isFixed: true },
      filterValueArr: [],
    }
    return {
      ...state,
      ...this.getDerivedStateFromProps(getOptionProps(this), state)
    }
  },
  provide () {
    return {
      tree: this
    }
  },
  computed: {
    classes () {
      const { prefixCls, blockDirectory, blockNode } = this
      const treeCls = [
        prefixCls,
        `${prefixCls}-tabindex`,
        {
          [`${prefixCls}-block-directory`]: blockDirectory,
          [`${prefixCls}-block-node`]: blockNode
        }
      ]
      return [treeCls]
    },
    keeps () {
      const { maxHeight, itemHeight, onlyScroll } = this.$props
      // let num = parseInt(maxHeight/Number(itemHeight))*3*2
      const num = parseInt(maxHeight / Number(itemHeight)) * 3
      // if (onlyScroll === false) num = num * 2
      // if (num < 180 ) num = 180
      return num
    },
    selectTreeInstance () {
      return findComponentParent(this, 'u-base-selector')
    },
    selectTreeBodyInstance () {
      return findComponentParent(this, 'SelectTreeBody')
    },
  },
  methods: {
    getItemProps (key) {
      // console.log('trigger getItemProps')
      const { loadedKeys, loadingKeys, newExpandedKeys: expandedKeys, newCheckedKeys: checkedKeys, newSelectedKeys: selectedKeys, halfCheckedKeys } = this.$data
      return {
        expanded: expandedKeys.indexOf(key) !== -1,
        selected: selectedKeys.indexOf(key) !== -1,
        loaded: loadedKeys.indexOf(key) !== -1,
        loading: loadingKeys.indexOf(key) !== -1,
        checked: checkedKeys.indexOf(key) !== -1,
        halfChecked: halfCheckedKeys.indexOf(key) !== -1,
      }
    },
    renderTreeNode (item, index) {
      const { formatValue } = this.$props
      const key = item[formatValue]
      const treeNodeProps = {
        props: {
          ...item,
          ...this.getItemProps(key),
          index,
          item: item
        },
        key: key
      }
      return <TreeNode {...treeNodeProps}></TreeNode>
    },
    renderVirtualList () {
      const { formatValue, maxHeight, itemHeight, transferScrollOptions, isTreeBody } = this.$props
      const { focusIndex, defaultTransferScrollOptions } = this.$data
      const { keeps } = this
      const visibileNum = parseInt(maxHeight / Number(itemHeight))
      // console.log(focusIndex, visibileNum, focusIndex - visibileNum)
      // const buffer = keeps/3
      // const visibleView = focusIndex - visibileNum

      const virtualProps = {
        directives: [
          {
            name: 'transfer-scroll',
            value: Object.assign(defaultTransferScrollOptions, transferScrollOptions)
          }
        ],
        props: {
          dataKey: formatValue,
          'estimate-size': Number(itemHeight),
          'data-sources': this.filterTreeData,
          // 'item-class': prefixCls + '-virtual-item',
          keeps: keeps,
          // dataComponent: Node,
          dataComponent: TreeNode,
          start: focusIndex - visibileNum + 1,
          'item-style': { padding: '1px 0' },
          'extra-props': this.getItemProps,
        },
        attrs: {
          tabindex: isTreeBody ? null : -1
        },
        on: {
          range: (range) => {
            const start = range.start
            const end = range.end
            // this.range = { start, end }
            this.setUncontrolledState({ range: { start, end } })
          }
        },
        nativeOn: {
          keydown: this.onKeydown
        }
      }
      const virtualCls = [
        ...this.classes,
        `${prefixCls}-virtual-list`
      ]
      const styles = {
        maxHeight: `${maxHeight}px`
      }
      return (
        // <div role="tree" style={styles} onKeydown={this.onKeydown}>
        <virtual-list role="tree" ref="virtualList" style={styles} class={virtualCls} {...virtualProps} ></virtual-list>
        // </div>
      )
    },
    renderEmptyList () {
      const { classes } = this
      const className = `${prefixCls}-not-found`
      const emptyListCls = [
        ...classes,
        className
      ]
      const iconCls = [
        'hui2-iconfont',
        'hui2-icon-empty',
      `${className}-icon`,
      ]
      const textCls = [`${className}-text`]
      return (
        <div class={emptyListCls}>
          <div class={iconCls}></div>
          <div class={textCls}>暂无数据</div>
        </div>
      )
    },
    onNodeCheck (checked, treeNode, e) {
      const {
        checkEntities,
        newCheckedKeys: oriCheckedKeys,
        halfCheckedKeys: oriHalfCheckedKeys
      } = this.$data

      const { formatValue, checkStrictly } = this.$props
      const key = treeNode[formatValue] || treeNode.item[formatValue]

      let checkedKeys = []; let halfCheckedKeys = []
      if (!checkStrictly) {
        const conductKeys = conductCheck([key], checked, checkEntities, {
          checkedKeys: oriCheckedKeys,
          halfCheckedKeys: oriHalfCheckedKeys
        }, formatValue);
        ({ checkedKeys, halfCheckedKeys } = conductKeys)
      } else {
        checkedKeys = checked ? arrAdd(oriCheckedKeys, key) : arrDel(oriCheckedKeys, key)
        halfCheckedKeys = arrDel(oriHalfCheckedKeys, key)
      }
      // console.log('onNodeCheck======》', checkedKeys, halfCheckedKeys)
      this.setUncontrolledState({ newCheckedKeys: checkedKeys, halfCheckedKeys: halfCheckedKeys })
      const eventObj = {
        event: 'check',
        node: treeNode,
        status: checked,
        nativeEvent: e,
        nodes: this.keysToObject(checkedKeys),
        halfNodes: this.keysToObject(halfCheckedKeys)
      }
      const sendValue = this.dataFormatFactory({
        propertyName: 'checkedKeys',
        type: 'format',
        value: checkedKeys
      })
      this.$emit('on-check', sendValue, eventObj)
    },
    onNodeSelect (selected, treeNode, e) {
      let { newSelectedKeys: selectedKeys, } = this.$data
      const { formatValue, multiple, isTreeBody, alwaysSelect } = this.$props
      const key = treeNode[formatValue] || treeNode.item[formatValue]
      /* 在isTreeBody=true,即在selectTree选择控件场景下，当触发的节点已经处于选中状态，则return当前操作 */
      if (isTreeBody && alwaysSelect && selectedKeys[0] === key) return
      if (multiple) {
        selected && (selectedKeys = arrAdd(selectedKeys, key))
        !selected && (selectedKeys = arrDel(selectedKeys, key))
      } else {
        (alwaysSelect || selected) && (selectedKeys = [key])
        !alwaysSelect && !selected && (selectedKeys = [])
      }

      /**
       * TODO multiple=false 文档单选时，点击已经选中的节点，再次节点，取消选中当前项; 考虑selectTree没有取消选择的问题
       * TODO 考虑新增isAlwaysSelect，代表始终文本选中节点
       */
      // !multiple && !selected && (selectedKeys = [key])
      this.setUncontrolledState({ newSelectedKeys: selectedKeys })
      const eventObj = {
        event: 'select',
        node: treeNode,
        status: selected,
        nativeEvent: e,
        nodes: this.keysToObject(selectedKeys)
      }
      let sendValue = selectedKeys
      if (isTreeBody) {
        sendValue = selectedKeys[0]
      }
      this.$emit('update:selectedKeys', sendValue, eventObj)
      this.$emit('on-select', sendValue, eventObj)
      // this.$emit('on-select', selectedKeys, eventObj)
    },
    onNodeExpand (expanded, treeNode, e) {
      let { newExpandedKeys: expandedKeys, loadingKeys, loadedKeys, rebuildTreeData, storageExpandObj, filterTreeData, needSyncKeys } = this.$data
      const { formatValue, loadData, virtual } = this.$props
      const key = treeNode[formatValue] || treeNode.item[formatValue]
      const { level, children } = treeNode
      expanded && (expandedKeys = arrAdd(expandedKeys, key))
      !expanded && (expandedKeys = arrDel(expandedKeys, key))

      /* 当focusIndex=-1时，表示并未启用focusIndex来选中节点，当点击展开/收缩图标，下拉数据变化，需重新自定义下拉数据 */
      // if (this.focusIndex >= 0) {
      //   this.focusIndex = treeNode.filterIndex === undefined ? 0 : treeNode.filterIndex
      // }

      const eventObj = {
        event: 'expand',
        node: treeNode,
        status: expanded,
        nativeEvent: e,
        nodes: this.keysToObject(expandedKeys)
      }

      let sync = false // 判断是否需要添加loading动画

      if (needSyncKeys.nodeExpand === undefined) {
        /** 模拟异步请求，针对数据量比较大的下拉展开 */
        const syncGetExpandShowList = (state, callback) => {
          return new Promise((resolve) => {
            const list = this.getExpandShowList(state)
            resolve(list)
          })
        }
        // 当节点收起时，storageExpandObj存储收起后的节点，方便下次展开，直接获取子节点信息
        if (!expanded) {
          const { first, last } = this.getCollapseRange(treeNode)
          if (!(first === undefined && last === undefined)) {
            const arr = filterTreeData.splice(first + 1, last - first - 1)
            storageExpandObj[key] = arr // 存储当前节点的(被收缩的节点)
          }
        } else if (storageExpandObj[key] === undefined) {
          // !loadData && (filterTreeData = this.getExpandShowList({...this.$data, newExpandedKeys: expandedKeys}))
          if (children && children.length > 0) {
            const state = { ...this.$data, newExpandedKeys: expandedKeys }
            const num = this.getRealExpandData(state)
            /* 当数据循环增加，添加loading动画效果 */
            if (num.length >= 500) {
              sync = true
              loadingKeys = arrAdd(loadingKeys, key)
              this.setUncontrolledState({ loadingKeys })
              setTimeout(() => {
                syncGetExpandShowList({ ...this.$data, newExpandedKeys: expandedKeys }).then(list => {
                  filterTreeData = list
                  loadingKeys = arrDel(loadingKeys, key)
                  this.setUncontrolledState({ newExpandedKeys: expandedKeys, filterTreeData, loadingKeys })
                  this.$emit('on-expand', expandedKeys, eventObj)
                  this.$emit('update:expandedKeys', expandedKeys)
                })
              }, 0)
            } else {
              filterTreeData = this.getExpandShowList({ ...this.$data, newExpandedKeys: expandedKeys })
            }
          }
        } else {
          const { first, last } = this.getCollapseRange(treeNode)
          filterTreeData.splice(first + 1, 0, ...storageExpandObj[key])
        }
      }
      if (!sync) {
        this.setUncontrolledState({ newExpandedKeys: expandedKeys, filterTreeData })
        this.$emit('on-expand', expandedKeys, eventObj)
        this.$emit('update:expandedKeys', expandedKeys)
      }
      // this.$emit('update:expandedKeys', expandedKeys)
      if (expanded && loadData && (!treeNode.children || treeNode.children.length === 0)) {
        const getLoadDataEventObj = (res) => {
          const eventObj = {
            event: 'expand-load',
            node: treeNode,
            nativeEvent: e,
            nodes: this.keysToObject(loadedKeys),
          }
          return Object.assign(eventObj, res)
        }
        // TODO res 添加数据失败时，具体回调函数的处理逻辑
        this.onNodeLoad(treeNode.item ? treeNode : { item: treeNode }).then(res => {
          loadingKeys = arrDel(loadingKeys, key)
          loadedKeys = arrAdd(loadedKeys, key)
          this.setUncontrolledState({ loadingKeys, loadedKeys })
          this.$emit('on-load', loadedKeys, getLoadDataEventObj(res))
          this.$set(this.needSyncKeys, 'treeData', true)
        }, (res) => {
          console.error('[hui warn] load-data异步加载失败~')
          loadingKeys = arrDel(loadingKeys, key)
          expandedKeys = arrDel(expandedKeys, key)
          this.setUncontrolledState({ loadingKeys, newExpandedKeys: expandedKeys })
          this.$emit('on-load', loadedKeys, getLoadDataEventObj(res))
        })
      }
    },
    onNodeLoad (treeNode) {
      const { formatValue, loadData, treeData } = this.$props
      const key = treeNode[formatValue] || treeNode.item[formatValue]
      let { loadedKeys, loadingKeys, keyEntities } = this.$data
      return new Promise((resolve, reject) => {
        // if ((loadedKeys.length > 0 && !loadedKeys.includes(key)) || (loadingKeys.length > 0 && !loadingKeys.includes(key) )) {
        //   resolve({})
        //   return
        // }
        loadingKeys = arrAdd(loadingKeys, key)
        this.setUncontrolledState({ loadingKeys })

        // TODO loadData treeNode 参数格式统一
        loadData(treeNode, (data) => {
          let response
          if (Object.prototype.toString.call(data) !== '[object Array]') {
            response = { status: false, msg: '请返回数组格式' }
            console.error(`[hui warn] ${response.msg}~`)
            reject(response)
            return
          }
          if (data.length === 0) {
            response = { status: true, msg: '添加成功，但是异步添加的data数据是空~' }
            resolve(response)
            return
          }
          response = this.treeAdd({ key, data, entities: keyEntities })
          if (response.status === false) {
            reject(response)
          } else {
            resolve(response)
          }
        })
      })
    },
    onNodeClick (node, event) {
      this.$emit('on-click', { node, event })
    },
    onNodeContextMenu (node, event) {
      event.preventDefault()
      event.stopPropagation()
      this.$emit('on-right-click', { node, event })
    },
    onNodeDoubleClick (node, event) {
      event.preventDefault()
      event.stopPropagation()
      this.$emit('on-double-click', { node, event })
    },
    onNodeMouseOver (node, event) {
      // event.preventDefault();
      // event.stopPropagation();
      this.$emit('on-mouseover', { node, event })
    },
    /* 获取点击收起的range范围 */
    getCollapseRange (treeNode) {
      const { formatValue } = this.$props
      const { rebuildTreeData, filterTreeData, storageExpandObj } = this.$data
      const key = treeNode[formatValue] || treeNode.item[formatValue]
      const { level } = treeNode
      const data = filterTreeData.map((item, index) => {
        return {
          ...item,
          filterIndex: index,
        }
      }).filter(v => v.level <= level)
      const _first = data.find(v => v[formatValue] === key)
      /* 在当前的filterTreeData,不包含当前的节点值 */
      if (_first === undefined) {
        return {
          first: undefined,
          last: undefined
        }
      }
      var _last = data.find(v => v[formatValue] !== key && v.filterIndex > _first.filterIndex)
      /* 同等级level节点时最后一个 */
      if (_last === undefined) {
        _last = { ...filterTreeData[filterTreeData.length - 1], filterIndex: filterTreeData.length }
      }
      return {
        first: _first.filterIndex,
        last: _last.filterIndex
      }
    },
    /* 创建 KeyEntities实例 */
    createKeyEntities (item, state) {
      const { formatValue } = this.$props
      // const entity = { ...item };
      const entity = item
      state.keyEntities.set(item[formatValue], entity)
    },
    /**
     * @description 通过keys返回obj对象的数组
     */
    keysToObject (keys, state = this.$data) {
      const { keyEntities } = state
      return keys.map(key => keyEntities.get(key)).filter(entity => entity)
    },
    setUncontrolledState (state) {
      // const needSync = false
      // const newState = {}
      // const props = getOptionProps(this)
      const needSyncKeys = []
      Object.keys(state).forEach(name => {
        // if (name.toLowerCase().replace('new', '') in props) return
        // needSync = true
        // newState[name] = state[name];
        this[name] = state[name]
        needSyncKeys.push(name)
      })
      // if (needSync) {
      needSyncKeys.forEach(key => {
        this.$set(this.needSyncKeys, key, true)
      })
      // }
    },
    /**
     * newExpandedKeys节点扩展成对象数组
     * 过滤newExpandedKeys不存在父节点的子节点
     * 当newExpandedKeys中的父节点没有，但其子节点存在，其子节点需要被过滤
     */
    filterExpandKeysToObj (state) {
      const { newExpandedKeys, keyEntities } = state
      // console.log('getExpandShowList newExpandedKeys---->', newExpandedKeys)
      function createNodeChains (arr) {
        const list = []
        arr.forEach(key => {
          const entity = keyEntities.get(key)
          if (entity) list.push(entity)
        })
        return list
      }
      var expandedObjList = createNodeChains(newExpandedKeys)

      function filterObjByExpandedKeys (obj) {
        return obj.chain.every(v => newExpandedKeys.includes(v))
      }
      return expandedObjList.filter(obj => filterObjByExpandedKeys(obj))
    },
    /** 获取需要真实需要显示的数据 */
    getRealExpandData (state) {
      const { formatValue } = this.$props
      const newExpandedObjList = this.filterExpandKeysToObj(state)
      // console.log('newExpandedObjList', newExpandedObjList)

      /**
       * 将newExpandedKeys需要展开的子节点push进去；重复的去重
       * 通过newExpandkeys展开节点来计算需要展开的节点个数，需要将展开节点的子节点都放进去
       */
      let arr = newExpandedObjList
      newExpandedObjList.forEach(obj => {
        obj.children && arr.push(...obj.children)
      })
      arr = duplicate(arr, formatValue)
      return arr
    },
    /** 根据newExpandedKeys、rebuildTreeData 获取显示的树的节点list */
    getExpandShowList (state) {
      // console.log('getExpandShowList')
      const { rebuildTreeData } = state
      const { formatValue } = this.$props
      // console.log(' ====== getExpandShowList before =====')
      var arr = this.getRealExpandData(state)

      /* 遍历rebuildTreeData，筛选相关节点 */
      const filterTreeData = []

      const filterEntities = new Map()
      arr.forEach(obj => {
        filterEntities.set(obj[formatValue], obj)
      })
      // console.log('getExpandShowList keys----->', keys)
      // 把expandKeys数据顺序调整正确，expandedKeys传递过来的数据顺序是随意的
      for (let j = 0, len = rebuildTreeData.length; j < len; j++) {
        const obj = rebuildTreeData[j]
        // isFliterLeaf 在重新计算 filterTreeData时，需要重置
        obj.isFliterLeaf = null
        if (!filterEntities.get(obj[formatValue])) {
          if (obj.level === 1) {
            filterTreeData.push(obj)
          }
          continue
        }
        filterTreeData.push(obj)
      }
      // if (arr.length === 0)  filterTreeData = [rebuildTreeData[0]]

      // console.log(' ====== getExpandShowList after =====')
      return filterTreeData
    },
    getDerivedStateFromProps (props, prevState) {
      // console.log('====================================getDerivedStateFromProps====================================')
      // console.log('this.sync----->', prevState.needSyncKeys, Object.keys(prevState.needSyncKeys))
      const { prevProps } = prevState
      // console.log('prevProps========>', prevProps)
      const newState = {
        // 优化场景：客户初始化treeData为[]，异步请求后赋值treeData数据的场景
        prevProps: (prevProps === null && props.treeData.length === 0) ? null : { ...props }
      }
      function needSync (name) {
        return (!prevProps && name in props) || (prevProps && prevState.needSyncKeys[name])
      }

      /**
       * 兼容老版本
       * oriCheckedKeys对应节点中包含checked:true
       * oriExpandedKeys对应节点中包含expand:true
       * oriSelectedKeys对应节点中包含selected:true
       */
      var oriCheckedKeys = []; var oriExpandedKeys = []; var oriSelectedKeys = []
      /*  ================= treeData ================== */
      if (needSync('treeData')) {
        // const treeData = deepCopy(props.treeData)
        // newState.rebuildTreeData = createRebuildTreeData(treeData, props)
        newState.rebuildTreeData = createRebuildTreeData(props.treeData, props)

        prevState.keyEntities.clear()
        newState.keyEntities = new Map()
        newState.rebuildTreeData.forEach(item => {
          this.createKeyEntities(item, newState)
          /** 兼容老版本，当treeData里面包含checked,expand,selected属性来控制复选框选中，展开/收缩状态 */
          item.checked && oriCheckedKeys.push(item[props.formatValue])
          item.expand && oriExpandedKeys.push(item[props.formatValue])
          item.selected && oriSelectedKeys.push(item[props.formatValue])
        })
        // 当treeData重新更新的时候，focusIndex需要重新开始计算
        // TODO 考虑由于loadData触发的treeData改变，导致的focusIndex重置的场景
        this.focusIndex = -1
        /* treedata数据变化，导致storageExpandObj存储的数据存在脏数据，需要清空缓存数据（增，删，改） */
        newState.storageExpandObj = {}
      } else {
        newState.rebuildTreeData = prevState.rebuildTreeData
      }

      // console.log('oriCheckedKeys------>', oriCheckedKeys)
      // console.log('oriExpandedKeys------>', oriExpandedKeys)
      // console.log('oriSelectedKeys------>', oriSelectedKeys)

      const keyEntities = newState.keyEntities || prevState.keyEntities
      newState.keyEntities = keyEntities

      /** * @realEntities 真实参与逻辑（联动选中，节点展开）计算的实例 */
      newState.realEntities = newState.keyEntities

      /*  ================= filterValueKeys 过滤/搜索 ================== */

      /** 下面的当tree处于节点需要过滤的场景
       * tree 筛选显示符合条件的节点 isTreeFilter && filterValue
       * @filterKeys 过滤后，需要展开的节点(过滤去除掉filterValueKeys中的符合条件的子节点，只需要符合条件节点的父节点们)，赋值newExpandedKeys；目的提高getExpandShowList性能
       * @filterValueKeys 需要显示的所有节点（筛选符合节点的父节点们 子节点+其父节点们）
       * @realEntities 过滤后的真实节点实例 （实际参与计算的实例(包括复选框联动选中逻辑，展开逻辑等)）
       * @realEntities 若不是触发过滤节点场景，则默认为 newState.keyEntities
       */
      let filterKeys = []
      if (props.isTreeFilter && props.filterValue !== undefined) {
        const { isTreeFilter, filterValue, formatLabel } = props
        const needRefilter = needSync('filterValue') || needSync('treeData')
        // needRefilter=true 表示需要重新过滤筛选
        if (needRefilter) {
          // 当需要重新过滤筛选时，focusIndex需要重新设置
          newState.focusIndex = -1

          const filterValueArr = newState.rebuildTreeData.filter(node => {
            let bol
            if (typeof props.filterNodeMethod === 'function') {
              bol = props.filterNodeMethod({ value: props.filterValue, data: props.treeData, node: node })
            } else {
              bol = props.filterValue === '' ? false : node[formatLabel].includes(props.filterValue)
            }
            // 符合条件的节点，将其父节点们需要显示chain
            bol && filterKeys.push(...node.chain.slice(1, node.chain.length))
            return bol
          }).map(v => v[props.formatValue])
          filterKeys = duplicate(filterKeys)
          // console.log('filterKeys========>', filterKeys)
          // console.log('filterValueArr========>', filterValueArr)
          newState.filterValueArr = filterValueArr
          newState.filterValueKeys = conductExpandParent(filterValueArr, keyEntities, props.formatValue)
          /**
           * 创建filterValueKeys（过滤节点符合条件的节点）
           * 当没匹配到节点，newState.filterEntities默认为keyEntities，包含所有数据
           * 有节点时，则过滤为符合条件的节点
           */
          newState.realEntities = newState.keyEntities
          if (filterValueArr.length > 0) {
            newState.realEntities = new Map()
            newState.filterValueKeys.forEach(key => {
              newState.realEntities.set(key, keyEntities.get(key))
            })
          }
        }
        if (!needRefilter) {
          newState.realEntities = prevState.realEntities
          newState.filterValueKeys = prevState.filterValueKeys
          newState.filterValueArr = prevState.filterValueArr
        }
      }

      /* 当filterType=search，过滤主要用于检索功能，则realEntities=keyEntities（整个树的数据） */
      if (props.filterType === 'search') {
        newState.checkEntities = newState.keyEntities
      } else {
        newState.checkEntities = newState.realEntities
      }

      /*  ===================== expandedKeys ====================== */
      const isRealExpandedKeys = needSync('expandedKeys') && !needSync('newExpandedKeys')
      if (needSync('expandedKeys')) {
        // 在外部设置expandedKeys，支持双向绑定
        newState.newExpandedKeys = !prevProps
          ? conductExpandParent(props.expandedKeys, keyEntities, props.formatValue)
          : props.expandedKeys
      } else {
        // 不触发双向绑定
        newState.newExpandedKeys = prevState.newExpandedKeys
      }
      /** 兼容1.0老版本，当tree的props中没有绑定expandedKeys时有效 */
      if (!prevProps && props.expandedKeys === undefined) {
        newState.newExpandedKeys = oriExpandedKeys
        // newState.newExpandedKeys = deepCopy(oriExpandedKeys)
      }
      // defaultExpandAll=true，默认展开所有的节点(包括子节点)
      if (!prevProps && props.defaultExpandAll) {
        newState.newExpandedKeys = [...keyEntities.keys()]
      } else if (!prevProps && props.expandLevel !== undefined) {
        const expandLevelArr = newState.rebuildTreeData.filter(v => v.level <= props.expandLevel && (v.children && v.children.length > 0)).map(v => v[props.formatValue])
        newState.newExpandedKeys.push(...expandLevelArr)
        newState.newExpandedKeys = duplicate(newState.newExpandedKeys)
      }

      /**
       * selectTree isTreeFilter在可过滤搜索节点的场景下，记录搜索过滤节点前,当前tree的展开清情况
       * 当过滤清除时，tree展开状况为当前记录的状况
      */
      if (props.isTreeFilter && props.filterValue !== undefined) {
        if (!prevProps || (!needSync('filterValue') && props.filterValue === '')) {
          newState.cacheBeforeFilterExpandKeys = newState.newExpandedKeys
        } else {
          newState.cacheBeforeFilterExpandKeys = prevState.cacheBeforeFilterExpandKeys
        }
      }

      /*  ===================== checkedKeys ====================== */
      // 是否外部变量改变触发变化 (排除节点展开/收缩，调用nodeCheck()方法触发变化的场景)
      const isRealCheckKeys = needSync('checkedKeys') && !needSync('newCheckedKeys')
      if (props.showCheckbox) {
        let checkedKeys = []; let halfCheckedKeys = []
        if (isRealCheckKeys) {
          const checkedData = this.dataFormatFactory({
            propertyName: 'checkedKeys',
            type: 'parse',
            value: props.checkedKeys
          })
          // checkedKeys = props.checkedKeys
          checkedKeys = checkedData
        } else {
          checkedKeys = prevState.newCheckedKeys
          halfCheckedKeys = prevState.halfCheckedKeys
        }
        /** 兼容1.0老版本，当tree的props中没有绑定checkedKeys时有效 */
        if (!prevProps && props.checkedKeys === undefined) {
          checkedKeys = oriCheckedKeys
        }
        // 联动
        if (!props.checkStrictly) {
          /**
           * 考虑当前tree是否处于过滤场景（设置filterValue、isTreeFilter）
           * 不符合条件的节点之间过滤，复选框选中也需要过滤
          */
          // const treeFilter = props.isTreeFilter && newState.realEntities.size > 0
          // const checkEntities = treeFilter ? newState.realEntities : keyEntities
          /**
           * 触发重新需要conductCheck联动计算的场景
           * 初始化
           * 外部checkedKeys改变时，不是由于内部选择导致的checkedKeys改变
           * treeData树数据改变时
           */
          if (isRealCheckKeys || !prevProps || needSync('treeData')) {
            const conductKeys = conductCheck(checkedKeys, true, newState.checkEntities, {}, props.formatValue);
            ({ checkedKeys, halfCheckedKeys } = conductKeys)
          }
        }
        newState.newCheckedKeys = checkedKeys
        newState.halfCheckedKeys = halfCheckedKeys
      }

      /*  ================= selectedKeys ================== */
      const isRealSelectKeys = needSync('selectedKeys') && !needSync('newSelectedKeys')
      if (props.selectable) {
        if (needSync('selectedKeys')) {
          newState.newSelectedKeys = props.selectedKeys
          if (props.isTreeBody) {
            newState.newSelectedKeys = [props.selectedKeys]
          }
        } else {
          newState.newSelectedKeys = prevState.newSelectedKeys
        }
      }
      /** 兼容1.0老版本，当tree的props中没有绑定selectedKeys时有效 */
      if (!prevProps && props.selectedKeys === undefined) {
        newState.newSelectedKeys = oriSelectedKeys
      }

      /*  ================= loadingKeys loadedKeys================== */
      newState.loadingKeys = prevState.loadingKeys
      newState.loadedKeys = prevState.loadedKeys

      /** 需要重新计算节点的场景 （导致节点需要更新展开/收缩的状态）
       * 初始化
       * 外部expandedKeys改变时outExpandedKeys，（单纯改变外部值的场景）
       * 当外部调用nodeExpand函数，改变了newExpandKeys值（兼容不双向绑定expandedKeys.sync）
       * 设置positionKey定位某节点，导致的newExpandedKeys（expandedKeys）的变化；positionKey传入的节点导致节点有展开的情况
       * treeData数据源更新
       * filterValue值变化时，在过滤搜索的时候，数节点展开符合条件的节点
       * filterValue===''时，区分两种场景（1.初始化 2.异步设置为空）
       * 过滤场景下，初始化时，默认显示用户设置展开相关属性的节点
       * 过滤场景下，非初始化；props.filterValue === '' && prevState.needSyncKeys['filterValue]===true，默认显示根节点
       * 特色场景：当filterValue !== '' && isTreeFilter 时，需要重新计算节点
       */

      // common 公共的（过滤场景、常规场景下）都需要重新计算节点展开/收缩状态的场景
      const commonRecalculateNodes = (needSync('expandedKeys') && !needSync('newExpandedKeys')) ||
                          (needSync('positionKey') && needSync('newExpandedKeys')) ||
                          needSync('treeData') ||
                          needSync('nodeExpand')
      if (props.isTreeFilter && props.filterValue !== undefined) {
        if (needSync('filterValue') || commonRecalculateNodes) {
          const { selectTreeInstance } = this
          // console.log('=======Enter the filtering scene========')
          /**
           * tree下，当filterValue变化，且值为空时，只显示根节点
           * selectTree下，当filterValue变化，且值为空时，需要展开搜索前一次的展开节点 cacheBeforeFilterExpandKeys
           */
          if (props.filterValue === '' && prevState.needSyncKeys.filterValue) {
            newState.newExpandedKeys = []
            // 当在selectTree下，filtervalue为空时，需要展开搜索前一次的展开节点
            selectTreeInstance && (newState.newExpandedKeys = deepCopy(newState.cacheBeforeFilterExpandKeys))
          }
          /* 当节点重新筛选后，节点需要重新计算 */
          if (props.filterValue !== '' && (needSync('filterValue') || needSync('treeData'))) {
            newState.newExpandedKeys = filterKeys
          }
          const showlist = this.getExpandShowList(newState)
          // console.log('showlist', showlist, 'filterValueKeys', newState.filterValueKeys)
          const filterTreeData = showlist.filter(v => {
            const bol = newState.filterValueKeys.includes(v[props.formatValue])
            /* 在过滤节点的场景下，当父节点下的子节点没有任何匹配项，需要处理成默认是子节点，通过isFliterLeaf扩展属性来实现 */
            if (bol) {
              v.isFliterLeaf = null
              v.childKeys && !v.childKeys.some((x) => {
                return newState.filterValueKeys.includes(x)
              }) && (v.isFliterLeaf = true)
            }
            return bol
          })
          /* 如果filterValue没有匹配到数据，则显示根节点 (1.filterValue===''；2.filterValue值未有合适的匹配项) */
          newState.filterTreeData = filterTreeData.length > 0 ? filterTreeData : showlist
          // 当tree作为selecttree使用时，过滤筛选时，匹配节点为空时i，只显示空页面
          if (selectTreeInstance && props.filterValue !== '') newState.filterTreeData = filterTreeData
        } else {
          newState.filterTreeData = prevState.filterTreeData
        }
      } else if (commonRecalculateNodes) {
        // console.log('=======Enter the Normal scene========')
        // console.log('getExpandShowList start')
        newState.filterTreeData = this.getExpandShowList(newState)
      } else {
        newState.filterTreeData = prevState.filterTreeData
      }

      /*  ===================== positionKey ====================== */
      if (needSync('positionKey')) {
        const index = newState.filterTreeData.findIndex(v => v[props.formatValue] === prevState.positionKey)
        this.$nextTick(() => {
          if (props.virtual) {
            this.$refs.virtualList.setStart(index)
          }
          if (!props.virtual) {
            const { prefixCls } = this.$data
            const scrollTop = index * props.itemHeight
            const el = this.selectTreeBodyInstance ? this.selectTreeBodyInstance.$refs['select-tree-body'] : this.$refs[prefixCls]
            // console.log('scrollTop', index, props.itemHeight, scrollTop, el)
            el.scrollTop = scrollTop
          }
        })
      }

      // console.log('====================================goto treeDataEcho====================================')
      // treeDataEcho({
      //   state: newState,
      //   formatValue: props.formatValue,
      //   range: prevState.range,
      //   self: this,
      // })

      // console.log('size------>', newState.keyEntities.size)

      if (isRealCheckKeys && props.showCheckbox && (prevProps || props.treeData.length > 0)) {
        const { newCheckedKeys } = newState
        const checkedKeysObj = this.keysToObject(newCheckedKeys, newState)
        this.$emit('on-checkedKeys-change', newCheckedKeys, checkedKeysObj)
      }

      if (isRealSelectKeys && !props.showCheckbox && (prevProps || props.treeData.length > 0)) {
        const { newSelectedKeys } = newState
        const selectedKeysObj = this.keysToObject(newSelectedKeys, newState)
        this.$emit('on-selectedKeys-change', newSelectedKeys, selectedKeysObj)
      }

      this.dispatch('u-base-selector', 'is-list-empty', !!(newState.filterTreeData.length === 0))

      // console.log('newState---->', newState)
      return newState
    },
    /**
     * 数据格式化中心
     * 目前支持isStringFormat格式转换
     * @function dataFormatFactory
     * @param { String } propertyName 需要处理的数目名称
     * @param { String } type 格式化方法 isStringFormat[parse/format]
     * @param value 需要处理的数据
     */
    dataFormatFactory (pramas) {
      const { propertyName, value, type } = pramas
      const { isString } = this.$props
      // isString可配置数组格式
      function checkPropertyName (name) {
        if (Object.prototype.toString.call(isString) !== '[object Array]') return undefined
        return isString.includes(propertyName)
      }
      if (isString === false || checkPropertyName(propertyName) === false) {
        // console.log('HUI 当前不需要格式转换~')
        return value
      }
      if (isString === true || checkPropertyName(propertyName) === true) {
        const val = isStringFormat[type](value)
        return val
      }
    },

  },
  watch: {
    ...getWatch(['treeData', 'checkedKeys', 'selectedKeys', 'expandedKeys', 'filterValue']),
    needSyncKeys: {
      deep: true,
      handler (needSyncKeys) {
        if (JSON.stringify(needSyncKeys) === '{}') return
        this.setState(this.getDerivedStateFromProps(getOptionProps(this), this.$data))
        this.needSyncKeys = {}
      }
    },
  },
  render () {
    // const { classes, treeRef } = this
    //
    // if ( filterTreeData.length === 0 ) return this.renderEmptyList()

    const { virtual, transferScrollOptions, isTreeBody } = this.$props
    if (virtual) return this.renderVirtualList()
    const { defaultTransferScrollOptions } = this.$data
    const normalProps = {
      ref: prefixCls,
      class: this.classes,
      directives: [
        {
          name: 'transfer-scroll',
          value: Object.assign(defaultTransferScrollOptions, transferScrollOptions)
          // { type: 'keep', onlyTransfer: false, isFixed: true, disabled: false }
        }
      ],
      on: {
        keydown: this.onKeydown
      },
      attrs: {
        tabindex: isTreeBody ? null : -1
      }
    }
    return (
      <ul {...normalProps} role="tree">
        {this.filterTreeData.map((item, index) =>
          // this.renderTreeNode({ ...item, filterIndex: index, key: `${item[formatValue]}` })
          this.renderTreeNode(item, index)
        )}
      </ul>
    )
  }
}
</script>

<style>
</style>
