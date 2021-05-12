<template>
  <div class="h-layout-head">
    <slot>
      <slot name="left">
        <div :class="`${prefix}-left ${prefix}-logo`">
          <div :class="`${prefix}-left-item ${prefix}-logo-img`">
            <img
              alt="app-logo"
              :src="layoutLogo"
              :style="appLogo == 'defaultLogo' ? { height: '24px' } : {}"
            />
          </div>
          <div :class="`${prefix}-left-item ${prefix}-logo-text`" :style="appNameStyle">
            {{ appName }}
          </div>
        </div>
      </slot>

      <slot name="center">
        <TopbarSys>
          <template slot="fullMenu">
            <!-- TODO 收藏组件抽离 -->
            <Tooltip
              v-if="fullMenu == 'in-sys'"
              placement="bottom"
              :content="$t('hui.frameLayout.fullMenu')"
              :class="[
                `${prefix}-sys-item ${prefix}-sys-all`,
                { 'is-active': store.activeSystem.uuid == 'fullMenu' },
              ]"
              @click.native="openFullMenu"
            >
              <i :class="`${prefix}-sys-all-icon ${iconAnimation} ${icon.star}`"></i>
            </Tooltip>
          </template>
        </TopbarSys>
      </slot>

      <slot name="right">
        <div :class="`${prefix}-right ${prefix}-ctrl`">
          <slot name="ctrl"></slot>
          <Tooltip
            v-if="fullMenu == 'in-ctrl'"
            transfer
            placement="bottom"
            :content="$t('hui.frameLayout.fullMenu')"
            :class="[
              `${prefix}-right-item ${prefix}-ctrl-icon ${prefix}-ctrl-fullMenu`,
              { 'is-active': store.activeSyste.uuid == 'fullMenu' },
            ]"
            @click.native="openFullMenu"
          >
            <i :class="icon.starOutline"></i>
          </Tooltip>

          <div :class="`${prefix}-right-item ${prefix}-ctrl-separator`"></div>

          <div
            ref="popperRef"
            :class="[`${prefix}-right-item ${prefix}-ctrl-user`,{ 'is-active': userInfo.show }]"
            @mouseenter="handleHover"
            @mouseleave="handleHover"
          >
            {{ userName }}
          </div>
          <transition name="zoom-in-top">
            <div
              ref="popperWrap"
              v-show="userInfo.show"
              v-clickoutside="hidePopper"
              :class="`${drawerPrefix}`"
              @mouseenter="handleHover"
              @mouseleave="handleHover"
            >
              <div :class="`${drawerPrefix}-group ${drawerPrefix}-info`">
                <div :class="`${drawerPrefix}-info-name`">{{ userName }}</div>
                <div :class="`${drawerPrefix}-info-sub`">
                  {{ $t('hui.frameLayout.loginTime') }}{{ loginTime }}
                </div>
                <div :class="`${drawerPrefix}-info-sub`">
                  {{ $t('hui.frameLayout.version') }}{{ version }}
                </div>
              </div>

              <div :class="`${drawerPrefix}-group`">
                <!-- 换肤菜单 -------------------------------------------->
                <div
                  v-if="Array.isArray(skinList) && skinList.length > 0"
                  :class="`${drawerPrefix}-item ${drawerPrefix}-skin`"
                >
                  <i :class="`${drawerPrefix}-item-icon ${icon.skin}`"></i>
                  <span :class="`${drawerPrefix}-item-title`">{{
                    $t('hui.frameLayout.changeSkin')
                  }}</span>
                  <layout-radio-group v-model="userInfo.skin" type="dot" @on-change="switchSkin">
                    <template v-for="skin in skinList">
                      <layout-radio :key="skin" v-bind="getSkinDetail(skin)">
                        <template slot="dot" slot-scope="scope">
                          <i
                            v-show="scope.checked"
                            :class="[icon.check, `${drawerPrefix}-dot-icon`]"
                          ></i>
                        </template>
                      </layout-radio>
                    </template>
                  </layout-radio-group>
                </div>

                <div :class="`${drawerPrefix}-item ${drawerPrefix}-sidebar-type`">
                  <i :class="`${drawerPrefix}-item-icon ${icon.fullmenu}`"></i>
                  <span :class="`${drawerPrefix}-item-title`">{{
                    $t('hui.frameLayout.sidebarType')
                  }}</span>
                  <layout-radio-group
                    v-model="userInfo.sidebarType"
                    type="button"
                    size="small"
                    style="min-width:135px;"
                    @on-change="switchSidebarType"
                  >
                    <layout-radio
                      :text="$t('hui.frameLayout.cookMenu')"
                      label="cookMenu"
                    ></layout-radio>
                    <layout-radio
                      :text="$t('hui.frameLayout.drawerMenu')"
                      label="drawerMenu"
                    ></layout-radio>
                  </layout-radio-group>
                </div>

                <slot name="prefixMenu"></slot>
              </div>

              <div :class="`${drawerPrefix}-group`">
                <template v-if="LAYOUT_ENV == 'dev'">
                  <div :class="`${drawerPrefix}-item`" @click="resetSidebar">
                    <i :class="`${drawerPrefix}-item-icon ${icon.reload}`"></i>
                    <span :class="`${drawerPrefix}-item-title`">{{
                      $t('hui.frameLayout.resetSidebar')
                    }}</span>
                  </div>
                </template>

                <slot name="menu"></slot>

                <div :class="`${drawerPrefix}-item  ${drawerPrefix}-logout`" @click="logout">
                  <i :class="`${drawerPrefix}-item-icon ${icon.logout}`"></i>
                  <span :class="`${drawerPrefix}-item-title`">{{
                    $t('hui.frameLayout.logout')
                  }}</span>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </slot>
    </slot>
  </div>
