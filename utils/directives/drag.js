export default {
  inserted (el, binding) {
    const obj = binding.value
    if (!obj[0]) return
    el.onmousedown = function (ev) {
      if (obj[2]) ev.target.click()
      const pel = el.parentNode
      const width = parseInt(pel.clientWidth)
      const height = parseInt(pel.clientHeight)
      const clWidth = document.body.clientWidth
      const clHeight = window.innerHeight || document.body.clientHeight
      var disX = ev.clientX - pel.offsetLeft
      var disY = ev.clientY - pel.offsetTop
      document.onmousemove = function (ev) {
        pel.parentNode.style.display = 'block'
        document.body.style.userSelect = 'none'
        var l = ev.clientX - disX
        var t = ev.clientY - disY
        // if (isVertical) t = t-pel.offsetTop;
        if (!obj[1] && l + width > clWidth) {
          l = clWidth - width
        }
        if (!obj[1] && t + height > clHeight) {
          t = clHeight - height
        }
        if (l < 0) l = 0
        if (t < 0) t = 0
        pel.style.left = l + 'px'
        pel.style.top = t + 'px'
      }
      document.onmouseup = function () {
        document.body.style.userSelect = 'text'
        document.onmousemove = null
        document.onmouseup = null
      }
    }
    el.onmouseup = function (ev) {
      document.body.style.userSelect = 'text'
      document.onmousemove = null
      document.onmouseup = null
    }
  },
  bind (el, binding, vnode) {},
  update () {},
  unbind (el, binding) {},
}
