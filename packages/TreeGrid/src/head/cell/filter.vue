<template>
  <Poptip
    class="operate-item"
    v-if="isPopperShow(column)"
    v-model="column._filterVisible"
    placement="bottom"
    autoPlacement
    @on-popper-hide="handleFilterHide(index)"
  >
    <span :class="[prefixCls + '-filter']">
      <Icon
        name="screen-filled"
        @mousedown.native.stop="handleClick"
        :class="filterClass"
      ></Icon>
    </span>
    <render-header
      slot="content"
      v-if="column.renderFilter"
      :render="column.renderFilter"
      :column="column"
      :index="index"
    ></render-header>
    <div
      slot="content"
      :class="[prefixCls + '-filter-list']"
      v-else-if="column._filterMultiple"
      @mousedown="handleClick"
    >
      <div :class="[prefixCls + '-filter-list-item']">
        <checkbox-group v-model="column._filterChecked">
          <checkbox
            v-for="(item, i) in column.filters"
            :key="i"
            :label="item.value"
          >{{ item.label }}</checkbox>
        </checkbox-group>
      </div>
      <div :class="[prefixCls + '-filter-footer']">
        <Button
          type="text"
          class="btn-confirm"
          size="small"
          :disabled="!column._filterChecked.length"
          @click.native="handleFilter(index)"
        >{{ t("i.table.confirmFilter") }}</Button>
        <Button
          type="text"
          class="btn-reset"
          size="small"
          @click.native="handleReset(index)"
        >{{ t("i.table.resetFilter") }}</Button>
      </div>
    </div>
    <div
      slot="content"
      :class="[prefixCls + '-filter-list']"
      v-else
      @mousedown="handleClick"
    >
      <ul :class="[prefixCls + '-filter-list-single']">
        <li
          :class="itemAllClasses(column)"
          @click="handleReset(index)"
        >{{ t("i.table.clearFilter") }}</li>
        <li
          :class="itemClasses(column, item)"
          v-for="(item, index) in column.filters"
          :key="index"
          @click="handleSelect(index, item.value)"
        >{{ item.label }}</li>
      </ul>
    </div>
  </Poptip>
</template>
<script>
import PropTypes from '@hui/shared-utils/vue-types'
import Mixin from '../../mixin'
import Locale from '@hui/shared-utils/vue-mixins/locale'
import Icon from '@/components/Icon/Icon.vue'
import CheckboxGroup from '@/components/Checkbox/CheckboxGroup.vue'
import Checkbox from '@/components/Checkbox/Checkbox.vue'
import Poptip from '@packages/Poptip'
import Button from '@/components/Button/Button.vue'
import renderHeader from '../../header'
import { TABLE_ICON } from '../../config'
export default {
  mixins: [Mixin, Locale],
  inject: {
    tableRoot: { default: () => {} },
    tableData: { default: () => {} }
  },
  props: {
    column: PropTypes.object,
    prefixCls: PropTypes.string,
    index: PropTypes.sNumber
  },
  components: { CheckboxGroup, Checkbox, Poptip, Button, Icon, renderHeader },
  data () {
    return {
      TABLE_ICON
    }
  },
  computed: {
    filterClass () {
      return [TABLE_ICON.filter, {
        on: this.column._isFiltered
      }]
    },
    columns () {
      return this.tableData.cloneColumns
    }
  },
  methods: {
    handleClick (event) {
      event.stopPropagation()
    },
    handleFilter (index) {
      // 筛选
      const _index = this.columns[index]._index
      this.tableRoot.handleFilter(_index)
    },
    handleSelect (index, value) {
      const _index = this.columns[index]._index
      this.tableRoot.handleFilterSelect(_index, value)
    },
    handleReset (index) {
      // 重置
      const _index = this.columns[index]._index
      this.tableRoot.handleFilterReset(_index)
    },
    handleFilterHide (index) {
      const _index = this.columns[index]._index
      this.tableRoot.handleFilterHide(_index)
    },
    itemClasses (column, item) {
      return [
        `${this.prefixCls}-filter-select-item`,
        {
          [`${this.prefixCls}-filter-select-item-selected`]:
            this.column._filterChecked[0] === item.value
        }
      ]
    },
    itemAllClasses (column) {
      return [
        `${this.prefixCls}-filter-select-item`,
        {
          [`${this.prefixCls}-filter-select-item-selected`]: !this.column._filterChecked.length
        }
      ]
    },
  }
}
</script>
