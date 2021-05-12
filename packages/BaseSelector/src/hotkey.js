import isEmpty from 'lodash/isEmpty'
import { getOptionsData } from './utils'
import { findComponentsDownward } from '@hui/shared-utils'
import { getValueByProp } from '@hui/shared-utils'

/**
 * 快捷键混入
 * ctrl + a 调用全选 selectAll
 * ctrl + d 调用反选 unselectAll
 * enter 调用 onKeydownEnter
 * 其他 调用 onKeydown
 */
export default {
  methods: {
    stopEvent (e) {
      if (!e) {
        return
      }
      e.preventDefault()
      e.stopPropagation()
    },
    /**
     * 全选
     * @param event 原生事件
     * @param isFilterOut 是否全选过滤后的结果
     * @param callPosition 函数调用来源 isHotKey | isSelectCtrl
     */
    selectAll (event, isFilterOut = false, callPosition) {
      // disabled readonly 单选 条件下不可 全选
      if (this.disabled || this.readonly) return
      if (!this.multiple) return
      // fix: 全选 聚焦不在 input 框下, 全选 会溢出 到框外选取 html 文本
      if (callPosition == 'isHotkey' && !this.filterable && event) {
        event.preventDefault()
      }

      // TODO 根据不同 body 动态添加 selectAll
      // 常规 options SelectAll
      this.normalSelectAll(event, isFilterOut)
      // 大数据  selectAll
      this.bigDataSelectAll(event, isFilterOut)
      // TODO tree selectAll
      // this.treeSelectAll(event,isFilterOut,componentSource)
    },
    // 反选
    unselectAll (event, isFilterOut = false) {
      // disabled readonly 单选 条件下不可 反选
      if (!this.multiple) return
      if (this.disabled || this.readonly) return

      // TODO 根据不同 body 动态添加 selectAll
      this.normalUnselectAll(event, isFilterOut)
      // 大数据  selectAll
      this.bigDataUnselectAll(event, isFilterOut)
    },
    // 按键监听
    onKeydown (e) {
      const { filterable, visible } = this
      // if (disabled || readonly) return
      const { keyCode, ctrlKey, metaKey } = e
      // console.log('onSelectonKeydown', e, keyCode)
      // if (!this.isDisabled()) {
      //   this.$emit('on-keydown', e)
      // }
      const keyMap = {
        8: 'Backspace',
        9: 'Tab',
        13: 'Enter',
        27: 'Escape',
        37: 'AllowLeft',
        38: 'ArrowUp',
        39: 'AllowRight',
        40: 'ArrowDown',
      }
      if (!filterable && visible === false && e.key !== 'Tab') {
        if (this.isDisabled()) return
        this.visible = true
        return
      }
      // TODO 区分设置当多选场景下，中文输入法，触发Backspace删除键，当输入框的值还未删除，tag已触发删除，（当前query判断为空）
      // TODO 兼容IE下，Backspace导致的页面返回的问题
      if (keyMap[keyCode] === 'Backspace') {
        if (this.isDisabled()) return
        // 优化当多选场景下，中文输入法，由于当前query判断为空，触发Backspace删除键，当输入框的值还未删除，tag已触发删除
        if (typeof e.target.value === 'string' && e.target.value !== '') return
        if (this.multiple && this.isBackClear) this.removeLastTag()
        return
      }
      // debugger
      if (this.visible) {
        const stopEvent = function () {
          e.preventDefault()
          e.stopPropagation()
        }
        if (keyMap[keyCode] === 'Tab') {
          // stopEvent()
          // if (!filterable) {
          //   this.toggleMenu(false)
          //   return
          // }
          // console.log('Tab')
        }
        // Esc slide-up
        /**
         * @key Escape
         * Esc slide-up
         */
        if (keyMap[keyCode] === 'Escape') {
          stopEvent()
          // this.hideMenu()
          // this.queryEcho()
          this.toggleMenu(false)
        }
        /**
         * @key AllowUp
         * next
         */
        if (keyMap[keyCode] === 'ArrowUp') {
          stopEvent()
          // this.navigateOptions('up')
          this.hotKey.navigateOptions('up')
        }
        /**
         * @key ArrowDown
         * prev
         */
        if (keyMap[keyCode] === 'ArrowDown') {
          stopEvent()
          this.hotKey.navigateOptions('down')
          // this.navigateOptions('down')
        }
        if (keyMap[keyCode] === 'Enter') {
          stopEvent()
          this.hotKey.onKeydownEnter()
        }
        /* 全选 */
        if ((ctrlKey || metaKey) && keyCode === 65) {
          stopEvent()
          this.hotKey.selectAll()
          return
        }
        /* 全不选 */
        if ((ctrlKey || metaKey) && keyCode === 68) {
          stopEvent()
          this.hotKey.unselectAll()
          return
        }

        /**
         * AllowRight
         */
        if (keyMap[keyCode] === 'AllowRight') {
          this.hotKey.allowKeyToExpand('open', e)
          return
        }
        /**
         * AllowLeft
         */
        if (keyMap[keyCode] === 'AllowLeft') {
          stopEvent()
          this.hotKey.allowKeyToExpand('close', e)
        }
      }
    },
    // enter
    onKeydownEnter () {
      if (!this.visible) {
        this.toggleMenu(true)
        return
      }
      if (!this.multiple) {
        this.hideMenu()
      }

      this.normalEnterSelect()
      this.bigDataEnterSelect()
    },
    /**
     * 键盘切换 option 聚焦
     * @param {number,string} direction 'up','down'
     */
    navigateOptions (direction) {
      const sMap = { up: -1, down: 1 }
      if (typeof direction == 'string') {
        direction = sMap[direction]
      }
      this.normalNavigateOptions(direction)
      // this.bigDataNavigateOptions(direction)
    },

    // 退格 在多选下删除最后一个标签
    removeLastTag () {
      // TODO input保持聚焦
      let multiOptions = this.multiInfo.currentOptions
      if (this.multiple && multiOptions.length > 0 && this.query === '') {
        // console.log(multiOptions)
        multiOptions = multiOptions.filter(v => !(v.disabled === true))
        const lastTag = multiOptions[multiOptions.length - 1]
        if (lastTag === undefined) {
          console.warn('[hui warn] 禁用【disabled】类tag不允许通过键盘删除哦~')
        }
        if (lastTag) { multiOptions.length > 0 && this.common.removeTag(lastTag) }
      }
    },

    // TODO 迁移到 SelectBody 内
    normalSelectAll (event, isFilterOut) {
      const isDefault = !isFilterOut
      const onSelect = oInstance => {
        if (!oInstance.selected) oInstance.onSelect()
      }
      // 默认全选
      if (isDefault) {
        const options = findComponentsDownward(this, 'Option', false)
        options.map(onSelect)
      }
      // 只选中过滤后的结果
      if (isFilterOut) {
        // 全选过滤后的结果
        if (this.flatOptions.length > 0) {
          this.flatOptions.map(optionVnode => {
            if (!getValueByProp(optionVnode, 'isHidden')) {
              onSelect(optionVnode.componentInstance)
            }
          })
        }
      }
    },

    normalUnselectAll (event, isFilterOut) {
      // FIXME 反选 input 焦点丢失
      const isDefault = !isFilterOut
      const unselect = oInstance => {
        if (oInstance.selected) oInstance.onSelect()
      }

      if (isDefault) {
        this.multiInfo.currentOptions = []
        this.$emit('on-change', [])
      }

      if (isFilterOut) {
        if (this.flatOptions.length > 0) {
          // 反选选过滤后的结果
          this.flatOptions.map(optionVnode => {
            if (!getValueByProp(optionVnode, 'isHidden')) {
              unselect(optionVnode.componentInstance)
            }
          })
        }
      }
    },

    normalEnterSelect () {
      if (!isEmpty(this.flatOptions)) {
        const optionComponent = this.flatOptions[this.focusIndex]
        if (this.focusIndex === -1) return this.hideMenu()
        if (optionComponent) {
          const optionData = getOptionsData(
            this.flatOptions,
            optionComponent.componentOptions.propsData.value
          )
          this.onSelectOption(optionData)
        }
      }
    },

    normalNavigateOptions (direction) {
      if (isEmpty(this.flatOptions)) return
      const indexsCanFocus = []
      this.flatOptions.map((option, i) => {
        const optionIsActive = !option.componentOptions.propsData.disabled
        const optionIsShow = !option.componentOptions.propsData.isHidden
        if (optionIsActive && optionIsShow) indexsCanFocus.push(i)
      })
      const optionsLength = indexsCanFocus.length - 1
      const _index = indexsCanFocus.indexOf(this.focusIndex)
      let index = _index + direction
      if (index < 0) index = optionsLength
      if (index > optionsLength) index = 0
      this.focusIndex = indexsCanFocus[index]
    },

    // TODO 迁移到 BigDataBody 内
    bigDataSelectAll (event, isFilterOut) {
      // TODO 如果为大数据, 全选过滤后的结果
      if (this.flatData.length > 0) {
        this.multiInfo.currentOptions = this.flatData
      }
    },

    bigDataUnselectAll (event, isFilterOut) {
      // TODO 如果为大数据, 反选过滤后的结果
      if (this.flatData.length > 0) {
        this.multiInfo.currentOptions = []
      }
    },

    bigDataEnterSelect () {
      if (!isEmpty(this.flatData)) {
        // TODO optionData format
        const optionData = this.flatData[this.focusIndex]
        if (this.focusIndex === -1) return this.hideMenu()
        if (optionData) {
          this.onSelectOption(optionData)
        }
      }
    },

    bigDataNavigateOptions () {
      if (isEmpty(this.flatData)) return
      // TODO optionData format
      const optionData = this.flatData[this.focusIndex]
      if (this.focusIndex === -1) return this.hideMenu()
      if (optionData) {
        this.onSelectOption(optionData)
      }
    }

  }
}
