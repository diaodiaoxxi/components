// import { deepCopy } from '@hui/shared-utils'
// import { getOptionProps } from '@hui/shared-utils'

export function formatBoolean (value) {
  if (value === 'false') return false
  if (value === 'true') return true
  return value
}

export function isCheckDisabled (node) {
  const { disabled, disableCheckbox, checkable } = node || {}
  // return !!(disabled || disableCheckbox) || checkable === false
  return !!(formatBoolean(disabled) || formatBoolean(disableCheckbox)) || formatBoolean(checkable) === false
}

export function deepTraversal (treeDate, props) {
  const { formatValue, isString } = props
  var nodeList = []
  var rebulidIndex = 0
  treeDate.forEach(node => {
    if (node) {
      var stack = []
      stack.push(node)
      while (stack.length != 0) {
        var item = stack.pop()
        var index = item.level || 1
        item.level = index
        isString && (item[formatValue] = item[formatValue].toString())
        // item.parentId = item.parentId || ''
        item.parantValue = item.parantValue || ''

        item.chain = item.level > 1 ? [item[formatValue], ...item.chain] : [item[formatValue]]
        item.childLength = item.children ? item.children.length : 0
        item.childKeys = item.children ? item.children.map(v => v[formatValue]) : null

        item.rebulidIndex = rebulidIndex
        rebulidIndex++

        /* 下面6个属性，需要初始化配置，在treeDataEcho中需要重新设置，及时响应 */
        // item.halfChecked = false
        // item.loading = false
        // item.loaded = false
        // /* 兼容老版本，当treeData里面包含checked,expand,selected属性来控制复选框选中，展开/收缩状态 */
        // item.checked = item.checked
        // item.selected = item.selected
        // item.expanded = item.expanded

        nodeList.push(item)
        if (item.children) {
          index++
          var children = item.children
          item.childLength = item.children.length
          for (var i = children.length - 1; i >= 0; i--) {
            // children[i].parentId = item.id
            children[i].parantValue = item[formatValue]
            children[i].parent = item
            children[i].level = index
            children[i].chain = item.chain
            children[i].rebulidIndex = rebulidIndex
            stack.push(children[i])
          }
        } else {
          /* 将初始化数据时，没有children属性（即：当前节点为叶子节点），扩展其children属性为[] */
          // item.children = []
        }
      }
    }
  })
  return nodeList
}

export function createRebuildTreeData (treeDate, props) {
  // const arr = []
  // treeDate.forEach(item => {
  //   arr.push(...deepTraversal(item, formatValue))
  // })
  // return arr
  return deepTraversal(treeDate, props)
}

/**
 * 需要循环遍历echo
 * 重新设置设置复选框选中节点，文本选中状态，节点loading、loaded状态，展开状态
 * @param state  需要循环遍历state状态
 * @param formatValue  个性化配置节点，默认id
 * @param range 需要循环echo的范围
 * @param self  表示tree的节点node
 */
export function treeDataEcho ({ state, formatValue, range, self }) {
  const {
    newCheckedKeys: checkedKeys,
    newSelectedKeys: selectedKeys,
    newExpandedKeys: expandedKeys,
    halfCheckedKeys,
    loadingKeys,
    loadedKeys,
    filterValueKeys
  } = state
  var { filterTreeData } = state
  const { start, end } = range
  const dataLoop = filterTreeData
  for (let j = 0, len = dataLoop.length; j < len; j++) {
    if (j < start) continue
    if (j > end && end !== null) break
    // console.log('for each')
    // console.log('dataLoop[j]', dataLoop[j])
    const obj = dataLoop[j]
    // TODO 为什么需要重新创建一个新的obj, 导致rebuildTreeData 与 filterTreeData 内部的obj不一致
    // 为了children值的赋值
    // const obj = {}
    // for (var i in dataLoop[j]) {
    //   obj[i] = dataLoop[j][i]
    // }
    const key = obj[formatValue]
    obj.halfChecked = halfCheckedKeys !== undefined && halfCheckedKeys.includes(key)
    obj.checked = checkedKeys !== undefined && checkedKeys.includes(key)
    obj.selected = selectedKeys !== undefined && selectedKeys.includes(key)
    obj.loading = loadingKeys.includes(key)
    obj.loaded = loadedKeys.includes(key)
    obj.expanded = expandedKeys.includes(key)
    self.$set(filterTreeData, j, obj)
  }
}

