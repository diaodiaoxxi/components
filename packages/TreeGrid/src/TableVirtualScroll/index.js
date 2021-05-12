/**
 * virtual list default component
 */

import Vue from 'vue'
import Virtual from './virtual'
import { Item } from './item'
import { VirtualProps } from './props'

const EVENT_TYPE = {
  ITEM: 'item_resize',
  SLOT: 'slot_resize'
}
const SLOT_TYPE = {
  HEADER: 'header', // string value also use for aria role attribute
  FOOTER: 'footer'
}

const noop = () => {}

const VirtualList = Vue.component('virtual-list', {
  props: {
    ...VirtualProps,
    ...{
      rootScrollEle: undefined,
      prefixCls: String,
      tableStyle: {
        type: Object,
        default () {
          return {}
        }
      }
    }
  },
  inject: {
    setScrollCallBack: { default: () => noop },
  },
  data () {
    return {
      range: null
    }
  },

  watch: {
    'dataSources.length' () {
      this.virtual.updateParam('uniqueIds', this.getUniqueIdFromDataSources())
      this.virtual.handleDataSourcesChange()
      const start = this.range.start
      const buffer = this.virtual.param.buffer
      this.virtual.checkRange(this.range.start, this.virtual.getEndByStart(start + buffer), true)
    },

    start (newValue) {
      this.scrollToIndex(newValue)
    },

    offset (newValue) {
      this.scrollToOffset(newValue)
    },
    keeps: {
      handler (val) {
        this.keeps = val
        this.installVirtual()
      },
      deep: true
    }
  },

  created () {
    this.isHorizontal = this.direction === 'horizontal'
    this.directionKey = this.isHorizontal ? 'scrollLeft' : 'scrollTop'

    this.installVirtual()

    // listen item size change
    this.$on(EVENT_TYPE.ITEM, this.onItemResized)

    // listen slot size change
    if (this.$slots.header || this.$slots.footer) {
      this.$on(EVENT_TYPE.SLOT, this.onSlotResized)
    }
  },

  // set back offset when awake from keep-alive
  activated () {
    this.scrollToOffset(this.virtual.offset)
  },

  mounted () {
    // set position
    if (this.start) {
      this.scrollToIndex(this.start)
    } else if (this.offset) {
      this.scrollToOffset(this.offset)
    }
  },

  beforeDestroy () {
    this.virtual.destroy()
  },

  methods: {
    // get item size by id
    getSize (id) {
      return this.virtual.sizes.get(id)
    },

    // get the total number of stored (rendered) items
    getSizes () {
      return this.virtual.sizes.size
    },

    // return current scroll offset
    getOffset () {
      const root = this.rootScrollEle

      return root ? Math.ceil(root[this.directionKey]) : 0
    },

    // return client viewport size
    getClientSize () {
      const root = this.rootScrollEle
      return root
        ? root[this.isHorizontal ? 'clientWidth' : 'clientHeight']
        : 0
    },

    // return all scroll size
    getScrollSize () {
      const root = this.rootScrollEle
      return root
        ? root[this.isHorizontal ? 'scrollWidth' : 'scrollHeight']
        : 0
    },

    // set current scroll position to a expectant offset
    scrollToOffset (offset) {
      const root = document.querySelector('[data-hui-table="basic-tbody"]')

      if (root) {
        root[this.directionKey] = offset || 0
      }
    },

    // set current scroll position to a expectant index
    scrollToIndex (index) {
      // scroll to bottom
      if (index >= this.dataSources.length - 1) {
        this.scrollToBottom()
      } else {
        const offset = this.virtual.getOffset(index)
        this.scrollToOffset(offset)
      }
    },

    // set current scroll position to bottom
    scrollToBottom () {
      const { shepherd } = this.$refs
      if (shepherd) {
        shepherd.scrollIntoView(false)

        // check if it's really scrolled to the bottom
        // maybe list doesn't render and calculate to last range
        // so we need retry in next event loop until it really at bottom
        setTimeout(() => {
          if (this.getOffset() + this.getClientSize() < this.getScrollSize()) {
            this.scrollToBottom()
          }
        }, 3)
      }
    },

    // reset all state back to initial
    reset () {
      this.virtual.destroy()
      this.scrollToOffset(0)
      this.installVirtual()
    },

    // ----------- public method end -----------

    installVirtual () {
      this.virtual = new Virtual(
        {
          size: this.size, // also could be a estimate value
          slotHeaderSize: 0,
          slotFooterSize: 0,
          keeps: this.keeps,
          buffer: this.keeps < 20 ? Math.round(this.keeps) : Math.round(this.keeps / 3), // recommend for a third of keeps
          // buffer: 0, // recommend for a third of keeps
          uniqueIds: this.getUniqueIdFromDataSources()
        },
        this.onRangeChanged
      )

      // sync initial range
      this.range = this.virtual.getRange()
    },

    getUniqueIdFromDataSources () {
      return this.dataSources.map(dataSource => dataSource[this.dataKey])
    },

    // event called when each item mounted or size changed
    onItemResized (id, size) {
      this.virtual.saveSize(id, size)
      this.$emit('resized', id, size)
    },

    // event called when slot mounted or size changed
    onSlotResized (type, size, hasInit) {
      if (type === SLOT_TYPE.HEADER) {
        this.virtual.updateParam('slotHeaderSize', size)
      } else if (type === SLOT_TYPE.FOOTER) {
        this.virtual.updateParam('slotFooterSize', size)
      }

      if (hasInit) {
        this.virtual.handleSlotSizeChange()
      }
    },

    // here is the rerendering entry
    onRangeChanged (range) {
      this.range = range
    },

    /**
     * 根据 rootScrollEle offset,client 计算虚拟padding 与 显示的表格数据
     * @param {*} evt scroll 事件参数
     */
    onScroll (evt) {
      const offset = this.getOffset()
      const clientSize = this.getClientSize()
      const scrollSize = this.getScrollSize()

      // iOS scroll-spring-back behavior will make direction mistake
      if (offset < 0 || offset + clientSize > scrollSize || !scrollSize) {
        return
      }
      this.virtual.handleScroll(offset)
      this.emitEvent(offset, clientSize, scrollSize, evt)
    },

    // emit event in special position
    emitEvent (offset, clientSize, scrollSize, evt) {
      this.$emit('scroll', evt, this.virtual.getRange())

      if (
        this.virtual.isFront() &&
        !!this.dataSources.length &&
        offset - this.topThreshold <= 0
      ) {
        this.$emit('totop')
      } else if (
        this.virtual.isBehind() &&
        offset + clientSize + this.bottomThreshold >= scrollSize
      ) {
        this.$emit('tobottom')
      }
    },

    // get the real render slots based on range data
    // in-place patch strategy will try to reuse components as possible
    // so those components that are reused will not trigger lifecycle mounted
    getRenderSlots (h) {
      const slots = []
      const { start, end } = this.range
      const {
        dataSources,
        dataKey,
        itemClass,
        itemTag,
        isHorizontal,
        extraProps,
        dataComponent
      } = this
      for (let index = start; index <= end; index++) {
        const dataSource = dataSources[index]
        if (dataSource) {
          if (dataSource[dataKey]) {
            slots.push(
              h(Item, {
                props: {
                  index,
                  tag: itemTag,
                  event: EVENT_TYPE.ITEM,
                  horizontal: isHorizontal,
                  uniqueKey: dataSource[dataKey],
                  source: dataSource,
                  extraProps: extraProps,
                  component: dataComponent
                },
                class: `${itemClass} ${
                  this.itemClassAdd ? this.itemClassAdd(index) : ''
                }`
              })
            )
          } else {
            console.warn(
              `Cannot get the data-key '${dataKey}' from data-sources.`
            )
          }
        }
        if (process.env.VUE_APP_HUI_ENV == 'dev') {
          console.warn(`Cannot get the index '${index}' from data-sources.`)
        }
      }
      return slots
    }
  },

  // render function, a closer-to-the-compiler alternative to templates
  // https://vuejs.org/v2/guide/render-function.html#The-Data-Object-In-Depth
  render (h) {
    const { header } = this.$slots
    const { padFront, padBehind } = this.range
    const padding = this.isHorizontal
      ? `0px ${padBehind}px 0px ${padFront}px`
      : `${padFront}px 0px ${padBehind}px`
    // findComponentParent(this, '')
    const colgroupVnode = header
    // scroll 滚动方法监听

    this.setScrollCallBack('virtualScroll', this.onScroll, this.extraProps.uuid)

    const virtualDom = (
      <tbody role="table-group" class={this.prefixCls + '-tbody'}>
        {this.getRenderSlots(h)}
      </tbody>
    )

    const tableProps = {
      attrs: {
        cellspacing: '0',
        cellpadding: '0',
        border: '0'
      },
      style: this.tableStyle
    }

    return (
      <div
        class="tbody-wrap"
        style={{
          padding: padding
        }}
      >
        <table {...tableProps}>
          {colgroupVnode}
          {virtualDom}
        </table>
      </div>
    )
  }
})

export default VirtualList
