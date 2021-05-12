
<script>
/* eslint-disable camelcase */
import Checkbox from './Checkbox'
import PropTypes from '@hui/shared-utils/vue-types'
import { deepCopy } from '@hui/shared-utils'
import Drop from './Dropdown'
import TransferDom from '@hui/directives/transfer-dom'
import clickoutside from '@hui/directives/clickoutside'
import { PREFIX, ICON_FONT_Family, ICON_FONT_CLASS } from '../config'
import { arrEqual, formatBoolean } from '../util'
import nodeMinix from './minix/node'
const prefixCls = `${PREFIX || 'h'}-tree-node`
const prefixClsFilter = `${PREFIX || 'h'}-tree-node-filter`
const ICON_OPEN = 'open'
const ICON_CLOSE = 'close'

function TreeNodeProps () {
  return {
    item: PropTypes.object.def({}),
    index: PropTypes.number,
    // by User data
    expanded: PropTypes.bool.def(false),
    title: PropTypes.string.def(''),
    id: PropTypes.oneOfType([String, Number]).def(''),
    disabled: PropTypes.oneOfType([Boolean, String]).def(undefined),
    disableCheckbox: PropTypes.oneOfType([Boolean, String]).def(false),
    selectable: PropTypes.oneOfType([Boolean, String]).def(undefined),
    disableClick: PropTypes.oneOfType([Boolean, String]).def(undefined), // only disable click 参与联动计算
    // TODO 设置节点showCheckbox是否显示checkbox
    // showCheckbox: PropTypes.bool.def(undefined),
    // autoLoad: PropTypes.bool.def(false), // 初始化自动赋值
    leaf: PropTypes.oneOfType([Boolean, String]).def(undefined),
    // hidden: PropTypes.bool.def(false),
    className: PropTypes.string.def(undefined),
    showMenu: PropTypes.oneOfType([Boolean, String]).def(undefined),
    // style: PropTypes.bool.def(undefined),

    // by parant props 或者 format data（内部扩展）
    loading: PropTypes.bool.def(false),
    selected: PropTypes.bool.def(false),
    checked: PropTypes.bool.def(false),
    halfChecked: PropTypes.bool.def(false),
    // parentId: PropTypes.string.def(""),
    parentValue: PropTypes.string.def(''),
    level: PropTypes.sNumber.def(''),
    children: PropTypes.array.def([]),
    childLength: PropTypes.number,
    loaded: PropTypes.bool,
    // checkable: PropTypes.bool.def(undefined),
    chain: PropTypes.array.def([])
  }
}