export function arrEqual (a, b) {
  // 判断数组的长度
  if (a.length !== b.length) {
    return false
  } else {
    // 循环遍历数组的值进行比较
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false
      }
    }
    return true
  }
}

// Es6 + ES5数组里面的对象通过关键词去重办法
export function duplicate (arr, type) {
  if (arr.length == 0) {
    return arr
  } else {
    if (type) {
      var obj = {}
      var newArr = arr.reduce((cur, next) => {
        obj[next[type]] ? '' : ((obj[next[type]] = true) && cur.push(next))
        return cur
      }, [])
      // arr.reduce((all, next) => all.some((atom) => atom[type] == next[type]) ? all : [...all, next],[])
      return newArr
    } else {
      return Array.from(new Set(arr))
    }
  }
}

/**
 * Conduct check state by the keyList. It will conduct up & from the provided key.
 * If the conduct path reach the disabled or already checked / unchecked node will stop conduct.
 * @param keyList       list of keys
 * @param isCheck       is check the node or not
 * @param keyEntities   parsed by `convertTreeToEntities` function in Tree
 * @param checkStatus   Can pass current checked status for process (usually for uncheck operation)
 * @returns {{checkedKeys: [], halfCheckedKeys: []}}
 */
export function conductCheck (keyList, isCheck, keyEntities, checkStatus = {}, formatValue = 'id') {
  const checkedKeys = new Map()
  const halfCheckedKeys = new Map(); // Record the key has some child checked (include child half checked)

  (checkStatus.checkedKeys || []).forEach(key => {
    checkedKeys.set(key, true)
  });

  (checkStatus.halfCheckedKeys || []).forEach(key => {
    halfCheckedKeys.set(key, true)
  })

  // Conduct up
  function conductUp (key) {
    if (checkedKeys.get(key) === isCheck) return

    const entity = keyEntities.get(key)
    if (!entity) return

    const { children, parent } = entity

    if (isCheckDisabled(entity)) return

    // Check child node checked status
    let everyChildChecked = true
    let someChildChecked = false; // Child checked or half checked

    (children || [])
      .filter(child => !isCheckDisabled(child))
      .forEach(({ [formatValue]: childKey }) => {
        const childChecked = checkedKeys.get(childKey)
        const childHalfChecked = halfCheckedKeys.get(childKey)

        if (childChecked || childHalfChecked) someChildChecked = true
        if (!childChecked) everyChildChecked = false
      })

    // Update checked status
    if (isCheck) {
      checkedKeys.set(key, everyChildChecked)
    } else {
      checkedKeys.set(key, false)
    }
    halfCheckedKeys.set(key, someChildChecked)

    if (parent) {
      conductUp(parent[formatValue])
    }
  }

  // Conduct down
  function conductDown (key) {
    if (checkedKeys.get(key) === isCheck) return

    const entity = keyEntities.get(key)
    if (!entity) return

    const { children, node } = entity

    if (isCheckDisabled(entity)) return

    checkedKeys.set(key, isCheck)
    // console.log('key', key);
    halfCheckedKeys.set(key, false);

    (children || []).forEach(child => {
      conductDown(child[formatValue])
    })
  }

  function conduct (key) {
    const entity = keyEntities.get(key)

    if (!entity) {
      // warning(false, `'${key}' does not exist in the tree.`);
      console.error('[hui warn]', false, `'${key}' does not exist in the tree.`)
      // TODO 考虑新增dirtyValue 1.考虑checkedKeys中存在脏值，是否需要清除脏值；2. 考虑loaddata场景下，未加载的节点，但是同时节点已经选在在checkedKeys中
      // checkedKeys.set(key, isCheck)
      return
    }
    const { children, parent, node } = entity
    checkedKeys.set(key, isCheck)

    if (isCheckDisabled(entity)) return;

    // Conduct down
    (children || [])
      .filter(child => !isCheckDisabled(entity))
      .forEach(child => {
        conductDown(child[formatValue])
      })

    // Conduct up
    if (parent) {
      conductUp(parent[formatValue])
    }
  }

  (keyList || []).forEach(key => {
    conduct(key)
  })

  const checkedKeyList = []
  const halfCheckedKeyList = []

  // Fill checked list
  for (const [key, value] of checkedKeys) {
    if (value) {
      checkedKeyList.push(key)
    }
  }

  // Fill half checked list
  for (const [key, value] of halfCheckedKeys) {
    if (!checkedKeys.get(key) && value) {
      halfCheckedKeyList.push(key)
    }
  }

  return {
    checkedKeys: checkedKeyList,
    halfCheckedKeys: halfCheckedKeyList,
  }
}

