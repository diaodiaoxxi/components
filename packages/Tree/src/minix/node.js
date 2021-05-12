import {
  formatBoolean,
} from '../../util'
export default {
  methods: {
    /**
     * @description 当前treeNode节点是否是叶子节点
     * @param {Object} treeNode treeNode实例或者treenode对应的obj对象
     * @param {Object} treeInstance tree实例
     */
    isLeaf (treeNode, treeInstance) {
      const { children, leaf, loaded, isFliterLeaf } = treeNode
      const { loadData, filterValue, isTreeFilter } = treeInstance.$props
      const hasChildren = children && children.length > 0
      /** 场景逻辑说明：
           * leaf属性 只有在loaddata远程搜索的时有效
           * 当leaf = false(前提是当前为异步请求 loaddata；有treeData传入)，表示当前节点不是叶子节点
           * 当不是异步加载，当前节点chilren.length === 0, 表示是叶子节点，反之是父节点
           * 当是异步加载，当前节点属性loaded=true，表示当前节点异步加载完成，如果不存在子节点，表示当前节点时叶子节点
           * 当过滤节点场景下，关键字有值且搜索时，【在filtervalue = true, 在过滤搜索的场景下（排除根节点）】当只有父元素符合节点条件，没有符合条件的子节点（子节点为空）时，该节点也是叶子节点 return false
           */
      if (loadData && formatBoolean(leaf) === false) return false
      // （添加 loadData判断条件）需要兼容 isTreeFilter && filterValue !== undefined && filterValue !== ''场景下 leaf: false后，触发loadData异步请求后，过滤的节点
      if (isTreeFilter && filterValue !== undefined && filterValue !== '' && hasChildren) {
        if (isFliterLeaf === true) return true
      }
      return (!loadData && !hasChildren) || (loadData && !!formatBoolean(leaf)) || (loadData && loaded && !hasChildren)

      // if (loadData) {
      //   return loaded && !hasChildren
      // } else {
      //   return !hasChildren
      // }
    },
    /**
     * @description 当前treeNode节点是否禁用
     * @param {Object} treeNode treeNode实例或者treenode对应的obj对象
     * @param {Object} treeInstance tree实例
     */
    isDisabled (treeNode, treeInstance) {
      const { disabled, disableClick } = treeNode
      const { disabled: treeDisabled } = treeInstance
      if (formatBoolean(disabled) === false || formatBoolean(disableClick) === false) {
        return false
      }
      return !!(treeDisabled || formatBoolean(disabled) || formatBoolean(disableClick))
    },
    /**
     * @description 当前treeNode节点是否可点击
     * @param {Object} treeNode treeNode实例或者treenode对应的obj对象
     * @param {Object} treeInstance tree实例
     */
    isCheckable (treeNode, treeInstance) {
      const { disableCheckbox } = treeNode
      const { showCheckbox: treeShowCheckbox } = treeInstance.$props
      if (!treeShowCheckbox || formatBoolean(disableCheckbox) === true) return false
      return treeShowCheckbox
    },
    /**
     * @description 当前treeNode节点是否可选择
     * @param {Object} treeNode treeNode实例或者treenode对应的obj对象
     * @param {Object} treeInstance tree实例
     */
    isSelectable (treeNode, treeInstance) {
      const { selectable } = treeNode
      const { selectable: treeSelectable } = treeInstance.$props
      if (typeof formatBoolean(selectable) === 'boolean') {
        return formatBoolean(selectable)
      }
      return treeSelectable
    },
    /**
     * @description 当前treeNode节点是否可展开；
     * isLeaf()当前节点的状态为叶子节点，不支持展开/收缩；
     * loading=true，当前节点处于loading加载状态，不支持展开/收缩
     * @param {Object} treeNode treeNode实例或者treenode对应的obj对象
     * @param {Object} treeInstance tree实例
     */
    isExpandable (treeNode, treeInstance) {
      if (this.isLeaf(treeNode, treeInstance)) {
        console.error('[hui] 当前节点状态为叶子节点，不支持做展开、收缩操作~')
        return false
      }
      // if (treeNode.loading) {
      //   console.error('[hui] 当期节点处于loading加载状态，不支持做展开、收缩操作~')
      //   return false
      // }
      return true
    }
  },
}
