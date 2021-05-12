<template>
  <Layout
    ref="layout"
    v-show="!loading"
    v-bind="layoutProps"
    :appName="bizStore.appName"
    :userName="bizStore.userName"
    :loginTime="bizStore.loginTime"
    :version="bizStore.version"
    :appSystemList="bizStore.systemList"
    :fullMenuFavourItemList="bizStore.favourMenuItemList"
    :skin.sync="skin"
    :sidebarType.sync="store.sidebarType"
    :sidebarTypeCache.sync="store.sidebarTypeCache"
    :tabList.sync="tabList"
    :activeMenuItem.sync="activeMenuItem"
    :cookMenuHorizontal="bizStore.horizontalPopperMenu"
    :sidebarCollapse.sync="collapse"
    :tabMaxNum="tabMaxNum"
    @sidebar-select="onSidebarSelect"
    @add-favour="onAddFavouriteMenuItem"
    @remove-favour="onRemoveFavouriteMenuItem"
    @tab-click="onTabClick"
    @tab-before-close="onTabBeforeClose"
    @tab-before-close-all="onTabBeforeClose"
    @tab-before-close-other="onTabBeforeClose"
    @tab-close="onTabClose"
    @tab-close-all="onTabCloseAll"
    @tab-close-other="onTabCloseOther"
    @tab-refresh-page="onRefreshPage"
    @tab-out-of-range="onTabOutOfRange"
    @logout="onLogout"
  >
    <!-- 顶部栏-右侧功能区-插槽-->
    <template slot="layoutHeadCtrl">
      <LayoutMenuSearch :filterFn="searchFilterFn"></LayoutMenuSearch>

      <slot name="layoutHeadCtrl"></slot>

      <!-- hui-pro 1.0 操作员中心 中的切换多国语言显示方式-->
      <LayoutHeadCtrlItem v-if="this.switchLocal == 'popper'">
        <SwitchLocaleCtrl @change-lang="changeLang" />
      </LayoutHeadCtrlItem>

      <!-- h-frame-layout 1.0 中的锁屏-->
      <LockScreen
        v-if="bizStore.isLockScreen"
        ref="lockScreen"
        :countdown="lockScreen.countdown"
        :disableCountDown="lockScreen.disableCountDown"
        @lock-screen="lockScreenFn"
        @unlock-screen="unlockScreenFn"
        @debug:log="onLockScreenLog"
      />

      <!-- 当前租户 -->
      <LayoutHeadCtrlSplit v-if="bizStore.isShowTenant" />
      <LayoutHeadCtrlItem v-if="bizStore.isShowTenant">
        <span>{{ $t('hui.biz.tenant.currentTenant') }}：</span>
        <span>{{ bizStore.userInfo.tenantName || '/' }}</span>
      </LayoutHeadCtrlItem>

      <!-- 当前空间 -->
      <LayoutHeadCtrlSplit v-if="bizStore.isShowSpace" />
      <LayoutHeadCtrlItem v-if="bizStore.isShowSpace">
        <span>{{ $t('hui.biz.space.currentSpace') }}：</span>
        <span>{{ bizStore.userInfo.envName || $t('hui.biz.space.default') }}</span>
      </LayoutHeadCtrlItem>
    </template>

    <!-- h-frame-layout 2.0 中的切换多国语言显示方式-->
    <template v-if="this.switchLocal == 'dialog'" slot="layoutHeadPrefixMenu">
      <SwitchLocale :locale="locale" @submit="changeLang" />
    </template>

    <!-- 顶部栏-个人信息浮窗-菜单插槽-->
    <template slot="layoutHeadMenu">
      <LayoutHeadMenuGroup>
        <LayoutHeadMenuItem v-if="bizStore.isShowEditUser" @click.native="openEditUserMsgbox">
          <i slot="icon" class="iconfont icon-t-b-userallocation"></i>
          <span slot="title">{{ $t('hui.biz.editUser.title') }}</span>
          <EditUserInfo ref="editUserInfo" :bizApi="bizApi" />
        </LayoutHeadMenuItem>

        <LayoutHeadMenuItem v-if="bizStore.isShowTenant" @click.native="openTenantMsgbox">
          <i slot="icon" class="iconfont icon-t-b-setting"></i>
          <span slot="title">{{ $t('hui.biz.tenant.title') }}</span>
          <SwitchTenant ref="switchTenant" :bizApi="bizApi" />
        </LayoutHeadMenuItem>

        <LayoutHeadMenuItem v-if="bizStore.isShowSpace" @click.native="openSpaceMsgbox">
          <i slot="icon" class="iconfont icon-backspace-outline"></i>
          <span slot="title">{{ $t('hui.biz.space.title') }}</span>
          <SwitchSpace ref="switchSpace" :bizApi="bizApi" />
        </LayoutHeadMenuItem>

        <!-- h-frame-layout 中的重置密码-->
        <ResetPassword
          ref="resetPwd"
          v-if="bizStore.isShowResetPassword"
          v-bind="bizStore.pwdInfo.pwdStandard"
          @reset-password="onResetPassword"
        />
      </LayoutHeadMenuGroup>

      <slot name="layoutHeadMenu"></slot>
    </template>

    <!-- 页签栏-右键菜单-菜单插槽  tabInfo 为页签信息-->
    <template slot="layoutNavbarContextmenuItem" slot-scope="{ tabInfo }">
      <slot name="layoutNavbarContextmenuItem" :tabInfo="tabInfo"></slot>
    </template>

    <!-- 主应用视图容器 -->
    <slot>
      <router-view ref="routerView"></router-view>
    </slot>

    <!-- 子应用视图容器 -->
    <!-- 子应用在挂载时要求 dom 节点必须存在 -->
    <!-- 如果在 __APP__ 内实现 subapp-container，在主应用做路由切换时，子应用会由于这个节点被销毁而挂载失败 -->
    <div id="subapp-container" v-if="isUseSubAppWrap" v-show="showSubAppWrap"></div>
  </Layout>
