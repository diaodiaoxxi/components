<template>
  <div :class="classes"
       ref="cell"
       tabindex="-1"
       @focusin="handleFocusin"
       @focusout="handleFocusout"
       v-clickoutside="handleClose"
       @mouseenter.stop="handleMouseIn($event)"
       @mouseleave.stop="handleMouseOut($event)">

    <div v-if="!hiddenOther && !render"
         :style="renderSty"
         class="dbClass"
         @click="clickCurrentCell($event)"
         :class="innerClass">
      <template v-if="showSlot">
        <slot></slot>
      </template>
      <template
        v-if="(column.type === 'index' && sum && columnIndex == 0 || column.type === 'selection' && sum && columnIndex == 0)"
      >汇总</template>
      <template
        v-else-if="(column.type === 'index' && sum && columnIndex != 0 || column.type === 'selection' && sum && columnIndex != 0)"
      ></template>
      <template v-if="renderType === 'index'">
        <span>{{Number(naturalIndex)+1}}</span>
      </template>
      <template v-if="renderType === 'selection'">
        <Checkbox :value="checked"
                  @click.native.stop="handleClick"
                  @on-change="toggleSelect"
                  v-bind="column.typeParams"
                   size="large"
                  :indeterminate="indeterminate"
                  :disabled="disabled"></Checkbox>
      </template>
      <template v-if="renderType === 'radio'">
        <h-radio :value="checked" :disabled="disabled" @input="clickCurrentRadio" @click.native.stop="handleClick" v-bind="column.typeParams"></h-radio>
      </template>
      <template v-if="renderType === 'normal' && !render">
        {{preLabel}}
        <span v-if="column.html" v-html="normalDate"
              :title="column.showTooltip ? normalDate : ''">
        </span>
        <span v-else v-text="normalDate"
          :title="column.showTooltip ? normalDate : ''">
        </span>
        {{rearLabel}}
        <!-- <i v-if="editType == 'cellEdit' && cellHover" tabindex="-1" :class="[`${prefixCls}-cell-icon`, TABLE_ICON.edit]"></i> -->
      </template>
      <template v-if="renderType === 'text'">
        <h-input v-model="columnText"
                 ref="input-edit-gird"
                 :icon="isFiledIcon(column)"
                 v-bind="column.typeParams"
                 class="canEdit"
                 @click.native.stop="handleClick"
                 @on-change="editinputChange"
                 @on-blur="editinputBlur"
                 @on-enter="editinputEnter"
                 ></h-input>
      </template>
      <template v-if="renderType === 'textArea'">
        <h-input v-model="columnArea"
                  type="textarea"
                  v-bind="column.typeParams"
                  :canResize="false"
                  @click.native.stop="handleClick"
                  @on-change="editAreaChange"
                  @on-blur="editAreaBlur"></h-input>
      </template>
      <template v-if="renderType === 'money'">
        <h-typefield :value="columnMoney"
                   ref="money"
                   v-bind="column.typeParams"
                   @click.native.stop="handleClick"
                   @input="typefieldChange"
                   @on-blur="typefieldBlur"
                   @on-enter="typefieldEnter"
                   :transfer="true"
                   class="canEdit"></h-typefield>
      </template>
      <template v-if="renderType === 'card'">
        <h-typefield v-model="columnCard"
                   v-bind="column.typeParams"
                   type="cardNo"
                   @click.native.stop="handleClick"
                   class="canEdit"></h-typefield>
      </template>
      <template v-if="renderType === 'select'">
        <cell-select v-model="columnSelect"
                  ref="select"
                  v-bind="column.typeParams"
                  @click.native.stop="handleClick"
                  @on-change="editselectChange"
                  class="canEdit">
          <!-- #199631  editGrid select下拉选项的option配置项目中，添加disabled:1 表示下拉选项不可选择 默认0可以用选择 -->
          <cell-option v-for="(item,i) in column.option"
                    :key="i"
                    :disabled="item.disabled === 1"
                    :value="item.value"
                    :label="item.label">{{item.label}}</cell-option>
        </cell-select>
      </template>
      <template v-if="renderType === 'date'">
        <h-date-picker v-model="columnDate"
              ref="date"
              v-bind="column.typeParams"
              :showFormat="true"
              :transfer="true"
              @click.native.stop="handleClick"
              @on-change="editdateChange"
              class="canEdit"></h-date-picker>
      </template>
      <template v-if="renderType === 'time'">
        <h-time-picker v-model="columnTime"
                ref="time"
                v-bind="column.typeParams"
                :transfer="true"
                @click.native.stop="handleClick"
                class="canEdit"></h-time-picker>
      </template>
      <template v-if="renderType === 'selectTree'">
        <h-select-tree v-model="columnTree"
                    ref="tree"
                    :firstValue.sync="columnTree"
                    v-bind="column.typeParams"
                    :transfer="true"
                    @click.native.stop="handleClick"
                    class="canEdit">
        </h-select-tree>
      </template>
       <template v-if="renderType === 'cascader'">
        <h-cascader v-model="columnCascader"
                  ref="cascader"
                  v-bind="column.typeParams"
                  :transfer="true"
                  @click.native.stop="handleClick"
                  class="canEdit">
        </h-cascader>
      </template>
      <!-- <template v-if="renderType === 'expand' && !row._disableExpand">
        <div :class="expandCls"
             @click="toggleExpand($event)">
          <Icon name="enter"></Icon>
        </div>
      </template> -->
    </div>

    <template v-if="showSlot && (render || renderType === 'slot')">
      <template >
        <slot></slot>
      </template>
      <div  style="display: inline-block">
        <Cell v-if="render&&renderType != 'expand'"
          :row="row"
          :column="column"
          :index="index"
          :sum="sum"
          :render="column.render"></Cell>
        <table-slot
          v-if="renderType === 'slot'"
          :row="row"
          :column="column"
          :index="index"
        ></table-slot>
      </div>

    </template>

    <!-- <transition name="fade">
      <div class="verify-tip verify-bottom"
           v-if="validateState === 'error'"
           ref="verifyTip">
        <div class="verify-tip-arrow"></div>
        <div class="verify-tip-inner">{{validateMessage}}</div>
      </div>
    </transition> -->
  </div>
