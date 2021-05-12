
/**
 * nodeEdit方法
 */

import { deepTraversal, arrDel, arrAdd, duplicate } from '../../util'

export default {
  methods: {
    setResponse (params) {
      const { status = true, msg = '' } = params
      !status && console.error(`[hui warn] ${msg}~`)
      return params
    },
    treeAdd ({ key, data, entities }) {
      const { formatValue } = this.$props
      const node = entities.get(key)
      if (node === undefined) {
        return this.setResponse({ status: false, msg: `${key}值不存在`, key })
      }
      function checkForDuplicates (array) {
        return new Set(array).size !== array.length
      }
      const rebuildData = deepTraversal(data, this.$props)
      if (rebuildData.some(v => entities.get(v[formatValue]))) {
        return this.setResponse({ status: false, msg: '新增数据与treeData数据的存在重复的key值', key })
      }
      if (checkForDuplicates(rebuildData.map(v => v[formatValue]))) {
        return this.setResponse({ status: false, msg: '新增的数据含有重复的key值', key })
      }
      node.children === undefined && (node.children = [])
      node.children.push(...data)
      return this.setResponse({ status: true, msg: '新增成功~', key })
    },
    // 支持批量删除key
    // TODO 考虑删除节点后，是否针对当前节点需要删除对应checkedKeys，expandedKeys，selectedKeys等字段
    treeDel ({ key, entities, treeData }) {
      const { formatValue } = this.$props
      let response
      if (Object.prototype.toString.call(key) === '[object Array]') {
        /**
         * 过滤不存在的key
         * 已存在父节点key，过滤其包含的子节点
         * @responseArr 返回每个key节点 删除事件的状态
         */
        const responseArr = []
        const filters = {}
        key.filter(k => {
          const entity = entities.get(k)
          if (entity === undefined) {
            responseArr.push(this.setResponse({ status: false, msg: `${k}值不存在`, key: k }))
            return false
          }
          // return !entity.chain.some(v => v !== k && key.includes(v))
          return !entity.chain.slice(0).reverse().some(v => {
            const bool = v !== k && key.includes(v)
            if (bool) {
              filters[v] === undefined && (filters[v] = [])
              filters[v].push(k)
            }
            return v !== k && key.includes(v)
          })
        }).forEach(k => {
          // console.log('filters', filters)
          responseArr.push(this.singleTreeDel({ key: k, entities, treeData }))
        })
        const validResponse = responseArr.filter(res => res.status)
        if (validResponse.length === 0) {
          response = this.setResponse({ status: false, msg: '全部删除失败~' })
        } else {
          const validKey = validResponse.map(v => v.key)
          validResponse.forEach(res => {
            const { key } = res
            filters[key] && validKey.push(...filters[key])
          })
          duplicate(validKey)
          // console.log('validKey', validKey)
          response = this.setResponse({
            status: true,
            msg: '删除成功~',
            // key: validResponse.map(v => v.key), // 返回删除成功的key 不包含 过滤的chain 子节点
            key: validKey // 包含之前过滤的子节点chain
          })
        }
      } else {
        response = this.singleTreeDel({ key, entities, treeData })
      }
      return response
    },
    // key 删除
    singleTreeDel ({ key, entities, treeData }) {
      const { formatValue } = this.$props
      const node = entities.get(key)
      if (node === undefined) {
        return this.setResponse({ status: false, msg: `${key}值不存在`, key })
      }
      const parantValue = node.parantValue
      const parentNode = entities.get(parantValue)
      if (parentNode === undefined) {
        const keyIndex = treeData.findIndex(v => v[formatValue] === key)
        treeData.splice(keyIndex, 1)
      } else {
        // const keyIndex = parentNode.children.findIndex(v => v[formatValue] === key)
        parentNode.children = parentNode.children.filter(v => v[formatValue] !== key)
        // parentNode.children.splice(keyIndex, 1)
      }
      return this.setResponse({ status: true, msg: '删除成功~', key })
    },
    treeEdit ({ key, data, entities }) {
      // deepTraversal([data], this.$props)
      const { formatValue } = this.$props
      let { newExpandedKeys: expandedKeys } = this.$data
      const newKey = data[formatValue]
      if (newKey === undefined) {
        return this.setResponse({ status: false, msg: `修改的对象缺少区分唯一值${formatValue}属性`, key })
      }
      const node = entities.get(key)
      if (node === undefined) {
        return this.setResponse({ status: false, msg: `${key}值不存在`, key })
      }
      Object.keys(data).forEach(v => {
        // TODO 考虑expandedKeys、selectedKeys、checkedKeys值的同步问题
        if (v !== 'children') {
          node[v] = data[v]
          if (expandedKeys.includes(key)) {
            expandedKeys = arrDel(expandedKeys, key)
            expandedKeys = arrAdd(expandedKeys, newKey)
            this.setUncontrolledState({ newExpandedKeys: expandedKeys })
            this.$emit('update:expandedKeys', expandedKeys)
          }
        }
      })
      return this.setResponse({ status: true, msg: '编辑成功~', key })
    },
    /**
     * @description 方法：针对node的节点 增，删，改
     * @function nodeEdit
     * @param { String } type [add/edit/del] add: 新增 edit: 修改 del: 删除
     * @param { Number/String } key 当前需要处理的节点key
     * @param { Array } data type=add 新增场景下，需要新增的节点数据
     * @return { Object } response 返回此次执行的状态obj内容
     * @response status 当前事件执行的状态
     * @response msg 当前事件执行的文本msg
     */
    nodeEdit (type, key, data) {
      const { keyEntities: entities } = this.$data
      const { treeData } = this.$props
      let response = {}
      if (type === 'add') {
        response = this.treeAdd({ key, data, entities })
      }
      if (type === 'edit') {
        response = this.treeEdit({ key, data, entities })
      }
      if (type === 'del') {
        response = this.treeDel({ key, entities, treeData })
      }
      response.status && this.$set(this.needSyncKeys, 'treeData', true)
      return response
    },
  }
}