</template>

<script>
import PropTypes from '@hui/shared-utils/vue-types'
// UED 锁屏、多语言、重置密码
import LayoutMenuSearch from '@hui/h-frame-layout/lib/MenuBlockSearch'
import SwitchLocale from '@hui/h-frame-layout/lib/SwitchLocale'
import LockScreen from '@hui/h-frame-layout/lib/LockScreen'
import ResetPassword from '@hui/h-frame-layout/lib/ResetPassword'
// 操作员中心相关
import i18n from './locales'
import SwitchLocaleCtrl from './components/SwitchLocale' // 原1.0切换语言浮窗方式
import EditUserInfo from './components/EditUserInfo'
import SwitchTenant from './components/SwitchTenant'
import SwitchSpace from './components/SwitchSpace'

import BizApi, { BizApiError } from '../utils/bizApi'
// 对外暴露事件
import EventMixin from './eventMixin'
import logger from '../utils/logger'
import { get, isEmpty, isEqual, omit, qs } from '../utils'
import { triggerMicroApp } from 'hui-core'

const console = logger('bizLayout')
const lockScreenLogger = logger('bizLockScreen')
const bizApi = new BizApi()
const props = {
  isUseSubAppWrap: PropTypes.bool.def(true),
  homeUrl: PropTypes.string.def(get(window, 'FRAME_CONFIG.HOME_URL') || '/home'),
  appLogo: PropTypes.string.def('defaultLogo'),
  appName: PropTypes.string.def(get(window, 'FRAME_CONFIG.APP_NAME' || '操作员中心')),
  version: PropTypes.string.def(get(window, 'FRAME_CONFIG.VERSION' || '/')),
  // 是否整个页签栏开启弹窗确认
  tabEnableConfirm: PropTypes.bool.def(get(window, 'FRAME_CONFIG.IS_TAB_CONFIRM_ENABLED')),
  // 操作员插槽组件配置项
  isShowEditUser: PropTypes.bool.def(get(window, 'FRAME_CONFIG.IS_EDIT_USER_ENABLED', true)),
  isShowResetPassword: PropTypes.bool.def(get(window, 'FRAME_CONFIG.IS_RESET_PWD_ENABLED', true)),
  isCheckPwd: PropTypes.bool.def(get(window, 'FRAME_CONFIG.IS_PWD_CHECK_ENABLED')),
  isLockScreen: PropTypes.bool.def(get(window, 'FRAME_CONFIG.IS_LOCK_SCREEN_ENABLED')),
  isShowSpace: PropTypes.bool.def(get(window, 'FRAME_CONFIG.IS_SPACE_ENABLED')),
  isShowTenant: PropTypes.bool.def(get(window, 'FRAME_CONFIG.IS_TENANT_ENABLED')),
  horizontalPopperMenu: PropTypes.bool.def(get(window, 'FRAME_CONFIG.IS_HORIZONTAL_POPPER_MENU')),
  // // 是否插入操作员中心示例
  // needDemo: PropTypes.bool.def(get(window, 'FRAME_CONFIG.IS_NEED_DEMO')),
  // // 是否开启用户行为记录
  // isSaveUserBehavior: PropTypes.bool.def(get(window, 'FRAME_CONFIG.IS_RECORD_USER_BEHAVIOR')),
  // // 单点登录
  // casLoginEnabled: PropTypes.bool.def(get(window, 'FRAME_CONFIG.CAS_LOGIN_ENABLED')),
  // casLoginUrl: PropTypes.string.def(get(window, 'FRAME_CONFIG.CAS_LOGIN_URL' || '/')),
  // casLogoutUrl: PropTypes.string.def(get(window, 'FRAME_CONFIG.CAS_LOGOUT_URL' || '/')),
  RELOGIN_URL: PropTypes.any.def(get(window, ['FRAME_CONFIG', 'RELOGIN_URL'], null)), // iframe 下重新登录跳转第三方

  tabMaxNum: PropTypes.sNumber.def(0), // 0 为不限制数量
  sidebarType: PropTypes.oneOf(['cookMenu', 'drawerMenu', 'fullMenu']).def('cookMenu'),
  skinList: PropTypes.any.def(['blue', 'dark']),
  switchLocal: PropTypes.oneOf(['popper', 'dialog', 'none', false, null]).def('dialog'),
  // 是否固定首页页签
  pinHomeTab: PropTypes.bool.def(false),
  // 刷新后是否还原页签列表
  keepTabListAfterReload: PropTypes.bool.def(true),
  layoutType: PropTypes.string.def('hui-biz-frame-layout'),
  // 锁屏配置项
  lockScreen: PropTypes.oneOfType([
    PropTypes.shape({
      countdown: PropTypes.number,
      disableCountDown: PropTypes.bool,
      reloadPage: PropTypes.bool, // 解锁后是否刷新页面
    }).loose,
    PropTypes.bool,
  ]).def({
    countdown: 5,
    disableCountDown: false,
    reloadPage: false,
  }),
  // tcmp
  onlyShowContentFromQuery: PropTypes.string.def(get(window, ['FRAME_CONFIG', 'URL_QUERY_ONLY_CONTENT'], '/iframe')),
}

