
/**
 * 对外开放的方法集合
 */

import { duplicate } from '../../util'
import { deepCopy } from '@hui/shared-utils'

export default {
  methods: {
    /* 获取checkbox选中节点的keys */
    getCheckedNodes () {
      const { newCheckedKeys: checkedKeys } = this.$data
      return deepCopy(checkedKeys)
    },
    /* 获取select选中节点的keys */
    getSelectedNodes () {
      const { newSelectedKeys: selectedKeys } = this.$data
      return deepCopy(selectedKeys)
    },
    // 不对外开放，转为propsForceUpdate方法
    treeForceUpdate () {
      this.$set(this.needSyncKeys, 'treeData', true)
    },
    propsForceUpdate (props) {
      const setSync = (prop) => {
        if (!type.includes(prop)) return console.error(`[hui warn] ${prop}属性不支持强制更新~`)
        this.$set(this.needSyncKeys, prop, true)
      }
      const type = ['treeData', 'positionKey']
      if (Object.prototype.toString.call(props) === '[object Array]') {
        props.forEach(prop => setSync(prop))
        return
      }
      setSync(props)
    },
    /**
     * @description 对外开放节点checkbox选中
     * @function nodeCheck
     * @param {Boolean} status 需要设置节点的状态值 true: 选中; false: 不选中
     * @param {Number/String} key 节点的唯一值
     * @param {Object} {}
     * @param {Boolean} force 默认[force=false] 当disabled=true时，force=true,是否强制对外选中；目前主要用于selectTree场景下
     */
    nodeCheck (status, key, { force = false } = {}) {
      const { newCheckedKeys: checkedKeys } = this.$data
      const node = this.getNode(key, checkedKeys, status)
      if (node === false) return
      if (this.isDisabled(node, this) || !this.isCheckable(node, this)) return
      this.onNodeCheck(status, node, event)
    },
    /**
     * @description 对外开放文本选中
     * @function nodeSelect
     * @param {Boolean} status 需要设置节点文本的状态值 true: 选中; false: 不选中
     * @param {Number/String} key 节点的唯一值
     */
    nodeSelect (status, key) {
      const { newSelectedKeys: selectedKeys } = this.$data
      const node = this.getNode(key, selectedKeys, status)
      if (node === false) return
      if (this.isDisabled(node, this) || !this.isSelectable(node, this)) return
      this.onNodeSelect(status, node, event)
    },
    /**
     * @description 对外开放节点展开
     * @function nodeExpand
     * @param {Boolean} status 需要设置节点的展开状态值 true: 展开; false: 不展开
     * @param {Number/String} key 节点的唯一值
     */
    nodeExpand (status, key) {
      let { newExpandedKeys: expandedKeys, keyEntities, storageExpandObj } = this.$data

      const node = keyEntities.get(key)

      if (node === undefined) {
        console.error('[hui warn] 请传入正确的节点信息~')
        return false
      }

      /* 判断当前node节点是否复合展开/收缩的条件 */
      if (!this.isExpandable(node, this)) return

      /**
       * 当status=true展开节点，expandedKeys包含当前节点（当前节点处于展开状态），但其节点的父节点们chain有不展开的
       * 当status=true展开节点，expandedKeys不包含当前节点（当前节点处于收缩状态）
       */
      if (status === true) {
        if (!expandedKeys.includes(key) || !node.chain.every(v => expandedKeys.includes(v))) {
          /* 展开当前节点chain上的父节点 */
          expandedKeys.push(...node.chain)
          expandedKeys = duplicate(expandedKeys)
          this.setUncontrolledState({ newExpandedKeys: expandedKeys })
          this.$set(this.needSyncKeys, 'nodeExpand', true)
          this.onNodeExpand(status, node, event)
        }
      }

      if (status === false && expandedKeys.includes(key)) {
        this.$set(this.needSyncKeys, 'nodeExpand', true)
        /**
         * 重置storageExpandObj[v]的值
         * 重置当前需要收缩节点的父节点们已经存贮在storageExpandObj的字段
         */
        node.chain.forEach(v => {
          if (storageExpandObj[v] !== undefined) {
            delete storageExpandObj[v]
            // storageExpandObj[v] = storageExpandObj[v].filter(i => !i.chain.includes(key) || i.level <= node.level)
          }
        })
        this.onNodeExpand(status, node, event)
      }
    },
    /**
     * @description 主要通过key值对应的节点是否在对应的[checkedKeys, selectedKeys]数组中;
     * 通过status传入的状态，判断相应的节点是否可以获取到，不满足条件的返回false
     * @function getNode
     * @param { Boolean } key 根据key值获取节点
     * @param { Array } keys 根据key值属性对应的数组 checkedKeys/selectedKeys
     * @param { Boolean } status 节点的状态
     */
    getNode (key, keys, status) {
      const { keyEntities } = this.$data
      const node = keyEntities.get(key)
      if (node === undefined) {
        console.error('[hui warn] 请传入正确的节点信息~')
        return false
      }
      // 用户外部手动调用方法，当status方法跟当前treeNode的节点状态一致时，return返回
      if ((status === true && !keys.includes(key)) || (status === false && keys.includes(key))) return node
      return false
    },
    /**
     * @description 批量操作展开节点
     * @param { Boolean } status 需要设置节点的展开状态值 true: 展开; false: 不展开
     * @param { String } type 展开、收缩节点的方式类型 all：全部展开、收缩；expandLevel：根据层级展开、收缩 当设置type=expandLevel,需要传入
     * @param { Number/String } expandLevel 当设置type=expandLevel,需要传入当前属性，设置需要传入的方法
     */
    // TODO 批量操作展开节点（全部展开、收缩节点）考虑loadData异步请求节点，过滤节点场景下节点展开的情况
    // expandTree (status, { type = 'all', expandLevel = 1 }) {
    //   const { newExpandedKeys, rebuildTreeData, filterTreeData } = this.$data
    //   const expandedKeys = []
    //   if (type === 'all') {
    //   }
    // },
    /**
     * 当传入的key值存在，但节点未展开，则展开当前节点；
     * 当传入的key值不存在，则控制台提示错误信息
    */
    nodePosition (key) {
      let { newExpandedKeys: expandedKeys, realEntities } = this.$data
      const node = realEntities.get(key)
      if (node === undefined) return console.error('[hui warn] 请输入合适匹配的节点key值~')
      /* 当传入的key值存在，但节点未展开，则展开当前节点；排除根节点 */
      const chain = node.chain.slice(1, node.chain.length)
      /* 判断chain中父节点是否都包含在expandedKeys中，若有不包含的，则添加显示节点 */
      if (node.level > 1 && !chain.every((v) => expandedKeys.includes(v))) {
        expandedKeys.push(...chain)
        expandedKeys = duplicate(expandedKeys)
        this.setUncontrolledState({ newExpandedKeys: expandedKeys })
        this.$emit('update:expandedKeys', expandedKeys)
      }

      this.setUncontrolledState({ positionKey: key })
    },
    /**
     * 获取所有树的节点
     * 不允许外部修改当期那返回的值，只能取数据（需要告知）
     * 可用于做需要批量性的通过数据驱动对（复选框选中（v-model）、文本选中（selectedKeys）、展开/收缩（expandedKeys））做一些操作等
    */
    getAllTreeNodes () {
      const { rebuildTreeData } = this.$data
      return rebuildTreeData
    },
  }
}
