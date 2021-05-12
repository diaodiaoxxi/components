<script>
import CONFIG from './config'
import clickoutside from '@hui/directives/clickoutside'
import TransferDom from '@hui/directives/transfer-dom'
import SingleSelectHead from './SelectHead/SingleSelectHead'
import MultiSelectHead from './SelectHead/MultiSelectHead'

import isEmpty from 'lodash/isEmpty'

import Hotkey from './hotkey'
import FormatValue from './formatValue'
// TODO LOCAL
import Locale from '@hui/shared-utils/vue-mixins/locale'
import { cloneElement, Emitter } from '@hui/shared-utils'
import { isStringFormat } from './format'

import Tip from './Tip.vue'
import Drop from './Dropdown.vue'

import baseProps from './props'

// import { debounce } from './utils'

const { PREFIX } = CONFIG
// const prefixCls = `${PREFIX || 'h'}-base-select`
const prefixCls = `${PREFIX || 'h'}-selector`

/**
 * 触发表单校验情况
 * initValue 初始化赋值
 * valueChange 手动赋值 value值改变
 * selected 选中option改变 value
 * blur
 * focus
 */
const initValidateStatus = [
  'initValue',
  'valueChange',
  'selected',
  'blur',
  'focus'
]

/**
 * init: 点击展开是否显示的选中项，是否根据当前值过滤
 * type: 根据什么字段过滤 （all, value, lable）或者字段名称  （id, title等）
 */
const defaultFilterParams = [
  'type',
]

