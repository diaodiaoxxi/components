
<script>
import { Spin } from 'h_ui/dist/h_ui.min.js'
import { on, off, get, cloneDeep, mergeProps, getStyle, getScrollBarSize } from '@hui/shared-utils'

import Methods from './methods'
import CommonMethods from './commonMethods'
import { PREFIX, TABLE_ICON } from './config'
import HeadTable from './HeadTable'
import BodyTable from './BodyTable'
import TableSummary from './summary'
import noData from './body/NoData'
import { TableProps } from './interface'
// import BigNumber from 'bignumber.js'
const prefixCls = `${PREFIX || 'h'}-edittree`
export default {
  name: 'TreeTable',
  mixins: [Methods, CommonMethods],
  props: TableProps,
  components: {
    noData,
    Spin,
    TableSummary
  },
  provide () {
    return {
      tableRoot: this,
      tableData: this.$data,
      tableProps: this.$props,
      setScrollCallBack: this.setScrollCallBack
    }
  },
  data () {
    const colsWithId = this.makeColumnsId(this.columns)
    // const dataWithId = this.getAllData(this.data)
    return {
      PREFIX,
      prefixCls: prefixCls,
      rebuildData: [],
      cloneColumns: this.makeColumns(colsWithId),
      objData: {},
      columnsWidth: {},
      initWidth: 0,
      tableWidth: 0,
      isScrollY: false,
      isScrollX: false,
      bodyHeight: 0,
      noDataBodyHeight: 0,
      scrollCallBackObject: {},
      realRebuildData: [],
      scrollBarWidth: getScrollBarSize(),
      resizeProxyVisible: false,
      moveProxyVisible: false,
      showScroll: false,
      bodyRealHeight: 0,
      lastScrollLeft: 0,
      horizontalToBottom: 1,
      lastScrollTop: 0,
      // summaryData: []
      // virtualParams: {
      //   size: this.itemHeight,
      //   keeps: 10
      // },
    }
  },
  computed: {
    currentLoadingText () {
      if (this.loadingText !== undefined) return this.loadingText
      return this.t('i.table.loadingText')
    },
    virtualParams () {
      const obj = {
        size: this.itemHeight,
        keeps: 10
      }
      if (this.bodyHeight != 0) {
        obj.keeps = Math.ceil(this.bodyHeight / obj.size)
      }
      return obj
    },
    styles () {
      const style = {}
      if (this.width) style.width = `${this.width}px`
      return style
    },
    localeNoFilteredDataText () {
      if (this.noFilteredDataText === undefined) {
        return this.t('i.table.noFilteredDataText')
      } else {
        return this.noFilteredDataText
      }
    },
    bodyStyle () {
      const style = {}
      const bodyHeight = this.bodyHeight
      if (bodyHeight !== 0 || this.maxHeight || this.noDataHeight) {
        // add a height to resolve scroll bug when browser has a scrollBar in fixed type and height prop
        const height = bodyHeight
        if (this.noDataHeight && this.rebuildData.length === 0) style.height = this.noDataBodyHeight + 'px'
        if (this.height) style.height = `${height}px`
        if (this.maxHeight) style.maxHeight = `${height}px`
      }
      return style
    },
    tableStyle () {
      const style = {}
      if (this.tableWidth !== 0) {
        let width = ''
        if (this.bodyHeight === 0) {
          width = this.tableWidth
        } else {
          width = this.tableWidth - (this.isScrollY ? this.scrollBarWidth : 0)
        }
        style.width = `${width}px`
      }
      return style
    },
    headStyles () {
      const style = {}
      if (this.tableWidth !== 0) {
        const width = parseInt(this.tableWidth * 100) / 100
        style.width = `${width}px`
      }
      return style
    },
    tableFixedStyle () {
      return [
        {
          [`${prefixCls}-fixed-body-shadow`]:
            this.rebuildData.length != 0 && this.lastScrollLeft > 0
        }
      ]
    },
    tableFixedRightStyle () {
      return [
        `${prefixCls}-fixed-border-left`,
        {
          [`${prefixCls}-fixed-body-shadow`]:
            this.rebuildData.length != 0 && this.horizontalToBottom != 0
        }
      ]
    },
    leftFixedColumns () {
      const left = []
      const other = []
      this.cloneColumns.forEach(col => {
        if (col.fixed && col.fixed === 'left') {
          left.push(col)
        } else {
          other.push(col)
        }
      })
      return left
      // return left.concat(other)
    },
    rightFixedColumns () {
      const right = []
      const other = []
      this.cloneColumns.forEach(col => {
        if (col.fixed && col.fixed === 'right' && right.length == 0) {
          right.push(col)
        } else {
          if (col.fixed == 'right') col.fixed = undefined
          other.push(col)
        }
      })
      return right
      // return right.concat(other)
    },
    isLeftFixed () {
      // 是否存在左固定
      return this.cloneColumns.some(col => col.fixed && col.fixed === 'left')
    },
    isRightFixed () {
      // 是否存在右固定
      return this.cloneColumns.some(col => col.fixed && col.fixed === 'right')
    },
    isCheckbox () {
      // 是否多选
      return this.cloneColumns.some(col => col.type && col.type === 'selection')
    },
    fixedTableStyle () {
      const style = {}
      let width = 0
      this.leftFixedColumns.forEach(col => {
        if (col.fixed && col.fixed === 'left') width += col.width
      })
      style.width = `${width}px`
      return style
    },
    fixedRightTableStyle () {
      const style = {}
      let width = 0
      this.rightFixedColumns.forEach(col => {
        if (col.fixed && col.fixed === 'right') width += col.width
      })
      if (this.isScrollY) {
        style.marginRight = `${this.scrollBarWidth}px`
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.showScroll = true
      }
      style.width = `${width}px`
      return style
    },
    fixedBodyStyle () {
      const style = {}
      const bodyHeight = this.bodyHeight
      if (bodyHeight !== 0 || this.maxHeight || this.height) {
        let height = bodyHeight
        height = this.isScrollX ? height - this.scrollBarWidth : bodyHeight - 1
        if (this.fixedAutoHeight) {
          if (this.bodyRealHeight < height) {
            height = this.bodyRealHeight
          }
        }
        style.height = `${height}px`
        if (this.maxHeight) style.maxHeight = `${height}px`
      }
      return style
    },
    fixedRightPatchStyle () {
      if (!this.$refs.head) return
      const style = {}
      const width = this.scrollBarWidth
      const headEl = this.$refs.head.$el
      const titleEl = headEl.querySelector(`${prefixCls + '-header'}`)
      const headerRealHeight = parseInt(getStyle(headEl, 'height')) || 0
      const height = headerRealHeight
      if (height <= 0) return
      let curHeight = getStyle(
        headEl.querySelectorAll('thead .cur-th')[0],
        'height'
      )
      if (
        curHeight === 'auto' &&
        this.multiLevel &&
        this.multiLevel.length > 0
      ) {
        curHeight = height / this.multiLevel.length - 1
      } else {
        curHeight = parseInt(curHeight) - 1
      }
      const top = parseInt(getStyle(titleEl, 'height')) || 0
      style.width = `${width}px`
      style.height = `${height}px`
      style.top = `${top}px`
      style.background = '#fff'

      return style
    },
    isSummation () {
      return (
        this.summationData.length > 0 ||
        this.cloneColumns.filter(data => data.isSum && (data.isSum == true || data.isSum == 'true'))
          .length > 0
      )
    },
    makeSumData () {
      // 汇总数据只有一条，否则只获取第一条
      const data =
        this.summationData && this.summationData.length > 0
          ? [cloneDeep(this.summationData[0])]
          : []
      if (data.length < 1) {
        const sumCol = this.columns.filter(
          (data, index) => data.isSum && (data.isSum == true || data.isSum == 'true') && (!data.type || data.type == 'money' || data.type == 'text')
        )
        const sumObj = {}
        sumCol.forEach((item, index) => {
          sumObj[item.key] = this.summary(item.key, item.sumType, item.sumFixed)
        })
        data.push(sumObj)
      }
      let rowKey = 1
      data.forEach((row, index) => {
        const rowId = (++rowKey).toString()
        row._rowid = rowId
        row._level = 1
        this.objData[row._rowid] = {
          _isDisabled: false,
          _isChecked: false,
          _isHighlight: false,
          _Indeterminate: false,
          _isExpand: false,
          _isShow: true,
          _isHover: false,
          _rowid: rowId

        }
      })
      return data
    },
  },
  methods: {
    setScrollCallBack (targetComponentName, cb, uid) {
      this.scrollCallBackObject[uid] = cb
    },
    fixedHeader () {
      // height与maxHeight不可同时存在，若同时存在则以height为准
      if (this.height || this.maxHeight || this.noDataHeight) {
        let setHeight = parseInt(this.height) || parseInt(this.maxHeight)
        const setNoDataHeight = parseInt(this.noDataHeight)
        if (this.height && this.maxHeight && this.height > this.maxHeight) setHeight = this.maxHeight
        this.$nextTick(() => {
          const titleHeight =
            parseInt(getStyle(this.$refs.title, 'height')) || 0
          const headerHeight = this.$refs.head ? parseInt(getStyle(this.$refs.head.$el, 'height')) || 0 : 0
          const footerHeight =
            parseInt(getStyle(this.$refs.footer, 'height')) || 0
          this.bodyHeight =
            setHeight - titleHeight - headerHeight - footerHeight
          this.noDataBodyHeight =
            setNoDataHeight - titleHeight - headerHeight - footerHeight
          const dom = get(this, '$refs.body.$refs.tbody.$el')
          this.bodyRealHeight = parseFloat(getStyle(dom, 'height')) || 0
          if (this.virtualParams && Object.keys(this.virtualParams).length != 0) {
            const keeps = Math.ceil(this.bodyHeight / this.virtualParams.size)
            this.virtualParams.keeps = keeps
          }
        })
      } else {
        this.bodyHeight = 0
        // console.log(this.bodyRealHeight, this.virtualParams)
        this.$nextTick(() => {
          const dom = get(this, '$refs.body.$refs.tbody.$el')
          this.bodyRealHeight = parseFloat(getStyle(dom, 'height')) || 0
          if (this.bodyRealHeight && this.virtualParams && Object.keys(this.virtualParams).length != 0) {
            const keeps = Math.ceil(this.bodyRealHeight / this.virtualParams.size) || 10
            this.virtualParams.keeps = keeps
          }
        })
      }
    },
    onEditSelectChange (val, columnIndex, index) {
      this.$emit('on-editselect-change', val, columnIndex, index)
    },
    onEditInputChange (val, columnIndex, index) {
      this.$emit('on-editinput-change', val, columnIndex, index)
    },
    onEditInputEnter (val, columnIndex, index) {
      this.$emit('on-editinput-enter', val, columnIndex, index)
    },
    onEditInputBlur (val, columnIndex, index) {
      this.$emit('on-editinput-blur', val, columnIndex, index)
    },
    onEditAreaChange (val, columnIndex, index) {
      this.$emit('on-editarea-change', val, columnIndex, index)
    },
    onEditAreaBlur (val, columnIndex, index) {
      this.$emit('on-editselect-blur', val, columnIndex, index)
    },
    onMoneyChange (val, columnIndex, index) {
      this.$emit('on-editselect-change', val, columnIndex, index)
    },
    onMoneyBlur (val, columnIndex, index) {
      this.$emit('on-editselect-change', val, columnIndex, index)
    },
    onMoneyEnter (val, columnIndex, index) {
      this.$emit('on-editselect-change', val, columnIndex, index)
    },
    onEditDateChange (val, columnIndex, index) {
      this.$emit('on-editdate-change', val, columnIndex, index)
    },
    onScroll: function (
      scrollBottom,
      scrollTop,
      direction,
      lastScrollLeft,
      horizontalToBottom,
      event
    ) {
      // 滚动
      const $center = this.$refs.body
      // 横向滚动
      if (this.showHeader && this.$refs.head) {
        const header = this.$refs.head.$el
        header.scrollLeft = lastScrollLeft
      }
      // 固定列纵向滚动
      // if (direction == 'y') {
      const fixRefNames = ['leftFixed', 'rightFixed']
      if ($center) {
        const syncFixedTableScrollTop = fixTableDom => {
          if (!fixTableDom) return
          fixTableDom.scrollTop = scrollTop
        }
        fixRefNames.forEach(ref => {
          const dom = get(this, ['$refs', ref, '$el'])
          syncFixedTableScrollTop(dom)
        })
        // TODO ScrollCallBack is function check
        Object.keys(this.scrollCallBackObject).map(val => {
          const fn = this.scrollCallBackObject[val]
          fn(event)
        })
      }
      // }
      if (this.isSummation && this.rebuildData.length != 0) {
        if (this.$refs.summaryBody) {
          const summary = this.$refs.summaryBody
          summary.scrollLeft = lastScrollLeft
        }
      }
      this.lastScrollTop = scrollTop
      this.lastScrollLeft = lastScrollLeft
      this.horizontalToBottom = horizontalToBottom
      this.$emit('on-scroll', scrollBottom, scrollTop, direction)
    },
    handleFixedMousewheel (event) {
      let deltaY = event.deltaY
      if (!deltaY && event.detail) {
        deltaY = event.detail * 40
      }
      if (!deltaY && event.wheelDeltaY) {
        deltaY = -event.wheelDeltaY
      }
      if (!deltaY && event.wheelDelta) {
        deltaY = -event.wheelDelta
      }
      if (!deltaY) return
      const body = this.$refs.body.$el
      const currentScrollTop = body.scrollTop
      if (deltaY < 0 && currentScrollTop !== 0) {
        // event.preventDefault()
      }
      if (
        deltaY > 0 &&
        body.scrollHeight - body.clientHeight > currentScrollTop
      ) {
        // event.preventDefault()
      }
      let step = 0
      const timeId = setInterval(() => {
        step += 10
        if (deltaY > 0) {
          body.scrollTop += 5
        } else {
          body.scrollTop -= 5
        }
        if (step >= Math.abs(deltaY)) {
          clearInterval(timeId)
        }
      }, 1)
    },
    renderLeftFixedTable () {
      return (
        <div class={[`${this.prefixCls}-fixed`, this.tableFixedStyle]} style={this.fixedTableStyle}>
          {this.renderTable({
            columns: this.leftFixedColumns,
            fixed: 'left',
            isSum: false,
            refs: 'leftFixed'
            // refs: isSum ? '' : 'leftFixed'
          })}
        </div>
      )
    },
    renderRightFixedTable () {
      return (
        <div class={[`${this.prefixCls}-fixed-right`, this.tableFixedRightStyle]} style={this.fixedRightTableStyle}>
          { this.renderTable({
            columns: this.rightFixedColumns,
            fixed: 'right',
            isSum: false,
            refs: 'rightFixed'
          })}
        </div>
      )
    },
    renderLeftFixedSummary () {
      return (
        <div class={[`${this.prefixCls}-fixed`, this.tableFixedStyle]} style={this.fixedTableStyle}>
          { this.summaryRender({
            columns: this.leftFixedColumns,
            fixed: 'left',
          })}
        </div>
      )
    },
    renderRightFixedSummary () {
      return (
        <div class={[`${this.prefixCls}-fixed-right`, this.tableFixedRightStyle]} style={this.fixedRightTableStyle}>
          { this.summaryRender({
            columns: this.rightFixedColumns,
            fixed: 'right',
          })}
        </div>
      )
    },
    summaryRender (options) {
      const { columns, fixed, refs } = options
      const styleObject = fixed ? (fixed == 'right' ? this.fixedRightTableStyle : this.fixedTableStyle) : this.tableStyle
      return (
        <table-summary
          ref={refs}
          fixed= {fixed}
          data={this.makeSumData}
          styleObject={styleObject}
          columns={columns}
          sum={this.isSummation}
          columnsWidth={this.columnsWidth}
          prefixCls= { this.prefixCls }
          bodyAlgin = {this.bodyAlgin}
        >
        </table-summary>
      )
    },
    renderSumTable () {
      if (this.isSummation && !(!this.rebuildData || this.rebuildData.length === 0)) {
        return (
          <div class={`${prefixCls}-summary`} ref="summary" style={{ position: 'relative' }} >
            <div class={`${prefixCls}-summary-body`} ref='summaryBody'>
              {this.summaryRender({ columns: this.cloneColumns }) }
            </div>
            { this.isLeftFixed && this.renderLeftFixedSummary()}
            { this.isRightFixed && this.renderRightFixedSummary()}
          </div>
        )
      }
    },
    renderTable (options) {
      const { columns, fixed, isSum, refs } = options
      const tableClassName = (fixed ? `${prefixCls}-fixed-body` : `${prefixCls}-body`)

      const headerClassName = fixed ? [
        `${prefixCls}-fixed-header`,
        {
          [`${prefixCls}-fixed-header-with-empty`]: !this.rebuildData.length
        }
      ] : `${prefixCls}-header`
      // const bodyRef = !isSum ? (fixed ? (fixed == 'right' ? 'leftFixed' : 'rightFixed') : 'body') : 'summaryBody'
      const styleObject = fixed ? (fixed == 'right' ? this.fixedRightTableStyle : this.fixedTableStyle) : this.tableStyle
      const headStyleObject = fixed ? (fixed == 'right' ? this.fixedRightTableStyle : this.fixedTableStyle) : this.headStyles
      const event = {
        'on-scroll': this.onScroll,
        'on-editselect-change': this.onEditSelectChange,
        'on-editinput-change': this.onEditInputChange,
        'on-editinput-blur': this.onEditInputBlur,
        'on-editinput-enter': this.onEditInputEnter,
        'on-editarea-change': this.onEditAreaChange,
        'on-editarea-blur': this.onEditAreaBlur,
        'on-editdate-change': this.onEditDateChange,
        'on-money-change': this.onMoneyChange,
        'on-money-enter': this.onMoneyEnter,
        'on-money-blur': this.onMoneyBlur,
        'on-change-width': this.changeWidth,
        // mousewheel: fixed && this.handleFixedMousewheel,
        // DOMMouseScroll: fixed && this.handleFixedMousewheel

      }
      const dataSource = this.realRebuildData
      // const objDataSource = isSum ? this.makeSumObjData() : this.objData
      const headTable = (
        <HeadTable
          ref={fixed ? '' : 'head'}
          columns={columns}
          prefixCls= { this.prefixCls }
          data={this.rebuildData}
          objData={this.objData}
          columnsWidth={this.columnsWidth}
          headAlgin={this.headAlgin}
          fixed= {fixed}
          styleObject={headStyleObject}
          data-hui-table="basic-header"
          multiLevel={this.multiLevel}
          headerClassName={headerClassName}
          {...{ on: { 'on-change-width': this.changeWidth } }}
        />
      )
      const flag = !(!!this.localeNoFilteredDataText && (!this.rebuildData || this.rebuildData.length === 0))
      const bodyTable = (
        <BodyTable
          ref={refs}
          fixed= {fixed}
          data={dataSource}
          columns={columns}
          objData={this.objData}
          columnsWidth={this.columnsWidth}
          prefixCls= { this.prefixCls }
          bigData={this.virtualParams}
          draggable={this.draggable}
          bodyAlgin={this.bodyAlgin}
          showTitle={this.showTitle}
          styleObject={styleObject}
          focusIndex={this.focusIndex}
          style={fixed ? this.fixedBodyStyle : this.bodyStyle}
          tableClassName= {tableClassName}
          {...{ on: event }}
          {...{
            nativeOn: {
              mousewheel: (e) => {
                if (fixed) this.handleFixedMousewheel(e)
              },
              // DOMMouseScroll: (e) => {
              //   if (fixed) this.handleFixedMousewheel(e)
              // },
            }
          }}
        />
      )
      return [this.showHeader && !isSum && headTable, flag && bodyTable]
    },
    load () {
      if (this.loading) {
        return (
          // <Spin fix size="large" class="spin-loading">
          //   <slot name="loading">
          //     <i name="loading" size="18" class={[PREFIX + '-load-loop', TABLE_ICON.loading]} ></i>
          //     <div>{this.currentLoadingText}</div>
          //   </slot>
          // </Spin>
          <div fix size="large" class="spin-loading">
            <div class={[PREFIX + '-spin-main']}>
              <slot name="loading">
                <svg t="1609147836961" class={[PREFIX + '-load-loop', 'icon', TABLE_ICON.loading]} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2225" width="16" height="16"><path d="M277.2 277.2m-149.2 0a149.2 149.2 0 1 0 298.4 0 149.2 149.2 0 1 0-298.4 0Z" fill="#4686F2" opacity=".6" p-id="2226"></path><path d="M277.2 746.8m-149.2 0a149.2 149.2 0 1 0 298.4 0 149.2 149.2 0 1 0-298.4 0Z" fill="#4686F2" opacity=".8" p-id="2227"></path><path d="M746.8 277.2m-149.2 0a149.2 149.2 0 1 0 298.4 0 149.2 149.2 0 1 0-298.4 0Z" fill="#4686F2" opacity=".4" p-id="2228"></path><path d="M746.8 746.8m-149.2 0a149.2 149.2 0 1 0 298.4 0 149.2 149.2 0 1 0-298.4 0Z" fill="#4686F2" p-id="2229"></path></svg>
                <div>{this.currentLoadingText}</div>
              </slot>
            </div>
          </div>
        )
      }
    },
    patch () {
      if (this.isRightFixed && this.isScrollY) {
        return (
          <div
            class={[prefixCls + '-fixed-right-patch']}
            style={this.fixedRightPatchStyle}
            ref="rightPatch"
          ></div>
        )
      }
    }
  },
  created () {
    this.rebuildData = this.makeData(cloneDeep(this.data))
    this.realRebuildData = this.rebuildData.filter(val => this.objData[val._rowid]._isShow)
    // this.summaryData = this.makeSumData()
  },
  mounted () {
    on(window, 'resize', this.handleResize)
    this.$nextTick(() => {
      this.fixedHeader()
      this.handleResize()
    })
    this.handleResize()
    on(this.$refs.tableWrap, 'keyup', this.handleKeyUp)
    on(this.$refs.tableWrap, 'click', this.handleKeyUp)
  },
  activated () {
    if (this.keepAliveFlag) {
      this.handleResize()
      on(window, 'resize', this.handleResize)
    }
    this.keepAliveFlag = true
  },
  deactivated () {
    if (this.keepAliveFlag) {
      off(window, 'resize', this.handleResize)
    }
    off(this.$refs.tableWrap, 'keyup', this.handleKeyUp)
  },
  watch: {
    data: {
      handler (val) {
        // console.log('change')
        // window.$data = cloneDeep(val)
        // const dataWithId = this.getAllData(val)
        // this.rebuildData = this.makeData(cloneDeep(dataWithId))
        this.rebuildData = this.makeData(cloneDeep(val))
        this.realRebuildData = this.rebuildData.filter(val => this.objData[val._rowid]._isShow)
      },
      // deep: true,
    },
    // rebuildData: {
    //   handler () {
    //     this.realRebuildData = this.rebuildData.filter(val => this.objData[val._rowid]._isShow)
    //   },
    //   // deep: true,
    // },
    realRebuildData: {
      handler (val) {
        this.$nextTick(() => {
          this.handleResize()
          this.fixedHeader()
        })
      },
      // deep: true
    },
    columns: {
      handler (val) {
        const colsWithId = this.makeColumnsId(val)
        this.cloneColumns = this.makeColumns(colsWithId)
        this.handleResize()
      },
      deep: true
    },
    isScrollX () {
      this.handleResize()
    },
    isScrollY () {
      this.handleResize()
    },
    height () {
      this.handleResize()
    },
    showScroll () {
      setTimeout(() => {
        this.handleResize()
      }, 0)
    },
  },
  render () {
    const wrapProps = mergeProps({
      class: [
        `${prefixCls}-wrapper`,
        {
          // [`${prefixCls}-hide`]: !this.ready,
          [`${prefixCls}-with-header`]: this.showSlotHeader,
          [`${prefixCls}-with-footer`]: this.showSlotFooter
        }
      ],
      style: this.styles,
    })
    const tableProps = mergeProps({
      class: [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-border`]: true,
          [`${prefixCls}-hide-td-border`]: !this.border,
          [`${prefixCls}-stripe`]: this.stripe,
          [`${prefixCls}-with-fixed-top`]: !!this.height,
          // [`${prefixCls}-ping-left`]: this.rebuildData.length != 0 && this.lastScrollLeft > 0,
          // [`${prefixCls}-ping-right`]: this.rebuildData.length != 0 && this.horizontalToBottom != 0,
        }
      ]
    })
    const flag = !(!!this.localeNoFilteredDataText && (!this.rebuildData || this.rebuildData.length === 0))
    const noData = (
      <no-data
        prefixCls={this.prefixCls}
        data={this.rebuildData}
        bodyStyle={this.bodyStyle}
        filterFlag={this.filterFlag}
        isScrollX={this.isScrollX}
        on-on-scroll={this.onScroll}
        ref="noData"
      >
        <template slot="nodata">{this.$slots.nodata}</template>
      </no-data>
    )

    return (
      <div {...wrapProps} ref="tableWrap">
        <div {...tableProps}>
          { this.showSlotHeader &&
            <div class={[prefixCls + '-title']} ref="title">
              <slot name="header"></slot>
            </div>
          }
          {this.renderTable({ columns: this.cloneColumns, refs: 'body' })}
          {!flag && noData}
          {this.isLeftFixed && this.renderLeftFixedTable()}
          {this.isRightFixed && this.renderRightFixedTable()}
          {this.renderSumTable()}
          {this.patch()}
          {this.showSlotFooter &&
            <div class={[prefixCls + '-footer']} ref="footer">
              <slot name="footer"></slot>
            </div>
          }
          {this.load()}
          {this.resizeProxyVisible}
          <div
            class={`${prefixCls}__column-resize-proxy`}
            ref="resizeProxy"
            v-show={this.resizeProxyVisible}
          ></div>
          <div
            class={`${prefixCls}__column-move-proxy ${prefixCls}-cell`}
            ref="moveProxy"
            v-show={this.moveProxyVisible}
          ></div>
        </div>
      </div>
    )
  },
}
</script>
