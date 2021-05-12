/**
  @author:tanhong28754
  @desc: 修复 hui dropdown transfer 在多层滚动容器下，滚动时位置会脱离 reference
**/
// TODO hui 1.0 其他 dropdown 兼容
import {
  get,
  isFunction,
  isHidden,
  isElement,
  findComponentsDownward,
  findComponentUpward,
  defaults,
  debounce,
} from '@hui/shared-utils'

const defaultOptions = {
  type: 'hide', // hide 模式为滚动隐藏， keep 为更新 dropdown 位置
  rootBoundary: 'self' || document.querySelector('.app-main') || document.body,
  onlyTransfer: true, // 只对 transfer 的 dom 生效
  isFixed: false, // fixed 定位的 dropdown
  disabled: false, // 是否开启transfer-scroll
  dropdownWrapName: [], // dropdown父级组件（过滤不相干的组件）
}

const selectNameList = [
  'Select',
  'SimpleSelect',
  'SelectTable',
  'Tree',
  'TreeNode',
  'virtual-list',
  'SelectTree',
  'SingleSelect',
  'hMultiSelect',
  'Cascader',
]
const dropNameList = ['Drop', 'Dropdown', 'CommonDropdown', 'dropdown']

let scrollHandle = () => {}
let ticking = false

function updateDropdown (dropElement, options) {
  const instance = get(dropElement, '__vue__')
  const referenceInst = findComponentUpward(instance, selectNameList)
  const referenceEle = get(referenceInst, '$el')
  const dropdownPopper = get(instance, '$refs.dropdown') || get(instance, '$refs.drop')
  const scheduleUpdate = get(dropdownPopper, 'popper.scheduleUpdate')
  const instanceUpdate = get(dropdownPopper, 'update')
  const update = instanceUpdate || scheduleUpdate
  const rootElement = get(options.context, '$el') || document.querySelector('.app-main') || document.body
  if (instance && isFunction(update)) {
    update()
  }
  const IntersectionObserver = window.IntersectionObserver || null
  if (!IntersectionObserver) {
    return
  }
  if (referenceEle && IntersectionObserver) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach((entry, index) => {
          const { isIntersecting } = entry
          // isIntersecting 表示 referenceEle 是否出现在了root区域内
          if (!isIntersecting) {
            // blurActiveElement(dropElement)
            fixSelectVisible(dropElement)
            // dom 隐藏后需要清除 observer 监听
            observer.disconnect()
          }
        })
      },
      { root: rootElement },
    )
    observer.observe(referenceEle)
  }
}

const updateDropdownPopper = debounce(
  instance => {
    instance.visible = false
    const dropdownPopper = get(instance, '$refs.dropdown') || get(instance, '$refs.drop')
    const scheduleUpdate = get(dropdownPopper, 'popper.scheduleUpdate')
    const instanceUpdate = get(dropdownPopper, 'update')
    const update = scheduleUpdate || instanceUpdate
    if (instance && isFunction(update)) {
      update()
    }
  },
  600,
  { leading: true, trailing: false },
)

// hui1.0 select 失焦后必须设置 visible = false,不然 click 还是会触发隐藏
function fixSelectVisible (dropElement) {
  const dropInstance = get(dropElement, '__vue__')
  const instance = findComponentUpward(dropInstance, selectNameList)
  const name = get(instance, '$options.name')
  if (instance && selectNameList.includes(name)) {
    // 处理 h-multi-select 组件
    if (name === 'hMultiSelect') {
      instance.isDropdownVisible = false
    }
    // 处理 2.0 Tree 内的 dropdown
    if (name === 'TreeNode') {
      instance.menuVisible = false
    }
    updateDropdownPopper(instance)
  }
}

// 触发 drop 父级dom容器的失焦
function blurActiveElement (dropElement) {
  const dropInstance = get(dropElement, '__vue__')
  const instance = findComponentUpward(dropInstance, selectNameList)
  const referenceEle = get(instance, '$el')
  const activeEle = document.activeElement
  const isChild = referenceEle && activeEle && (referenceEle == activeEle || referenceEle.contains(activeEle))
  if (activeEle && isChild) {
    activeEle.blur()
  }
}

const directives = {
  inserted (el, { value }, vnode) {
    const options = defaults(value, defaultOptions)
    const context = vnode.componentInstance || vnode.context
    /* disabled: 是否开启transfer-scroll */
    if (options.disabled) return
    // 将 context 存入 options
    options.context = context
    const IntersectionObserver = window.IntersectionObserver
    if (!IntersectionObserver) {
      console.warn('[hui warn] v-transfer-scroll 自定义指令在该浏览器下不支持 keep 模式, 自动跳转为 hide 模式!')
      options.type = 'hide'
    }
    scrollHandle = e => {
      const dropdownList = findComponentsDownward(context, dropNameList)
      const dropdownEleList = dropdownList
        .map(item => item.$el)
        .filter(item => {
          if (options.onlyTransfer) {
            return item.dataset.transfer
          }
          return item
        })
      const dropdownShowing = dropdownEleList.find(item => {
        return !isHidden(item, options.isFixed)
      })
      if (!dropdownShowing) {
        return
      }
      // 如果滚动来自 dropdown 不隐藏
      const isScroll = e.type == 'scroll'
      const isNativeNode = isElement(e.target)
      const isSelectChildDom = isNativeNode && (dropdownShowing == e.target || dropdownShowing.contains(e.target))
      const isRoot = e.target == document
      // fix: IE10 需要设置 options
      if (!IntersectionObserver) {
        options.type = 'hide'
      }
      if (isScroll && isSelectChildDom) {
        return
      }
      if (isRoot) {
        return
      }
      if (dropdownShowing && !ticking) {
        window.requestAnimationFrame(function () {
          if (options.type == 'hide') {
            blurActiveElement(dropdownShowing)
            fixSelectVisible(dropdownShowing)
          }
          if (options.type == 'keep') {
            updateDropdown(dropdownShowing, options)
          }
          context.$nextTick(() => {
            ticking = false
          })
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', scrollHandle, true)
    window.addEventListener('resize', scrollHandle, true)
  },
  unbind () {
    window.removeEventListener('scroll', scrollHandle, true)
    window.removeEventListener('resize', scrollHandle, true)
    scrollHandle = null
  },
}

export default directives
