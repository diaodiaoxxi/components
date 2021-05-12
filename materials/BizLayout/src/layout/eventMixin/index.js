import { onMicroApp, triggerMicroApp } from 'hui-core'
import { get, defaults, isEmpty, cloneDeep, kebabCase, firstUpperCase } from '../../utils'
// import { validateTabInfo } from './tabValidate'
import { ActiveTabChain, DelTabChain } from './tabChain'
let customEvent = null

// const triggerMicroApp = {
//  triggerMicroApp('frame-change-skin', { skin } )
//  triggerMicroApp('frame-change-collapse', { collapse } )
//  triggerMicroApp('frame-change-locale', { locale })
//  triggerMicroApp('frame-logout')
//  triggerMicroApp('frame-tab-close', { closeTabInfo, activeTabInfo, tabList, }
//  triggerMicroApp('frame-tab-close-other', { removedTabList })
//  triggerMicroApp('frame-tab-close-all', { removedTabList })
//  triggerMicroApp('tab-out-of-range', cEvent)
// }

export default {
  methods: {
    // tab 事件默认 options
    defaultTabOptions (customTab, options) {
      const defaultOptions = {
        uuidKey: get(customTab, 'uuid') ? 'uuid' : 'url',
        deleteTabByUrl: false, // 通过url关闭页签
        isActiveNeighbour: true, // 关闭页签时是否激活临近页签
        isCanDelPin: false, // 如果为固定页签，是否可通过del-custom-tab事件删除
        autoAddToTabList: true,
      }
      return defaults(options, defaultOptions)
    },
    // 添加自定义标签页
    onAddCustomTab (customTab, options) {
      // 避免 uuid 为空
      const tabUuid = get(customTab, 'uuid')
      if (!tabUuid) {
        customTab.uuid = this.$hCore.utils.uuid()
      }
      // 检查是否已存在页签
      const isTabExist = this.tabList.find(item => {
        if (tabUuid) {
          return item.uuid === customTab.uuid
        }
        return item.url == customTab.url
      })
      if (!isTabExist && get(customTab, 'uuid')) {
        // feat: 添加 tab 最大数量
        if (+this.tabMaxNum && this.tabList.length >= +this.tabMaxNum) {
          this.onTabOutOfRange({
            tab: customTab,
            tabList: cloneDeep(this.tabList),
            tabMaxNum: +this.tabMaxNum,
          })
          return
        }
        this.tabList = this.tabList.concat(customTab)
      }
    },
    // 删除特定的标签页
    // options.isActiveNeighbour:如果删除的是激活的标签，是否激活临近标签
    onDelCustomTab (customTab, options) {
      options = this.defaultTabOptions(customTab, options)

      // 不传customTab时，删除当前激活
      const delCurrentTab = function (customTab, options) {
        if (customTab) {
          return
        }

        // 默认不可删除固定页签
        if (
          typeof this.vm.activeMenuItem.closable == 'boolean' &&
          !this.vm.activeMenuItem.closable &&
          !options.isCanDelPin
        ) {
          return
        }

        if (this.vm.activeMenuItem) {
          return cloneDeep(this.vm.activeMenuItem)
        }
      }

      // 传customTab时，根据 customTab 删除
      const delCustomTab = function (customTab, options) {
        return this.vm.tabList.find(item => {
          return get(item, options.uuidKey) == get(customTab, options.uuidKey)
        })
      }

      const delCurrentChainNode = new DelTabChain(this, delCurrentTab)
      const delCustomChainNode = new DelTabChain(this, delCustomTab)

      delCurrentChainNode.setNext(delCustomChainNode)
      delCurrentChainNode.init(customTab, options)
    },

    // 激活自定义标签
    onActiveCustomTab (customTab, options = {}) {
      // 从 tabList 查找
      const findTabFromTabList = function (customTab, options) {
        // 避免 uuid 为空
        const tabUuid = get(customTab, 'uuid')
        if (!tabUuid) {
          customTab.uuid = this.vm.$hCore.utils.uuid()
        }
        // 检查是否已存在页签
        // TODO url 相同，有些子系统也需要新开页签，添加第二参数区分判断
        const existTab = this.vm.tabList.find(item => {
          if (tabUuid) {
            return item.uuid === customTab.uuid
          }
          return item.url == customTab.url
        })
        if (existTab) {
          return Object.assign(existTab, customTab)
        }
      }

      // 从菜单项查找 tab
      const findTabFromMenuItem = function (customTab, options) {
        const tabUrl = get(customTab, 'url')
        const checkMenu = true
        const isMenuItem = checkMenu && tabUrl
        if (!isMenuItem) {
          return
        }
        // TODO 替换为 layout 内部方法
        const menuItemKey = Object.keys(this.vm.$refs.layout.menuItemMap).find(key => {
          const item = this.vm.$refs.layout.menuItemMap[key]
          const itemUrl = get(item, 'url')
          return itemUrl === tabUrl
        })
        const menuItem = cloneDeep(this.vm.$refs.layout.menuItemMap[menuItemKey])
        // menuItem 为空时，不合并 customTab 参数
        return menuItem && Object.assign(menuItem, customTab)
      }

      // tabList 不存在时是否新增到 tabList
      const addTabToTabList = function (customTab, option) {
        const tabUuid = get(customTab, 'uuid')
        const uuid = this.vm.$hCore.utils.uuid()
        if (tabUuid) {
          this.vm.onAddCustomTab(customTab)
          return customTab
        }
        // 自定义tab 未传 systemName与systemUuid 时保留当前激活系统
        // const lastActiveMenuItem = this.vm.activeMenuItem
        if (!customTab.systemUuid && !customTab.systemName) {
          customTab.systemUuid =
            get(this.vm.activeMenuItem, 'systemUuid') ||
            get(this.vm, '$refs.layout.activeSystemInfo.uuid')
          customTab.systemName =
            get(this.vm.activeMenuItem, 'systemUuid') ||
            get(this.vm, '$refs.layout.activeSystemInfo.title')
        }
        customTab.uuid = uuid
        this.vm.onAddCustomTab(customTab)
        return customTab
      }

      // 激活 tab 页签责任链
      const chainNodeTab = new ActiveTabChain(this, findTabFromTabList)
      const chainNodeMenu = new ActiveTabChain(this, findTabFromMenuItem)
      const chainNodeNew = new ActiveTabChain(this, addTabToTabList)
      chainNodeTab.setNext(chainNodeMenu).setNext(chainNodeNew)
      chainNodeTab.init(customTab, options)
    },
    // 标签栏关闭
    onTabClose (closeTabInfo, activeTabInfo, tabList) {
      triggerMicroApp('frame-tab-close', {
        closeTabInfo,
        activeTabInfo,
        tabList,
      })
      if (activeTabInfo) {
        return this.navigate(activeTabInfo)
      }
      // 跳转到默认的首页
      this.goHomePage()
    },
    // 标签栏关闭其他
    onTabCloseOther (removedTabList, { current }) {
      this.navigate(current)
      triggerMicroApp('frame-tab-close-other', { removedTabList })
    },
    // 标签栏关闭所有
    // TODO 判断是否有首页页签
    onTabCloseAll (removedTabList) {
      this.$nextTick()
        .then(() => {
          if (isEmpty(this.tabList)) {
            return
          }
          const lastTab = this.tabList[this.tabList.length - 1]
          this.activeMenuItem = lastTab
        })
        .then(() => {
          triggerMicroApp('frame-tab-close-all', { removedTabList })
          this.goHomePage()
        })
    },
    // 手动触发锁屏
    onLockScreen () {
      const lockScreenInst = this.$refs.lockScreen
      if (!lockScreenInst) {
        console.warn('[hui warn][h-frame-layout]', '请先开启锁屏组件！')
        return
      }
      clearTimeout(this.$refs.lockScreen.timer)
      this.$refs.lockScreen.lockScreen()
    },
    // 设置 tabMaxNum 后触发事件
    onTabOutOfRange (cEvent) {
      if (process.env.NODE_ENV == 'development') {
        console.warn('[hui-warn]', '已超出tabList数量限制', cEvent)
      }
      this.$emit('tab-out-of-range', cEvent)
      triggerMicroApp('tab-out-of-range', cEvent)
    },
    async goHomePage () {
      this.navigate(this.homeUrl)
      await this.$nextTick()
      if (this.tabList.length == 0 && this.pinHomeTab) {
        this.activeMenuItemFromRoute(this.$route, 'after clear tabList')
      }
    },
  },
  mounted () {
    // fix webpack 更新时注销事件
    if (customEvent) {
      customEvent.off()
    }
    const CustomEvent = function (layoutInst) {
      this.eventMap = ['addCustomTab', 'delCustomTab', 'activeCustomTab', 'logout', 'lockScreen']
      this.layoutInst = layoutInst
      this.$hCore = layoutInst.$hCore
      return this
    }

    const eventMethod = {
      on: function () {
        this.eventMap.map(eventName => {
          const eventHandleName = 'on' + firstUpperCase(eventName)
          const kebabEventName = kebabCase(eventName)
          this.$hCore.on(kebabEventName, this.layoutInst[eventHandleName])
          onMicroApp(kebabEventName, this.layoutInst[eventHandleName])
        })
        return this
      },
      off: function () {
        this.eventMap.map(eventName => {
          // const eventHandleName = 'on' + firstUpperCase(eventName)
          const kebabEventName = kebabCase(eventName)
          this.$hCore.off(kebabEventName)
        })
        return this
      },
    }

    CustomEvent.prototype = Object.create(eventMethod)
    CustomEvent.prototype.constructor = CustomEvent

    customEvent = new CustomEvent(this).on()
  },
  beforeDestroy () {
    if (customEvent && customEvent.layoutInst) {
      customEvent.off()
    }
  },
}
