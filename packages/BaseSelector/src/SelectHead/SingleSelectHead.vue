<template>
  <div
    :title="titleText"
    :style="headStyles"
    @click="onHeaderClick"
    :class="headCls"
    @mouseenter="setMouseover(true)"
    @mouseleave="setMouseover(false)"
    >
    <span :class="[prefixCls + '-prefix']" v-if="$slots.prefix || prefix">
      <slot name="prefix">
        <i :type="prefix" v-if="prefix" />
      </slot>
    </span>

    <span :class="[prefixCls + '-append']" v-if="$slots.append || append">
      <slot name="append">
        <i :type="append" v-if="append" />
      </slot>
    </span>

    <slot name="default">
      <span :class="defaultDisplayClasses" v-show="!showInput || !isFocused">
        {{ singleDisplayValue }}
      </span>
    </slot>

    <input
      ref="input"
      type="text"
      data-hui-type="select-head-input"
      v-if="showInput"
      v-show="isFocused"
      v-model="query"
      :id="inputElementId"
      :disabled="disabled"
      :readonly="readonly"
      :class="[prefixCls + '-input']"
      :placeholder="browser.type === 'IE' ? null : showPlaceholder ? localePlaceholder : '' "
      :style="inputStyle"
      autocomplete="off"
      spellcheck="false"
      @keyup="keyupInput"
      @keydown="keydownInput"
      @focusin="onInputFocus"
      @focusout="onInputBlur"
      @paste="onInputPaste"
    />
    <div :class="prefixCls + '-head-right'" :ref="prefixCls + '-head-right'" >
      <transition :name="transitionType">
        <i
          v-if="showClearIcon"
          ref="clear"
          name="clear"
          :class="[
            prefixCls + '-head-clear',
            prefixCls + '-head-right-icon',
            SELECT_ICON.clear
          ]"
          @click.stop="onClearSelect"
        ></i>
      </transition>
      <i
        v-if="showArrowIcon && !showLoadingIcon"
        ref="arrow"
        name="arrow"
        :class="[
          prefixCls + '-head-arrow',
          prefixCls + '-head-right-icon',
          SELECT_ICON.arrow
        ]"
      ></i>
      <i
        v-if="showLoadingIcon"
        ref="loading"
        name="loading"
        :class="[
          prefixCls + '-loading',
          prefixCls + '-head-loading',
          prefixCls + '-head-right-icon',
          remote.loadingIcon || SELECT_ICON.loading
        ]"
      ></i>
    </div>
  </div>
</template>
<script>
import classnames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import { Emitter } from '@hui/shared-utils'
// todo
import Locale from '@hui/shared-utils/vue-mixins/locale'
import { getIeVersion, getBrowerInfo } from '@materials/BizLayout/src/utils/index.js'
import { mapSelectProps, mapSelectData, debounce } from '../utils'
import { SELECT_CONFIG } from '../config'

