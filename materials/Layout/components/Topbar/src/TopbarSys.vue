<template>
  <div :class="`${prefix}-center ${prefix}-sys`">
    <slot name="fullMenu"></slot>

    <div
      v-for="(item, index) in outSystemList"
      ref="tabs"
      :class="[`${prefix}-sys-item`, { 'is-active': activeSystem.uuid == item.uuid }]"
      :key="item.uuid || index"
      @click="openSystem(item, 'outSystem')"
    >
      {{ item.title }}
    </div>

    <!-- TODO 菜单排序 -->
    <div
      v-show="showMoreSys"
      ref="popperRef"
      :class="[`${prefix}-sys-item ${prefix}-sys-more`, { 'is-active': activeMore }]"
      @mouseenter="handleHover"
      @mouseleave="handleHover"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="sys-more-icon"
        style="margin-bottom:-2px;width:20px;height:14px"
        viewBox="0 0 1280 1024"
        version="1.1"
      >
        <path
          d="M1184 1024h-1088C38.4 1024 0 985.6 0 928v-832C0 38.4 38.4 0 96 0h1088c57.6 0 96 38.4 96 96v832c0 57.6-38.4 96-96 96zM96 64c-19.2 0-32 12.8-32 32v832c0 19.2 12.8 32 32 32h1088c19.2 0 32-12.8 32-32v-832c0-19.2-12.8-32-32-32h-1088z"
          fill="#fff"
        />
        <path
          d="M307.2 512c0 19.2 12.8 38.4 25.6 51.2 19.2 12.8 38.4 12.8 57.6 0 12.8-12.8 25.6-32 25.6-51.2s-12.8-38.4-25.6-51.2c-19.2-12.8-38.4-12.8-57.6 0-19.2 12.8-25.6 32-25.6 51.2z m275.2 0c0 32 25.6 57.6 57.6 57.6s57.6-25.6 57.6-57.6-25.6-57.6-57.6-57.6-57.6 25.6-57.6 57.6z m281.6 0c0 32 25.6 57.6 57.6 57.6s57.6-25.6 57.6-57.6-25.6-57.6-57.6-57.6-57.6 25.6-57.6 57.6z"
          fill="#FFFFFF"
        />
        <path
          d="M96 32h1088c38.4 0 64 25.6 64 64v832c0 38.4-25.6 64-64 64h-1088c-38.4 0-64-25.6-64-64v-832c0-38.4 25.6-64 64-64z"
          fill="transparent"
        />
      </svg>

      <transition name="zoom-in-top">
        <div
          v-show="showMorePopper"
          ref="popperWrap"
          style="transition-duration:.6s;"
          :class="`${prefix}-sys-more-popper`"
          @mouseenter="handleHover"
          @mouseleave="handleHover"
        >
          <div :class="[`${prefix}-sys-more-popper-wrap`]">
            <div
              :class="[
                `${prefix}-sys-more-popper-item`,
                { 'is-active': activeSystem.uuid == item.uuid },
              ]"
              v-for="(item, index) in moreSystemList"
              :key="item.id || index"
              @click="openSystem(item, 'moreSystem')"
            >
              {{ item.title }}
            </div>
          </div>
            <!-- FIXME: 排序宽度判断存在问题 -->
            <!-- TODO: 操作员中心接口未开放暂时隐藏 -->
          <div v-if="false" :class="[`${prefix}-sys-more-popper-sort-item`]" @click="openSysSort">
            <span>{{ $t('hui.frameLayout.sysSort') }}</span>
            <!-- <TopbarSysSort :systemList.sync="appSystemList" ref="sysSort"/> -->
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import Hover from '@hui/shared-utils/lib/hover'
import { on, off, get, cloneDeep, debounce, omit, isEqualWithKeys } from '@hui/shared-utils'