</template>
<script>
/* eslint-disable camelcase */
import cellSelect from '@packages/Select'
import { Checkbox } from 'h_ui/dist/h_ui.min.js'
// import AsyncValidator from 'async-validator'
import Cell from '../expand'
import TableSlot from '../slot'
import { TABLE_ICON } from '../config'
import PropTypes from '@hui/shared-utils/vue-types'
import clickoutside from '@hui/directives/clickoutside'
// import Icon from '../../../../hui-component/src/components/Icon/Icon.vue'
// import hInput from '@/components/Input'
// import InputNumber from '@/components/InputNumber/InputNumber.vue'
// import Typefield from '../../../../hui-component/src/components/Typefield/Typefield.vue'
// import SelectTree from '../../../../hui-component/src/components/SelectTree/SelectTree.vue'
// import Date from '../../../../hui-component/src/components/DatePicker'
// import hTime from '../../../../hui-component/src/components/TimePicker'
// import Radio from '../../../../hui-component/src/components/Radio'
// import Cascader from '../../../../hui-component/src/components/Cascader/index.js'
import {
  addClass,
  removeClass,
  deepCopy,
  cutNum,
  divideNum,
} from '@hui/shared-utils'
import Emitter from '@hui/shared-utils/vue-mixins/emitter'
import { get } from '@hui/shared-utils/index'

const cellOption = cellSelect.Option
// const hOptionGroup = hSelect.OptionGroup

