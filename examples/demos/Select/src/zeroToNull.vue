<template>
  <div>
    <h3>单选zeroToNull,value:{{ model16 }}</h3>
    <u-select v-model="model16" style="width:300px" zeroToNull clearable>
      <u-option v-for="item in cityList" :value="item.value" :key="item.label">
        {{ item.label }}
      </u-option>
    </u-select>
    <h-button @click="model16 = '0'">
      设置'0' 转为空字符串
    </h-button>
  </div>
</template>
<script>
export default {
  zhName: '',
  data () {
    return {
      model16: null,
      cityList: [
        {
          value: '123',
          label: '北京市'
        },
        {
          value: '',
          label: '上海市'
        }
      ]
    }
  }
}
</script>
