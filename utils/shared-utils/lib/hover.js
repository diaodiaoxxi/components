import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'
import defaults from 'lodash/defaults'
import extend from 'lodash/extend'
import uniqueId from 'lodash/uniqueId'
import { isElement } from './dom'

const noop = () => {}
const store = {
  timeoutId: null,
  curDelayHover: null, // 当前激活的菜单
  hoverInstMap: {}, // hover 实例map
  delay: null, // 是否有延迟
  delayFinalEnter: {
    // 最后进入的菜单
    hover: null,
    enterFn: noop,
  },
  delayHoverInstMap: {}, // 延迟菜单map
  mouseLocs: [], // 全局鼠标指针位置
}
const console = {
  log: noop,
  table: noop,
  group: noop,
  groupEnd: noop,
}

function mouseMoveDocument (e) {
  store.mouseLocs.push({ x: e.pageX, y: e.pageY })
  if (store.mouseLocs.length > 3) {
    store.mouseLocs.shift()
  }
  // console.log(this.mouseLocs[this.mouseLocs.length -1 ])
}

// function mouseLeaveDocument(e) {
//   e = e ? e : window.event
//   var from = e.relatedTarget || e.toElement
//   if (!from || from.nodeName == 'HTML') {
//     console.log('已经离开屏幕')
//   }
// }

document.addEventListener('mousemove', mouseMoveDocument, false)
// document.body.addEventListener('mouseout', mouseLeaveDocument, false)

export default class Hover {
  constructor (options) {
    const defaultOptions = {
      popperRef: Element,
      popperWrap: Element,
      popperRefOther: Element,
      hoverType: null,
      tolerance: 150, // 延时三角容忍边距
      period: 300, // 延时三角区域检查周期
      rectTolerance: 0,
      handleBeforeEnter: noop,
      handleEnter: noop,
      handleLeave: noop,
      handleEnterRef: noop,
      handleLeaveRef: noop,
      handleEnterWrap: noop,
      handleLeaveWrap: noop,
    }
    this.options = defaults(options, defaultOptions)
    extend(this, this.options)
    // TODO Ref 校验
    // other
    this.uuid = uniqueId()
    this.show = false
    this.mouseLocs = store.mouseLocs // 鼠标位置存储栈
    this.lastDelayLoc = null // 存储最近有延时的坐标
    this.leaveTimeoutId = null // 离开定时器
    this.leaveSleep = 50
    this.mouseenterRef = this.mouseenterRef.bind(this)
    this.mouseleaveRef = this.mouseleaveRef.bind(this)
    this.mouseenterWrap = this.mouseenterWrap.bind(this)
    this.mouseleaveWrap = this.mouseleaveWrap.bind(this)
    this.possiblyActivate = this.possiblyActivate.bind(this)
    // 如果是延时三角类型的左侧菜
    if (this.hoverType == 'delay') {
      this.isDelayItem = true
      store.delayHoverInstMap[this.uuid] = this
    }
    store.hoverInstMap[this.uuid] = this
  }

  init () {
    this.popperRef.addEventListener('mouseenter', this.mouseenterRef, false)
    this.popperRef.addEventListener('mouseleave', this.mouseleaveRef, false)
    this.popperWrap.addEventListener('mouseenter', this.mouseenterWrap, false)
    this.popperWrap.addEventListener('mouseleave', this.mouseleaveWrap, false)
  }

  destroy () {
    this.popperRef.removeEventListener('mouseenter', this.mouseenterRef, false)
    this.popperRef.removeEventListener('mouseleave', this.mouseleaveRef, false)
    this.popperWrap.removeEventListener('mouseenter', this.mouseenterWrap, false)
    this.popperWrap.removeEventListener('mouseleave', this.mouseleaveWrap, false)
    omit(store.hoverInstMap, [this.uuid])
    omit(store.delayHoverInstMap, [this.uuid])
    if (isEmpty(store.hoverInstMap)) {
      document.removeEventListener('mousemove', mouseMoveDocument, false)
      // document.body.removeEventListener('mouseout', mouseLeaveDocument, false)
    }
  }

  // 鼠标移入容器触发
  mouseenterRef (e) {
    console.group('hover', 'enter ref')
    if (this.leaveTimeoutId) {
      console.log('进入 ref 清除定时器')
      clearTimeout(this.leaveTimeoutId)
    }
    if (this.isDelayItem) {
      console.log('当前激活的延迟菜单', store.curDelayHover, this)
      console.log(
        '当前激活的延迟菜单',
        store?.curDelayHover?.popperRef?.innerText,
        this.popperRef.innerText,
      )
      console.log('current timeout', store.timeoutId)
      if (store.curDelayHover && store.curDelayHover !== this) {
        store.delayFinalEnter.hover = this
        store.delayFinalEnter.enterFn = () => {
          store.curDelayHover = this
          this.show = true
          this.handleEnter(this)
          this.handleBeforeEnter(this)
        }
        console.log('prevent enter fn', 'delay:', store.delay)
        console.groupEnd()
        return
      }
      store.curDelayHover = this
      this.show = true
      this.handleEnter(this)
      this.handleBeforeEnter(this)
      console.groupEnd()
      return
    }

    console.log('进入 ref', this.popperRef.innerText)
    console.log('触发 enter', this.handleEnter)
    this.show = true
    this.handleEnter(this)
    this.handleBeforeEnter(this)
    console.groupEnd()
  }