export default {
  /* 对外开放的名称为 u-select, 内部为u-base-selector，针对找组件等有效 */
  name: 'u-base-selector',
  mixins: [Emitter, Locale, Hotkey, FormatValue],
  data () {
    return {
      visible: false,
      isFocused: false,
      flatData: [],
      validateStatus: initValidateStatus,
      query: '',
      searchQuery: '',
      queryTimeout: null,
      isListEmpty: false,
      childInstance: {
        body: null,
        list: null,
      },
      singleInfo: {
        currentOption: {}
      },
      multiInfo: {
        clearQuery: ['clickouside', 'optionSelected'],
        radioOption: null,
        isOverage: false,
        currentOptions: []
      },
      remoteInfo: {
        loading: false,
        loadingIcon: true,
        loadingText: '',
        method: undefined
      },
      /* body内部的相关快捷键方法 */
      hotKey: {
        navigateOptions: () => {},
        selectAll: () => {},
        unselectAll: () => {},
        onKeydownEnter: () => {},
        allowKeyToExpand: () => {},
      },
      common: {
        removeTag: () => {},
      }
    }
  },
  provide () {
    return {
      selectProps: this.$props,
      selectData: this.$data,
      selectSlot: this.$slots,
      onClearSelect: this.onClearSelect,
      setSelectValue: this.setSelectValue,
      // onSelectTreeOption: this.onSelectTreeOption,
      onPasteAssignment: this.onPasteAssignment,
      isDisabled: this.isDisabled,
      // // ctrl
      // selectAll: this.selectAll,
      // unselectAll: this.unselectAll,
      // // create
      // createOption: this.createOption,
      // 不清除query
      setClearQuery: this.setClearQuery,
      getValue: this.getValue,
      setFormat: this.setFormat,
    }
  },
  directives: { clickoutside, 'transfer-dom': TransferDom },
  computed: {
    selectTabindex () {
      return this.isDisabled() ? -1 : this.tabindex
    },
  },
  props: baseProps,
  model: {
    prop: 'value',
    event: 'on-change'
  },
  methods: {
    stopEvent (e) {
      if (!e) {
        return
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onClickOutside (event) {
      // console.log('onSelect onClickOutside')
      this.toggleMenu(false)
      // this.$emit('on-clickoutside', event)
    },
    onSelectWrapBlur (event) {
      if (event.detail === 0) return
      // console.log('onSelectWrapBlur:2', this.isFocused, event.detail, event)
      if (this.isFocused === false) return
      // console.log('onSelectWrapBlur:2', this.isFocused, event.detail, event)
      this.isFocused = false
      this.$emit('on-blur', event)
      if (this.validateStatus.includes('blur')) {
        this.dispatch('FormItem', 'on-form-blur')
      }
      // console.log('触发了 onSelectWrapBlur')
    },
    onSelectWrapFocus (event) {
      if (event.detail === 0) return
      // console.log('onSelectWrapFocus', this.isFocused, event.detail, event)
      if (this.isFocused === true) return
      // console.log('onSelectWrapFocus', this.isFocused, event.detail, event)
      this.isFocused = true
      this.$emit('on-focus', event)
      if (this.validateStatus.includes('focus')) {
        this.dispatch('FormItem', 'on-form-focus')
      }
      // console.log('触发了 onSelectWrapFocus')
    },
    onSelectWrapClick (e) {
      // console.log('onSelectWrapClick')
      if (this.isDisabled()) return
      // console.log('onSelectWrapClick', this.visible)
      this.toggleMenu()
      // const { isFocused, visible } = this
      // if (isFocused && !visible) {
      //   this.toggleMenu(true)
      // } else if (!isFocused && visible) {
      //   this.toggleMenu(false)
      // } else {
      //   this.toggleMenu()
      // }
      if (this.visible && !this.multiple && this.value !== '') {
        const { list } = this.childInstance
        list && list.nodePosition(this.value)
      }
      this.$emit('on-click', e)
    },
    isValueEmpty () {
    },
    onClearSelect () {
      // this.query 触发watch中的clear，导致onClearSelect重复两次
      this.isFocused = false
      this.focusIndex = -1
      if (this.multiple) {
        this.query = ''
        this.setValue([])
        return
      }
      this.query = ''
      this.setValue({})
      this.$emit('on-clear-select')
    },
    /* 输入框值回显 */
    queryEcho () {
      const { multiple, filterable } = this.$props
      if (!filterable) return
      this.searchQuery = ''
      if (!multiple) {
        this.query = this.singleInfo.currentOption.label
      } else {
        this.query = ''
      }
    },
    setSelectQuery (value) {
    },
    // 粘贴文本赋值
    onPasteAssignment (e, pasteText) {
      const { multiple, isString } = this.$props
      if (multiple) {
        const formatValue = isString ? pasteText : isStringFormat.parse(pasteText)
        // console.log('onPasteAssignment', formatValue)
        this._setValue(formatValue)
        return
      }
      this._setValue(pasteText)
    },
    /* 设置值v-model、singleInfo、multiInfo */
    setSelectValue (options) {
      // console.log('===== setSelectValue =====')
      // this.stopEvent(event)
      /* 单选场景 */
      if (!this.multiple) {
        const option = options
        // console.log('onSelect setSelectValue')
        this.toggleMenu(false)
        // this.searchQuery = ''
        // this.singleInfo.currentOption = option
        this.setValue(option)
        return
      }
      /* 多选场景 */
      // this.multiInfo.currentOptions = options
      this.setValue(options)
    },
    /** * 切换下拉列表显示 **/
    /**
     * 针对下拉面板 展开、收起
     * 展开：
     * 1. 当下拉面板在展开状态下（visible=false）时，点击warp头部（调用onSelectWrapClick函数）；
     * 2. 当用户在外部调用foucus函数，是warp(input)聚焦，此时下拉面板未展开，当用户点击键盘，展开下拉面板（on-input-keyup）
     * 收起：
     * 1. 当下拉面板在展开状态下（visible=true）时，点击warp头部（调用onSelectWrapClick函数）收起下拉面板
     * 2. 当点击外部，调用onClickOutside函数，收起面板
     * 3. 单选时，选择下拉项（hander选择、enter键选择），收起面板
     *
     * 常规场景：展开面板时，input始终聚焦（有值时，且选中select()）；收起面板时，input失焦
     * 特殊处理：当由于展开的第2种中情况出发的展开面板，此时有值时，不需要选中（select）值
     * 调用toggleMenu()方法，在可搜索场景下，收起下拉面板menu,则数据需要回显
     */
    toggleMenu (force) {
      // console.log('onSelect this.visible ', this.visible, force)
      // 去除一些不必要的重复展开调用切换面板函数
      /** 兼容场景
       * 当组件isFocused聚焦时，但是下拉框未展开的时候 eg：当外部调用onFocus()方法，下拉框未展开的，组件处于聚焦聚焦状态
       */
      if (this.visible === force && !this.isFocused) return

      if (this.isDisabled()) return false

      // console.log(`触发了 toggleMenu；force: ${force}；visible：${this.visible}`)

      this.visible = typeof force !== 'undefined' ? !!force : !this.visible

      /* 当面板切换收起时，组件wrap失焦， */
      if (!this.visible) {
        // console.log('onSelectWrap toggleMenu')
        this.wrapBlur()
      }

      /* 当面板切换展开时，组件wrap聚焦， */
      if (this.visible) {
        this.wrapFocus()
      }

      const $input = this.findInputElement()
      if ($input) {
        // !this.visible && (this.searchQuery = '')
        setTimeout(() => {
          this.visible && $input.select()
          if (!this.visible) {
            $input.blur()
            this.queryEcho()
          }
        })
      }
    },
    renderHeader (h) {
      const { multiple } = this.$props
      const { body } = this.childInstance
      const { virtual } = body || { virtual: false }
      const defaultHead = multiple ? MultiSelectHead : SingleSelectHead
      if (this.$slots['select-head']) return this.$slots['select-head']
      const headProps = {
        on: {
          'on-inside-query-change': (query) => {
            this.visible = true
            if (virtual) {
              clearTimeout(this.queryTimeout)
              this.queryTimeout = setTimeout(() => {
                this.searchQuery = query
                this.dropdownUpdate()
              }, 300)
              // debounce(() => { this.searchQuery = query }, 3000)()
            } else {
              this.searchQuery = query
              this.dropdownUpdate()
            }
          }
        }
      }
      return (
        <defaultHead {...headProps}>
          <template slot="prefix">
            {this.$slots.prefix}
          </template>
          <template slot="append">
            {this.$slots.append}
          </template>
        </defaultHead>
      )
    },
    renderDropdown (h) {
      const { animated, transfer, placement, dropWidth, widthAdaption, maxDropWidth, autoPlacement, filterable, loading } = this.$props
      const { visible, isListEmpty } = this.$data
      const dropAnimation = () => {
        if (typeof animated == 'string') {
          return animated
        }
        return animated ? 'transition-drop' : ''
      }
      const dropdownCls = [
        `${prefixCls}-dropdown`,
        {
          [prefixCls + '-dropdown-transfer']: transfer,
          'is-multiple': this.multiple,
          'is-overage': this.multiInfo.isOverage
        }
      ]
      const dropProps = {
        class: dropdownCls,
        ref: 'dropdown',
        props: {
          placement: placement,
          transfer: transfer,
          dropWidth: dropWidth,
          widthAdaption: widthAdaption,
          maxDropWidth: maxDropWidth,
          autoPlacement: autoPlacement,
        },
        attrs: {
          tabindex: filterable ? -1 : null,
          'data-transfer': transfer,
        },
        style: {
          'min-height': loading ? '76px' : 'auto'
        },
        nativeOn: {
          click: (e) => {
            // console.log('===== nativeOn', this.visible)
            this.visible && this.onInputFocus()
            // console.log('nativeOn click')
            this.stopEvent(e)
          },
          focusout: (e) => {
            // console.log('onSelect nativeOn blur', e)
            this.stopEvent(e)
          },
          focusin: (e) => {
            // console.log('onSelect nativeOn foucus in', e)
            this.stopEvent(e)
          }
        }
      }

      const defaultElement = cloneElement(this.$slots.default, {
        style: {
          display: !isListEmpty ? 'block' : 'none'
        }
      })
      const emptyElement = cloneElement(<Tip type="notFound"></Tip>, {
        style: {
          display: isListEmpty && !loading ? 'block' : 'none'
        }
      })
      const loadingElement = cloneElement(<Tip type="loading"></Tip>, {
        style: {
          display: loading ? 'flex' : 'none'
        }
      })
      return (
        <transition name={dropAnimation()}>
          <Drop
            v-transfer-dom
            v-show={visible}
            {...dropProps}
          >
            <template slot="dropHead">
              {this.$slots.dropHead}
            </template>
            <template slot="default">
              <div ref="selector-dropdown" style="overflow: auto">
                {defaultElement}
                {emptyElement}
                {loadingElement}
              </div>
            </template>
            <template slot="dropFoot">
              {this.$slots.dropFoot}
            </template>
          </Drop>
        </transition>
      )
    },
    updateDropdown () {
      // console.log('updateDropdown')
      this.$nextTick(() => {
        this.$refs.dropdown.update()
      })
    },
    findInputElement () {
      const type = 'select-head-input'
      const $input = this.$el.querySelector(
        `input[data-hui-type="${type}"]`
      )
      return $input
    },
    isDisabled () {
      const { disabled, readonly } = this.$props
      return disabled || readonly
    },
    onFocus (drop = true) {
      if (this.isDisabled()) return
      if (drop) {
        this.toggleMenu(true)
        return
      }
      this.wrapFocus()
      this.onInputFocus()
    },
    onBlur (drop = true) {
      if (this.isDisabled()) return
      if (drop) {
        this.toggleMenu(false)
        return
      }
      this.wrapBlur()
      this.onInputBlur()
    },
    wrapFocus () {
      const { filterable } = this.$props
      // const event = new CustomEvent('focusin', { detail: 'focus' })
      // // const event = new CustomEvent('focus', { detail: 'focus' })
      // this.$refs.reference.dispatchEvent(event)

      const event = new CustomEvent('onClick', { detail: 'focus' })
      this.$refs.reference.dispatchEvent(event)

      // !filterable && this.$refs.reference.focus()
    },
    wrapBlur () {
      const { filterable } = this.$props
      const event = new CustomEvent('focusout', { detail: 'blur' })
      // const event = new CustomEvent('blur', { detail: 'blur' })
      this.$refs.reference.dispatchEvent(event)
      !filterable && this.$refs.reference.blur()
    },
    onInputFocus () {
      const $input = this.findInputElement()
      // console.log('$input---->', $input)
      this.$nextTick(() => {
        if ($input) {
          $input.focus()
        }
      })
    },
    onInputBlur () {
      const $input = this.findInputElement()
      if ($input) $input.blur()
    },
    dropdownUpdate () {
      if (this.visible) {
        // console.log('updateDropdown')
        this.updateDropdown()
      }
    }
  },
  updated () {
    this.dropdownUpdate()
  },
  created () {
    this.$on('is-list-empty', (value) => {
      // console.log('u-base-selector is-list-empty', value)
      this.isListEmpty = value
    })
  },
  beforeDestroy () {
    this.$off('is-list-empty')
  },
  watch: {
    'singleInfo.currentOption': {
      deep: true,
      handler (currentOption) {
        // console.log('watch singleInfo.currentOption', currentOption)
        const { filterable } = this.$props
        if (!filterable) return
        const label = isEmpty(currentOption.label) ? '' : currentOption.label
        this.query = label
        // setTimeout(() => {
        //   console.log(111111)
        //   this.singleInfo.currentOption.label = 'hahahahahah'
        //   this.singleInfo.currentOption.value = 'hhhhhhg'
        // }, 4000)
      }
    }
  },
  render (h) {
    // console.log('=====render=======', this.$props)

    const { disabled, readonly, multiple, filterable } = this.$props
    const { selectTabindex } = this
    const { visible, isFocused } = this.$data
    const classCls = [
      prefixCls,
      {
        [`${prefixCls}-visible`]: visible,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-readonly`]: readonly,
        [`${prefixCls}-multiple`]: multiple,
        [`${prefixCls}-single`]: !multiple,
        [`${prefixCls}-focused`]: isFocused,
        'adapt-height': false
      }
    ]
    const selectionCls = [
      {
        [`${prefixCls}-selection`]: true,
        [`${prefixCls}-selection-focused`]: isFocused
      }
    ]
    const clickoutside = { trigger: 'mousedown', handler: this.onClickOutside }
    const reference = {
      ref: 'reference',
      class: selectionCls,
      on: {
        focusout: this.onSelectWrapBlur,
        focusin: this.onSelectWrapFocus,
        // blur: this.onSelectWrapBlur,
        // focus: this.onSelectWrapFocus,
        click: this.onSelectWrapClick,
        keydown: this.onKeydown,
      },
      attrs: {
        tabindex: !filterable ? selectTabindex : -1,
      }
    }
    return (
      <div class={classCls} v-clickoutside={clickoutside} >
        <div {...reference}>
          {this.renderHeader(h)}
          {this.renderDropdown(h)}
        </div>
      </div>
    )
  }
}
</script>
