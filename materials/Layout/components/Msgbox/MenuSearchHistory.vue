<template>
  <!-- <transition> -->
  <div v-show="showHistory" :class="prefixCls" @click.stop="noop">
    <div :class="`${prefixCls}-head`">
      <span :class="`${prefixCls}-title`">历史记录</span>
      <span :class="`${prefixCls}-ctrl`">
        <div :class="`${prefixCls}-ctrl-item`" @click="onShowOptions">列表</div>
        <div :class="`${prefixCls}-ctrl-item`" @click="onClear">清空</div>
      </span>
    </div>
    <div :class="`${prefixCls}-body`">
      <transition name="fade">
        <div v-if="!isDataEmpty" :class="`${prefixCls}-tag-wrap`">
          <Tag ref="tagList" v-for="n in this.value" :key="n" closable>{{ n }}</Tag>
        </div>
      </transition>

      <transition name="fade" :duration="{ enter: 400, leave: 800 }">
        <div v-if="isDataEmpty" :class="`${prefixCls}-empty`">
          <img :class="`${prefixCls}-empty-icon`" :src="emptyIcon" alt="" />
          <span :class="[`${prefixCls}-empty-text`]">暂无历史</span>
        </div>
      </transition>
    </div>
  </div>
  <!-- </transition> -->
</template>

<script>
import Tag, { TAG_CONFIG } from '@packages/Tag'
import { isEmpty } from '@hui/shared-utils'
import PropTypes from '@hui/shared-utils/vue-types'
import emptyIcon from './hui2-icon-empty.js'

TAG_CONFIG.PREFIX = 'h-layout'
const prefix = 'h-layout-head'
export default {
  name: 'LayoutHeadSearchHistory',
  components: { Tag },
  provide () {
    return { TAG_CONFIG }
  },
  inject: {
    selectData: { default: () => ({}) },
  },
  props: {
    value: PropTypes.array.def([]),
  },
  data () {
    this.prefix = prefix
    this.prefixCls = `${prefix}-search-history`
    this.emptyIcon = emptyIcon
    return {
      show: true,
    }
  },
  computed: {
    isDataEmpty () {
      return isEmpty(this.value)
    },
    query () {
      return this.selectData.query
    },
    dropdownShow () {
      return this.selectData.visible
    },
    showHistory () {
      return !this.query && this.show
    },
  },
  watch: {
    showHistory (showHistory) {
      this.showOptionList(!showHistory)
    },
    dropdownShow (val) {
      if (val) {
        this.keepTagWidth()
      }
      this.show = this.dropdownShow
    },
  },
  methods: {
    showOptionList (show) {
      this.$nextTick().then(() => {
        const dropdownDom = this.$parent.$el
        const optionListWrap = dropdownDom.querySelector('[data-hui-type="option-list"]')
        console.warn('show:', show, optionListWrap)
        if (!optionListWrap) {
          return
        }
        if (show) {
          optionListWrap.style.display = 'block'
          return
        }
        optionListWrap.style.display = 'none'
      })
    },
    noop () {},
    // 保持 tag 宽度
    keepTagWidth () {
      this.$nextTick().then(() => {
        if (isEmpty(this.$refs.tagList)) {
          return
        }
        this.$refs.tagList.map(item => {
          const el = item.$el
          el.style.width = el.offsetWidth + 1 + 'px'
        })
      })
    },
    onClear () {
      this.store.value = []
    },
    onShowOptions () {
      this.show = false
      this.showOptionList(true)
    },
  },
  mounted () {
    this.showOptionList(!this.showHistory)
  },
}
</script>
