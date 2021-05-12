<template>
  <div>
    <div>
      <h3>select-block 单选 支持大数据渲染</h3>
      <u-select ref="newSelect" style="width:300px;">
        <u-select-block :data="optionsList"></u-select-block>
      </u-select>
    </div>

    <div>
      <h3>select-block 多选 支持大数据渲染</h3>
      <u-select
        ref="newSelect"
        style="width:300px;"
        :value="selectValue"
        v-bind="singleFilterProps"
      >
        <u-select-block :data="optionsList">
          <u-select-check-all slot="dropFoot"></u-select-check-all>
        </u-select-block>
      </u-select>
    </div>

    <div>
      <h3>select-block 支持大数据渲染 - 可过滤</h3>
      <u-select
        ref="newSelect"
        style="width:300px;"
        :value="selectValue"
        filterable
        v-bind="singleFilterProps"
      >
        <u-select-block :data="optionsList"></u-select-block>
      </u-select>
    </div>

    <div>
      <h3>select-block optionTexts</h3>
      <u-select
        ref="newSelect"
        style="width:300px;"
        :value="selectValue"
        filterable
        v-bind="singleFilterProps"
      >
        <u-select-block  :optionTexts="['value']" :data="optionsList"></u-select-block>
      </u-select>
    </div>

    <div>
      <h3>select-block remain 数据显示数量</h3>
      <u-select
        ref="newSelect"
        style="width:300px;"
        :value="selectValue"
        filterable
        v-bind="singleFilterProps"
      >
        <u-select-block  :remain="10" :data="optionsList"></u-select-block>
      </u-select>
    </div>
  </div>
</template>
<script>
import Mock from 'mockjs'
export default {
  zhName: '大数据支持',
  data () {
    const multiple = true
    return {
      selectValue: '',
      singleFilterProps: {
        multiple,
        maxTagCount: 2
      },
      optionsList: []
    }
  },
  methods: {
    customPlaceholder () {
      return <div>test</div>
    },
    initBigData () {
      const mockData = Mock.mock({
        'array|10000': [
          {
            label: () => Mock.Random.ctitle(),
            'value|100000-999999999': 1000,
            other: () => Mock.Random.ctitle()
          }
        ]
      }).array
      this.optionsList = this.optionsList.concat(mockData)
      console.log('data mount', this.optionsList.length)
    }
  },
  created () {
    this.initBigData()
    window.$setValue = val => {
      this.form.selectValue = val
    }
  }
}
</script>
