import Vue from 'vue'
const isServer = Vue.prototype.$isServer
export function getOffsetTop (element, container) {
  if (!element) {
    return 0
  }

  if (!element.getClientRects().length) {
    return 0
  }

  const rect = element.getBoundingClientRect()

  if (rect.width || rect.height) {
    if (container === window) {
      container = element.ownerDocument.documentElement
      return rect.top - container.clientTop
    }
    return rect.top - container.getBoundingClientRect().top
  }

  return rect.top
}

export function getScroll (target, top) {
  if (typeof window === 'undefined') {
    return 0
  }

  const prop = top ? 'pageYOffset' : 'pageXOffset'
  const method = top ? 'scrollTop' : 'scrollLeft'
  const isWindow = target === window

  let ret = isWindow ? target[prop] : target[method]
  // ie6,7,8 standard mode
  if (isWindow && typeof ret !== 'number') {
    ret = window.document.documentElement[method]
  }

  return ret
}

export function getOffset (element) {
  const rect = element.getBoundingClientRect() // 获取 element的 top bottom left right

  const scrollTop = getScroll(window, true) // window.pageYOffset（ 滚动条距离顶部的偏移量 ）
  const scrollLeft = getScroll(window) // window.pageXOffset

  const docEl = window.document.body
  const clientTop = docEl.clientTop || 0
  const clientLeft = docEl.clientLeft || 0

  return {
    top: rect.top + scrollTop - clientTop,
    left: rect.left + scrollLeft - clientLeft,
  }
}

export function easeInOutCubic (t, b, c, d) {
  const cc = c - b
  t /= d / 2
  if (t < 1) {
    return (cc / 2) * t * t * t + b
  }
  return (cc / 2) * ((t -= 2) * t * t + 2) + b
}

export function scrollTo (y, options = {}) {
  // https://github.com/chrisdickinson/raf
  const raf = window.requestAnimationFrame
  const { getContainer = () => window, callback, duration = 450 } = options

  const container = getContainer()
  const scrollTop = getScroll(container, true)
  const startTime = Date.now()

  const frameFunc = () => {
    const timestamp = Date.now()
    const time = timestamp - startTime
    const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration)
    if (container === window) {
      window.scrollTo(window.pageXOffset, nextScrollTop)
    } else {
      container.scrollTop = nextScrollTop
    }
    if (time < duration) {
      raf(frameFunc)
    } else if (typeof callback === 'function') {
      callback()
    }
  }
  raf(frameFunc)
}

// For Modal scrollBar hidden
// 获取滚动条宽度
let cached
export function getScrollBarSize (fresh) {
  if (isServer) return 0
  if (fresh || cached === undefined) {
    const inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.height = '200px'

    const outer = document.createElement('div')
    const outerStyle = outer.style

    outerStyle.position = 'absolute'
    outerStyle.top = 0
    outerStyle.left = 0
    outerStyle.pointerEvents = 'none'
    outerStyle.visibility = 'hidden'
    outerStyle.width = '200px'
    outerStyle.height = '150px'
    outerStyle.overflow = 'hidden'

    outer.appendChild(inner)

    document.body.appendChild(outer)

    const widthContained = inner.offsetWidth
    outer.style.overflow = 'scroll'
    let widthScroll = inner.offsetWidth

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth
    }

    document.body.removeChild(outer)

    cached = widthContained - widthScroll
  }
  return cached
}
export const getScrollbarWidth = getScrollBarSize

// scrollTop animation
export function scrollTop (el, from = 0, to, duration = 500, endCallback) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil((difference / duration) * 50)

  function scroll (start, end, step) {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = start + step > end ? end : start + step
    if (start > end) {
      d = start - step < end ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

// 滚动动画模拟
let timer
export function scrollAnimate (element, curTop, newTop) {
  const status = curTop < newTop
  const offset = Math.abs(Number(curTop - newTop))
  const ins = 500 / offset > 1 ? 1 : 500 / offset
  clearInterval(timer)
  timer = setInterval(() => {
    curTop = status ? curTop + 1 : curTop - 1
    element.scrollTop = curTop
    if (curTop == newTop) {
      clearInterval(timer)
    }
  }, ins)
}

/**
 * 获取滚动后 可见内容剩余高度
 * @param {*} element
 * @param {*} barWidth 是否去除滚动条宽度
 */
export function getContentHeightScrolled (element, barWidth = 0) {
  const width = element.getBoundingClientRect().width
  const height = element.getBoundingClientRect().height
  const conentWidth = element.scrollWidth
  const conentHeight = element.scrollHeight
  const top = element.scrollTop
  const sheight = conentWidth + barWidth > width ? height - barWidth : height
  return conentHeight - top - sheight
}

/**
 * 获取水平滚动后 可见内容剩余宽度
 * @param {*} element
 * @param {*} barWidth 是否去除滚动条宽度
 */
export function getContentWidthScrolled (element, barWidth = 0) {
  const width = element.getBoundingClientRect().width
  const height = element.getBoundingClientRect().height
  const conentWidth = element.scrollWidth
  const conentHeight = element.scrollHeight
  const left = element.scrollLeft
  const swidth = conentHeight + barWidth > height ? width - barWidth : width
  let toBottom = conentWidth - left - swidth
  if (toBottom < 1) toBottom = 0
  return toBottom
}
