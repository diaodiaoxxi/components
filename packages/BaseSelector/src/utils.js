import { get } from '@hui/shared-utils'
export const optionRegexp = /^option|Option$/i
export const optionGroupRegexp = /option-group|OptionGroup/i

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function getComponentName (opts) {
  return get(opts, 'Ctor.options.name') || get(opts, 'tag')
}

/* export const debounce = fn => {
  let waiting
  return function () {
    if (waiting) return
    waiting = true
    const context = this
    const args = arguments
    const later = function () {
      waiting = false
      fn.apply(context, args)
    }
    this.$nextTick(later)
  }
} */

export function debounce (func, wait, immediate = false) {
  var timeout
  return function () {
    var context = this
    var args = arguments

    var later = function () {
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

export const findChild = (instance, checkFn) => {
  let match = checkFn(instance)
  if (match) return instance
  for (let i = 0, l = instance.$children.length; i < l; i++) {
    const child = instance.$children[i]
    match = findChild(child, checkFn)
    if (match) return match
  }
}

/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
export function normalizeMap (map) {
  // Validate whether given map is valid or not
  function isValidMap (map) {
    return Array.isArray(map) || isObject(map)
  }
  if (!isValidMap(map)) {
    return []
  }
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}

/**
 * 提取 option-group 中的option
 * @param {vnode} node option vnode
 * @return {vnodeMap:[]}  vnodeMap vnode 映射数组
 * @type {vnodeMap.key} defaultSlots 中的路径
 * @type {vnodeMap.vnode} 常规option vnode
 */
export const findOptionsInGroup = (node, index, cIndex) => {
  const opts = node.componentOptions
  if (!opts) {
    console.warn('can\'t find node component Options', node)
    return []
  }
  const key =
    cIndex == undefined
      ? `${index}`
      : `${index}.componentOptions.children.${cIndex}`
  const optionName = getComponentName(opts)
  const isOption = optionName.match(optionRegexp) && (!optionName.match(optionGroupRegexp))
  if (isOption) return [{ key: key, vnode: node }]
  if (!node.children && (!opts || !opts.children)) return []
  const children = [
    ...(node.children || []),
    ...((opts && opts.children) || [])
  ]
  const options = children
    .reduce(
      (arr, el, cIndex) => [...arr, ...findOptionsInGroup(el, key, cIndex)],
      []
    )
    .filter(Boolean)
  return options.length > 0 ? options : []
}

/**
 * 提取 option-group 中的option ,拍平为数组
 * @param {vnode:[]} options
 * @return {vnodeMap:[]}  vnodeMap vnode 映射数组
 */
export const extractOptions = options => {
  return options.reduce((options, slotEntry, i) => {
    return options.concat(findOptionsInGroup(slotEntry, i))
  }, [])
}

export const applyProp = (node, propName, value) => {
  return {
    ...node,
    componentOptions: {
      ...node.componentOptions,
      propsData: {
        ...node.componentOptions.propsData,
        [propName]: value
      }
    }
  }
}

export const getNestedProperty = (obj, path) => {
  const keys = path.split('.')
  return keys.reduce((o, key) => (o && o[key]) || null, obj)
}

export const getOptionLabel = option => {
  if (option.componentOptions.propsData.label) { return option.componentOptions.propsData.label }
  const textContent = (option.componentOptions.children || []).reduce(
    (str, child) => str + (child.text || ''),
    ''
  )
  const innerHTML = getNestedProperty(option, 'data.domProps.innerHTML')
  return textContent || (typeof innerHTML === 'string' ? innerHTML : '')
}

// 获取option 数据
export const getOptionData = (option) => {
  if (!option) return null
  const label = getOptionLabel(option).trim()
  const value = option.componentOptions.propsData.value
  return {
    value: value,
    label: label,
  }
}

export const getOptionsData = (vnodes, value) => {
  const option = vnodes.find(
    ({ componentOptions }) => componentOptions.propsData.value === value
  )
  if (!option) return null
  const label = getOptionLabel(option).trim()
  return {
    value: value,
    label: label
  }
}

export const checkValuesNotEqual = (value, publicValue, values) => {
  const strValue = JSON.stringify(value)
  const strPublic = JSON.stringify(publicValue)
  const strValues = JSON.stringify(
    values.map(item => {
      return item.value
    })
  )
  return (
    strValue !== strPublic || strValue !== strValues || strValues !== strPublic
  )
}

export function mapSelectProps (obj) {
  const props = {}
  Object.keys(obj).forEach(key => {
    const val = obj[key]
    props[key] = function () {
      const selectProps = this.selectProps
      if (!selectProps) {
        throw new Error('need inject selectProps')
      }
      if (typeof val === 'function') {
        return val.call(this, selectProps)
      }
      if (typeof val === 'string') {
        return selectProps[val]
      }
      throw new Error('invalid value type')
    }
  })
  return props
}

export function mapSelectData (obj) {
  const props = {}
  Object.keys(obj).forEach(key => {
    const val = obj[key]
    props[key] = function () {
      const selectData = this.selectData
      if (!selectData) {
        throw new Error('need inject selectData')
      }
      if (typeof val === 'function') {
        return val.call(this, selectData)
      }
      if (typeof val === 'string') {
        return selectData[val]
      }
      throw new Error('invalid value type')
    }
  })
  return props
}
