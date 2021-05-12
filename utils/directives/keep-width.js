function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Check if the given value is an element.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is an element, else `false`.
 */
function isElement (value) {
  return (
    isObject(value) &&
    value.nodeType === 1 &&
    Object.prototype.toString.call(value).indexOf('Element') > -1
  )
}

function keepWidth (el, binding, vnode) {
  if (!isElement(el)) {
    throw new Error('v-keep-width only support for native dom')
  }
  // 数字字母混合会被挤压1像素
  el.style.width = el.offsetWidth + 1 + 'px'
}

/**
 * 保持初始渲染宽度
 */
export default {
  inserted: keepWidth,
}
