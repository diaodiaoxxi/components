/**
  @author:tanhong28754
  @desc:支持hui组件transfer设置后添加自定义class,只迭代一层 component.$refs
**/
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
    toString.call(value).indexOf('Element') > -1
  )
}
/**
 * if has [data-transfer] add class value
 * @param {element} dom
 * @param {string} value className
 */
function addTransferClass (dom, value) {
  const hasTransferDom = dom.dataset && !!dom.dataset.transfer
  if (!hasTransferDom) {
    return
  }
  const transferDom = dom
  if (transferDom.classList.contains(value)) {
    return
  }
  transferDom.classList.add(value)
  return transferDom.getAttribute('class')
}

function noop () {}

// fix if transition component ,insert class will be recover by updateClass #6516 in vue
function insertClassForVmUpdate (vueCom, cb = noop) {
  vueCom._hasHookEvent = vueCom.$off('hook:updated', cb)
  vueCom.$on('hook:updated', cb)
}

function addTransferClassForRef (vnode, value) {
  addTransferClass(vnode.componentInstance.$el, value)
  const children = vnode.componentInstance.$refs
  Object.values(children).forEach(child => {
    if (!isObject(child)) {
      return
    }
    if (isElement(child)) {
      addTransferClass(child, value)
      return
    }
    const isVueCom = !!child.$el && isElement(child.$el)
    if (isVueCom) {
      addTransferClass(child.$el, value)
      insertClassForVmUpdate(child, () => {
        addTransferClass(child.$el, value)
      })
    }
  })
}

export default {
  inserted: function (el, { value }, vnode) {
    if (typeof value !== 'string') {
      throw new Error('v-transfer-dom-class 绑定的值必须为 string')
    }
    addTransferClassForRef(vnode, value)
  },
  componentUpdated: function (el, { value }, vnode) {
    addTransferClassForRef(vnode, value)
  }
}
