<template>
  <div class="h-layout" :theme="store.skin" :data-hui-layout="layoutType">
    <!-- 页面顶部 -->
    <slot name="head">
      <LayoutHead
        ref="layoutHead"
        v-bind="layoutHeadProps"
        :appSystemList="store.appSystemList"
        :activeSystem.sync="activeSystem"
      >
        <template slot="left">
          <slot name="layoutHeadLeft"></slot>
        </template>

        <template slot="center">
          <slot name="layoutHeadCenter"></slot>
        </template>

        <template slot="right">
          <slot name="layoutHeadRight"></slot>
        </template>

        <template slot="ctrl">
          <slot name="layoutHeadCtrl"></slot>
        </template>

        <template slot="prefixMenu">
          <slot name="layoutHeadPrefixMenu"></slot>
        </template>

        <template slot="menu">
          <slot name="layoutHeadMenu"></slot>
        </template>
      </LayoutHead>
    </slot>

    <!-- 页面主体 -->
    <slot name="body">
      <LayoutBody>
        <!-- 侧边栏 -->
        <template slot="sidebar">
          <slot name="sidebar">
            <LayoutSidebar
              slot="sidebar"
              :defaultActive="store.activeMenuItem"
              :value="sidebarMenuList"
              :defaultFullMenuTab="activeFullMenuTab"
              :fullMenuTabs="fullMenuTabs"
              :fullMenuData="fullMenuData"
              :fullMenuFavourItemList="store.fullMenuFavourItemList"
              :cookMenuHorizontal="cookMenuHorizontal"
            ></LayoutSidebar>
          </slot>
        </template>

        <!-- 页面标签栏 -->
        <slot name="navbar">
          <LayoutNavbar
            v-model="store.tabList"
            v-on="$listeners"
            :defaultTab.sync="store.activeMenuItem"
          >
            <!-- TODO 过滤_uuid,_page 等组件内部属性 -->
            <template slot="contextmenuItem" slot-scope="{ tabInfo }">
              <slot name="layoutNavbarContextmenuItem" :tabInfo="tabInfo"></slot>
            </template>
          </LayoutNavbar>
        </slot>

        <!-- 页面内容 -->
        <slot name="content">
          <LayoutContent slot="content">
            <template slot="default">
              <slot></slot>
            </template>
          </LayoutContent>
        </slot>
      </LayoutBody>
    </slot>
  </div>
</template>
<script>
import PropTypes from '@hui/shared-utils/vue-types'
import { props as LayoutHeadProps } from '../components/Topbar'
import i18n from '../locales'
import {
  isString,
  isEmpty,
  get,
  // values,
  pick,
  omit,
  mapTree,
  filterPrivate,
  cloneDeep,
} from '@hui/shared-utils'

const props = Object.assign(
  {
    layoutType: PropTypes.string.def('hui-frame-layout'),
    sidebarType: PropTypes.oneOf(['cookMenu', 'drawerMenu', 'fullMenu']).def('cookMenu'),
    sidebarTypeCache: PropTypes.oneOf(['cookMenu', 'drawerMenu', 'fullMenu']).def('cookMenu'),
    sidebarCollapse: PropTypes.bool.def(false),
    activeMenuItem: PropTypes.object.def({}),
    tabList: PropTypes.array.def([]),
    tabMaxNum: PropTypes.sNumber.def(0),
    skin: PropTypes.oneOf(['blue', 'dark']).def('blue'),
    /* sidebar---------------------------- */
    fullMenuFavourItemList: PropTypes.any.def([]),
    fullMenuIconPosition: PropTypes.oneOf(['in-sys', 'in-ctrl']).def('in-sys'),
    cookMenuHorizontal: PropTypes.bool.def(false),
  },
  // topbar defaultSystem,searchItemList 放在 layout 内部处理
  omit(LayoutHeadProps, ['activeSystem', 'fullMenuFavourItemList']),
)