export default {
  name: 'SingleSelectHead',
  mixins: [Emitter, Locale],
  inject: {
    SELECT_CONFIG: { default: () => SELECT_CONFIG },
    selectProps: { default: () => ({}) },
    selectData: { default: () => ({}) },
    onClearSelect: { default: () => ({}) },
    onSelectOption: { default: () => ({}) },
    onPasteAssignment: { default: () => ({}) },
    isDisabled: { default: () => ({}) },
  },
  data () {
    const { PREFIX, SELECT_ICON } = this.SELECT_CONFIG
    // const prefixCls = `${PREFIX || 'h'}-select`
    const prefixCls = `${PREFIX || 'h'}-selector`
    return {
      prefixCls,
      SELECT_ICON,
      headTitle: '',
      preventRemoteCall: false,
      isMouseover: false,
      debounce,
      headStyles: null,
      transitionType: null,
      browser: {},
    }
  },
  computed: {
    ...mapSelectProps({
      disabled: 'disabled',
      readonly: 'readonly',
      placeholder: 'placeholder',
      clearable: 'clearable',
      showArrowIcon: 'isArrow',
      filterable: 'filterable',
      remote: 'remote',
      initialLabel: 'initialLabel',
      inputElementId: 'inputElementId',
      multiple: 'multiple',
      showCreateItem: 'showCreateItem',
      prefix: 'prefix', // icon 样式名格式化
      append: 'append',
      selectPaste: 'selectPaste', // 是否通过赋值文本直接赋值
      multHeadType: 'multHeadType',
      showTitle: 'showTitle',
    }),
    ...mapSelectData({
      showLoadingIcon: selectData => selectData.remoteInfo.loading,
      // isFocused: 'isFocused',
    }),
    /**
     * query 需要注意：正对query值，在singleSelectHead/multiSelectHead组件内部不针对由于外部值变化，从而导致query值赋值的变化
     * [query inside] 在head组件针对query值的改变，只能有input输入框键盘输入值改变；即：用户在主动改变值；发生在computed set阶段；
     * 注意：set阶段不允许在其他阶段触发
     * [query outside] 在外部Selector传递query值改变导致的输入框query值改变；发生在set get阶段
     */
    query: {
      get () {
        return this.selectData.query
      },
      set (val) {
        this.selectData.query = val
        this.$emit('on-inside-query-change', val)
      }
    },
    value () {
      return this.selectData.singleInfo.currentOption.label
    },
    isFocused () {
      return this.selectData.isFocused
    },
    defaultDisplayClasses () {
      const { showPlaceholder, prefixCls, disabled, readonly } = this
      return [
        `${prefixCls}-selected-text`,
        {
          // TODO 前置插槽判断错误
          [prefixCls + '-head-with-prefix']: this.$slots.prefix || this.prefix,
          [prefixCls + '-placeholder']: showPlaceholder,
          [prefixCls + '-selected-value']: !showPlaceholder,
        }
      ]
    },
    // 使用 prefix 时，在 filterable
    headCls () {
      const { multiple, multHeadType, prefixCls, filterable } = this
      return [
        `is-multiple-${multHeadType}`,
        {
          [`${prefixCls}-head`]: true,
          'is-single': !multiple,
          'is-multiple': multiple,
          [`${prefixCls}-head-flex`]: filterable && (this.$slots.prefix || this.prefix),
        }
      ]
    },
    selectedSingle () {
      return this.value || ''
    },
    singleDisplayValue () {
      // if (this.filterable) return ''
      return `${this.selectedSingle}` || this.localePlaceholder
    },
    showPlaceholder () {
      let status = false
      const value = this.value
      status = !value || String(value).trim() === ''
      return status
    },
    showClearIcon () {
      const { disabled, readonly, clearable, isMouseover } = this
      return !disabled && !readonly && !this.showPlaceholder && (clearable || isMouseover)
    },
    inputStyle () {
      const style = {}
      return style
    },
    localePlaceholder () {
      if (isEmpty(this.placeholder) && this.t) {
        return this.t('i.select.placeholder')
      }
      return this.placeholder
    },
    showInput () {
      const { filterable, disabled, readonly } = this
      return !disabled && !readonly && filterable
    },
    watchHeadStyles () {
      const { showArrowIcon, showClearIcon, showLoadingIcon } = this
      return {
        showArrowIcon, showClearIcon, showLoadingIcon
      }
    },
    titleText () {
      const { singleDisplayValue, showTitle } = this
      if (!showTitle) return null
      return singleDisplayValue
    }
  },
  watch: {
    watchHeadStyles () {
      setTimeout(() => {
        this.headStyles = this.getHeadStyles()
      }, 400)
    }
  },
  methods: {
    stopEvent (e) {
      if (!e) {
        return
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onInputFocus (e) {
      // console.log('onSelect Input Focus', e)
      // this.stopEvent(e)
      this.$emit('on-select-input-focus', e)
      // TODO 值全选情况判断
      this.$refs.input.select()
    },
    onInputBlur (e) {
      // console.log('onSelect Input Blur', e)
      // this.stopEvent(e)
      if (this.showCreateItem) return
      this.$emit('on-select-input-blur', e)
    },
    onInputKeyup (e) {
      this.$emit('on-select-input-keydown', e)
    },
    onInputEnter (e) {
      this.$emit('on-select-input-enter', e)
    },
    onInputDelete (e) {
      this.$emit('on-select-input-delete', e)
    },
    onInputPaste (e) {
      const { selectPaste } = this
      const pasteText = (e.clipboardData || window.clipboardData).getData('text')
      // console.log('pasteText', pasteText)
      this.dispatch('u-base-selector', 'on-paste', pasteText, { event: e })
      if (selectPaste) {
        e.preventDefault()
        this.onPasteAssignment(e, pasteText)
      }
    },
    onHeaderClick () {},
    setMouseover (bol) {
      // if (this.multiple) return
      this.isMouseover = bol
    },
    keyupInput (e) {},
    keydownInput (e) {},
    getHeadRightWidth () {
      const { prefixCls } = this
      const headRight = this.$refs[prefixCls + '-head-right']
      const width = !headRight ? 8 : headRight.clientWidth
      return width
    },
    getHeadStyles () {
      // console.log('headRight', this.$refs)
      const paddingLeft = this.getHeadRightWidth()
      return {
        'padding-right': paddingLeft + 'px',
      }
    },
  },
  created () {
    const browser = getBrowerInfo()
    const browserList = ['Edge', 'IE']
    if (!browserList.includes(browser.type)) {
      this.transitionType = 'fade'
    }
    this.browser = browser
  },
}
</script>