  // 鼠标离开容器触发
  mouseleaveRef (event) {
    if (this.isDelayItem) {
      if (!store.curDelayHover || store.curDelayHover !== this) {
        console.log(
          '当前激活的菜单',
          'uuid',
          store.curDelayHover?.uuid,
          store.curDelayHover?.popperRef?.innerText,
        )
        console.log('非当前延迟菜单', 'uuid', this.uuid, this?.popperRef?.innerText)
        store.delayFinalEnter = { hover: null, enterFn: noop }
        return
      }
      console.log('触发延时判断')
      if (store.timeoutId) {
        clearTimeout(store.timeoutId)
      }
      // ('是否移出屏幕外',isOutBrowerScreen)
      const from = event.relatedTarget || event.toElement
      const isOutBrowerScreen = !from || from.nodeName == 'HTML'
      if (isOutBrowerScreen) {
        this.handleLeave(this)
      }
      this.possiblyActivate().then(() => {
        this.activeLeave(event, {
          hoverTarget: 'ref',
        })
        if (
          store.delayFinalEnter.hover &&
          store.delayFinalEnter.hover !== this &&
          this.isInHoverRect(store.delayFinalEnter.hover)
        ) {
          console.log('激活了延时过程中最后激活的 hover', store.delayFinalEnter)
          store.delayFinalEnter.enterFn()
        }
      })
      return
    }
    // 清除定时器
    if (this.leaveTimeoutId) {
      clearTimeout(this.leaveTimeoutId)
    }
    this.leaveTimeoutId = setTimeout(() => {
      this.activeLeave(event, {
        hoverTarget: 'ref',
      })
    }, this.leaveSleep)
  }

  mouseenterWrap (e) {
    this.handleEnterWrap(e)
  }

  mouseleaveWrap (event) {
    // 清除定时器
    if (this.leaveTimeoutId) {
      clearTimeout(this.leaveTimeoutId)
    }
    this.leaveTimeoutId = setTimeout(() => {
      this.activeLeave(event, {
        hoverTarget: 'wrap',
      })
    }, this.leaveSleep)
  }

  activeLeave (event, info) {
    // FIXME 360浏览器，chrome 78 及以下 mouseleave 离开浏览器判断存在问题
    const currentCur = this.mouseLocs[this.mouseLocs.length - 1]
    const x = currentCur.x || 0
    const y = currentCur.y || 0
    const isInRect = [this.popperRef, this.popperWrap]
      .concat(this.popperRefOther)
      .filter(element => isElement(element))
      .some(element => this.isInElementRect(x, y, element))

    console.group('hover', 'active leave')
    console.log('当前鼠标坐标', { x, y })
    console.log('是否在范围内', isInRect)
    console.log('当前激活的延迟菜单', store.curDelayHover)
    console.log('当前激活的延迟菜单', store?.curDelayHover?.popperRef?.innerText)

    // 清除记录的 delay hover
    if (store.curDelayHover === this) {
      store.curDelayHover = null
      clearTimeout(store.timeoutId)
      console.log('清空 current', store.curDelayHover, store.timeoutId, isInRect)
    }
    // const check = (element) => this.checkRelatedTarget.bind(this, e, element)
    // const isEqualRelatedTarget = [this.popperRef, this.popperWrap].some(check)
    // 单击,双击 莫名会触发 mouseleave, e.relatedTarget == null,利用鼠标指针坐标来判断是否在范围内
    // https://stackoverflow.com/questions/45266854/mouseleave-triggered-by-click
    console.log('鼠标移出', event, info.hoverTarget)
    const from = event.relatedTarget || event.toElement
    const isOutBrowerScreen = !from || from.nodeName == 'HTML'
    console.log('是否移出屏幕外', isOutBrowerScreen)
    if (isOutBrowerScreen) {
      this.show = false
      this.handleLeave(this)
    }
    if (!isInRect) {
      this.show = false
      this.handleLeave(this)
      console.log('触发了离开', this.handleLeave)
    }
    console.groupEnd()
  }

  // 是否在 hover 的相关dom
  isInHoverRect (hoverInst) {
    const currentCur = hoverInst.mouseLocs[hoverInst.mouseLocs.length - 1]
    const x = currentCur.x || 0
    const y = currentCur.y || 0
    const isInRect = [hoverInst.popperRef, hoverInst.popperWrap]
      .concat(hoverInst.popperRefOther)
      .filter(element => isElement(element))
      .some(element => hoverInst.isInElementRect(x, y, element))
    console.log('鼠标是否还在 delayFinalEnter hover 相关元素内', isInRect)
    return isInRect
  }

