<template>
  <div>
    <div>
      <h3>select-block 单选 支持大数据渲染</h3>
      <u-select-2 ref="newSelect" style="width:300px;">
        <u-select-2-block :data="optionsList"></u-select-2-block>
      </u-select-2>
    </div>

    <div>
      <h3>select-block 多选 支持大数据渲染</h3>
      <u-select-2
        ref="newSelect"
        style="width:300px;"
        :value="selectValue"
        v-bind="singleFilterProps"
      >
        <u-select-2-block :data="optionsList">
          <u-select-2-check-all slot="dropFoot"></u-select-2-check-all>
        </u-select-2-block>
      </u-select-2>
    </div>

    <div>
      <h3>select-block 支持大数据渲染 - 可过滤</h3>
      <u-select-2
        ref="newSelect"
        style="width:300px;"
        :value="selectValue"
        filterable
        v-bind="singleFilterProps"
      >
        <u-select-2-block :data="optionsList"></u-select-2-block>
      </u-select-2>
    </div>

    <div>
      <h3>select-block optionTexts</h3>
      <u-select-2
        ref="newSelect"
        style="width:300px;"
        :value="selectValue"
        filterable
        v-bind="singleFilterProps"
      >
        <u-select-2-block  :optionTexts="['value']" :data="optionsList"></u-select-2-block>
      </u-select-2>
    </div>

    <div>
      <h3>select-block remain 数据显示数量</h3>
      <u-select-2
        ref="newSelect"
        style="width:300px;"
        :value="selectValue"
        filterable
        v-bind="singleFilterProps"
      >
        <u-select-2-block  :remain="10" :data="optionsList"></u-select-2-block>
      </u-select-2>
    </div>
  </div>
</template>
<script>
import Mock from 'mockjs'
export default {
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