/**
 * Parse `checkedKeys` to { checkedKeys, halfCheckedKeys } style
 */
export function parseCheckedKeys (keys) {
  if (!keys) {
    return null
  }

  // Convert keys to object format
  let keyProps
  if (Array.isArray(keys)) {
    // [Legacy] Follow the api doc
    keyProps = {
      checkedKeys: keys,
      halfCheckedKeys: undefined,
    }
  } else if (typeof keys === 'object') {
    keyProps = {
      checkedKeys: keys.checked || undefined,
      halfCheckedKeys: keys.halfChecked || undefined,
    }
  } else {
    console.warning('[hui warn]', false, '`checkedKeys` is not an array or an object')
    return null
  }

  // keyProps.checkedKeys = keyListToString(keyProps.checkedKeys)
  // keyProps.halfCheckedKeys = keyListToString(keyProps.halfCheckedKeys)

  return keyProps
}

/**
 * keyList关联的parent
 * @param keyList
 * @param keyEntities
 * @param formatValue
 */
export function conductExpandParent (keyList, keyEntities, formatValue) {
  const expandedKeys = new Map()

  function conductUp (key) {
    if (expandedKeys.get(key)) return

    const entity = keyEntities.get(key)
    if (!entity) return

    expandedKeys.set(key, true)

    const { parent } = entity
    // const props = getOptionProps(node);
    // if (props && props.disabled) return;
    // console.log('parent---->', parent)

    if (parent) {
      conductUp(parent[formatValue])
    }
  }

  (keyList || []).forEach(key => {
    conductUp(key)
  })

  return [...expandedKeys.keys()]
}

/**
 *
 * @param {list} 表示当前数组
 * @param {value} 数组中的某个值
 * @param {isNew} true: 表示返回全新的数组，全数组不变 false:
 * @param {isNew} false: 直接删除当前数组的值
 */
export function arrDel (list, value, isNew = false) {
  const clone = isNew ? list : list.slice()
  const index = clone.indexOf(value)
  if (index >= 0) {
    clone.splice(index, 1)
  }
  return clone
}

export function arrAdd (list, value, isNew = false) {
  const clone = isNew ? list : list.slice()
  if (clone.indexOf(value) === -1) {
    clone.push(value)
  }
  return clone
}

export function debounce (func, wait, immediate = false) {
  var timeout
  return function () {
    var context = this
    var args = arguments

    var later = function later () {
    // var later = function () {
      timeout = null

      if (!immediate) {
        func.apply(context, args)
      }
    }

    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) {
      func.apply(context, args)
    }
  }
}
