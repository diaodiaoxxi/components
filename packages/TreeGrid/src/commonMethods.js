import { deepCopy } from '@hui/shared-utils'
// import { getRandomStr, getRandomId, makeObjData } from './util'

export default {
  data () {
    return {
      shiftSelect: [],
      ctrlSelect: [],
      baseInx: null,
      offsetInx: null,
      focusIndex: -1
    }
  },
  watch: {
    shiftSelect (val) {
      if (val.length == 2) {
        this.selectRange()
      }
    },
  },
  methods: {
    // 选中切换
    toggleSelect (row, event) {
      const rowId = row._rowid

      if (this.objData[rowId]._isDisabled) {
        return
      }
      const curIndex = this.realRebuildData.findIndex((value, index, array) => value._rowid == rowId)
      if (this.objData[rowId]) {
        const status = !this.objData[rowId]._isChecked
        this.objData[rowId]._isChecked = status
        this.objData[rowId]._Indeterminate = false

        if (!status) {
          this.objData[rowId]._isHighlight = false
        }
        if (this.highlightRow) {
          this.focusIndex = curIndex
        }
        if (!this.checkStrictly && this.isCheckbox) {
          if (row.childrenId && row.childrenId.length > 0) {
            // 如当前节点是父节点-则联动子节点
            this.treeCheckedDown(row.childrenId, status,)
          }
          if (row._parentId && row._parentId != 'root') {
            const parentChildNode = this.objData[row._parentId].childrenId
            if (parentChildNode) {
              this.treeCheckedUp(parentChildNode, row._parentId)
            }
          }
        }
      }
      // debugger
      // shift
      // console.log(status, curIndex)
      // if (!status) {
      //   this.shiftSelect = []
      //   this.shiftSelect[0] = curIndex
      //   console.log(this.shiftSelect, 'this.shiftSelect')
      // } else {
      //   this.shiftSelect = []
      // }
      this.baseInx = curIndex
      this.offsetInx = curIndex
      const selection = this.getSelection()
      const selectionInx = this.getSelection(true)
      this.$nextTick(() => {
        // const selection = this.getSelection()
        this.$emit(status ? 'on-select' : 'on-select-cancel', selection, JSON.parse(JSON.stringify(this.getRowData(rowId))))
        this.$emit('on-selection-change', selection, selectionInx, rowId)
      })
    },
    treeCheckedUp (parentChildNode, parentId) {
      const status = parentChildNode.some(val => !this.objData[val]._isChecked) // 是否全没有选中
      const someSelect = parentChildNode.some(val => this.objData[val]._isChecked) // 是否有选中
      const indeterminate = parentChildNode.some(val => this.objData[val]._Indeterminate) // 是否有选中
      if (!this.objData[parentId]._isDisabled) this.objData[parentId]._isChecked = !status
      if (!this.objData[parentId]._isDisabled) this.objData[parentId]._Indeterminate = status && (someSelect || indeterminate)
      const parent = this.objData[parentId]._parentId
      if (parent && parent != 'root') {
        const parentChild = this.objData[parent].childrenId
        if (parentChild) {
          this.treeCheckedUp(parentChild, parent)
        }
      }
    },
    treeCheckedDown (childrenId, status, disabled) {
      childrenId.forEach((val, index) => {
        if (!this.objData[val]._isDisabled) this.objData[val]._isChecked = status; this.objData[val]._Indeterminate = false
        const child = this.objData[val].childrenId
        if (child && child.length > 0) this.treeCheckedDown(this.objData[val].childrenId, status)
      })
    },
    selectAll (status) {
      for (const data of this.rebuildData) {
        this.objData[data._rowid]._isHighlight = false
        if (this.objData[data._rowid]._isDisabled) {
          continue
        } else {
          this.objData[data._rowid]._isChecked = status
          this.objData[data._rowid]._Indeterminate = false
        }
      }
      const selection = this.getSelection()
      const selectionInx = this.getSelection(true)
      this.$emit('on-select-all', selection, status)
      this.$emit('on-selection-change', selection, selectionInx)
    },
    handleToggleExpand (row, isAutoLoad = false) {
      const rowId = row._rowid
      const itemAutoLoad = row.autoLoad
      if (isAutoLoad && itemAutoLoad && (!row.expand || (row._parentId != 'root' && !this.objData[row._parentId]._isExpand)) && 'loading' in row && !row.loading && !row.leaf && this.loadData) return
      if ((row.childrenId && row.childrenId.length > 0) || row._load) {
        // 如当前节点是父节点-则联动子节点
        const status = !this.objData[rowId]._isExpand
        this.objData[rowId]._isExpand = status
        // 异步加载情况下，删除子元素
        if (row.freshLoad && !status) {
          while (row.childrenId.length > 0) {
            this.handleDelData(row.childrenId[0])
          }
          this.$set(row, 'expand', false)
          this.$set(row, '_load', false)
        } else {
          this.treeExpandDown(row.childrenId, status)
          this.realRebuildData = this.rebuildData.filter(val => this.objData[val._rowid]._isShow)
        }
        this.$emit('on-expand',
          JSON.parse(JSON.stringify(this.getRowData(rowId))),
          status,
          rowId
        )
      } else {
        const status = this.objData[rowId]._isExpand
        if (status) {
          this.objData[rowId]._isExpand = !status
          if (this.loadData && 'loading' in row && !row.loading && row.expand && !isAutoLoad && !itemAutoLoad) {
            // 非autoload情况，需要手动点击去加载
            this.$set(row, 'expand', false)
          }
        } else {
          if (this.loadData && 'loading' in row && !row.loading && ((!row.expand && !isAutoLoad) || (row.expand && itemAutoLoad && isAutoLoad))) {
            if (row._load && !row.freshLoad) return
            this.$set(row, 'loading', true) // 异步加载动画
            this.loadData(row, children => {
              if (row._load) return // 已经加载过
              this.objData[rowId]._isExpand = true
              this.$set(row, 'loading', false)

              if (children.length) {
              // 异步加载数据处理
                this.loadNode(children, row, true, true)
                // 联动展开设置
                this.realRebuildData = this.rebuildData.filter(val => this.objData[val._rowid]._isShow)
                this.$emit(
                  'on-expand',
                  JSON.parse(JSON.stringify(this.getRowData(rowId))),
                  true,
                  rowId
                )
              }
              this.$set(row, '_load', true)
            })
          } else if (this.loadData && 'loading' in row && !row.loading && row.expand && !isAutoLoad && !itemAutoLoad) {
            // 非autoload情况，需要手动点击去加载
            this.$set(this.objData[rowId], '_isExpand', false)
            // this.$set(this.objData[rowId], 'expand', false)
            this.$set(row, 'expand', false)
            // row.expand = false
          }
        }
      }
    },
    loadNode (children, row, addEditStatus, load) {
      const rowId = row._rowid
      // const dataWithId = this.getAllData(children)
      const data = this.makeData(children, rowId, row._level)
      const index = this.rebuildData.findIndex(n => n._rowid == rowId)
      const childrenId = row.childrenId ? row.childrenId : []
      data.map(val => {
        if (val._parentId == rowId) {
          childrenId.push(val._rowid)
        }
      })
      this.objData[rowId].childrenId = childrenId

      if (load) {
        // if (row.freshLoad) {
        //   this.$set(this.rebuildData[index], '_load', false)
        // } else {
        //   this.$set(this.rebuildData[index], '_load', true)
        // }
        this.$set(this.rebuildData[index], 'expand', true)
      }
      this.$set(this.rebuildData[index], 'childrenId', childrenId)
      if (!addEditStatus) {
        data.forEach(val => {
          val._isRowEdit = true
        })
      }

      const makeData = deepCopy(this.rebuildData)
      const start = makeData.slice(0, index + 1)
      const end = makeData.slice(index + 1)
      this.treeExpandDown(childrenId, true)
      this.rebuildData = start.concat(data).concat(end)
      if (this.objData[rowId]._isChecked) {
        data.forEach(val => {
          this.objData[val._rowid]._isChecked = this.objData[rowId]._isChecked
        })
      } else {
        data.forEach(val => {
          if (!this.checkStrictly && val.checked && val.checked == true && this.isCheckbox) {
            if (val.childrenId && val.childrenId.length > 0) {
              // 如当前节点是父节点-则联动子节点
              this.treeCheckedDown(val.childrenId, true)
            }
            // 父节点联动
            if (val._parentId && val._parentId != 'root') {
              const parentChildNode = this.objData[val._parentId].childrenId
              if (parentChildNode) {
                this.treeCheckedUp(parentChildNode, val._parentId)
              }
            }
          }
        })
      }
    },
    getRowData (rowId) {
      const data = this.rebuildData.filter(val => val._rowid == rowId)[0]
      return data
    },
    treeExpandDown (childrenId, status) {
      if (childrenId && childrenId.length > 0) {
        childrenId.forEach((val, childIndex) => {
          this.objData[val]._isShow = status
          const child = this.objData[val].childrenId
          const expand = this.objData[val]._isExpand
          if (child && child.length > 0 && expand) {
            this.treeExpandDown(child, status)
          }
        })
      }
    },
    setEditableRow (row) {
      if ((this.editType && this.editType != 'rowEdit') || row._disEdit) return
      const rowId = row._rowid
      const target = this.getRowData(rowId)
      target._isRowEdit = true
    },
    cancelEditableRow (row) {
      if ((this.editType && this.editType != 'rowEdit') || row._disEdit) return
      const rowId = row._rowid
      const target = this.getRowData(rowId)
      target._isRowEdit = false
    },
    highlightCurrentRow (rowId, isRadio) {
      if (!(this.highlightRow || isRadio)) return
      const curStatus = this.objData[rowId]._isHighlight
      const returnData = this.getRowData(rowId)

      if (this.objData[rowId]._isChecked && this.rowSelectOnly) {
        return
      }
      let oldIndex = -1
      for (const i in this.objData) {
        this.objData[i]._isChecked = false // 单选时取消多选项，估值6.0专用
        if (this.objData[i]._isHighlight) {
          oldIndex = i
          this.objData[i]._isHighlight = false // 单选是上一项取消选中
        }
      }
      const oldData =
          oldIndex == -1
            ? null
            : JSON.parse(JSON.stringify(this.getRowData(oldIndex)))
      if (curStatus) {
        this.objData[rowId]._isHighlight = false
        this.objData[rowId]._isChecked = false
        this.$emit(
          'on-current-change-cancel',
          JSON.parse(JSON.stringify(returnData)),
          oldData,
          rowId
        )
      } else {
        this.objData[rowId]._isHighlight = true
        this.objData[rowId]._isChecked = true
        this.$emit(
          'on-current-change',
          JSON.parse(JSON.stringify(returnData)),
          oldData,
          rowId
        )
      }
      if (
        this.columns.length > 0 &&
          (this.columns[0].type == 'selection' ||
            this.columns[1].type == 'selection')
      ) {
        const selection = this.getSelection()
        const selectionInx = this.getSelection(true)
        this.$emit('on-selection-change', selection, selectionInx)
      }
      // this.tableData.objData = this.objData
    },
    clickCurrentRow (row, event) {
      const rowId = row._rowid
      // if (!(this.rowSelect || this.highlightRow || this.rowSelectOnly)) return
      // if (this.clickToSelect) {
      //   const curStatus = this.objData[rowId]._isHighlight
      //   for (const i in this.objData) {
      //     if (this.objData[i]._isHighlight) {
      //       this.objData[i]._isHighlight = false
      //     }
      //   }
      //   this.objData[rowId]._isHighlight = !curStatus
      // }
      const curIndex = this.realRebuildData.findIndex((value, index, array) => value._rowid == rowId)
      this.baseInx = curIndex
      this.offsetInx = curIndex
      // ctrSelection仅开启highlight-row时支持ctrl和shift多选 兼容mac
      // rowSelect 多选时是否支持行选中,(仅在type为selection即多选下使用)
      if (
        (!event.shiftKey && !(event.ctrlKey || event.metaKey)) ||
          (this.highlightRow && !!this.ctrSelection)
      ) {
        // if (!this.rowSelect) {
        //   this.focusIndex = curIndex
        //   this.highlightCurrentRow(rowId)
        // }
        if (!this.objData[rowId]._isHighlight) {
          this.shiftSelect = []
          this.ctrlSelect = []
          this.shiftSelect[0] = curIndex
          this.ctrlSelect.push(rowId)
        } else {
          this.shiftSelect = []
          this.ctrlSelect = []
        }
      } else if (event.shiftKey && this.checkStrictly && this.isCheckbox) {
        window.getSelection()
          ? window.getSelection().removeAllRanges()
          : document.selection.empty()
        this.getshiftSelect(curIndex)
      } else {
        this.getctrlSelect(rowId)
      }
      // this.tableData.objData = this.objData
      const returnData = this.getRowData(rowId)
      this.$emit('on-row-click', [
        JSON.parse(JSON.stringify(returnData)),
        rowId,
        this.objData[rowId]._isHighlight
      ])
    },
    dblclickCurrentRow (rowId) {
      const curIndex = this.realRebuildData.findIndex((value, index, array) => value._rowid == rowId)
      this.focusIndex = curIndex
      this.$emit(
        'on-row-dbclick',
        JSON.parse(JSON.stringify(this.getRowData(rowId)))
      )
    },
    clickCurrentBtn (rowId) {
      if (this.objData[rowId]._isDisabled) return
      const returnData = this.getRowData(rowId)
      this.$emit('on-row-click', [
        JSON.parse(JSON.stringify(returnData)),
        rowId
      ])
    },
    getSelection (status = false) {
      const selectionIndexes = []
      for (const i in this.objData) {
        if (this.objData[i]._isChecked && !this.objData[i]._isDel) { selectionIndexes.push(i) }
      }

      return status
        ? selectionIndexes
        : JSON.parse(
          JSON.stringify(
            this.rebuildData.filter(
              (data, index) => selectionIndexes.indexOf(data._rowid) > -1
            )
          )
        )
    },
    getshiftSelect (_index) {
      if (!this.highlightRow) return
      const min = Math.min(this.shiftSelect[0], _index)
      const max = Math.max(this.shiftSelect[0], _index)
      switch (this.shiftSelect.length) {
        case 0:
          this.shiftSelect[0] = _index
          break
        case 1:
          this.$set(this.shiftSelect, 0, min)
          this.$set(this.shiftSelect, 1, max)
          break
        case 2:
          if (_index < this.shiftSelect[0]) { this.$set(this.shiftSelect, 0, _index) }
          if (_index > this.shiftSelect[1]) { this.$set(this.shiftSelect, 1, _index) }
          break
        default:
          this.shiftSelect = []
      }
    },
    getctrlSelect (rowId) {
      if (!this.highlightRow) return
      const itemIndex = this.ctrlSelect.indexOf(rowId)
      if (itemIndex == -1) {
        this.ctrlSelect.push(rowId)
        this.objData[rowId]._isChecked = true
      } else {
        this.ctrlSelect.splice(itemIndex, 1)
        this.objData[rowId]._isHighlight = false
        this.objData[rowId]._isChecked = false
      }
      this.$emit(
        'on-selection-change',
        this.getSelection(),
        this.getSelection(true)
      )
    },
    selectRange () {
      for (var i = this.shiftSelect[0]; i <= this.shiftSelect[1]; i++) {
        const rowId = this.realRebuildData[i]._rowid
        this.objData[rowId]._isHighlight = false
        if (!this.objData[rowId]._isDisabled) {
          this.objData[rowId]._isChecked = true
        }
      }
      this.$emit(
        'on-selection-change',
        this.getSelection(),
        this.getSelection(true)
      )
    },
    handleMouseIn (rowId) {
      if (this.disabledHover) return
      if (this.objData[rowId]._isHover) return
      for (const i in this.objData) {
        this.objData[i]._isHover = false
      }
      this.objData[rowId]._isHover = true
    },
    handleMouseOut (rowId) {
      if (this.disabledHover) return
      this.objData[rowId]._isHover = false
    },
    handleAddData (rowId, arr, addEditStatus) {
      // const dataWithId = this.getAllData(arr)
      if (this.editType != 'rowEdit') return
      if (rowId == 'root') {
        const data = this.makeData(arr)
        if (!addEditStatus) {
          data.forEach(val => {
            val._isRowEdit = true
          })
        }
        this.rebuildData = data.concat(this.rebuildData)
      } else {
        if (!rowId) return
        const index = this.rebuildData.findIndex(n => n._rowid == rowId)
        this.objData[rowId]._isExpand = true
        this.loadNode(arr, this.rebuildData[index])
      }
      this.realRebuildData = this.rebuildData.filter(val => this.objData[val._rowid]._isShow)
    },
    handleDelData (rowId) {
      if (!rowId) return
      if (this.rebuildData && this.rebuildData.length > 0) {
        const index = this.rebuildData.findIndex(n => n._rowid == rowId)
        const row = this.rebuildData[index]
        if (index > -1) {
          if (row._parentId != 'root') {
            const parent = this.rebuildData.filter(n => n._rowid == row._parentId)[0]
            this.updateParent(parent.childrenId, row._rowid)
            this.updateParent(this.objData[row._parentId].childrenId, row._rowid)
          }
          this.rebuildData.splice(index, 1)
          this.objData[row._rowid]._isDel = true
          this.delete(row)
          this.realRebuildData = this.rebuildData.filter(val => this.objData[val._rowid]._isShow)
        }
      }
    },
    delete (row) {
      if (row.childrenId && row.childrenId.length > 0) {
        row.childrenId.map(val => {
          if (val) {
            const index = this.rebuildData.findIndex(n => n._rowid == val)
            if (index > -1) {
              const row = this.rebuildData[index]
              this.rebuildData.splice(index, 1)
              this.objData[row._rowid]._isDel = true
              if (row.childrenId && row.childrenId.length > 0) this.delete(row)
            }
          }
        })
      }
    },
    updateParent (item, parentId) {
      const index = item.indexOf(parentId)
      if (index > -1) {
        item.splice(index, 1)
      }
    },
    getTreeSelection () {
      let selection = []
      selection = this.getSelection()
      return selection
    },
    handleKeyUp (e) {
      if (!e.ctrlKey && e.keyCode === 17) {
        e.preventDefault()
        e.stopPropagation()
        this.isCtrlDown = false
      }

      if (!e.shiftKey && (e.keyCode === 40 || e.keyCode === 38)) {
        // this.isFocusSelect = true
        if (e.keyCode === 40 || e.keyCode === 38) {
          e.preventDefault()
          e.stopPropagation()
          if (e.keyCode === 40 && this.focusIndex < this.realRebuildData.length - 1) {
            this.focusIndex++
          }
          if (e.keyCode === 38 && this.focusIndex > 0) {
            this.focusIndex--
          }
          const rowId =
            this.realRebuildData && this.realRebuildData[this.focusIndex]
              ? this.realRebuildData[this.focusIndex]._rowid
              : null
          this.baseInx = this.focusIndex
          this.offsetInx = this.focusIndex
          if (rowId) { this.highlightCurrentRow(rowId) }
        }
      }
      if (e.shiftKey && (this.baseInx || this.baseInx == 0)) {
        const keyCode = e.keyCode
        if (keyCode === 40) {
          e.preventDefault()
          e.stopPropagation()
          if (this.offsetInx < this.realRebuildData.length - 1) {
            this.offsetInx++
          }
          this.keySelectRange()
        }
        // prev
        if (keyCode === 38) {
          e.preventDefault()
          e.stopPropagation()
          if (this.offsetInx > 0) {
            this.offsetInx--
          }
          this.keySelectRange()
        }
      }
    },
    keySelectRange () {
      let max, min
      if (this.baseInx < this.offsetInx) {
        min = this.baseInx + 1
        max = this.offsetInx
      }
      if (this.baseInx > this.offsetInx) {
        min = this.offsetInx
        max = this.baseInx - 1
      }
      for (var i = 0; i < this.realRebuildData.length; i++) {
        const rowId = this.realRebuildData[i]._rowid
        if (this.objData[rowId]._isDisabled || i == this.baseInx) continue
        // const index = this.rebuildData[i]._index
        if (i >= min && i <= max) {
          this.objData[rowId]._isChecked = true
        } else {
          this.objData[rowId]._isChecked = false
        }
      }
      this.focusIndex = this.offsetInx
      this.$emit(
        'on-selection-change',
        this.getSelection(),
        this.getSelection(true)
      )
    },
    handleCheckChange (row, status) {
      if (this.objData[row._rowid]._isDisabled) return
      this.objData[row._rowid]._isChecked = status
      this.objData[row._rowid]._isHighlight = status
      if (!this.checkStrictly && this.isCheckbox) {
        if (row.childrenId && row.childrenId.length > 0) {
          // 如当前节点是父节点-则联动子节点
          this.treeCheckedDown(row.childrenId, status,)
        }
        if (row._parentId && row._parentId != 'root') {
          const parentChildNode = this.objData[row._parentId].childrenId
          if (parentChildNode) {
            this.treeCheckedUp(parentChildNode, row._parentId)
          }
        }
      }
      const selection = this.getSelection()
      const selectionInx = this.getSelection(true)
      this.$nextTick(() => {
        this.$emit(status ? 'on-select' : 'on-select-cancel', selection, JSON.parse(JSON.stringify(row)))
        this.$emit('on-selection-change', selection, selectionInx, row._rowid)
      })
    },
    /**
     * 动态改变属性checked、expand、_isHighlight、_isRowEdit、_disabled、_disEdit
     * @param {*} rowId 行id
     * @param {*} attr 要改变的属性
     * @param {*} status 属性状态
     */
    handleAttrChange (rowId, attr, status) {
      if (rowId) {
        const row = this.getRowData(rowId)
        if (row) {
          this.$set(row, attr, status)
        }
        switch (attr) {
          case 'checked': this.handleCheckChange(row, status); break
          case 'expand': this.objData[rowId]._isExpand = !status; this.handleToggleExpand(row); break
          case '_isHighlight': this.objData[rowId]._isHighlight = status; break
          case '_isRowEdit': this.objData[rowId]._isRowEdit = status; break
          case '_disabled': this.objData[rowId]._isDisabled = status; break
          default: break
        }
      }
    },
    expandLevel (level) {
      if (level) {
        this.rebuildData.map(item => {
          if (item.childrenId && item._level <= level) {
            this.$set(item, 'expand', false)
            this.objData[item._rowid]._isExpand = false
            this.handleToggleExpand(item)
            // this.setScrollCallBack()
          }
        })
      }
    },
  }
}
