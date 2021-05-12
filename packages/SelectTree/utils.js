import { deepCopy } from '@hui/shared-utils'
import { SHOW_ALL, SHOW_PARENT, SHOW_CHILD, SHOW_HALF_ALL } from './strategies'

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
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

export function toArray (data) {
  if (data === undefined || data === null) return []

  return Array.isArray(data) ? data : [data]
}

/**
 * Convert value to array format to make logic simplify.
 */
export function formatInternalValue (value, props) {
  const { labelInValue } = props
  const valueList = toArray(value)

  // Parse label in value
  if (labelInValue) {
    return valueList.map(val => {
      if (typeof val !== 'object' || !val) {
        return {
          value: '',
          label: '',
        }
      }
      return val
    })
  }

  return valueList.map(val => ({
    value: val,
  }))
}

/**
 * Convert internal state `valueList` to user needed value list.
 * This will return an array list. You need check if is not multiple when return.
 *
 * `allCheckedNodes` is used for `treeCheckStrictly`
 */
export function formatSelectorValue (selectorValue, props, formatKey) {
  const { multiple, checkStrictly, showCheckedStrategy } = props
  const { labelKey, valueKey } = formatKey
  const { valueList, keys } = selectorValue
  // Will hide some value if `showCheckedStrategy` is set
  if (multiple && !checkStrictly) {
    if (showCheckedStrategy === SHOW_PARENT) {
      const list = valueList.filter(obj => {
        const chain = deepCopy(obj.chain)
        chain.shift()
        return obj.level === 1 || !chain.some(v => keys.includes(v))
      }).map(item => ({ label: item[labelKey], value: item[valueKey], disabled: item.disabled }))
      return list
    }
    if (showCheckedStrategy === SHOW_CHILD) {
      return valueList.filter(obj => {
        return obj.childLength === 0
      }).map(item => ({ label: item[labelKey], value: item[valueKey], disabled: item.disabled }))
    }
    // return list.map(item => ({ label: item[labelKey], value: item[valueKey] }))
  }

  return valueList.map(item => ({
    label: item[labelKey],
    value: item[valueKey],
    disabled: item.disabled
  }))
}
