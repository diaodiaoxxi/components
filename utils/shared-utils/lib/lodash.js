export const chain = require('lodash/chain')
/** lang **/
export const isString = require('lodash/isString')
export const isEmpty = require('lodash/isEmpty')
export const isObject = require('lodash/isObject')
export const isPlainObject = require('lodash/isPlainObject')
export const isArray = require('lodash/isArray')
export const isFunction = require('lodash/isFunction')
/* string 类 */
export const camelCase = require('lodash/camelCase')
/** array  类 */
export const take = require('lodash/take')
export const findIndex = require('lodash/findIndex')
/** object 类 */
export const get = require('lodash/get')
export const set = require('lodash/set')
export const unset = require('lodash/unset')
export const some = require('lodash/some')
export const pick = require('lodash/pick')
export const merge = require('lodash/merge')
export const cloneDeep = require('lodash/cloneDeep')
export const defaults = require('lodash/defaults')
export const defaultsDeep = require('lodash/defaultsDeep')
export const values = require('lodash/values')
export const omit = require('lodash/omit')
export const omitBy = require('lodash/omitBy')
/** function 类**/
export const debounce = require('lodash/debounce')
export const throttle = require('lodash/throttle')
export const noop = require('lodash/noop')
/* lang */
export const isEqual = require('lodash/isEqual')
export const isEqualWith = require('lodash/isEqualWith')

/**
 * 根据 keys 内 key 值判断两个对象是否相等, 如果任意对象 object.key == null ,undefined 返回 false
 * @param {Object} value The value to compare.
 * @param {Object} other The other value to compare.
 * @param {Array} keys the key to compare
 */
export function isEqualWithKeys (object, other, keys = []) {
  if (typeof keys == 'string') {
    keys = [keys]
  }
  if (!Array.isArray(keys)) {
    throw new Error('keys must be array or string')
  }

  return keys.some(key => {
    const objValue = get(object, key)
    const othValue = get(other, key)
    if (isEmpty(objValue) || isEmpty(othValue)) {
      return false
    }
    return isEqual(objValue, othValue)
  })
}