export default {
  name: 'Layout',
  provide () {
    return {
      layout: this,
      searchItemList: this.searchItemList,
      setCollapse: this.setCollapse,
    }
  },
  inheritAttrs: false,
  props,
  data () {
    return {
      /* 子孙组件通信状态 store ------------- */
      store: {
        skin: this.skin,
        sidebarType: 'cookMenu',
        sidebarTypeCache: 'cookMenu', // 缓存 topbar 菜单类型,切回普通菜单还原类型
        appSystemList: [],
        fullMenuFavourItemList: [],
        /* navbar---------------------------- */
        tabList: this.tabList, // 页签集合
        activeMenuItem: this.activeMenuItem, // 处于激活状态的页签信息
      },

      isCollapse: this.sidebarCollapse,
      isShowNoticeBar: false,
      hasWorkTable: false, // 是否有工作台

      instMap: {}, // 待操作子孙组件 vue component 实例
      menuItemMap: {}, // 系统菜单表

      /* topbar---------------------------- */
      activeSystem: null, // 激活的子系统
      // searchMenuItemList: [],

      /* sidebar---------------------------- */
      activeFullMenuTab: '全部',
      fullMenuTabs: [],
      fullMenuData: [],
    }
  },
  computed: {
    // 侧栏菜单集合
    sidebarMenuList () {
      // 从 menuItemMap 与 this.store.appSystemList 统一获取
      if (this.activeSystem && this.activeSystem.children) {
        const activeSystemUuid = get(this.activeSystem, 'uuid')
        return get(this.menuItemMap, [activeSystemUuid, 'children']) || []
      }
      return []
    },

    layoutHeadProps () {
      return pick(this.$props, Object.keys(LayoutHeadProps))
    },
  },
  watch: {
    appSystemList: {
      immediate: true,
      handler (appSystemList) {
        this.initFullMenu(appSystemList)
        this.setDefaultActiveSystem(appSystemList)
      },
    },

    sidebarType: {
      immediate: true,
      handler (type) {
        this.store.sidebarType = type
      },
    },

    sidebarTypeCache: {
      immediate: true,
      handler (type) {
        this.store.sidebarTypeCache = type
      },
    },

    fullMenuFavourItemList: {
      immediate: true,
      handler (list) {
        this.store.fullMenuFavourItemList = list
        this.refreshSidebar('fullMenuFavourItemList change')
      },
    },

    sidebarCollapse (collapse) {
      this.isCollapse = collapse
    },

    isCollapse (bool) {
      this.$emit('update:sidebarCollapse', bool)
    },

    tabList (val) {
      this.store.tabList = val
    },

    activeMenuItem (val) {
      this.store.activeMenuItem = val
    },

    skin (name) {
      this.store.skin = name
    },

    'store.tabList' (list) {
      this.$emit('update:tabList', list)
    },

    'store.activeMenuItem': {
      immediate: true,
      handler (info) {
        this.$emit('update:activeMenuItem', info)
        if (isEmpty(this.appSystemList)) {
          return
        }
        this.refreshSidebar('store.activeMenuItem change')
      },
    },

    'store.skin': {
      immediate: true,
      handler (val) {
        document.body.dataset.huiLayoutTheme = val
      },
    },
  },
  methods: {
    /* -common------------------ */
    // 初始化全部菜单栏数据
    initFullMenu (appSystemList) {
      this.menuItemMap = {}
      this.store.appSystemList = this.appSystemList
      // 全部菜单数据处理
      for (const system of this.store.appSystemList) {
        // fullMenu.children = fullMenu.children.concat(children)
        const { children, title, uuid } = system
        this.menuItemMap[uuid] = system
        if (!Array.isArray(children)) {
          continue
        }
        mapTree(children, (item, path) => {
          item.systemName = title
          item.systemUuid = uuid
          const result = path.match(/children/g)
          const level = !result ? 0 : result.length
          if (level == 0) {
            item.favourItemList = item.favourItemList || []
          }
          if (level > 0) {
            const rootPath = get(path.split('.'), '0')
            const cookSubmenu = get(children, rootPath)
            item._systemMenuPath = path
            item._cookSubmenuUuid = cookSubmenu.uuid
            item._path = path
          }
          this.menuItemMap[item.uuid] = item
        })
      }

      this.fullMenuTabs = [].concat(this.store.appSystemList)
      this.activeFullMenuTab = get(this.fullMenuTabs, '[0]')
      this.fullMenuData = get(this.fullMenuTabs, '[0].children') || []
    },
    // 缓存 需要操作的子孙组件 vue component 实例
    addChild (childComponent) {
      // const name = childComponent?.$options?.name
      const name = get(childComponent, '$options.name')
      if (!name) {
        throw new Error('layout child component must have name')
      }
      this.$set(this.instMap, childComponent.$options.name, childComponent)
    },
    // 刷新侧边栏数据
    /**
     * @param {string} 方法调用来源
     */
    async refreshSidebar (source) {
      await this.$nextTick()
      if (isEmpty(this.appSystemList)) {
        return
      }
      // 1.如果为全部菜单,保持顶部栏激活系统为全部菜单
      const currentSystemUuid = get(this.activeSystem, 'uuid')
      if (currentSystemUuid === 'fullMenu') {
        const fullMenuInfo = {
          uuid: 'fullMenu',
          title: this.$t('hui.frameLayout.fullMenu'),
        }
        this.activeSystem = fullMenuInfo
        return
      }
      // 2.如果能从激活的菜单项中获取到激活的系统项
      const activeSystemUuid = get(this.store.activeMenuItem, 'systemUuid')
      const menuItemSystem = get(this.menuItemMap, activeSystemUuid)
      if (this.activeMenuItem && menuItemSystem) {
        this.activeSystem = menuItemSystem
        return
      }
      this.activeSystem = get(this.appSystemList, '[0]')
    },
    // 侧边栏开关
    setCollapse (isCollapse) {
      this.isCollapse = isCollapse
    },
    // 设置侧边栏类型
    setSidebarType (type = 'drawerMenu') {
      if (!['fullMenu', 'drawerMenu', 'cookMenu'].includes(type)) {
        console.warn("this sidebar type is not't exist")
        return
      }
      // 因为没有缓存全部菜单 tab defaultActive ，重置数据为第一项
      this.fullMenuData = get(this.fullMenuTabs, '[0].children') || []
      if (type !== 'fullMenu' && this.store.sidebarType == 'fullMenu') {
        this.activeSystem = get(this.store.appSystemList, '[0]')
      }
      this.store.sidebarType = type
      this.$emit('update:sidebarType', this.store.sidebarType)
    },
    setSkin (skin) {
      this.store.skin = skin
      this.$emit('change-skin', skin)
      this.$emit('update:skin', skin)
    },
    // 缓存 top-bar sidebar type 用于跳转到 全部菜单 时还原
    setSidebarTypeCache (type) {
      this.store.sidebarTypeCache = type
    },
    // 还原回普通菜单
    recoverSidebarType () {
      this.store.sidebarType = this.store.sidebarTypeCache
    },

    addFavour (menuItem, eventInfo) {
      // 添加异步回调确认
      const confirm = options => {
        const layoutMenuItem = get(this.menuItemMap, menuItem.uuid)
        if (!layoutMenuItem) {
          console.error("can't get menu from layout menuItemMap")
          return
        }
        const cookSubmenuUuid = get(layoutMenuItem, '_cookSubmenuUuid')
        this.menuItemMap[menuItem.uuid].isFavour = true
        // 添加到全部菜单侧边栏收藏列表
        const isExist = this.store.fullMenuFavourItemList.find(m => m.uuid === menuItem.uuid)
        if (!isExist) {
          this.store.fullMenuFavourItemList.push(menuItem)
        }
        // 添加到菜谱菜单侧边栏收藏列表
        const cookSubmenu = get(this.menuItemMap, cookSubmenuUuid)
        if (cookSubmenu && Array.isArray(cookSubmenu.favourItemList)) {
          const isExistInCook = cookSubmenu.favourItemList.find(m => m.uuid === menuItem.uuid)
          if (!isExistInCook && cookSubmenu && cookSubmenu.favourItemList) {
            cookSubmenu.favourItemList.push(menuItem)
          }
          // 添加收藏时是否自动展开菜谱菜单项
          const openCookmenu = get(eventInfo, 'openCookmenu')
          if (get(options, 'openCookmenu') && openCookmenu) {
            openCookmenu()
          }
        }
      }
      this.$emit('add-favour', filterPrivate(menuItem), confirm)
    },

    removeFavour (menuItem, eventInfo) {
      const confirm = () => {
        const layoutMenuItem = get(this.menuItemMap, menuItem.uuid)
        if (!layoutMenuItem) {
          console.error("can't get menu from layout menuItemMap")
          return
        }
        const cookSubmenuUuid = get(layoutMenuItem, '_cookSubmenuUuid')
        this.menuItemMap[menuItem.uuid].isFavour = false
        // 从全部菜单侧边栏收藏列表中删除
        this.store.fullMenuFavourItemList = this.store.fullMenuFavourItemList.filter(
          m => m.uuid !== menuItem.uuid,
        )
        //  从菜谱菜单侧边栏收藏列表中删除
        const cookSubmenu = get(this.menuItemMap, cookSubmenuUuid)
        if (cookSubmenu && Array.isArray(cookSubmenu.favourItemList)) {
          cookSubmenu.favourItemList = cookSubmenu.favourItemList.filter(
            m => m.uuid !== menuItem.uuid,
          )
        }
      }
      // TODO 过滤私有属性
      this.$emit('remove-favour', filterPrivate(menuItem), confirm)
    },
    // 侧边栏页签选中
    sidebarSelect (info) {
      if (!isString(info.url)) {
        throw new Error('菜单项数据必须有 url 字段')
      }
      if (!isString(info.uuid)) {
        throw new Error('菜单项数据必须有 uuid 字段')
      }
      // 检查是否已存在页签
      const isTabExist = this.store.tabList.find(item => item.uuid === info.uuid)
      if (!isTabExist) {
        // feat: 添加 tab 最大数量
        if (+this.tabMaxNum && this.store.tabList.length >= +this.tabMaxNum) {
          this.$emit('tab-out-of-range', {
            tab: info,
            tabList: cloneDeep(this.store.tabList),
            tabMaxNum: +this.tabMaxNum,
          })
          return
        }
        this.store.tabList = this.store.tabList.concat(info)
      }
      // 初始化 store.activeMenuItem
      this.store.activeMenuItem = info
      this.$emit('sidebar-select', info)
    },
    setActiveMenuItem (info) {
      this.store.activeMenuItem = info
    },
    fullMenuTabClick (tab) {
      const systemUuid = get(tab, 'uuid')
      this.fullMenuData = get(this.menuItemMap, [systemUuid, 'children'])
    },
    // 设置默认激活的系统菜单
    setDefaultActiveSystem (appSystemList) {
      if (isEmpty(this.activeSystem) && appSystemList.length) {
        // 修复激活全部菜单时更新系统列表，全部菜单激活状态丢失
        const lastActiveSystem = get(this.$refs, 'layoutHead.store.activeSystem')
        if (lastActiveSystem && lastActiveSystem.uuid == 'fullMenu') {
          this.activeSystem = {
            uuid: 'fullMenu',
            title: this.$t('hui.frameLayout.fullMenu'),
          }
          return
        }
        const activeSystemUuid = get(this.activeMenuItem, 'systemUuid')
        const activeSystem = get(this.menuItemMap, activeSystemUuid)
        if (this.activeMenuItem && activeSystem) {
          this.activeSystem = activeSystem
          return
        }
        this.activeSystem = get(appSystemList, '[0]')
      }
    },
  },
  created () {},
  beforeMount () {
    const i18nInst = get(this, '$root.$i18n')
    if (i18nInst) {
      Object.keys(i18n.messages).map(key => {
        this.$root.$i18n.mergeLocaleMessage(key, i18n.messages[key])
      })
    }
  },
  mounted () {},
  beforeDestroy () {},
}
</script>