</template>
<script>
import PropTypes from '@hui/shared-utils/vue-types'
import clickoutside from '@hui/directives/clickoutside'
import CONFIG from '../../config'
import TopbarSys from './TopbarSys'
import Tooltip from '@packages/Tooltip'
import Radio from '@packages/Radio'
import { get, filterPrivate, isEqualWithKeys } from '@hui/shared-utils/index'
import * as defaultLogo from './defaultLogo'
import Hover from '@hui/shared-utils/lib/hover'
let hoverInst = null
export const props = {
  appLogo: PropTypes.string.def('defaultLogo'),
  appName: PropTypes.string.def('/').devDef('UED框架'), // web name
  appNameLength: PropTypes.sNumber.def('14'), // web name length 超出省略号
  fullMenu: PropTypes.oneOf(['in-sys', 'in-ctrl', 'none']).def('in-sys'), // 全部菜单位置
  activeSystem: PropTypes.oneOfType([String, Object]).def(undefined), // 为 fullMenu 时为全部菜单
  appSystemList: PropTypes.array
    .def([])
    .devDef([
      { title: '通知中心' },
      { title: '权益中心' },
      { title: '用户权限系统' },
      { title: '认证中心' },
      { title: '用户中心' },
      { title: '客户中心' },
      { title: '子系统七1' },
      { title: '子系统八' },
      { title: '子系统十' },
      { title: '子系统十一' },
      { title: '子系统十二' },
    ]),
  userName: PropTypes.string.def('/').devDef('操作员名称'),
  loginTime: PropTypes.string.def('-/-/-').devDef('2019/01/22 12:23:22'),
  version: PropTypes.string.def('/').devDef('1.0.0'),
  initUserInfo: PropTypes.object.def({}),
  isResetSidebar: PropTypes.bool.def(true), // 激活子系统是否还原菜单类型
  skinList: PropTypes.any.def(['blue', 'dark']), // skin 列表,不为数组或为空时隐藏，pink 暂不开放
}

