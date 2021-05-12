<script>
import Poptip from '@packages/Poptip/index'
import TextTag from './TextTag'
import SingleSelectHead from './SingleSelectHead'
import get from 'lodash/get'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'
import { isValidElement } from '@hui/shared-utils'
import { mapSelectProps } from '../utils'
import { SELECT_CONFIG } from '../config'

const noop = () => {}
export default {
  mixins: [SingleSelectHead],
  name: 'MultiSelectHead',
  components: { TextTag, Poptip },
  inject: {
    SELECT_CONFIG: { default: () => SELECT_CONFIG }
  },
  data () {
    const { PREFIX } = this.SELECT_CONFIG
    // const prefixCls = `${PREFIX || 'h'}-select`
    const prefixCls = `${PREFIX || 'h'}-selector`
    return {
      prefixCls,
      multipleDisplayValue: '', // text模式下使用
    }
  },
  computed: {
    ...mapSelectProps({
      maxTagCount: props => +props.maxTagCount,
      maxTagPlaceholder: 'maxTagPlaceholder',
      maxTagNumber: 'maxTagNumber',
      tagKey: 'tagKey',
      valueKey: 'valueKey',
      multHeadType: 'multHeadType',
      popTipProps: 'moreTagPopTipProps',
      // TODO showTitle 样式
      showTitle: 'showTitle'
    }),
    selectedOptions () {
      return this.selectData.multiInfo.currentOptions
    },
    // mutiple has differ
    showPlaceholder () {
      let status = false
      status = this.selectedOptions.length == 0
      return status
    },
    // TODO multiple input 搜索框可自定义
    inputStyle () {
      const { query, singleDisplayValue, multiple, selectedOptions } = this
      const style = {}
      function getInputWidth (len) {
        return len * 12 + 20
      }
      if (multiple) {
        if (query === '') {
          style.width = getInputWidth(singleDisplayValue.length) + 'px'
          if (selectedOptions.length > 0) style.width = '5px'
          return style
        }
        const inputLength = getInputWidth(query.length)
        style.width = `${inputLength}px`
      }
      return style
    },
    extraTagNum () {
      if (!this.maxTagCount) {
        return 0
      }
      const extraTagNum = this.selectedOptions.length - this.maxTagCount
      return extraTagNum
    },
    extraTags () {
      if (!this.maxTagCount) {
        return []
      }
      return this.selectedOptions.slice(this.maxTagCount)
    },
    titleText () {
      const { showTitle, multHeadType, multipleDisplayValue, localePlaceholder, selectedOptions } = this
      if (!showTitle) return null
      if (selectedOptions.length === 0) return localePlaceholder
      if (multHeadType === 'tag') return null
      if (multHeadType === 'text') return multipleDisplayValue
      return null
    }
  },
  methods: {
    // multiple method
    removeTag (option) {
      // this.onSelectOption(option)
      const { common } = this.selectData
      const { removeTag } = common
      removeTag(option)
      // this.selectData.common.removeTag(option)
    },
    // multiple method
    formatTag (item) {
      const tagKey = this.tagKey
      return item[tagKey]
    },

    // 通过覆盖 singleSelectHead default 插槽更改head内容
    patchTags () {
      this.$slots.default = this.renderTags()
    },

    renderTags () {
      const {
        defaultDisplayClasses,
        selectedOptions,
        localePlaceholder,
        maxTagCount,
        multHeadType,
        query,
        filterable,
        isFocused,
        showInput
      } = this
      // 为空时显示 placeholder 文本
      const placeholderBol = (this.showInput && !isFocused) || !this.showInput
      const placeholder = (
        <span class={defaultDisplayClasses} v-show={selectedOptions.length == 0 && placeholderBol}>
          {localePlaceholder}
        </span>
      )
      const multHeadTypeMap = {
        tag: 'renderNormalTags', // tag 标签头
        textTag: 'renderTextTags', // ued 暂时弃用
        text: 'renderText' // 连续文本头
      }
      // 通过多选multHeadType不同类型，设置渲染表头方法
      const method = multHeadTypeMap[multHeadType] || 'renderNormalTags'
      let tags = this[method](selectedOptions, maxTagCount)
      let moreTag = null
      if (selectedOptions.length > maxTagCount) {
        moreTag = this.renderMoreTag()
      }
      const isTextHead = multHeadType === 'text'
      if (isTextHead) {
        // text场景下，不需要显示moreTag元素
        moreTag = null
        // 当可搜索的场景下，默认 placeholder 不需要展示，通过 input默认提示来展示
        // filterable && !this.isDisabled() && (placeholder = null)
        // text场景下，由于tags，input,在统一可视区域显示，所以当query有值时，默认placeholder、tags内容不展示即可
        if (filterable && query !== '') {
          tags = null
        }
      }
      if (multHeadType === 'tag') {
        // 可搜索 && 非 disabled、readonly状态下，不需要显示placeholder的节点
        // filterable && !this.isDisabled() && (placeholder = null)
      }
      return [placeholder, tags, moreTag]
    },

    renderNormalTags (selectedOptions, maxTagCount, cb = noop) {
      const tags = selectedOptions.map((item, index) => {
        if (maxTagCount && index >= maxTagCount) {
          return null
        }
        // const prefixCls = this.prefixCls
        const { prefixCls, disabled, readonly } = this
        const { SELECT_ICON } = this.SELECT_CONFIG
        const key = item.value
        const { disabled: nodeDisabled } = item
        const isShowClose = !disabled && !readonly && !(nodeDisabled === true)
        const tagText = this.formatTag(item)
        // TODO ellipsis computer
        const isEllipsis = 12 * tagText.length > 62
        const showTitle = isEllipsis && this.showTitle
        // class={`${prefixCls}-tag ${prefixCls}-tag-checked`}
        const tagCls = [
          `${prefixCls}-tag`,
          `${prefixCls}-tag-checked`,
          {
            [`${prefixCls}-tag-disabled`]: nodeDisabled === true || disabled,
            [`${prefixCls}-tag-readonly`]: readonly
          }
        ]
        return (
          <div
            key={`${prefixCls}-tag-${key}`}
            title={showTitle ? tagText : ''}
            class={tagCls}
          >
            <span class={`${prefixCls}-tag-text`}>{tagText}</span>
            <i
              v-show={isShowClose}
              name="close"
              class={SELECT_ICON.tagClose}
              onClick={e => { e.stopPropagation(); this.removeTag(item); cb() }}
            ></i>
          </div>
        )
      })
      return tags
    },

    renderTextTags () {
      const {
        selectedOptions,
        maxTagCount,
        onTextTagKeydown,
        onTextTagFocus,
      } = this
      const { PREFIX } = this.SELECT_CONFIG
      const tags = selectedOptions.map((item, index) => {
        if (!(maxTagCount === undefined || index < maxTagCount)) {
          return null
        }
        const attr = {
          props: {
            PREFIX: PREFIX,
            index,
            item,
            maxTagCount,
            selectedOptions,
            onTextTagKeydown,
            onTextTagFocus,
            key: item.value
          }
        }
        return <TextTag {...attr}></TextTag>
      })
      return tags
    },

    renderText () {
      const { selectedOptions, prefixCls, filterable, isFocused, defaultDisplayClasses } = this

      const tags = selectedOptions.reduce((acc, item, index) => {
        return (
          acc +
          (item.tag !== undefined ? item.tag : item.label) +
          (index < selectedOptions.length - 1 ? ', ' : '')
        )
      }, '')
      this.multipleDisplayValue = tags
      const renderTextCls = [
        `${prefixCls}-text-tags`,
        {
          [`${prefixCls}-text-tags-focused`]: filterable && isFocused
        },
        ...defaultDisplayClasses
      ]
      return <span v-show={tags} data-hui-type="select-head" class={renderTextCls}>{tags}</span>
    },

    /**
     * 生成额外标签数字dom
     * 如果是大数据就不渲染
     * @param {string} val
     */
    renderMoreTag () {
      const { selectedOptions, prefixCls, maxTagNumber, maxTagCount } = this
      // const prefixCls = this.prefixCls
      const val = this.extraTagNum
      const className = `${prefixCls}-tag ${prefixCls}-tag-checked is-more`

      // 大数据场景下（virtual=true）,只显示数字，不显示poptip提示隐藏内容
      if (selectedOptions.length - Number(maxTagCount) > maxTagNumber) {
        const text = ` +${val} `
        return <div class={className}><div>{text}</div></div>
      }

      // const title = this.extraTags
      //   .map(item => (item.tag !== undefined ? item.tag : item.label))
      //   .join(',')
      // title={this.showTitle ? title : ''}

      const updatePop = () => {
        const pop = get(this, '$refs.moreTagPop')
        if (pop) {
          pop.updatePopper()
        }
      }
      const moreTags = this.renderNormalTags(this.extraTags, null, updatePop)

      const popClassName = [
        `${prefixCls}-tag-more-poptip`,
        this.popTipProps.popClassName
      ].join(' ')
      const zIndex = this.popTipProps.zIndex
      const popTipProps = this.popTipProps

      const defaultTag = text => (
        <Poptip
          ref="moreTagPop"
          transfer={popTipProps.transfer || true}
          trigger={popTipProps.trigger || 'hover'}
          class={className}
          zIndex={zIndex}
          customTransferClassName={popClassName}
          data-select-head-type={this.multHeadType}
          nativeOnClick={e => {
            e.stopPropagation()
          }}
          {...popTipProps}
        >
          <div>{text}</div>
          <div
            class={[`${prefixCls}`, `${prefixCls}-tag-pop-wrap`]}
            slot="content"
          >
            {moreTags}
          </div>
        </Poptip>
      )
      if (this.maxTagPlaceholder && isString(this.maxTagPlaceholder)) {
        return defaultTag(this.maxTagPlaceholder)
      }
      if (this.maxTagPlaceholder && isFunction(this.maxTagPlaceholder)) {
        const tagContent = this.maxTagPlaceholder(
          {
            extraTagNum: this.extraTagNum,
            extraTags: this.extraTags
          },
          this.$createElement
        )
        if (isValidElement(tagContent)) {
          return tagContent
        }
        return defaultTag(tagContent)
      }
      const text = ` +${val} `
      return defaultTag(text)
    },

    // 聚焦textTag时全选range
    onTextTagFocus (e) {
      function focusLast (el) {
        var range = document.createRange()
        var sel = window.getSelection()
        range.setStartAfter(el.firstChild)
        range.setEndAfter(el.firstChild)
        sel.removeAllRanges()
        sel.addRange(range)
      }
      focusLast(e.target)
    },

    onInputKeyup (e) {
      const atStart = e.target.selectionStart == 0
      const atEnd = e.target.selectionStart == e.target.value.length
      const keyCode = Object.freeze({
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
      })
      if (atEnd && e.keyCode == keyCode.RIGHT) {
        this.onTextTagKeydown(e, 'right')
      }
      if (atStart && e.keyCode == keyCode.LEFT) {
        this.onTextTagKeydown(e, 'left')
      }
    },

    // textTag 键盘快捷键
    onTextTagKeydown (e, type, item) {
      e.preventDefault()
      // e.stopPropagation()
      let children = this.$el.querySelectorAll('[data-name="tag-cell"]')
      children = Array.from(children).concat(this.$refs.input)
      const index = children.findIndex(item => item == e.target)
      if (index < 0) {
        return
      }

      if (type == 'delete') {
        e.stopPropagation()
        this.removeTag(item)
      }

      if (type == 'right') {
        e.stopPropagation()
        if (index === children.length - 1) {
          children[0].focus()
          return
        }
        children[index + 1].focus()
      }

      if (type == 'left') {
        e.stopPropagation()
        if (index === 0) {
          children[children.length - 1].focus()
          return
        }
        children[index - 1].focus()
      }
    },
    // input 方法
    onInputBlur (e) {
      // console.log('onSelect 多选 Input Blur', e)
      this.stopEvent(e)
      if (this.showCreateItem) return
      this.$emit('on-input-blur', e)
    }
  },
  created () {
    this.patchTags()
  },
  beforeMount () {},
  beforeUpdate () {
    this.patchTags()
  }
}
</script>
