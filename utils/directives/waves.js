import { on as addHandler, off as removeHandler, removeDom } from '@hui/shared-utils'
// 水波纹
const prefixCls = 'h-waves'
const style = (el, value) => {
  ['transform', '-webkit-transform', '-moz-transform'].forEach(i => {
    el.style[i] = value
  })
}

const waves = {
  show (e, el, binding) {
    const doc = document
    const container = doc.createElement('span')
    const animation = doc.createElement('span')
    const color = binding.value ? binding.value.color : false
    const isLight = binding.modifiers.light

    container.appendChild(animation)
    container.className = `${prefixCls}-wrap`

    if (el.classList.includes('relative')) {
      el.classList.remove('relative')
    }
    el.classList.add('relative')

    if (isLight) {
      container.classList.add('light')
    }
    if (!isLight && color) {
      container.classList.add(`${color}-text`)
    }

    animation.className = `${prefixCls}-animation`
    animation.style.width = `${el.clientWidth * 2}px`
    animation.style.height = animation.style.width

    el.appendChild(container)
    // getBoundingClientRect用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置。
    const offset = el.getBoundingClientRect()
    const x = (e.clientX || e.x) - offset.left
    const y = (e.clientY || e.y) - offset.top
    animation.classList.add(`${prefixCls}-animation-enter`)
    animation.classList.add(`${prefixCls}-animation-visible`)
    style(animation, `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, 0) scale3d(.001, .001, 1)`)
    animation.dataset.activated = Date.now()

    setTimeout(_ => {
      animation.classList.remove(`${prefixCls}-animation-enter`)
      style(animation, `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, 0)`)
    }, 0)
  },

  hide (el) {
    const waves = el.getElementsByClassName(`${prefixCls}-animation`)

    if (waves.length === 0) return
    const animation = waves[waves.length - 1]
    const diff = Date.now() - Number(animation.dataset.activated)
    let delay = 500 - diff

    delay = delay < 0 ? 0 : delay

    setTimeout(_ => {
      animation.classList.remove(`${prefixCls}-animation-visible`)
      setTimeout(_ => {
        // animation.parentNode.remove()
        removeDom(animation.parentNode)
      }, 300)
    }, delay)
  }
}

const directive = (el, binding, v) => {
  if ('ontouchtart' in window) {
    // el.addEventListener('touchtart', e => waves.show(e, el, binding), false)
    el.addEventListener('touchend', _ => waves.hide(el), false)
    el.addEventListener('touchcancel', _ => waves.hide(el), false)
  }
  // el.addEventListener('mousedown', e => waves.show(e, el, binding), false)
  addHandler(el, 'mousedown', e => waves.show(e, el, binding))
  addHandler(el, 'mouseup', _ => waves.hide(el))
  addHandler(el, 'mouseleave', _ => waves.hide(el),)
  // el.addEventListener('mouseup', _ => waves.hide(el), false)
  // el.addEventListener('mouseleave', _ => waves.hide(el), false)
}

const unbind = (el, binding) => {
  // el.removeEventListener('touchtart', e => waves.show(e, el, binding), false)
  removeHandler(el, 'mousedown', e => waves.show(e, el, binding))
  // el.removeEventListener('mousedown', e => waves.show(e, el, binding), false)
  removeHandler(el, 'touchend', _ => waves.hide(el))
  // el.removeEventListener('touchend', _ => waves.hide(el), false)
  removeHandler(el, 'touchcancel', _ => waves.hide(el))
  // el.removeEventListener('touchcancel', _ => waves.hide(el), false)
  removeHandler(el, 'mouseup', _ => waves.hide(el))
  // el.removeEventListener('mouseup', _ => waves.hide(el), false)
  removeHandler(el, 'mouseleave', _ => waves.hide(el))
  // el.removeEventListener('mouseleave', _ => waves.hide(el), false)
}

export default {
  bind: directive,
  unbind: unbind
}
