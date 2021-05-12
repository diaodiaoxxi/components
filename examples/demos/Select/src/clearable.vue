<template>
  <div>
    <h3>单选clearable,值:{{ model }}</h3>
    <div>
      <u-select
        ref="singleClear"
        v-model="model"
        :clearable="clearable"
        style="width:200px"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
      <h-switch v-model="clearable"></h-switch>
      <span v-text="`clearable:${clearable}`"></span>
    </div>
    <h3>多选clearable,值:{{ model }}</h3>
    <div>
      <u-select
        ref="multipleClear"
        v-model="model2"
        multiple
        :clearable="clearable"
        style="width:200px"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
      <h-switch v-model="clearable"></h-switch>
      <span v-text="`clearable:${clearable}`"></span>
    </div>
    <div>
      <h-button
        v-text="'调用select清空方法'"
        style="margin-top:10px;"
        type="primary"
        @click="clearSelect"
      ></h-button>
    </div>
  </div>
</template>
<script>
export default {
  zhName: '',
  data () {
    return {
      clearable: true,
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
      model: 'beijing',
      model2: ['beijing', 'chongqing'],
      model3: ''
    }
  },
  methods: {
    clearSelect () {
      this.$refs.single.onClearSelect()
      this.$refs.multiple.onClearSelect()
    }
  }
}
</script>