export default {
  name: 'BizLayout',
  mixins: [EventMixin],
  components: {
    LayoutMenuSearch,
    SwitchLocale,
    SwitchLocaleCtrl,
    LockScreen,
    ResetPassword,
    EditUserInfo,
    SwitchTenant,
    SwitchSpace,
  },
  provide () {
    return {
      bizLayout: this,
    }
  },
  inheritAttrs: false,
  props,
  data () {
    this.bizApi = bizApi
    return {
      bizStore: bizApi.store,
      collapse: false,
      skin: 'blue',
      tabList: [],
      activeMenuItem: {},
      historyActiveMenuItem: {}, // 刷新时缓存
      showSubAppWrap: false, // 是否显示子应用容器
      showIFrameWrap: false,
      loading: false,
      store: {
        sidebarType: this.sidebarType,
        sidebarTypeCache: this.sidebarType,
      },
    }
  },
  computed: {
    layoutProps () {
      return omit(this.$props, ['switchLocal'])
    },
    locale () {
      return this.$root.$i18n.locale
    },
    storageData () {
      const {
        tabList,
        activeMenuItem,
        skin,
        collapse,
        store: { sidebarType },
      } = this
      return {
        tabList,
        activeMenuItem,
        skin,
        theme: skin, // 兼容 1.0 参数名
        collapse,
        sidebarType,
      }
    },
    bizData () {
      const { bizMenuList, bizMenuMap, menuItemMap } = this.bizStore
      return { bizMenuList, bizMenuMap, menuItemMap }
    },
  },
  watch: {
    storageData (data) {
      // FIXME 全部菜单 侧边栏还原时 与 初始化激活子系统冲突
      if (data.sidebarType == 'fullMenu') {
        return
      }
      this.saveBizStorage(data)
      this.$store.commit('root/setSkeleton', data)
    },
    bizData (data) {
      this.activeMenuItemFromRoute(this.$route, 'bizDataWatcher')
      this.$store.commit('root/setBizMenuList', data.bizMenuList)
      this.$store.commit('root/setBizMenuMap', data.bizMenuMap)
    },
    $route (route) {
      this.checkRouterView()
      this.activeMenuItemFromRoute(route, '$routeWatcher')
    },
    sidebarType (val) {
      console.log('sidebarType', val)
      this.store.sidebarType = val
      this.store.sidebarTypeCache = val
    },
    skin (val) {
      triggerMicroApp('frame-change-skin', {
        skin: val,
      })
    },
    sidebarCollapse (val) {
      triggerMicroApp('frame-change-collapse', {
        collapse: val,
      })
    },
    // 缓存 getCurrentUser
    'bizStore.userInfo' (val) {
      this.$hCore.storage.setData({ key: 'currentUser', value: val })
      this.$emit('get-current-user', val)
    },
  },
  methods: {
    // 搜索栏过滤没有 url 和 不可收藏项
    searchFilterFn (item) {
      return !!item.originalValue.url && item.originalValue.canFavour
    },
    // 根据 route 激活菜单项
    /**
     * @param {object} route vue $route 参数
     * @param {object} source 方法来源 recoverBizStorage $routeWatcher bizDataWatcher
     */
    async activeMenuItemFromRoute (route, source) {
      await this.$nextTick()
      console.warn('vue route', route, source)

      if (source == 'recoverBizStorage') {
        const menuItem = this.tabList.find(item => item.uuid == this.historyActiveMenuItem.uuid)
        this.activeMenuItem = menuItem
        console.log('update activeMenuItem', menuItem)
        return
      }
      if (source == 'bizDataWatcher' && this.activeMenuItem) return

      // 获取菜单地址
      let url = route.fullPath
      // 子系统路由如果未传递全路径且为 hash 需要截取兼容
      const APPS = get(window, ['FRAME_CONFIG', 'APPS'], [])
      const isHasQuery = route.fullPath.includes('?')
      const isHasHash = route.fullPath.includes('#')
      const isHasUrlPrefix = APPS.find(item => {
        const appActiveWhen = get(item, 'base', '') || get(item, 'activeWhen', '')
        // FIXME: IE 不支持零宽断言
        // appActiveWhen = appActiveWhen.replace(/(?<!(http:|https:))\/+/g, '/')
        return item.urlPrefix && new RegExp('^' + appActiveWhen).test(route.path)
      })
      const urlPrefix = get(isHasUrlPrefix, 'urlPrefix')
      const query = isHasQuery ? qs.parse(route.fullPath.split('?')[1], {}) : {}

      console.log('query', query)
      if (get(query, 'browser') == 'iframe') {
        // this.patchOnlyContent()
      }

      // 去除 hash 路由模式下 query 参数
      if (isHasQuery && isHasHash) {
        url = route.fullPath.split('?')[0]
      }

      if (isHasQuery && !isHasHash) {
        url = route.fullPath.split('?')[0]
      }

      // 兼容子系统注册时 urlPrefix 字段
      if (urlPrefix) {
        url = route.fullPath
        url = url.replace(urlPrefix, '')
        url = url.split('?')[0]
        // FIXME: IE 不支持零宽断言
        // url = url.replace(/(?<!(http:|https:))\/+/g, '/')
      }
      console.warn('*url*', url, urlPrefix, query)

      // 是否从 tabList 中查找 url 激活菜单项
      const menuItemList = this.tabList.filter(item => {
        return item.url == url
      })

      // fix: 相同 url 处理
      let menuItem = get(menuItemList, '[0]')
      if (menuItemList.length > 1) {
        if (!isEmpty(query)) {
          menuItem = menuItemList.find(item => isEqual(item.query, query))
        }
        // FIXME 浏览器 前进后退定位可能有问题
        if (isEmpty(menuItem)) {
          menuItem = menuItemList.find(item => item.uuid == this.activeMenuItem.uuid)
        }
      }

      // 兼容 iframe 处理
      if (url == '/iframe') {
        const iframeUrl = get(qs.parse(query), 'url')
        menuItem = this.tabList
          .filter(item => get(item, 'originData.menu_type') == 'iframe')
          .find(item => item.url == iframeUrl)
        this.activeMenuItem = menuItem
        console.warn('*iframeUrl*', source, query, iframeUrl)
        return
      }

      if (this.tabList.length != 0 && menuItem) {
        // 是否固定首页页签
        if (menuItem.closable || menuItem.closable === undefined) {
          const canCloseHomeTab = !(this.pinHomeTab && menuItem.url === this.homeUrl)
          menuItem.closable = canCloseHomeTab
        }
        this.activeMenuItem = menuItem
        this.bizApi.saveUserBehaviorLog({
          consumerId: this.bizStore.loginInfo.operatorCode || '',
          ipAddr: this.bizStore.loginInfo.ipAddr || '',
          actionId: 'altermenu',
          menuName: menuItem.title,
        })
        return
      }

      // 从菜单项中查找 url 激活菜单项
      if (this.bizStore.systemList.length != 0) {
        const bizMenuItemKey = Object.keys(this.bizStore.menuItemMap).find(key => {
          const bizMenuItem = get(this.bizStore.menuItemMap, key)

          return get(bizMenuItem, 'url') == url
        })
        menuItem = get(this.bizStore.menuItemMap, bizMenuItemKey)
        if (menuItem) {
          // 是否固定首页页签
          const canCloseHomeTab = !(this.pinHomeTab && menuItem.url === this.homeUrl)
          menuItem.closable = canCloseHomeTab
          this.activeMenuItem = menuItem
          this.bizApi.saveUserBehaviorLog({
            consumerId: this.bizStore.loginInfo.operatorCode || '',
            ipAddr: this.bizStore.loginInfo.ipAddr || '',
            actionId: 'openmenu',
            menuName: menuItem.title,
          })
          const exist = this.tabList.find(item => item.url == url)
          if (!exist && menuItem) {
            this.tabList = this.tabList.concat([menuItem])
          }
        }
      }
    },
    // 根据 route-view 内容隐藏 subapp-container
    checkRouterView () {
      this.$nextTick(() => {
        const dom = get(this.$slots, 'default.0.elm')
        if (dom && dom.dataset.appContainer == 'subapp-container') {
          this.showSubAppWrap = true
          return
        }
        this.showSubAppWrap = false
      })
    },
    changeLang (locale) {
      triggerMicroApp('frame-change-locale', { locale })
      this.$root.$i18n.locale = locale
      this.bizApi
        .changeLang(locale)
        .then(res => {
          this.bizApi.init({ layoutWrap: this, locale })
          // TODO 页签信息切换语言后处理，自定义页签待考虑
          // 暂时保持为和1.0 一样清空
          this.tabList = []
          this.activeMenuItem = {}
          this.navigate('/')
        })
        .catch(e => {
          if (e instanceof BizApiError) {
            this.$hMessage.error({
              content: e.message,
              duration: 3,
              closable: true,
            })
            return
          }
          this.$hMessage.error({
            content: this.$t('hui.ajax.error'),
            duration: 3,
            closable: true,
          })
        })
    },
    lockScreenFn () {
      this.bizApi.lockScreen()
    },
    unlockScreenFn (password, closeDialog) {
      this.bizApi
        .unLockScreen(password)
        .then(res => {
          // 解锁后是否刷新页面
          if (this.lockScreen.reloadPage) {
            window.location.reload()
            return
          }
          closeDialog()
        })
        .catch(e => {
          if (e instanceof BizApiError) {
            this.$hMessage.error({
              content: e.message,
              duration: 3,
              closable: true,
            })
            return
          }
          this.$hMessage.error({
            content: this.$t('hui.ajax.error'),
            duration: 3,
            closable: true,
          })
        })
    },
    onResetPassword (passwordInfo, success, error) {
      this.bizApi
        .resetPassword(passwordInfo)
        .then(res => {
          success()
        })
        .catch(e => {
          if (e instanceof BizApiError) {
            this.$hMessage.error({
              content: e.message,
              duration: 3,
              closable: true,
            })
            return
          }
          this.$hMessage.error({
            content: this.$t('hui.ajax.error'),
            duration: 3,
            closable: true,
          })
        })
    },
    onLogout () {
      // RELOGIN_URL 下重新登录跳转第三方
      const next = () => {
        const RELOGIN_URL = this.RELOGIN_URL
        if (RELOGIN_URL) {
          this.bizApi
            .saveUserBehaviorLog()
            .then(() => {
              window.top.location.href = window.top.location.origin + RELOGIN_URL
            })
            .catch(() => {
              window.top.location.href = window.top.location.origin + RELOGIN_URL
            })
          return
        }
        this.bizApi.logout()
      }
      triggerMicroApp('frame-logout')
      if (get(this.$listeners, 'logout')) {
        this.$emit('logout', { next }, next)
        return
      }
      next()
    },
    // 侧边栏页签选中
    onSidebarSelect (menuItem) {
      this.navigate(menuItem)
    },
    // 标签栏点击
    onTabClick (tab) {
      this.navigate(tab)
    },
    // 侧边栏添加收藏
    onAddFavouriteMenuItem (item, next) {
      const id = get(item, 'originData.id')
      if (!id) {
        console.warn('未找到id,该项不属于操作员中心菜单')
        return
      }
      this.bizApi
        .addFavoriteItem({ menu_code: item.originData.id, has_children: false })
        .then(res => {
          this.$hMessage.success({
            content: this.$t('hui.biz.addFavourSuccess'),
            duration: 3,
            closable: true,
          })
          bizApi.getFavourMenuItemList()
          next({ openCookmenu: true })
        })
        .catch(e => {
          if (e instanceof BizApiError) {
            this.$hMessage.error({
              content: this.$t('hui.biz.addFavourFail'),
              duration: 3,
              closable: true,
            })
            return
          }
          this.$hMessage.error({
            content: this.$t('hui.ajax.error'),
            duration: 3,
            closable: true,
          })
        })
    },
    // 侧边栏移除收藏
    onRemoveFavouriteMenuItem (item, next) {
      const id = get(item, 'originData.id')
      if (!id) {
        console.warn('未找到id,该项不属于操作员中心菜单')
        return
      }
      this.bizApi
        .delFavoriteItem({ menu_code: item.originData.id, has_children: false })
        .then(res => {
          this.$hMessage.success({
            content: this.$t('hui.biz.delFavourSuccess'),
            duration: 3,
            closable: true,
          })
          bizApi.getFavourMenuItemList()
          next()
        })
        .catch(e => {
          if (e instanceof BizApiError) {
            this.$hMessage.error({
              content: this.$t('hui.biz.delFavourFail'),
              duration: 3,
              closable: true,
            })
            return
          }
          this.$hMessage.error({
            content: this.$t('hui.ajax.error'),
            duration: 3,
            closable: true,
          })
        })
    },
    // 标签栏 与 激活菜单项 改变时存入本地缓存
    saveBizStorage (storageData) {
      this.$hCore.storage.setData({
        key: 'bizStorage',
        value: storageData,
      })
    },
    // 刷新页面后从  storage 读取激活的 侧边栏信息与标签栏列表
    recoverBizStorage () {
      // 刷新页面后从  storage 读取激活的 侧边栏信息与标签栏列表
      this.$hCore.storage
        .getData({ key: 'bizStorage' })
        .then(bizStorage => {
          bizStorage = JSON.parse(bizStorage)
          this.bizStorage = bizStorage || {}
          this.skin = bizStorage.skin
          this.store.sidebarType = bizStorage.sidebarType
          this.store.sidebarTypeCache = bizStorage.sidebarType
          // 刷新后是否还原页签列表
          if (this.keepTabListAfterReload) {
            this.tabList = bizStorage.tabList
            this.historyActiveMenuItem = bizStorage.activeMenuItem
            this.activeMenuItemFromRoute(this.$route, 'recoverBizStorage')
          }
          // this.activeMenuItem = bizStorage.activeMenuItem || this.activeMenuItem
        })
        .catch(e => {
          // 无需处理
          // console.error(e)
        })
    },
    // 子应用跳转
    async navigate (menuItem) {
      if (typeof menuItem == 'string') {
        this.$hCore.navigate(menuItem)
        return
      }
      const menuType = get(menuItem, 'originData.menu_type')
      const isIFrame = menuType && menuType == 'iframe'
      if (isIFrame) {
        this.$hCore.navigate('/iframe', {}, { url: encodeURI(menuItem.url) })
        return
      }
      await this.$nextTick()
      const isHashRouter = menuItem.url.includes('#')
      if (isHashRouter) {
        const query = menuItem.query ? '?' + qs.stringify(menuItem.query) : ''
        this.$hCore.navigate(menuItem.url + query)
        return
      }
      this.$hCore.navigate(menuItem.url, menuItem.query ? menuItem.query : {})
    },
    onTabBeforeClose (tab, closeTab, { type, current }) {
      const closeTabTip = this.$t('hui.frameLayout.sureClose')
      const tipMap = {
        current: tab.title,
        all: this.$t('hui.frameLayout.allTab'),
        other: this.$t('hui.frameLayout.otherTab'),
      }
      // skeleton 页面模板 与 单个 tab 是否开启了确认弹窗
      if (this.tabEnableConfirm || current.enableConfirm) {
        this.$hMsgBox.confirm({
          title: this.$t('hui.frameLayout.tip'),
          content: `${closeTabTip} ${tipMap[type]} ？`,
          onOk: closeTab,
        })
        return
      }
      closeTab()
    },
    // 修改用户信息
    openEditUserMsgbox () {
      this.$refs.editUserInfo.open()
    },
    // 切换多租户
    openTenantMsgbox () {
      this.$refs.switchTenant.open()
    },
    // 切换空间
    openSpaceMsgbox () {
      this.$refs.switchSpace.open()
    },
    onChangeSkin (skin) {},
    onRefreshPage (tab) {},
    // 将语言包合入 vue-i18n 实例
    mergeI18n (i18n) {
      Object.keys(i18n.messages).map(local => {
        this.$i18n.mergeLocaleMessage(local, i18n.messages[local])
      })
    },
    onLockScreenLog (info) {
      lockScreenLogger.log('lockScreen countdown', info)
    },
    // 只显示内容
    patchOnlyContent () {
      const content = this.renderContent()
      console.log('onlyPatch', content)
      this._update(content)
    },

    renderContent () {
      const h = this.$createElement
      const _this = this
      return h('div', {
        class: 'h-layout is-only-content'
      }, [
        h('router-view', {
          ref: 'routerView',
        }),
        h('div', {
          attrs: {
            id: 'subapp-container',
          },
          directives: [
            {
              name: 'show',
              value: _this.showSubAppWrap,
            },
          ],
        }),
      ])
    },
  },
  created () {
    // fix 页面刷新时会有皮肤切换效果
    this.recoverBizStorage()
    this.mergeI18n(i18n)
    // TODO 待整理
    const route = this.$route
    const isHasQuery = route.fullPath.includes('?')
    const query = isHasQuery ? qs.parse(route.fullPath.split('?')[1], {}) : {}
    if (this.onlyShowContentFromQuery && get(query, 'browser') == 'iframe') {
      this.loading = true
    }
  },
  mounted () {
    this.checkRouterView()
    this.$nextTick()
      .then(() => {
        const route = this.$route
        const isHasQuery = route.fullPath.includes('?')
        const query = isHasQuery ? qs.parse(route.fullPath.split('?')[1], {}) : {}
        if (this.onlyShowContentFromQuery && get(query, 'browser') == 'iframe') {
          this.patchOnlyContent()
        }
      })
    bizApi
      .init({ layoutWrap: this })
      .then(() => {
        return bizApi.getPwdConfig()
      })
      .then(pwdInfo => {
        // 默认密码 或 过期密码 弹出密码修改框
        if (pwdInfo.isDefaultPwd || pwdInfo.isExpiredPwd) {
          this.$refs.resetPwd.open(false)
        }
        if (pwdInfo.isNeedExipiredConfirm) {
          const pwdExpired = this.$t('hui.frameLayout.pwdExpired')
          const day = this.$t('hui.frameLayout.day')
          this.$hMsgBox.confirm({
            title: this.$t('hui.frameLayout.tip'),
            content: `${pwdExpired} ${pwdInfo.expiredDays} ${day}`,
            onOk: () => {
              this.$refs.resetPwd.open(false)
            },
          })
        }
        // 获取子系统列表后复原 tabList
        // this.recoverBizStorage()
      })
      .catch(e => {
        // console.error(e)
      })
  },
}
</script>
<style lang="css">
body {
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
@import '~@hui/biz-frame-layout/styles/theme';
.h-layout.is-only-content {
  padding: 0;
}
// TODO 换肤实现
#subapp-container,
/deep/ .h-layout-iframe-wrap {
  height: 100%;
  background-color: #ffffff;
  overflow: hidden;
}

/deep/ .micro-app-wrapper {
  height: 100%;
  overflow: auto;
}

// TODO 替换为工具类函数
@include layout-theme-dark() {
  #subapp-container,
  /deep/ .h-layout-iframe-wrap {
    background: #263140;
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
