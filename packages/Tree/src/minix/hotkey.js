import { findComponentChildren } from '@hui/shared-utils'
import { duplicate, formatBoolean } from '../../util'
// const ANIMATION_TIMEOUT = 300
export default {
  methods: {
    getTreeChild () {
      const { virtual } = this.$props
      let { $children: children } = this
      if (virtual) {
        // const virtualList = findComponentChildren(this, 'virtual-list')
        const virtualList = this.$refs.virtualList
        children = virtualList.$children.map(node => {
          return findComponentChildren(node, 'TreeNode')
        })
      }
      return children
    },
    getChildrenNode (focusIndex, children) {
      const item = children.find((v) => v.index === focusIndex)
      if (item === undefined) return {}
      return item
    },
    onKeydown (event) {
      event.preventDefault()
      event.stopPropagation()
      const { disabled } = this.$props
      const { keyCode, ctrlKey, metaKey } = event

      // console.log('keycode----->', keyCode)
      if (disabled) return

      /* 全选 */
      if ((ctrlKey || metaKey) && keyCode === 65) {
        this.selectAll()
        return
      }
      /* 全不选 */
      if ((ctrlKey || metaKey) && keyCode === 68) {
        this.unselectAll()
        return
      }
      if (keyCode === 40) {
        this.navigateOptions('down')
        return
      }
      if (keyCode === 38) {
        this.navigateOptions('up')
      }
      if (keyCode === 13) {
        this.onKeydownEnter(event)
        return
      }
      if (keyCode === 39) {
        this.allowKeyToExpand('open', event)
        return
      }
      if (keyCode === 37) {
        this.allowKeyToExpand('close', event)
      }
    },
    /* allowUp 箭头向上时 focusIndex 上下调用 */
    /**
     * 键盘切换 option 聚焦
     * @param {number,string} direction 'up','down'
     */
    navigateOptions (direction) {
      const sMap = { up: -1, down: 1 }
      if (typeof direction == 'string') {
        direction = sMap[direction]
      }
      this.allowKeyDown(direction)
    },
    // TODO 上下键选中时，大数据场景下，range变化场景
    allowKeyDown (direction) {
      const { itemHeight, virtual, showCheckbox } = this.$props
      let { focusIndex } = this.$data
      const { filterTreeData } = this.$data
      const children = this.getTreeChild()
      // let clientItem = parseInt(this.$el.clientHeight/Number(itemHeight))
      // TODO 考虑非showCheckbox场景下，selectabled = false, 是否跳过
      const checkDisableNode = (node) => {
        /* 判断叶子节点; */
        if (!this.isLeaf(node, this)) return false
        /* 判断节点满足禁用条件 */
        if (this.isDisabled(node, this)) return true
        if (showCheckbox) {
          return !this.isCheckable(node, this)
        } else {
          return !this.isSelectable(node, this)
        }
      }
      if (direction === 1) {
        do {
          focusIndex++
          if (focusIndex === filterTreeData.length) focusIndex = 0
        } while (checkDisableNode(this.getChildrenNode(focusIndex, children)))
      }
      if (direction === -1) {
        do {
          focusIndex--
          if (focusIndex < 0) focusIndex = filterTreeData.length - 1
        } while (checkDisableNode(this.getChildrenNode(focusIndex, children)))
      }
      if (!virtual) {
        const el = this.selectTreeBodyInstance ? this.selectTreeBodyInstance.$refs['select-tree-body'] : this.$el
        el.scrollTop = (focusIndex + 1) * (itemHeight) - el.clientHeight
      }
      // !virtual && (this.$el.scrollTop = (focusIndex+1)*(itemHeight) - this.$el.clientHeight)
      this.focusIndex = focusIndex
    },
    /* 全选 */
    selectAll (e) {
      const { formatValue, filterType } = this.$props
      const { realEntities, newCheckedKeys, rebuildTreeData } = this.$data
      let checkedKeys = newCheckedKeys; const halfCheckedKeys = []
      // TODO 当前checkedKeys已包含disabled/disabledCheckbox属性的节点，保留已选的节点
      // checkedKeys = filterTreeData.filter(v => !(v.disabled === true || v.disableCheckbox === true)).map(v => v[formatValue])
      // TODO 1. 考虑过滤场景下的全选，是否需要包含之前的值；2. 考虑数据全部覆盖的场景
      let checkedKeysFilter = []
      if (filterType === 'search') {
        checkedKeysFilter = rebuildTreeData.filter(v => {
          let bol = !(formatBoolean(v.disabled) === true || formatBoolean(v.disableCheckbox) === true)
          !bol && newCheckedKeys.includes(v[formatValue]) && (bol = true)
          return bol
        }).map(v => v[formatValue])
        checkedKeys = checkedKeysFilter
      } else {
        realEntities.forEach(v => {
          const bol = !(formatBoolean(v.disabled) === true || formatBoolean(v.disableCheckbox) === true)
          !bol && newCheckedKeys.includes(v[formatValue]) && checkedKeysFilter.push(v[formatValue])
          bol && checkedKeysFilter.push(v[formatValue])
        })
        checkedKeys = checkedKeys.concat(checkedKeysFilter)
        checkedKeys = duplicate(checkedKeys)
      }
      /* TODO 需要考虑当父节点是disabled,disableCheckbox,在全选场景下，其子节点是否需要响应 */
      this.setUncontrolledState({ newCheckedKeys: checkedKeys, halfCheckedKeys: halfCheckedKeys })
      const eventObj = {
        event: 'selectAll',
        node: null,
        status: true,
        nativeEvent: e,
        nodes: this.keysToObject(checkedKeys)
      }
      const sendValue = this.dataFormatFactory({
        propertyName: 'checkedKeys',
        type: 'format',
        value: checkedKeys
      })
      this.$emit('on-check', sendValue, eventObj)
    },
    /* 全不选 */
    unselectAll (e) {
      const { newCheckedKeys, halfCheckedKeys: newHalfCheckedKeys, realEntities } = this.$data
      const { filterType } = this.$props
      let checkedKeys = []
      let halfCheckedKeys = []
      if (filterType === 'search') {
        checkedKeys = []
        halfCheckedKeys = []
      } else {
        newCheckedKeys.forEach(key => {
          !realEntities.has(key) && checkedKeys.push(key)
        })
        newHalfCheckedKeys.forEach(key => {
          !realEntities.has(key) && halfCheckedKeys.push(key)
        })
        // console.log('checkedKeys', checkedKeys, halfCheckedKeys)
      }
      this.setUncontrolledState({ newCheckedKeys: checkedKeys, halfCheckedKeys: halfCheckedKeys })
      const eventObj = {
        event: 'unselectAll',
        node: null,
        status: false,
        nativeEvent: e,
        nodes: this.keysToObject(checkedKeys)
      }
      const sendValue = this.dataFormatFactory({
        propertyName: 'checkedKeys',
        type: 'format',
        value: checkedKeys
      })
      this.$emit('on-check', sendValue, eventObj)
    },
    onKeydownEnter (event) {
      // console.log('onKeydownEnter')
      const { focusIndex } = this.$data
      const children = this.getTreeChild()
      const node = this.getChildrenNode(focusIndex, children)
      if (Object.keys(node).length === 0) return
      const { showCheckbox } = this.$props
      const { checked, selected } = node

      if (this.isDisabled(node, this)) return
      if (showCheckbox && this.isCheckable(node, this)) this.onNodeCheck(!checked, node, event)
      if (!showCheckbox && this.isSelectable(node, this)) this.onNodeSelect(!selected, node, event)
    },
    allowKeyToExpand (direction, event) {
      const sMap = { close: -1, open: 1 }
      if (typeof direction == 'string') {
        direction = sMap[direction]
      }
      const { focusIndex } = this.$data
      const children = this.getTreeChild()
      const node = this.getChildrenNode(focusIndex, children)
      if (Object.keys(node).length === 0) return
      const { expanded } = node
      if (direction === 1 && expanded === true) return
      if (direction === -1 && expanded === false) return
      this.isExpandable(node, this) && this.onNodeExpand(!expanded, node, event)
    }
  }
}