  // 是否在元素范围内
  isInElementRect (x, y, element) {
    const rect = element.getBoundingClientRect()
    const xIsWithin = x > rect.left + this.rectTolerance && x < rect.right + this.rectTolerance
    const yIsWithin = y > rect.top + this.rectTolerance && y < rect.bottom + this.rectTolerance
    return xIsWithin && yIsWithin
  }

  checkRelatedTarget (event, element) {
    return element == event.relatedTarget || element.contains(event.relatedTarget)
  }

  // 是否在延时三角区域内
  possiblyActivate (cb) {
    store.delay = this.activationDelay()
    const delay = store.delay
    console.log('是否在延时区域', delay)
    // 有延时情况时，将匿名函数加入到执行队列，延迟delay毫秒后执行。
    // 而在匿名函数中调用possiblyActivate，会每隔一段时间调用一次，直到不延时
    if (delay) {
      return new Promise(resolve => {
        store.timeoutId = setTimeout(() => {
          resolve()
        }, delay)
      }).then(() => {
        return this.possiblyActivate()
      })
    }
    return new Promise(resolve => {
      store.timeoutId = setTimeout(() => {
        resolve()
      }, this.leaveSleep)
    })
  }

  // 是否在延时三角区域内,
  activationDelay () {
    console.group('in delay function judge')
    const curDelayHover = store.curDelayHover
    if (!curDelayHover) {
      return
    }
    // 当前没有被激活的行时，直接执行
    const popperElement = curDelayHover.popperWrap
    const offsetLeft = this.getElementViewLeft(popperElement)
    const offsetTop = this.getElementViewTop(popperElement)
    console.log(this.options.tolerance)
    const upperLeft = {
      x: offsetLeft,
      y: offsetTop - this.options.tolerance,
    }
    // const upperRight = {
    //   x: offsetLeft + popperElement.offsetWidth,
    //   y: upperLeft.y,
    // }
    const lowerLeft = {
      x: offsetLeft,
      y: offsetTop + popperElement.offsetHeight + this.options.tolerance,
    }
    // const lowerRight = {
    //   x: offsetLeft + popperElement.offsetWidth,
    //   y: lowerLeft.y,
    // }
    const currLoc = this.mouseLocs[this.mouseLocs.length - 1] // 当前坐标
    let prevLoc = this.mouseLocs[0] // 前一个坐标

    if (!currLoc) {
      console.log('当前鼠标坐标为空')
      console.groupEnd()
      return 0
    }

    if (!prevLoc) {
      prevLoc = currLoc
    }

    // 鼠标在一级菜单相邻行缓慢切换时或停留不动
    if (this.lastDelayLoc && currLoc.x == this.lastDelayLoc.x && currLoc.y == this.lastDelayLoc.y) {
      console.log('鼠标没动', this.uuid)
      console.groupEnd()
      return 0
    }

    console.table({
      upperLeft,
      lowerLeft,
    })
    const decreasingCorner = upperLeft // 左上角
    const increasingCorner = lowerLeft // 左下角

    const decreasingSlope = this.slope(currLoc, decreasingCorner)
    const increasingSlope = this.slope(currLoc, increasingCorner)
    const prevDecreasingSlope = this.slope(prevLoc, decreasingCorner)
    const prevIncreasingSlope = this.slope(prevLoc, increasingCorner)
    if (decreasingSlope < prevDecreasingSlope && increasingSlope > prevIncreasingSlope) {
      this.lastDelayLoc = currLoc // 记录延迟坐标
      console.log(
        'isInDelayTriangle',
        decreasingSlope < prevDecreasingSlope && increasingSlope > prevIncreasingSlope,
      )
      console.table({
        decreasingSlope,
        increasingSlope,
        prevDecreasingSlope,
        prevIncreasingSlope,
      })
      console.groupEnd()
      return this.period // 返回延迟毫秒数
    }
    console.table({
      decreasingSlope,
      increasingSlope,
      prevDecreasingSlope,
      prevIncreasingSlope,
    })
    console.log('夹角过大')
    console.groupEnd()
    this.lastDelayLoc = null
    return 0
  }

  // tan 正切
  slope (a, b) {
    return (b.y - a.y) / (b.x - a.x)
  }

  // 获取元素相对左坐标
  getElementViewLeft (element) {
    let actualLeft = element.offsetLeft
    let current = element.offsetParent
    let elementScrollLeft = 0
    while (current !== null) {
      actualLeft += current.offsetLeft
      current = current.offsetParent
    }
    if (document.compatMode == 'BackCompat') {
      elementScrollLeft = document.body.scrollLeft
    } else {
      elementScrollLeft = document.documentElement.scrollLeft
    }
    return actualLeft - elementScrollLeft
  }

  // 获取元素相对上坐标
  getElementViewTop (element) {
    let actualTop = element.offsetTop
    let current = element.offsetParent
    let elementScrollTop = 0
    while (current !== null) {
      actualTop += current.offsetTop
      current = current.offsetParent
    }
    if (document.compatMode == 'BackCompat') {
      elementScrollTop = document.body.scrollTop
    } else {
      elementScrollTop = document.documentElement.scrollTop
    }
    return actualTop - elementScrollTop
  }
}
