import { get } from '../../utils'
/**
 * 替换 激活页签 删除 tab if else 为责任链
 * 1.责任链节点有返回时忽略后续节点，跳转执行 handle
 * 2.责任链节点无返回时执行下一节点 init current fn
 * 3.责任链最后节点也无结果返回时执行 finally
 */
export class TabChain {
  constructor (vm, fn) {
    const noop = () => {}
    this.name = `${fn.name}-tab-chain-node`
    this.vm = vm
    this.current = fn
    this.next = null
    // 结果操作------------>
    this.handle = noop
    this.finally = noop
  }

  // 设置下一节点
  setNext (nextChainNode) {
    this.next = nextChainNode
    return nextChainNode
  }

  // 初始化执行 this.current
  init (customTab, options) {
    const tab = this.current(customTab, options)
    if (tab === undefined && this.next) {
      return this.next && this.next.init(customTab, options)
    }
    if (tab == undefined && !this.next) {
      return this.finally(customTab, options)
    }
    return this.handle(tab, options)
  }
}

// 激活页签责任链
export class ActiveTabChain extends TabChain {
  constructor (vm, fn) {
    super(vm, fn)
    this.handle = function (tab) {
      this.checkTab(tab)
      return this.activeTab(tab)
    }
    this.finally = function (tab) {
      this.checkTab(tab)
      return this.activeTab(tab)
    }
  }

  // 校验页签
  // TODO change to tabValidate
  checkTab (tab) {
    if (!(typeof tab == 'object' && tab.url && tab.title)) {
      throw new Error('tab must has url and title')
    }
  }

  // 激活页签
  activeTab (customTab) {
    this.vm.onAddCustomTab(customTab)
    this.vm.activeMenuItem = customTab
    this.vm.navigate(customTab)
  }
}

// 删除页签责任链
export class DelTabChain extends TabChain {
  constructor (vm, fn) {
    super(vm, fn)

    this.activeNeighbour = this.activeNeighbour.bind(this.vm)
    this.delTab = this.delTab.bind(this.vm)
    this.handle = function (tab, options) {
      this.checkTab(tab)
      this.activeNeighbour(tab, options)
      this.delTab(tab, options)
    }
  }

  // 校验页签
  // TODO change to tabValidate
  checkTab (tab) {
    if (!(typeof tab == 'object' && tab.uuid)) {
      throw new Error('tab must has uuid')
    }
  }

  activeNeighbour (customTab, options) {
    const { isActiveNeighbour } = options
    const { activeMenuItem } = this
    if (
      get(customTab, 'uuid') &&
      get(activeMenuItem, 'uuid') !== get(customTab, 'uuid')
    ) {
      return
    }
    if (!isActiveNeighbour) return
    const index = this.tabList.findIndex(
      (item) => get(item, 'uuid') === get(activeMenuItem, 'uuid')
    )
    if (index < 0) return
    const beforeTab = get(this.tabList, index - 1)
    const afterTab = get(this.tabList, index + 1)
    const hasNeighbour = beforeTab || afterTab
    if (hasNeighbour) {
      this.onActiveCustomTab(hasNeighbour)
    }
  }

  // 删除页签
  delTab (tab, options) {
    this.tabList = this.tabList.filter((item) => item.uuid !== tab.uuid)
  }
}