export default {
  name: 'TreeNode',
  data () {
    return {
      prefixCls,
      menuVisible: false,
      moreIconShow: false,
      hiddened: undefined,
      timeout: null,
    }
  },
  inject: ['tree'],
  props: {
    ...TreeNodeProps()
  },
  mixins: [nodeMinix],
  directives: { clickoutside, TransferDom },
  computed: {
    formatKey () {
      const { tree: { formatValue } } = this
      const { item } = this.$props
      const { [formatValue]: key } = item
      return key
    }
  },
  methods: {
    // 展开/收缩 Switcher
    renderSwitcher () {
      const { expanded, loading } = this.$props
      function iconShow () {
        if (loading) return [`${ICON_FONT_CLASS}loading-noop`, `${prefixCls}-switcher-loading`]
        return [`${ICON_FONT_CLASS}caret-down-s`, `${prefixCls}-switcher-${expanded ? ICON_OPEN : ICON_CLOSE}`]
      }
      const switcherCls = [
        `${prefixCls}-switcher`,
        ICON_FONT_Family,
        iconShow()
      ]
      if (this.isLeaf(this, this.tree)) {
        return <span class={[`${prefixCls}-switcher`, `${prefixCls}-not-show`]}></span>
      }
      return <span onClick={this.onExpand} class={switcherCls}></span>
    },
    // 节点
    renderSelector (h) {
      const { selected } = this.$props
      const {
        tree: { blockNode, render, titleMaxWidth, renderIcon, isBoxRight, isTreeBody },
      } = this
      const title = this.getFormatLabel()
      const switcherCls = [
        `${prefixCls}-selector`,
        {
          [`${prefixCls}-blockNode`]: blockNode || isTreeBody,
          [`${prefixCls}-disabled-selector`]: this.isDisabled(this, this.tree),
          [`${prefixCls}-selector-isBoxRight`]: isBoxRight,
        }
      ]
      const renderProps = {
        root: this.tree,
        node: this,
        data: this.$props,
      }
      const textCls = [
        `${prefixCls}-selector-text`,
         `${prefixClsFilter}-text`,
         {
           [`${prefixCls}-text-max-width`]: titleMaxWidth !== undefined
         }
      ]
      const textStyles = {
        width: titleMaxWidth !== undefined ? `${titleMaxWidth}px` : 'auto'
      }
      /* √图标：在selecttree场景下，单选的选中项，需要显示图标 */
      const iconSelected = (
        <span class={[`${ICON_FONT_CLASS}check`, ICON_FONT_Family, `${prefixCls}-selector-check`]}></span>
      )
      // TODO 考虑添加纯render,不添加hover样式，双击，单击等事件
      return <div class={switcherCls}
        onClick={this.onSelectorClick}
        onContextmenu={this.handleRightClick}
        onDblclick={this.handleDoubleClick}
        onMouseenter={this.onSelectorMouseenter}>
        { this.isFunction('renderIcon') ? <span>{renderIcon(h, { ...renderProps })} </span> : null }
        <span style={textStyles} class={textCls}>
          { !this.isFunction('render') ? title : render(h, { ...renderProps }) }
        </span>
        {isTreeBody && selected && iconSelected}
        {this.renderMoreIcon()}
      </div>
    },
    // ...菜单
    renderDropMenu (h) {
      const {
        tree: { renderMenu },
      } = this
      if (!this.isFunction('renderMenu')) return null
      const renderMenuProps = {
        root: this.tree,
        node: this,
        data: this.$props,
      }
      const dropProps = {
        props: {
          placement: 'bottom-end',
          className: `${prefixCls}-menu`,
          widthAdaption: true,
        },
        ref: 'dropdown'
      }
      return <Drop v-show={this.menuVisible} v-clickoutside={{ trigger: 'mousedown', handler: this.onClickOutside }} {...dropProps} >{renderMenu(h, { ...renderMenuProps })}</Drop>
    },
    // 鼠标title提示文本
    renderTextTitleTips (h) {
      if (this.isDisabled(this, this.tree)) return null
      const {
        tree: { renderTextTips, showTitle }
      } = this
      const title = this.getFormatLabel()
      if (!showTitle) return null

      if (renderTextTips === undefined) return title
      if (Object.prototype.toString.call(renderTextTips) === '[object String]') return this.$props[renderTextTips]
      if (Object.prototype.toString.call(renderTextTips) === '[object Array]') return renderTextTips.map(v => this.$props[v]).join('-')
      if (Object.prototype.toString.call(renderTextTips) === '[object Function]') return renderTextTips(this.$props)
    },
    // 复选框
    renderCheckbox () {
      const { checked, halfChecked } = this.$props
      const checkable = this.isShowCheckbox()

      if (!checkable) return null

      const checkboxDisabled = () => {
        return this.isDisabled(this, this.tree) || !this.isCheckable(this, this.tree)
      }

      const checkboxProps = {
        on: {
          click: (value, event) => {
            // console.log("click======>", value, event);
            !checkboxDisabled() && this.onCheck(event, value)
          },
        },
        props: {
          value: checked,
          indeterminate: halfChecked,
          disabled: checkboxDisabled(),
        },
        class: [
          `${prefixCls}-checkbox`
        ]
      }
      return <Checkbox {...checkboxProps}></Checkbox>
    },
    /** icon-more图标显示
     * 当isDisabled()禁用，不展示...更多Icon
     * 鼠标hover:moreIconShow=true 或者 menuVisible=true(menu下拉菜单显示)
     * renderMenu的props方法有被绑定，并未是Function类型
     */
    renderMoreIcon () {
      const { showMenu } = this.$props
      if (this.isDisabled(this, this.tree) || formatBoolean(showMenu) === false) return null
      if (!this.isFunction('renderMenu')) return null

      let show = true
      if (!(this.moreIconShow || this.menuVisible)) show = false
      return <span v-show={show} ref="reference" onClick={this.openDropMenu} class={[ICON_FONT_Family, `${ICON_FONT_CLASS}more`, `${prefixCls}-more`]}></span>
    },
    onClickOutside () {
      this.menuVisible = false
    },
    onMouseenter () {
      this.moreIconShow = true
    },
    onMouseleave () {
      this.moreIconShow = false
    },
    updateDropdown () {
      this.$nextTick(() => {
        this.$refs.dropdown.update()
      })
    },
    openDropMenu (e) {
      this.stopEvent(e)
      // event.stopPropagation()
      // event.preventDefault()
      this.menuVisible = true
      this.updateDropdown()
    },
    isShowCheckbox () {
      const {
        tree: { showCheckbox: treeCheckable },
      } = this
      return treeCheckable
    },
    onCheck (e, value) {
      if (this.isDisabled(this, this.tree)) return
      if (!this.isCheckable(this, this.tree)) return
      const {
        tree: { onNodeCheck },
      } = this
      onNodeCheck(value, this, e)
    },
    onSelect (e) {
      const { selected } = this.$props
      const {
        tree: { onNodeSelect },
      } = this
      onNodeSelect(!selected, this, e)
    },
    onExpand (e) {
      // this.stopEvent(e)
      const { expanded, loading } = this.$props
      if (loading) return
      const {
        tree: { onNodeExpand },
      } = this
      onNodeExpand(!expanded, this, e)
    },
    onSelectorClick (e) {
      // this.stopEvent(e)
      /* 兼容双击事件，双击事件，不触发单击事件 */
      const { tree: { $listeners: listeners }, } = this

      if (listeners['on-double-click'] !== undefined) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.selectorClick(e)
        }, 300)
        return
      }
      this.selectorClick(e)
    },
    selectorClick (e) {
      if (this.isDisabled(this, this.tree)) return
      const { checked } = this.$props
      const {
        tree: { onNodeClick, showCheckbox },
      } = this
      onNodeClick(this, e)

      if (this.isSelectable(this, this.tree)) {
        this.onSelect(e)
      } else {
        showCheckbox && this.onCheck(e, !checked)
      }
    },
    handleRightClick (event) {
      if (this.isDisabled(this, this.tree)) return
      const {
        tree: { onNodeContextMenu },
      } = this
      onNodeContextMenu(this, event)
    },
    handleDoubleClick () {
      if (this.isDisabled(this, this.tree)) return
      clearTimeout(this.timeout)
      const {
        tree: { onNodeDoubleClick }
      } = this
      onNodeDoubleClick(this, event)
    },
    onSelectorMouseenter () {
      if (this.isDisabled(this, this.tree)) return
      const {
        tree: { onNodeMouseOver }
      } = this
      onNodeMouseOver(this, event)
    },
    isFunction (name) {
      const {
        tree: { [name]: renderName },
      } = this
      if (typeof renderName === 'function') return true
      return false
    },
    isBoxRightRender (h) {
      const {
        tree: { isBoxRight },
      } = this
      if (isBoxRight) {
        return [this.renderSelector(h), this.renderCheckbox()]
      }
      return [this.renderCheckbox(), this.renderSelector(h)]
    },
    isRender () {
      const { level, chain } = this.$props
      const {
        tree: { formatValue, filterValueKeys, newExpandedObjList }
      } = this
      let hiddened
      const key = this.$props.item[formatValue]
      if (filterValueKeys.length !== 0) {
        hiddened = !filterValueKeys.includes(key)
      } else {
        hiddened = !newExpandedObjList.some(item => {
          const chains = deepCopy(chain)
          if (level > 1) chains.shift()
          return arrEqual(item.chain, chains)
        })
        newExpandedObjList.length === 0 && level === 1 && (hiddened = false)
      }
      return hiddened
    },
    stopEvent (e) {
      if (e) {
        e.stopPropagation()
        e.preventDefault()
      }
    },
    getFormatLabel () {
      const { tree: { formatLabel, formatValue } } = this
      const { item } = this.$props
      const { [formatLabel]: title, [formatValue]: key } = item
      if (title === undefined) console.error(`[hui warn] ${formatValue}为 ${key} 的节点对象不存在${formatLabel}属性~`)
      // console.log('title======>', formatLabel, item, title)
      return title || ''
    },
    getFormatKey () {
      const { tree: { formatValue } } = this
      const { item } = this.$props
      const { [formatValue]: key } = item
      return key
    }
  },
  // destroyed () {
  //   console.log('destroyed', this.formatKey )
  // },
  // created() {
  //   console.log('created', this.formatKey)
  // },
  // updated() {
  //   console.log('updated', this.formatKey)
  // },
  render (h) {
    const {
      tree: { filterValue, virtual, focusIndex, filterValueArr }
    } = this
    const { className, level, disableCheckbox, selected, index } = this.$props
    const key = this.getFormatKey()

    const styles = {
      paddingLeft: `${16 * Number(level)}px`,
      margin: !virtual && '2px 0px',
    }

    const classes = [
      className,
      prefixCls,
      `${prefixCls}-tabindex`,
      {
        [prefixClsFilter]: (filterValue !== '' && filterValue !== undefined) && filterValueArr.findIndex(value => value === key) >= 0,
        [`${prefixCls}-disabled`]: this.isDisabled(this, this.tree) || formatBoolean(disableCheckbox),
        [`${prefixCls}-focus`]: index === focusIndex,
        [`${prefixCls}-selected`]: selected,
      }
    ]
    // tabindex={isTreeBody ? null : -1}

    return (
      <li
        class={classes}
        style={styles}
        onMouseenter={this.onMouseenter}
        onMouseleave={this.onMouseleave}
        title={this.renderTextTitleTips()}
      >
        {this.renderSwitcher()}
        {...this.isBoxRightRender(h)}
        {this.renderDropMenu(h)}
      </li>
    )
  }
}
</script>
