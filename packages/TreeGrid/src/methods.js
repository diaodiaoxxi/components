import { deepCopy, getStyle } from '@hui/shared-utils'
import { getRandomStr, makeObjData } from './util'
import { Object } from 'core-js'
import { uuid } from '@hui/shared-utils/index'
import { formatdata } from './util'
// const rowKey = 1
let columnKey = 1
export default {
  methods: {
    // 宽度计算
    handleResize (isWindowResize = false) {
      const { cloneColumns } = this
      if (cloneColumns.length <= 0) return false
      else {
        const tableWidth = this.$el.offsetWidth - 1
        const columnsWidth = {}
        let sumMinWidth = 0
        const hasWidthColumns = []
        const noWidthColumns = []
        const maxWidthColumns = []
        const noMaxWidthColumns = []
        this.cloneColumns.forEach((col, index) => {
          // if (col.type && (col.type == 'index' || col.type == 'selection')) col.width = 80
          if (isWindowResize && !col.isWidth && col.width) delete col.width
          if (col.width) {
            hasWidthColumns.push(col)
          } else {
            noWidthColumns.push(col)
            if (col.minWidth) {
              sumMinWidth += col.minWidth
            } else {
              col.minWidth = this.minColWidth
              sumMinWidth += col.minWidth
            }
            if (col.maxWidth) {
              maxWidthColumns.push(col)
            } else {
              noMaxWidthColumns.push(col)
            }
          }
          col._width = null
        })
        // unUsableWidth 已被占用的宽度
        // usableWidth 可利用的宽度
        // usableLength 没有设置宽度的列
        const unUsableWidth = hasWidthColumns.map(cell => cell.width).reduce((a, b) => a + b, 0)
        let usableWidth = tableWidth - unUsableWidth - sumMinWidth - (this.isScrollY ? this.scrollBarWidth : 0) - 1
        let usableLength = noWidthColumns.length
        let columnWidth = 0
        if (usableWidth > 0 && usableLength > 0) {
          columnWidth = parseInt(usableWidth / usableLength)
        }
        for (let i = 0; i < this.cloneColumns.length; i++) {
          const column = this.cloneColumns[i]
          let width = columnWidth + (column.minWidth ? column.minWidth : this.minColWidth)
          if (column.width) {
            width = column.width
          } else {
            if (column._width) {
              width = column._width
            } else {
              if (column.minWidth > width) {
                width = column.minWidth
              } else if (column.maxWidth < width) {
                width = column.maxWidth
              }

              if (usableWidth > 0) {
                usableWidth -= width - (column.minWidth ? column.minWidth : this.minColWidth)
                usableLength--
                if (usableLength > 0) {
                  columnWidth = parseInt(usableWidth / usableLength)
                } else {
                  columnWidth = 0
                }
              } else {
                columnWidth = 0
              }
            }
          }

          column._width = width

          columnsWidth[column._index] = {
            width: width
          }
        }
        if (usableWidth > 0) {
          usableLength = noMaxWidthColumns.length
          columnWidth = parseInt(usableWidth / usableLength)
          for (let i = 0; i < noMaxWidthColumns.length; i++) {
            const column = noMaxWidthColumns[i]
            const width = column._width + columnWidth
            if (usableLength > 1) {
              usableLength--
              usableWidth -= columnWidth
              columnWidth = parseInt(usableWidth / usableLength)
            } else {
              columnWidth = 0
            }

            column._width = width

            columnsWidth[column._index] = {
              width: width
            }
          }
        }

        // this.tableWidth = this.cloneColumns
        //   .map(cell => cell._width)
        //   .reduce((a, b) => a + b, 0)
        // this.columnsWidth = columnsWidth
        this.tableWidth = this.cloneColumns.map(cell => cell._width).reduce((a, b) => a + b, 0) + (this.isScrollY ? this.scrollBarWidth : 0)
        this.columnsWidth = columnsWidth
        this.fixedHeader()
        this.$nextTick(() => {
          this.updateScroll()
          this.initWidth = parseInt(getStyle(this.$refs.tableWrap, 'width')) || 0
          // this.fixedHeader()
        })
      }
    },
    updateScroll () {
      if (!this.$refs.body || !this.rebuildData || this.rebuildData.length === 0) {
        this.isScrollY = false
        if (this.$refs.noData) {
          const bodyContentEl = this.$refs.noData.$el
          const bodyEl = bodyContentEl.parentElement
          this.isScrollX = bodyEl.offsetWidth < bodyContentEl.scrollWidth
        }
      } else {
        const bodyContentEl = this.$refs.body.$refs.tbody.$el
        const bodyEl = bodyContentEl.parentElement
        const bodyContentHeight = bodyContentEl.scrollHeight
        const bodyHeight = bodyEl.offsetHeight
        this.isScrollX = bodyEl.offsetWidth < bodyContentEl.scrollWidth + (this.isScrollY ? this.scrollBarWidth : 0)
        this.isScrollY = this.bodyHeight ? bodyHeight - (this.isScrollX ? this.scrollBarWidth : 0) < bodyContentHeight : false
        // console.log(this.tableWidth)
        // console.log('x', this.isScrollX, bodyEl.offsetWidth, bodyContentEl.scrollWidth)
        // console.log('y', this.isScrollY, bodyHeight, bodyContentHeight)
      }
    },
    changeWidth (drag, id, width, obj) {
      const that = this
      let totalWidth = 0
      if (drag > 0) {
        this.cloneColumns.forEach((col, i) => {
          if (col.__id == id) {
            const min = col.minWidth ? col.minWidth : this.minColWidth
            width = min && width < min ? min : width
            width = col.maxWidth && width > col.maxWidth ? col.maxWidth : width
            that.$set(col, 'width', width)
            that.$set(col, '_width', width)
          }
        })
      } else {
        this.cloneColumns.forEach((col, i) => {
          if (col.__id == id) {
            const min = col.minWidth ? col.minWidth : this.minColWidth
            width = min && width < min ? min : width
            // width = col.minWidth && width < col.minWidth ? col.minWidth : width
            that.$set(col, 'width', width)
            that.$set(col, '_width', width)
          }
          var colWidth = col.width || col._width
          totalWidth = totalWidth + colWidth
        })
        if (totalWidth < this.initWidth) {
          // let findIndex = this.cloneColumns[index].width? 0 : index + 1
          let noWidthIndex = obj.index
          let lastInx = null
          for (let i = this.cloneColumns.length - 1; i >= 0; i--) {
            if (this.cloneColumns[i].fixed != 'right') {
              lastInx = i
              break
            }
          }
          if (obj.index == lastInx) {
            noWidthIndex = obj.index - 1 < 0 ? 0 : obj.index - 1
          } else {
            noWidthIndex = obj.index + 1
          }
          for (let i = 0; i < this.cloneColumns.length - 1; i++) {
            if (!this.cloneColumns[i].isWidth && i != obj.index) {
              noWidthIndex = i
              break
            }
          }
          const isScrollY = this.isScrollY ? this.scrollBarWidth : 0
          const gap = this.initWidth - totalWidth - isScrollY - 1
          const _column = this.cloneColumns[noWidthIndex]
          const width = _column.width ? _column.width : _column._width
          _column.width = width + gap
        }
      }
      this.$nextTick(() => {
        this.$emit('on-drag', width, obj.key)
        this.handleResize()
      })
    },
    // getAllData (data) {
    //   console.time()
    //   const cloneData = cloneDeep(data)
    //   function setDataId (item) {
    //     for (const i in item) {
    //       const row = item[i]
    //       const uid = uuid()
    //       row._rowid = uuid()
    //       if (row.children && row.children.length > 0) {
    //         setDataId(row.children)
    //       }
    //     }
    //   }
    //   setDataId(cloneData)
    //   console.timeEnd()
    //   return cloneData
    // },
    /**
     *  markData 扁平化数据
     * @param {*} col 加 _rowid 的所有数据
     * @param {*} parentNode 异步加载数据
     * @param {*} level 层级
     */
    makeData (cloneData, parentNode, level) {
      let uIndex = 0
      // 全部数据
      const newData = []
      // 真实数据
      const rowMap = {}
      const flattenChildren = (dataList, acc = [], parentNode, level, expand, checked, path = '') => {
        const getPath = (path, i) => {
          return path === '' ? `${i}` : `${path}.children.${i}`
        }
        return dataList.reduce((acc, row, i) => {
          const newRow = row
          newRow._rowid = newRow._rowid || uuid()
          newRow._index = uIndex++
          // 跟节点编号
          newRow._parentId = parentNode || 'root'
          // 数据路径
          newRow._path = getPath(path, i)
          // 是否展开
          newRow._expand = !!((typeof row.expand == 'string' && row.expand == 'true') || (typeof row.expand == 'boolean' && row.expand))
          newRow._checked = this.checkStrictly ? (!!((typeof row.checked == 'string' && row.checked == 'true') || (typeof row.checked == 'boolean' && row.checked))) : checked || !!((typeof row.checked == 'string' && row.checked == 'true') || (typeof row.checked == 'boolean' && row.checked))
          newRow._freshLoad = !!((typeof row.freshLoad == 'string' && row.freshLoad == 'true') || (typeof row.freshLoad == 'boolean' && row.freshLoad))
          newRow._isShow = expand || false
          // 行编辑
          newRow._isRowEdit = !!((typeof row._isRowEdit == 'string' && row._isRowEdit == 'true') || (typeof row._isRowEdit == 'boolean' && row._isRowEdit))
          newRow._disabled = !!((typeof row._disabled == 'string' && row._disabled == 'true') || (typeof row._disabled == 'boolean' && row._disabled))
          newRow._disEdit = !!((typeof row._disEdit == 'string' && row._disEdit == 'true') || (typeof row._disEdit == 'boolean' && row._disEdit))
          // 异步加载子节点后的层级
          newRow._level = (level + 1) || 1

          if (Array.isArray(newRow.children)) {
            newRow.children = newRow.children.map(val => {
              val._rowid = uuid()
              return val
            })
          }
          newRow.childrenId = Array.isArray(row.children) ? row.children.map(function (item) {
            return item._rowid
          }) : []

          acc.push(newRow)
          rowMap[newRow._rowid] = makeObjData(newRow)
          // console.log(Object.keys(rowMap).length, acc.length, newRow._rowid, Array.from(new Set(acc)).length, '获取数据')
          if (Array.isArray(newRow.children)) {
            flattenChildren(newRow.children, acc, newRow._rowid, newRow._level, newRow._expand, newRow._checked, newRow._path)
          }
          return acc
        }, acc)
      }

      flattenChildren(cloneData, newData, parentNode, level, true, false, '')
      this.objData = Object.assign({}, this.objData, rowMap)
      // console.log(Object.keys(this.objData).length, this.objData, newData, '获取数据')
      return newData
    },
    makeSumObjData () {
      const data = {}
      this.summationData.forEach((row, index) => {
        data[index] = deepCopy(row)
      })
      return data
    },

    summary (key, format, sumFixed) {
      const data = deepCopy(this.rebuildData)
      let total = 0
      const _key = key
      data.forEach((row, index) => {
        let item = row[_key]
        if (item === null || item === undefined) {
          item = ''
        }
        item = item.toString().replace(/,/g, '')
        if (item && item != '') {
          total += Number(item)
        }
      })
      return formatdata(total, format, sumFixed)
    },
    makeColumnsId (columns) {
      return columns.map(item => {
        item.__id = getRandomStr(6)
        return item
      })
    },
    getAllColumns (cols, forTableHead = false) {
      const columns = deepCopy(cols)
      const result = []
      columns.forEach((column) => {
        result.push(column)
      })
      return result
    },
    makeColumns (cols) { // columns处理
      const columns = deepCopy(this.getAllColumns(cols))
      const left = []
      const right = []
      const center = []
      let curType = false
      let treeNodeIndex = -1
      columns.forEach((column, index) => {
        if (column.type == 'selection') {
          curType = true
        }
        if (typeof column.treeNode === 'boolean' && column.treeNode && !column.hiddenCol && treeNodeIndex === -1) {
          treeNodeIndex = index
          column._treeNode = true
        } else {
          column._treeNode = false
        }
        column._index = index
        column._columnKey = columnKey++
        column._width = column.width ? column.width : '' // update in handleResize()
        column._sortType = 'normal'
        column._filterVisible = false
        column._isFiltered = false
        column._isColumnEdit = false
        column._filterChecked = []
        column.isWidth = !!column.width // 区分定宽/非定宽列

        if ('filterMultiple' in column) {
          column._filterMultiple = column.filterMultiple
        } else {
          column._filterMultiple = true
        }
        if ('filteredValue' in column) {
          column._filterChecked = column.filteredValue
          column._isFiltered = true
        }
        if (!column.hiddenCol || column.hiddenCol == 'false') {
          if (column.fixed && column.fixed === 'left') {
            left.push(column)
          } else if (column.fixed && column.fixed === 'right' && right.length == 0) {
            right.push(column)
          } else {
            if (column.fixed) column.fixed = undefined
            center.push(column)
          }
        }
      })
      if (treeNodeIndex === -1 && center.length > 0) {
        if ((center[0].type === 'index' || center[0].type === 'selection') && center.length > 1) {
          center[1]._treeNode = true
        } else {
          center[0]._treeNode = true
        }
      }
      this.$nextTick(() => {
        this.selectType = curType
      })
      return left.concat(center).concat(right)
    },
    sortCloumn (curIndex, insertIndex, _index) {
      if (this.cloneColumns[insertIndex].fixed) return
      const item = this.cloneColumns[curIndex]
      this.cloneColumns.splice(curIndex, 1)
      this.cloneColumns.splice(insertIndex, 0, item)
      this.$emit('on-move', curIndex, insertIndex)
    },

  }
}
