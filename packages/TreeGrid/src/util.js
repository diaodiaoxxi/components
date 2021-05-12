import { deepCopySome } from '@hui/shared-utils'
// import { defaultsDeep } from '@hui/shared-utils/index'
let rowIndex = 0
export const divideNum = (num) => {
  let revalue = ''
  const array = String(num).split('.')
  const pointStr = array[1] ? '.' + array[1] : ''
  array[0] = array[0].replace(/-/g, '')
  if (array[0].length > 3) {
    while (array[0].length > 3) {
      revalue =
            ',' +
            array[0].substring(array[0].length - 3, array[0].length) +
            revalue
      array[0] = array[0].substring(0, array[0].length - 3)
    }
  }
  return num >= 0
    ? array[0] + revalue + pointStr
    : '-' + array[0] + revalue + pointStr
}
export const formatdata = (value, type, sumFixed) => {
  value = value.toString().replace(/[^0-9.-]/g, '') || ''
  const reg = /^[+]{0,1}(\d+)$/

  const isNum = reg.test(sumFixed) && typeof sumFixed === 'number'

  var firstChar = value.substring(0, 1) || ''
  if (type == 'money') {
    if (firstChar == '-') {
      value = value.substring(1) || ''
    }
    // var valArr = value.split('.')
    // var intLength = valArr.length > 0 ? valArr[0].length : value
    value = value.replace('-', '')
    if (value == '') return
    const fixedNum = isNum ? sumFixed : 2

    // let sumNum = (sumFixed || sumFixed == 0)? sumFixed : 2
    value = Number(value).toFixed(fixedNum)
    if (firstChar == '-') {
      value = '-' + value
    }
    if (value.substring(value.length - 1, value.length) == '.') {
      value = value.substring(0, value.length - 1)
    }
    return divideNum(value)
  } else {
    const fixedNum = isNum ? sumFixed : ''
    const result = isNum && value ? Number(value).toFixed(fixedNum) : value
    return result
  }
}

export const getRandomStr = function (len = 32) {
  const $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  const maxPos = $chars.length
  let str = ''
  for (let i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return str
}
export const getRandomId = function () {
  rowIndex++
  return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36) + rowIndex
}
export function mapTableProps (obj) {
  const props = {}
  Object.keys(obj).forEach(key => {
    const val = obj[key]
    props[key] = function () {
      const tableProps = this.tableProps
      if (!tableProps) {
        throw new Error('need inject tableProps')
      }
      if (typeof val === 'function') {
        return val.call(this, tableProps)
      }
      if (typeof val === 'string') {
        return tableProps[val]
      }
      throw new Error('invalid value type')
    }
  })
  return props
}

export function mapTableData (obj) {
  const props = {}
  Object.keys(obj).forEach(key => {
    const val = obj[key]
    props[key] = function () {
      const tableData = this.tableData
      if (!tableData) {
        throw new Error('need inject tableData')
      }
      if (typeof val === 'function') {
        return val.call(this, tableData)
      }
      if (typeof val === 'string') {
        return tableData[val]
      }
      throw new Error('invalid value type')
    }
  })
  return props
}
export const isIE = () => {
  return navigator.userAgent.toLowerCase().indexOf('trident') > -1
}
export const makeObjData = (row, index) => {
  const newRow = deepCopySome(row, ['_level', '_disabled', '_freshLoad', '_checked', '_parentId', 'childrenId', '_expand'])
  newRow._isHover = false
  newRow._index = row._index
  newRow._rowid = row._rowid
  // TODO replace defaultsDeep
  // newRow.childrenId = row.childrenId
  if (newRow._disabled) {
    newRow._isDisabled = newRow._disabled
  } else {
    newRow._isDisabled = false
  }
  if (newRow._checked) {
    newRow._isChecked = newRow._checked
  } else {
    newRow._isChecked = false
  }
  if (newRow._highlight) {
    newRow._isHighlight = newRow._highlight
  } else {
    newRow._isHighlight = false
  }
  if (newRow._indeterminate) {
    newRow._Indeterminate = newRow._indeterminate
  } else {
    newRow._Indeterminate = false
  }
  if (newRow._expand) {
    newRow._isExpand = true
  } else {
    newRow._isExpand = false
  }
  if (row._isShow) {
    newRow._isShow = row._isShow
  } else {
    newRow._isShow = false
  }
  if (row._isFreshLoad) {
    newRow._isFreshLoad = row._isFreshLoad
  } else {
    newRow._isFreshLoad = false
  }
  return newRow
}
