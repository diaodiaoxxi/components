<template>
  <div>
    <h3>单选</h3>
    <div style="display:flex;align-items:flex-end;">
      <u-select v-model="model2" size="small" style="width:200px;">
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
      <u-select v-model="model3" style="width:200px;">
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
      <u-select v-model="model4" size="large" style="width:200px;">
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
    </div>
    <h3>多选</h3>
    <div style="display:flex;align-items:flex-end;">
      <u-select size="small" multiple style="width:200px;">
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
      <u-select multiple style="width:200px;">
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
      <u-select size="large" multiple style="width:200px;">
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
  zhName: 'size',
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
      model2: '',
      model3: '',
      model4: ''
    }
  }
}
</script>
