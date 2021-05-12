const EVT_LIST = ['click', 'mouseup', 'mousedown']

/**
 * 指令绑定的值
 * type: Function | Object
 * 当值为Object类型时，可设置以下两个属性：
 * trigger: String，指定触发回调函数的事件。可选：click(默认值), mouseup, mousedown。
 * handler: Function，回调函数。
 */
export default {
  bind (el, binding, vnode) {
    function documentHandler (e) {
      if (el.contains(e.target)) {
        return false
      }
      typeof handler === 'function' && handler(e)
    }
    const value = binding.value
    let handler = null
    // 默认绑定click事件
    let trigger = 'click'
    if (value && typeof value === 'object') {
      trigger = value.trigger ? ('' + value.trigger).toLowerCase() : 'click'
      trigger = EVT_LIST.indexOf(trigger) ? trigger : 'click'
      handler = value.handler
    } else if (typeof value === 'function') {
      handler = value
    }

    el.__vueclickOutside__ = {
      handler: documentHandler,
      trigger: trigger
    }
    document.addEventListener(trigger, documentHandler)
  },
  update () {},
  unbind (el, binding) {
    document.removeEventListener(
      el.__vueclickOutside__.trigger,
      el.__vueclickOutside__.handler
    )

    delete el.__vueclickOutside__
  }
}