// import TopbarSysSort from './TopbarSysSort'
let hoverInst = null
export default {
  name: 'TopbarSys',
  // components: { TopbarSysSort },
  inject: {
    topbar: { default: () => {} },
  },
  data () {
    return {
      appSystemList: [],
      outSystemList: [],
      moreSystemList: [],
      showMoreSys: false,
      showMorePopper: false,
    }
  },
  computed: {
    prefix () {
      return this.topbar.prefix
    },
    activeSystem () {
      return this.topbar.store.activeSystem
    },
    icon () {
      return this.topbar.icon
    },
    topbarAppSystemList () {
      return this.topbar.appSystemList
    },
    activeMore () {
      return this.moreSystemList.some(item => item.uuid == this.activeSystem.uuid)
    },
  },
  watch: {
    topbarAppSystemList () {
      this.appSystemList = this.topbarAppSystemList.map(item => {
        return omit(item, ['children'])
      })
      this.outSystemList = this.appSystemList
      this.$nextTick(() => {
        this.initTabOffset()
        this.computerMoreList()
      })
    },
    appSystemList () {
      this.outSystemList = this.appSystemList
      this.$nextTick(() => {
        // TODO 更新时 this.appSystemList 顺序存在问题
        this.initTabOffset()
        this.computerMoreList()
      })
    },
  },
  methods: {
    /**
     * 打开相应的子系统
     * @param item 子系统数据项
     * @param eventTarget 事件来源 outSystem/moreSystem
     */
    openSystem (item, eventTarget) {
      // fix: topbarAppSystemList 没有深度监听在 Layout 组件中 不能返回 children 实时结构,深度监听会有性能开销,
      const realItem = this.topbarAppSystemList.find(tItem => {
        return isEqualWithKeys(tItem, item, ['uuid', 'title'])
      })
      this.topbar.openSystem(realItem)
      if (eventTarget == 'moreSystem' && this.showMorePopper) {
        this.showMorePopper = false
      }
    },
    // 更多系统
    handleHover (e) {},
    initTabOffset () {
      // const rightSpace = 200
      const moreTagWidth = 44
      const navWrapWidth = this.$el.offsetWidth
      const navOffsetLeft = this.$el.offsetLeft
      const canUseWidth = navWrapWidth - moreTagWidth

      this.appSystemList.map((item, i) => {
        const $tab = get(this.$refs.tabs, i)
        item._offsetStart = $tab.offsetLeft - navOffsetLeft
        item._offsetEnd = $tab.offsetLeft + $tab.offsetWidth - navOffsetLeft
        item._isOutRange = item._offsetEnd > canUseWidth
      })
    },
    // 计算更多宽度
    computerMoreList: debounce(
      function (e, menuData) {
        this.$nextTick(() => {
          const moreTagWidth = 44
          const navWrapWidth = this.$el.offsetWidth
          const canUseWidth = navWrapWidth - moreTagWidth

          this.appSystemList.map((item, i) => {
            item._isOutRange = item._offsetEnd > canUseWidth
          })

          const outSystemList = []
          const moreSystemList = []
          this.appSystemList.map(item => {
            if (item._isOutRange) {
              moreSystemList.push(item)
            } else {
              outSystemList.push(item)
            }
          })
          this.outSystemList = outSystemList
          this.moreSystemList = moreSystemList
          this.showMoreSys = this.moreSystemList.length > 0

          this.setPopperLeft()
        })
      },
      800,
      { leading: true },
    ),
    setPopperLeft () {
      this.$nextTick().then(() => {
        const popperWrap = get(this, '$refs.popperWrap')
        if (!popperWrap) return
        this.$refs.popperWrap.style.left = this.$refs.popperRef.offsetLeft + 'px'
      })
    },
    openSysSort () {
      this.$refs.sysSort.open()
      this.showMorePopper = false
    }
  },
  created () {
    this.appSystemList = cloneDeep(this.topbarAppSystemList)
    this.outSystemList = cloneDeep(this.appSystemList)
  },
  mounted () {
    hoverInst = new Hover({
      popperRef: this.$refs.popperRef,
      popperWrap: this.$refs.popperWrap,
      handleEnter: () => {
        this.showMorePopper = true
      },
      handleLeave: () => {
        this.showMorePopper = false
      },
    })
    hoverInst.init()
    this.initTabOffset()
    this.computerMoreList()
    off(window, 'resize', this.computerMoreList)
    on(window, 'resize', this.computerMoreList)
  },
  beforeDestroy () {
    if (hoverInst && hoverInst instanceof Hover && hoverInst.destory) {
      hoverInst.destory()
    }
    off(window, 'resize', this.computerMoreList)
  },
}
</script>