export default {
  name: 'Topbar',
  directives: { clickoutside },
  components: {
    TopbarSys,
    Tooltip,
    LayoutRadio: Radio,
    LayoutRadioGroup: Radio.Group,
  },
  props,
  provide () {
    return {
      topbar: this,
      SELECT_CONFIG: {
        PREFIX: 'h-layout',
      },
    }
  },
  inject: {
    CONFIG: { default: () => CONFIG },
    layout: { default: () => {} },
  },
  data () {
    const prefix = 'h' || this.CONFIG.PREFIX
    this.prefix = `${prefix}-layout-head`
    this.icon = this.CONFIG.ICON
    this.drawerPrefix = `${this.prefix}-user-drawer`
    this.LAYOUT_ENV = process.env.LAYOUT_ENV
    return {
      iconAnimation: '',
      iconClock: null,
      fullMenuInfo: {
        uuid: 'fullMenu',
        title: this.$t('hui.frameLayout.fullMenu'),
      },
      store: {
        activeSystem: '', // 为 title
      },
      userInfo: {
        show: false,
        sidebarType: this.layout.store.sidebarType,
        skin: this.layout.store.skin || 'blue',
      },
      skinDetailList: [
        { dotColor: '#5196FF', label: 'blue' },
        { dotColor: '#FF7575', label: 'pink' },
        { dotColor: '#333333', label: 'dark' },
      ],
    }
  },
  computed: {
    layoutLogo () {
      if (Object.keys(defaultLogo).includes(this.appLogo)) {
        return get(defaultLogo, this.appLogo)
      }
      return this.appLogo
    },
    layoutSidebarType () {
      return this.layout.store.sidebarType
    },
    layoutSkin () {
      return this.layout.store.skin
    },
    appNameStyle () {
      const FONT_SIZE = 14
      return {
        maxWidth: FONT_SIZE * +this.appNameLength + 'px',
      }
    },
  },
  watch: {
    appSystemList: {
      immediate: true,
      handler () {
        this.initDefaultSystem(this.activeSystem, false)
      },
    },
    activeSystem (activeSystem) {
      this.initDefaultSystem(activeSystem, false)
    },
    layoutSidebarType (type) {
      this.userInfo.sidebarType = type
    },
    layoutSkin (skin) {
      this.userInfo.skin = skin
    },
  },
  methods: {
    getSkinDetail (skin) {
      const skinDetail = this.skinDetailList.find(d => d.label === skin)
      if (!skinDetail) {
        throw new Error('皮肤列表中没有这项皮肤')
      }
      return skinDetail
    },
    // 如果设置了 activeSystem
    initDefaultSystem (activeSystem, isSyncActive = true) {
      if (!activeSystem) {
        return
      }
      this.store.activeSystem = activeSystem
      // 是否同步更新 props.activeSystem 激活系统
      if (!isSyncActive) {
        return
      }
      const item = this.appSystemList.find(item => {
        return isEqualWithKeys(activeSystem, item, ['uuid', 'title'])
      })
      this.$emit('update:activeSystem', item)
    },
    // 全部菜单按钮动画
    toggleIconAnimation () {
      this.iconAnimation = 'is-expand'
      clearTimeout(this.iconClock)
      this.iconClock = setTimeout(() => {
        this.iconAnimation = ''
      }, 400)
    },
    openFullMenu () {
      this.toggleIconAnimation()
      this.store.activeSystem = this.fullMenuInfo
      this.layout.setSidebarType('fullMenu')
      this.$emit('update:activeSystem', filterPrivate(this.fullMenuInfo))
      this.$emit('open-fullMenu')
    },
    openSystem (item) {
      this.store.activeSystem = item
      // 还原侧边栏类型
      if (this.isResetSidebar) {
        this.layout.recoverSidebarType()
      }
      this.$emit('update:activeSystem', filterPrivate(item))
    },
    switchSidebarType (type) {
      this.layout.setSidebarType(type)
      this.layout.setSidebarTypeCache(type)
      this.userInfo.show = false
      this.$emit('change-sidebar', type)
    },
    switchSkin (skin) {
      this.userInfo.show = false
      this.layout.setSkin(skin)
      this.$emit('change-skin', skin)
    },

    resetSidebar () {
      this.layout.$emit('reset-sidebar')
    },

    logout () {
      this.$emit('logout', this.initUserInfo)
      this.layout.$emit('logout')
    },
    hidePopper (e) {
      const check = elem => elem.contains(e.target)
      if (check(this.$refs.popperRef)) {
        return
      }
      this.userInfo.show = false
    },
    // 个人信息盒
    handleHover (e) {},
  },
  mounted () {
    // 根据 topbar 确定初始 sidebarType
    this.layout.setSidebarTypeCache(this.userInfo.sidebarType)
    hoverInst = new Hover({
      popperRef: this.$refs.popperRef,
      popperWrap: this.$refs.popperWrap,
      handleEnter: () => {
        this.userInfo.show = true
      },
      handleLeave: () => {
        this.userInfo.show = false
      },
    })
    hoverInst.init()
  },
  destroyed () {
    if (hoverInst && hoverInst instanceof Hover && hoverInst.destory) {
      hoverInst.destroy()
    }
  },
}
</script>