export default {
  name: 'GirdCell',
  mixins: [Emitter],
  directives: { clickoutside },
  inject: {
    tableData: { default: () => ({}) },
    tableRoot: { default: () => ({}) },
    tableProps: { default: () => ({}) },
  },
  components: {
    Cell,
    cellSelect,
    cellOption,
    Checkbox,
    TableSlot
    // Checkbox,
    // hInput,
    // Typefield,
    // hSelect,
    // hOption,
    // SelectTree,
    // Date,
    // hTime,
    // Radio,
    // Cascader
  },
  props: {
    isValidate: PropTypes.bool,
    prefixCls: PropTypes.string,
    row: PropTypes.object,
    column: PropTypes.object,
    sum: PropTypes.bool,
    naturalIndex: PropTypes.number, // index of rebuildData
    columnIndex: PropTypes.number,
    index: PropTypes.oneOfType([Number, String]), // _index of data
    checked: PropTypes.bool,
    // 单选选中
    radioChecked: PropTypes.bool,
    disabled: PropTypes.bool,
    expanded: PropTypes.bool,
    // showEditInput: Boolean,
    typeName: PropTypes.string,
    // option: Array,
    // treeOption: Array,
    // cascaderOption: Array,
    fixed: PropTypes.oneOfType([Boolean, String]),
    height: PropTypes.number
  },
  data () {
    return {
      renderType: '',
      normalDate: this.row[this.column.key],
      columnText: this.row[this.column.key],
      columnArea: this.row[this.column.key],
      columnNumber: this.row[this.column.key],
      columnMoney: this.row[this.column.key],
      columnCard: this.row[this.column.key],
      columnDate: this.row[this.column.key],
      columnTime: this.row[this.column.key],
      columnSelect: this.row[this.column.key],
      columnTree: this.row[this.column.key],
      columnCascader: this.row[this.column.key],
      firstTreeValue: this.row[this.column.key],
      uid: -1,
      //   context: this.parent.currentContext,
      showSlot: true,
      validateState: '',
      validateMessage: '',
      rule: null,
      baseData: [],
      render: false,
      hiddenOther: false,
      currentSelect: [], // 当前选中值
      selectedLabel: [], // 保存当前select label值
      isSelectTrans: true, // 是否将多选value转为label显示，watch normalDate时防止二次执行watch操作
      rearLabel: null,
      preLabel: null,
      cellHover: false,
      TABLE_ICON,
      isFocus: false
    }
  },
  computed: {
    editType () {
      return this.tableProps.editType
    },
    renderSty () {
      const style = {}
      const typeWidth = this.column.typeWidth
      if (typeWidth) {
        style.width = this.render ? typeWidth + 'px' : '100%'
      } else {
        style.width = this.render ? '70' : '100%'
      }
      return style
    },
    table () {
      return this.tableRoot
    },
    objData () {
      return this.tableData.objData
    },
    propsParams () {
      return this.tableProps
    },
    indeterminate () {
      return this.objData[this.row._rowid]._Indeterminate
    },
    classes () {
      return [
        `${this.prefixCls}-cell`,
        {
          [`${this.prefixCls}-hidden`]:
            !this.fixed &&
            this.column.fixed &&
            (this.column.fixed === 'left' || this.column.fixed === 'right'),
          [`${this.prefixCls}-cell-error`]: this.validateState === 'error',
          [`${this.prefixCls}-cell-with-expand`]: this.renderType === 'expand',
          [`${this.prefixCls}-cell-with-render`]: this.render && this.renderType != 'expand',
          [`${this.prefixCls}-cell-ellipsis-with-render`]: this.ellipsisAndRender
        }
      ]
    },
    innerClass () {
      return {
        [`${this.prefixCls}-cell-ellipsis`]: this.renderType == 'normal',
        [`${this.prefixCls}-cell-flex`]: this.renderType != 'normal' && (this.column.type != 'index' &&
        this.column.type != 'selection' &&
        this.column.type != 'expand' &&
        this.column.type != 'radio'),
        // this.column.ellipsis || false,
        // [`${this.prefixCls}-cell-hover`]: this.cellHover || false
      }
    },
    expandCls () {
      return [
        `${this.prefixCls}-cell-expand`,
        {
          [`${this.prefixCls}-cell-expand-expanded`]: this.expanded
        }
      ]
    },
    // areaClass () {
    //   return [
    //     // 'canEdit h-input',
    //     {
    //       // 'h-input-disabled': this.column.disabled,
    //       // 'h-input-noresize': true //! this.column.canResize
    //     }
    //   ]
    // },
    ellipsisAndRender () {
      return this.column.ellipsis && this.render && this.renderType != 'expand'
    }
  },
  methods: {
    isFiledIcon (column) {
      const icon = get(column, 'typeParams.icon')
      return icon != undefined ? icon : true
    },
    handleFocusin () {
      this.isFocus = true
    },
    handleFocusout () {
      this.isFocus = false
    },
    handleMouseIn (event) {
      event.stopPropagation()
      this.cellHover = true
    },
    handleMouseOut (event) {
      event.stopPropagation()
      this.cellHover = false
    },
    clickCurrentRadio () {
      this.table.highlightCurrentRow(this.row._rowid, true)
      this.table.clickCurrentBtn(this.row._rowid)
    },
    handleClose () {
      if (this.editType != 'cellEdit') return
      if (
        this.column.type === 'index' ||
        this.column.type === 'selection' ||
        this.column.type === 'expand' ||
        this.column.type === 'radio'
      ) {
        this.renderType = this.column.type
      } else {
        this.renderType = 'normal'
      }
      // this.showSlot = true
    },
    toggleSelect (event) {
      this.table.toggleSelect(this.row, event)
      this.table.clickCurrentRow(this.row, event)
    },
    handleClick () {
      // 放置 Checkbox 冒泡
    },
    addBg () {
      if (this.checked) {
        addClass(this.$parent, `${this.prefixCls}-row-hover`)
      } else {
        removeClass(this.$parent, `${this.prefixCls}-row-hover`)
      }
    },
    asyncSave (val) {
      const rowId = this.row._rowid
      const target = this.tableData.rebuildData.filter(val => val._rowid == rowId)[0]
      if (!target) return
      target[this.column.key] = val
    },
    save (str) {
      this.$nextTick(() => {
        var _parent = this.tableData
        if (!_parent.rebuildData || _parent.rebuildData.length == 0) return
        switch (str) {
          case 'text':
            this.normalDate = this.columnText
            this.asyncSave(this.columnText)
            break
          case 'textArea':
            this.normalDate = this.columnArea
            this.asyncSave(this.columnArea)
            break
          case 'number':
            this.normalDate = this.columnNumber
            this.asyncSave(this.columnNumber)
            this.syncRebuildData()
            break
          case 'money':
            this.normalDate = this.columnMoney
            this.asyncSave(this.columnMoney)
            break
          case 'card':
            this.normalDate = this.columnCard
            this.asyncSave(this.columnCard)
            this.syncRebuildData()
            break
          case 'select':
            // if (this.column.multiple || this.column.singleShowLabel) { this.isSelectTrans = true }
            this.isSelectTrans = true
            this.normalDate = this.columnSelect
            this.asyncSave(this.columnSelect)
            this.syncRebuildData()
            break
          case 'date':
            this.normalDate = this.columnDate
            this.asyncSave(this.columnDate)
            this.syncRebuildData()
            break
          case 'time':
            this.normalDate = this.columnTime
            this.asyncSave(this.columnTime)
            this.syncRebuildData()
            break
          case 'selectTree':
            this.normalDate = this.columnTree
            this.asyncSave(this.columnTree)
            this.syncRebuildData()
            break
          case 'cascader':
            this.normalDate = this.columnCascader
            this.asyncSave(this.columnCascader)
            this.syncRebuildData()
            break
        }
        if (this.rule) {
          // this.validate('blur')
        }
      })
    },
    clickCurrentCell (e) {
      // return false
      // _disEdit 当前行不可编辑
      if (this.editType != 'cellEdit') return
      if (
        !this.column.type || this.row._disEdit ||
        this.column.type === 'html' ||
        this.column.type === 'index' ||
        this.column.type === 'selection' ||
        this.column.viewValue
      ) {
        return false
      } else {
        // this.showSlot = false
        this.renderType = this.column.type
        this.$nextTick(() => {
          var inputEl =
            this.$refs.cell.querySelector('input') ||
            this.$refs.cell.querySelector('textarea')
          if (!inputEl) return
          inputEl.focus()
        })
      }
    },
    getFilteredRule (trigger) {
      // rule 为对象或数组
      let rules = [].concat(this.rule)
      if (rules && rules.length) {
        rules = rules.map(item => {
          if (item && item.test) {
            item.pattern = item.test
          }
          return item
        })
      }
      if (rules && rules.length) {
        return rules.filter(
          rule => {
            if (rule) {
              return !rule.trigger || rule.trigger.indexOf(trigger) !== -1
            }
          }
        )
      }
    },
    // validate (trigger, callback = function () {}) {
    //   const rules = this.getFilteredRule(trigger)
    //   if (!rules || rules.length === 0) {
    //     callback()
    //     return true
    //   }
    //   this.validateState = 'validating'
    //   const descriptor = {}
    //   descriptor.name = rules
    //   const validator = new AsyncValidator(descriptor)
    //   const model = {}
    //   model.name = this.normalDate
    //   validator.validate(model, { firstFields: true }, errors => {
    //     this.validateState = !errors ? 'success' : 'error'
    //     this.validateMessage = errors ? errors[0].message : ''
    //     callback(this.validateMessage)
    //   })
    // },
    // filterMethod () {
    //   if (this.column.filterMethod) {
    //     return this.column.filterMethod
    //   }
    // },
    // remoteMethod () {
    //   if (this.column.remoteMethod) {
    //     return this.column.remoteMethod
    //   }
    // },
    getIndex () {
      const rowId = this.row._rowid
      let rowIndex
      this.tableData.rebuildData.map((val, index) => {
        if (val._rowid == rowId) {
          rowIndex = index
        }
      })
      return rowIndex
    },
    editselectChange (val, obj) {
      this.currentSelect = this.column.typeParams && this.column.typeParams.multiple ? obj : [obj]
      // this.currentSelect = this.column.typeParams.multiple ? val : [val]
      const index = this.getIndex()
      this.dispatch('TreeTable', 'on-editselect-change', val, this.columnIndex, index)
    },
    editdateChange (val) {
      const index = this.getIndex()
      this.dispatch('TreeTable', 'on-editdate-change', val, this.columnIndex, index)
    },
    editinputChange () {
      const index = this.getIndex()
      this.dispatch('TreeTable', 'on-editinput-change', this.columnText, this.columnIndex, index)
    },
    editinputBlur () {
      this.syncRebuildData()
      const index = this.getIndex()
      this.dispatch('TreeTable', 'on-editinput-blur', this.columnText, this.columnIndex, index)
    },
    editinputEnter () {
      const index = this.getIndex()
      this.dispatch('TreeTable', 'on-editinput-enter', this.columnText, this.columnIndex, index)
      // if (!this.showEditInput) {
      //   this.renderType = 'normal'
      // }
      this.editinputBlur()
    },
    editAreaChange (event) {
      const index = this.getIndex()
      let value = event.target.value
      if (this.column.typeParams && this.column.typeParams.filterRE) {
        value = value.replace(this.column.typeParams.filterRE, '')
        event.target.value = value
      }
      this.columnArea = value
      this.dispatch('TreeTable', 'on-editarea-change', this.columnArea, this.columnIndex, index)
    },
    editAreaBlur () {
      this.syncRebuildData()
      const index = this.getIndex()
      this.dispatch('TreeTable', 'on-editarea-blur', this.columnArea, this.columnIndex, index)
    },
    typefieldChange (val) {
      if (this.column.typeParams && this.column.typeParams.divided) {
        const value = this.$refs.money.inputValue
        this.columnMoney = value
      } else {
        this.columnMoney = val
      }
      const index = this.getIndex()
      this.dispatch('TreeTable', 'on-money-change', this.columnMoney, this.columnIndex, index)
    },
    typefieldBlur () {
      this.syncRebuildData()
      const index = this.getIndex()
      this.dispatch('TreeTable', 'on-money-blur', this.columnMoney, this.columnIndex, index)
    },
    typefieldEnter () {
      const index = this.getIndex()
      this.typefieldBlur()
      this.dispatch('TreeTable', 'on-money-enter', this.columnMoney, this.columnIndex, index)
    },
    setvisible () {
      ['select', 'date', 'time', 'tree'].forEach(item => {
        if (this.$refs[item] && this.$refs[item].visible) {
          this.$refs[item].visible = false
        }
      })
      if (this.$refs.money && this.$refs.money.tipShow) {
        this.$refs.money.tipShow = false
      }
    },
    strtoArr (val) {
      if (val == '' || val == ' ' || val == null || val == undefined) {
        return []
      } else if (val.length > 0 && val.indexOf(',') == -1) {
        return new Array(val)
      } else {
        return val.split(',')
      }
    },
    arrtoStr (val) {
      if (val.length == 0) {
        return ''
      } else {
        return val.join(',')
      }
    },
    initValToLabel () {
      // 支持单选显示
      if (
        // (this.column.multiple || this.column.singleShowLabel) &&
        this.column.type == 'select' &&
        this.renderType == 'normal' &&
        this.column.option &&
        this.column.option.length > 0
      ) {
        this.selectedLabel = []
        const selectedArr = this.column.typeParams && this.column.typeParams.multiple ? this.columnSelect : this.strtoArr(this.columnSelect)
        for (let i = 0; i < selectedArr.length; i++) {
          for (let j = 0; j < this.column.option.length; j++) {
            if (selectedArr[i] == this.column.option[j].value) {
              this.selectedLabel.push(this.column.option[j].label)
            }
          }
        }
        this.isSelectTrans = false
        this.normalDate =
          this.selectedLabel.length == 0 && this.normalDate
            ? this.normalDate
            : this.arrtoStr(this.selectedLabel)
      }
    },
    selectValToLabel () {
      // 多选情况下value与label的转换(显示label)
      //  支持单选
      if (
        // (this.column.multiple || this.column.singleShowLabel) &&
        this.column.option &&
        this.column.option.length > 0 &&
        this.column.type == 'select' &&
        this.renderType == 'normal'
      ) {
        // 多选情况下显示label
        this.selectedLabel = []
        for (let i = 0; i < this.currentSelect.length; i++) {
          this.selectedLabel.push(this.currentSelect[i].label)
        }
        this.isSelectTrans = false
        this.normalDate =
          this.selectedLabel.length == 0 && this.normalDate
            ? this.normalDate
            : this.arrtoStr(this.selectedLabel)
      }
    },

    /**
     * 同步单元格编辑内容到rebuildData
     */
    syncRebuildData () {
      const data = this.tableData.rebuildData
      if (this.row[this.column.key] === this.normalDate) return
      if (!Array.isArray(data) || data.length === 0) return
      const find = (rows, _rowid) => {
        if (!Array.isArray(rows) || rows.length === 0) return null
        let matched = null
        rows.some(row => {
          if (row._rowid === _rowid) {
            matched = row
          } else {
            matched = find(row.children, _rowid)
          }
          return matched !== null
        })
        return matched
      }
      const row = find(data, this.row._rowid)
      if (row) {
        row[this.column.key] = this.normalDate
      }
    },
    /**
     * 格式化数据
     */
    formatNum (value, integerNum, suffixNum) {
      value = value.trim().replace(/,/g, '')
      value = value.replace(/[^0-9.-]/g, '') || ''
      var firstChar = value.substring(0, 1) || ''

      if (firstChar == '-') {
        value = value.substring(1) || ''
      }
      var valArr = value.split('.')
      var intLength = valArr.length > 0 ? valArr[0].length : value
      if (integerNum < 16 || intLength < 16) {
        value = value.replace('-', '')
        value = cutNum(value, integerNum)
        if (value == '') return
        if (this.column.typeParams && this.column.typeParams.isround) {
          // 7位小数Number会转成科学计数法
          // value = Number(value).toFixedSelf(suffixNum);
          const result = this.changeRexNum(Number(value))
          value = this.toFixed(result, suffixNum)
        } else {
          value = this.fillZero(value, Number(suffixNum))
        }
        value = this.setNum(value, suffixNum, integerNum)
        if (firstChar == '-') {
          value = '-' + value
        }
        if (value.substring(value.length - 1, value.length) == '.') {
          value = value.substring(0, value.length - 1)
        }
      } else {
        value = this.setBigData(value, valArr)
        if (firstChar == '-') {
          value = '-' + value
        }
      }
      if (this.column.typeParams && this.column.typeParams.nonNegative) {
        value = value.replace(/-/, '')
      }
      return value
    },
    setBigData (value, arr) {
      let curInt, curSuffix, val1, val2
      let isCarry = false
      if (arr.length > 0) {
        curInt = arr[0].substr(0, this.integerNum)
        curSuffix = arr[1]
      } else {
        curInt = value
      }
      val1 = curInt.slice(0, 8)
      // eslint-disable-next-line prefer-const
      val2 = curInt.slice(8)
      let curVal2 = curSuffix ? val2 + '.' + curSuffix : val2
      if (this.isround) {
        curVal2 = Number(curVal2).toFixedSelf(this.suffixNum)
      } else {
        curVal2 = this.fillZero(curVal2, Number(this.suffixNum))
        if (this.suffixNum > 0) {
          var arrNum = curVal2.split('.')
          curVal2 = arrNum[0] + '.' + arrNum[1].substring(0, this.suffixNum)
        }
      }
      const arr2 = curVal2.split('.')
      if (
        (arr2.length > 0 && arr2[0].length > val2.length) ||
        (arr2.length == 0 && curVal2.length > val2.length)
      ) {
        isCarry = true
        curVal2 = curVal2.slice(1)
      }
      val1 = isCarry ? Number(val1) + 1 : val1
      value = val1 + curVal2
      return value
    },
    // 补足0
    fillZero (number, bitNum) {
      /// 小数位不够，用0补足位数
      var f_x = parseFloat(number)
      if (isNaN(f_x)) {
        return
      }
      var s_x = number.toString()
      var pos_decimal = s_x.indexOf('.')
      if (pos_decimal < 0) {
        pos_decimal = s_x.length
        s_x += '.'
      }
      while (s_x.length <= pos_decimal + bitNum && !this.notFillin) {
        s_x += '0'
      }
      if (bitNum == 0) {
        s_x = s_x.slice(0, pos_decimal)
      }
      return s_x
    },
    setNum (value, suffixNum, integerNum) {
      if (isNaN(value)) return
      if (suffixNum > 0) {
        var arrNum = value.split('.')
        var integerNumber = arrNum[0].substring(0, integerNum)
        value = Number(integerNumber) + '.' + arrNum[1].substring(0, suffixNum)
      } else {
        value = Number(value) + ''
      }
      return value
    },
    // 转换科学技术法为数值---Number(val)会在小数点7位后以科学计数法返回，影响格式化
    changeRexNum (val) {
      const e = String(val)
      const rex = /^([0-9])\.?([0-9]*)e-([0-9])/
      if (!rex.test(e)) return val
      const numArr = e.match(rex)
      const n = Number('' + numArr[1] + (numArr[2] || ''))
      const num =
        '0.' + String(Math.pow(10, Number(numArr[3]) - 1)).substr(1) + n
      return num.replace(/0*$/, '') // 防止可能出现0.0001540000000的情况
    },
    // 修正val的小数位，val 为输入值，n为格式化位数【不用Number中的toFixed是因为超过7位小数Number会转换成科学计数法，格式化会报错，因此需要手动转换】
    toFixed (val, n) {
      if (n > 20 || n < 0) {
        throw new RangeError(
          'toFixed() digits argument must be between 0 and 20'
        )
      }
      // const number = this;
      if (isNaN(val) || val >= Math.pow(10, 21)) {
        return val.toString()
      }
      if (typeof n == 'undefined' || n == 0) {
        return Math.round(val).toString()
      }
      let result = val.toString()
      const arr = result.split('.')
      // 整数的情况
      if (arr.length < 2) {
        result += '.'
        for (let i = 0; i < n; i += 1) {
          result += '0'
        }
        return result
      }
      const integer = arr[0]
      const decimal = arr[1]
      if (decimal.length == n) {
        return result
      }
      if (decimal.length < n) {
        for (let i = 0; i < n - decimal.length; i += 1) {
          result += '0'
        }
        return result
      }
      result = integer + '.' + decimal.substr(0, n)
      const last = decimal.substr(n, 1)

      // 四舍五入，转换为整数再处理，避免浮点数精度的损失
      if (parseInt(last, 10) >= 5) {
        const x = Math.pow(10, n)
        result = (Math.round(parseFloat(result) * x) + 1) / x
        result = result.toFixed(n)
      }
      return result
    },
    /**
     * 格式化type=money时显示值
     */
    initMoneyViewValue () {
      let val = this.normalDate
      if (typeof this.normalDate == 'number') val = String(this.normalDate)
      if (val && val != '') {
        const integerNum = this.column.typeParams && this.column.typeParams.integerNum ? this.column.typeParams.integerNum : 2
        const suffixNum = this.column.typeParams && this.column.typeParams.suffixNum ? this.column.typeParams.suffixNum : 2
        val = this.formatNum(
          val.replace(/,/g, ''),
          integerNum,
          suffixNum
        )
        this.normalDate = divideNum(val.trim())
      }
    },
    renderTypeDeal (a) {
      if (this.editType == 'cellEdit' || this.sum) return
      const specialType = (this.column.type !== 'index' && this.column.type !== 'selection' && this.column.type !== 'expand' && this.column.type !== 'radio')
      if (!this.column.type || this.column.type === 'html') {
        this.renderType = 'normal'
      } else {
        if (this.editType == 'disEdit' || this.sum) {
          this.noCellEdit(specialType)
        } else if (this.editType == 'columnEdit') {
          if (!this.row._disEdit && (this.column.type && this.column._isColumnEdit && specialType)) {
            this.renderType = this.column.type
          } else {
            this.noCellEdit(specialType)
          }
        } else if (this.editType == 'rowEdit') {
          if (!this.row._disEdit && (this.column.type && this.row._isRowEdit && specialType)) {
            this.renderType = this.column.type
          } else {
            this.noCellEdit(specialType)
          }
        } else if (this.editType == 'allEdit') {
          if (!this.row._disEdit && (this.column.type && specialType)) {
            this.renderType = this.column.type
          } else {
            this.noCellEdit(specialType)
          }
        } else {
          this.noCellEdit(specialType)
        }
      }
    },
    noCellEdit (specialType) {
      if (this.column.type && !specialType) {
        this.renderType = this.column.type
      } else {
        this.renderType = 'normal'
      }
    },
    updateData (a) {
      this.renderTypeDeal(a)
      const key = this.column.key
      const val = this.row[key]
      if (val !== this.normalDate) {
        switch (this.column.type) {
          case 'text':
            this.columnText = val
            break
          case 'textArea':
            this.columnArea = val
            break
          case 'number':
            this.columnNumber = val
            break
          case 'money':
            this.columnMoney = val
            break
          case 'card':
            this.columnCard = val
            break
          case 'select':
            this.columnSelect = val
            break
          case 'date':
            this.columnDate = val
            break
          case 'time':
            this.columnTime = val
            break
          case 'selectTree':
            this.columnTree = val
            break
          case 'cascader':
            this.columnCascader = val
            break
        }
      }
      // 格式化 type=money的千分符显示
      if (this.column.type == 'money' && this.renderType == 'normal' && ((this.column.typeParams && this.column.typeParams.divided) || (this.column.typeParams && this.column.typeParams.immeDivided))) {
        this.initMoneyViewValue()
      } else
      // if (this.column.type == 'select' && this.renderType == 'normal' && (this.column.singleShowLabel || this.column.multiple)) {
      if (this.column.type == 'select' && this.renderType == 'normal') {
        // 格式化 select
        this.initValToLabel()
      } else {
        this.normalDate = val
      }
    }
  },
  watch: {
    columnTree (val) {
      this.$emit('on-selecttree-change', val)
      this.save('selectTree')
    },
    columnTime () {
      this.save('time')
    },
    columnDate () {
      this.save('date')
    },
    columnSelect () {
      this.save('select')
    },
    columnCard () {
      this.save('card')
    },
    columnMoney (val) {
      this.$emit('on-typefield-change', val, this.columnIndex, this.index)
      this.save('money')
    },
    columnNumber () {
      this.save('number')
    },
    columnArea (val) {
      this.save('textArea')
    },
    columnText () {
      this.save('text')
    },
    columnCascader () {
      this.save('cascader')
    },
    validateState (val) {
      // if (val == 'error') {
      //   if (this.renderType === 'normal' && this.isValidate) {
      //     this.showSlot = false
      //     this.renderType = this.column.type
      //   }
      //   this.$nextTick(() => {
      //     if (this.$refs.verifyTip) {
      //       const fyTip = this.$refs.verifyTip
      //       const canEdit = fyTip.parentNode.querySelectorAll('.canEdit')[0]
      //       const left =
      //         canEdit.offsetLeft -
      //         this.parent.$el.querySelector('.h-editgird-body').scrollLeft
      //       const top =
      //         canEdit.offsetTop +
      //         canEdit.getBoundingClientRect().height -
      //         this.parent.$el.querySelector('.h-editgird-body').scrollTop
      //       fyTip.style.left = left + 'px'
      //       fyTip.style.top = top + 'px'
      //       // 初始校验不通过，提示显示表格外部问题
      //       if (top >= this.height) {
      //         fyTip.style.display = 'none'
      //       }
      //     }
      //   })
      // }
    },
    // treeOption (val) {
    //   this.baseData = deepCopy(val)
    // },
    renderType (val) {
      // 多选情况下value与label的转换(显示label)
      if (this.column.type == 'select') this.selectValToLabel()
    },
    // option: {
    //   // option服务端传入，初始化无值
    //   handler (val) {
    //     if (val && val.length > 0) {
    //       this.initValToLabel()
    //     }
    //   },
    //   deep: true
    // },
    row: {
      deep: true,
      handler (newRow) {
        this.updateData()
      }
    },
    column: {
      handler () {
        // this.renderTypeDeal()
        this.updateData()
      },
      deep: true
    },
    editType () {
      this.renderTypeDeal()
    }
  },
  created () {
    this.renderTypeDeal()
    if (this.editType == 'cellEdit') {
      const specialType = (this.column.type !== 'index' && this.column.type !== 'selection' && this.column.type !== 'expand' && this.column.type !== 'radio')
      this.noCellEdit(specialType)
    }
    if (this.sum) {
      this.renderType = 'normal'
    }
    if (this.column.type === 'selectTree') {
      this.baseData = deepCopy(this.treeOption)
    }

    this.render = !!this.column.render
    this.hiddenOther = !!this.column.hiddenOther

    if ((this.renderType !== 'normal' && this.column.rule) || this.isValidate) {
      if ((this.column.fixed === 'left' && this.$parent.$parent.fixed === 'left') ||
      (this.column.fixed === 'right' && this.$parent.$parent.fixed === 'right') ||
      (this.column.fixed !== 'left' && this.column.fixed !== 'right' && !this.$parent.$parent.fixed)) {
        this.dispatch('EditGird', 'on-rule-cell-add', this)
      }
    }
    // 格式化 type=money的千分符显示
    if (this.column.type == 'money' && this.renderType == 'normal' && (this.column.divided || this.column.immeDivided)) {
      this.initMoneyViewValue()
    }
    // 格式化 type="select"
    // if (this.column.type == 'select' && this.renderType == 'normal' && (this.column.singleShowLabel || this.column.multiple)) {
    if (this.column.type == 'select' && this.renderType == 'normal') {
      this.initValToLabel()
    }
  },
  mounted () {
    if (this.column.rearlabel) {
      this.rearLabel = this.column.rearlabel(this.index) || null
    }
    if (this.column.prelabel) {
      this.preLabel = this.column.prelabel(this.index) || null
    }
    this.$on('close-visible', () => {
      this.setvisible()
    })
    // // 注册全局事件供 editGrid 调用
    // this.$on('validate', callback => {
    //   if (this.rule) this.validate('blur', callback)
    // })
  },
  beforeDestroy () {
    if ((this.renderType !== 'normal' && this.column.rule) || this.isValidate) {
      if ((this.column.fixed === 'left' && this.$parent.$parent.fixed === 'left') ||
      (this.column.fixed === 'right' && this.$parent.$parent.fixed === 'right') ||
      (this.column.fixed !== 'left' && this.column.fixed !== 'right' && !this.$parent.$parent.fixed)) {
        this.dispatch('EditGird', 'on-rule-cell-remove', this)
      }
    }
  }
}
</script>
