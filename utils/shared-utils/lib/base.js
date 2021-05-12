import { isObject, isArray, omitBy, cloneDeep, noop } from './lodash'

// 判断变量类型
export function is (type, val) {
  if (val && val != '') {
    return Object.prototype.toString.call(val) === '[object ' + type + ']'
  }
}

// 变量类型
export function typeOf (obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

// 驼峰转连字号
export function camelcaseToHyphen (str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * simple generate uuid
 */
export function uuid () {
  let d = Date.now()
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now() // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

/**
 * 过滤下划线开头的私有属性
 * @param {} obj
 * @param {} deep 是否深拷贝，去除 watcher
 * @param {} returnSource 如果不为对象是否返回原数据
 */
export function filterPrivate (obj, deep = false, returnSource = true) {
  if (returnSource && !isObject(obj)) {
    return obj
  }
  return omitBy(cloneDeep(obj), (value, key) => key.startsWith('_'))
}

/**
 * 过滤下划线开头的私有属性 collection 数组
 * @param {} array
 */
export function filterPrivateArray (array, deep = false) {
  if (!isArray(array)) {
    return array
  }
  return array.map(item => filterPrivate(item, deep))
}

// 深复制别名
export const deepCopy = cloneDeep

// 深复制部分属性
export function deepCopySome (data, someAttr) {
  const t = typeOf(data)
  let o
  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]))
    }
  } else if (t === 'object') {
    for (const i in data) {
      if (someAttr.indexOf(i) >= 0) o[i] = deepCopySome(data[i], someAttr)
    }
  }
  return o
}

export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

/**
 * 遍历树形 childrenObj []
 * 递归层级过深可能会栈溢出，建议层级不超过5层
 * @param {array} arr childrenObj []
 * @param {fun} cb
 * @param {object} childrenObj {children:[]}
 */
export function mapTree (arr, cb = noop) {
  if (!isArray(arr)) {
    throw new Error('param must be array')
  }
  const getPath = (path, i) => {
    return path === '' ? `${i}` : `${path}.children.${i}`
  }
  const format = (mutiMenuList = [], path = '', cb) => {
    return mutiMenuList.map((item, i) => {
      cb(item, getPath(path, i))
      if (item.children) {
        item.children = format(item.children, getPath(path, i), cb)
      }
      return item
    })
  }
  return format(arr, '', cb)
}

// 拍平树
// treeFlat(temp1, 'knowledgeTrees', (e) => ({name: e.name, uid: e.uid}))
export const flatTree = (data, childrenKey = 'children', map = (item) => item) => {
  var res = []
  var loop = (arr) => {
    return arr.map(e => {
      const item = map(e)
      const children = e[childrenKey]
        ? loop(e[childrenKey]).flat().flat()
        : []
      e[childrenKey]
        ? res.push(item, ...children)
        : res.push(item)
      return e[childrenKey]
        ? [item, ...children]
        : [item]
    })
  }
  loop(data)
  return res
}
