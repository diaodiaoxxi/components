<template>
  <div>
    <div>
      <h3>高亮匹配字段 highLightQuery</h3>
      <u-select
        ref="select"
        v-model="model11"
        filterable
        filterMethod="all"
        highLightQuery
        @on-query-change="getquery"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      cityList: [
        { value: 'beijing', label: '北京市' },
        { value: 'shanghai', label: '上海市' },
        { value: 'shenzhen', label: '深圳市' },
        { value: 'hangzhou', label: '杭州市' },
        { value: 'nanjing', label: '南京市' },
        { value: 'chongqing', label: '重庆市' }
      ],
      model11: '',
      model12: []
    }
  },
  methods: {
    getquery (query) {},
    setQuery (name, text) {},
    filterFn (query, data) {
      return data.label.includes('京')
    }
  }
}
</script>
