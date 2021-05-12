<template>
  <div>
    <u-select v-model="model5" disabled style="width:200px">
      <u-option v-for="item in cityList" :value="item.value" :key="item.value">
        {{ item.label }}
      </u-option>
    </u-select>
    <u-select v-model="model6" style="width:200px">
      <u-option value="beijing">北京市</u-option>
      <u-option value="shanghai" disabled>上海市</u-option>
      <u-option value="shenzhen">深圳市</u-option>
    </u-select>
    <u-select v-model="model12" style="width:200px">
      <u-option
        disabled
        v-for="item in cityList"
        :value="item.value"
        :key="item.value"
      >
        {{ item.label }}
      </u-option>
    </u-select>
    <u-select v-model="model5" readonly style="width:200px">
      <u-option v-for="item in cityList" :value="item.value" :key="item.value">
        {{ item.label }}
      </u-option>
    </u-select>
    <u-select value="beijing" readonly style="width:200px">
      <u-option v-for="item in cityList" :value="item.value" :key="item.value">
        {{ item.label }}
      </u-option>
    </u-select>
  </div>
</template>
<script>
export default {
  zhName: 'disabled&readonly',
  data () {
    return {
      cityList: [
        {
          value: 'beijing',
          label: '北京市'
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
          value: 'nanjing',
          label: '南京市'
        },
        {
          value: 'chongqing',
          label: '重庆市'
        }
      ],
      model5: '',
      model6: '',
      model12: ''
    }
  }
}
</script>
