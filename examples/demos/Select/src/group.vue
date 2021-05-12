<template>
  <div>
    <u-select v-model="model7" style="width:200px">
      <u-option-group label="热门城市">
        <u-option
          v-for="item in cityList1"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-option-group>
      <u-option-group label="其它城市">
        <u-option
          v-for="item in cityList2"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-option-group>
    </u-select>
  </div>
</template>
<script>
export default {
  data () {
    return {
      cityList: [
        {
          value: 'beijing',
          label: '北京市',
        },
        {
          value: 'shanghai',
          label: '上海市',
        },
        {
          value: 'shenzhen',
          label: '深圳市',
        },
        {
          value: 'hangzhou',
          label: '杭州市',
        },
        {
          value: 'nanjing',
          label: '南京市',
        },
        {
          value: 'chongqing',
          label: '重庆市',
        },
      ],
      cityList1: [
        {
          value: 'beijing',
          label: '北京市',
        },
        {
          value: 'shanghai',
          label: '上海市',
        },
        {
          value: 'shenzhen',
          label: '深圳市',
        },
      ],
      cityList2: [
        {
          value: 'hangzhou',
          label: '杭州市',
        },
        {
          value: 'nanjing',
          label: '南京市',
        },
        {
          value: 'chongqing',
          label: '重庆市',
        },
      ],
      model7: '',
    }
  },
}
</script>
