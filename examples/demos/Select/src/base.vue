<template>
  <div>
    <u-select ref="base" value="beijing" style="width:200px" clearable @on-change="handleChange">
      <u-option v-for="item in cityList" :value="item" :key="item.value">
        {{ item.label }}
      </u-option>
    </u-select>
  </div>
</template>
<script>
export default {
  zhName: '基础使用',
  data () {
    return {
      cityList: [
        {
          value: 'beijing',
          label: '北京市',
          test: 'test'
        },
        {
          value: 'shanghai',
          label: '上海市'
        },
        {
          value: 'shenzhen',
          label: '深圳市'
        },
        {
          value: 'hangzhou',
          label: '杭州市'
        },
        {
          value: 1,
          label: '南京市'
        },
        {
          value: 2,
          label: '重庆市'
        }
      ],
      model1: 'beijing'
    }
  },
  methods: {
    handleChange (val, objValue) {
      console.log('change', val, objValue)
    }
  }
}
</script>
