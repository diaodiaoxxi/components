<template>
  <div>
    <u-select v-model="model1" style="width:200px" :isArrow="isArrow">
      <u-option
        v-for="item in cityList"
        :value="item.value"
        :key="item.value"
        :isArrow="false"
      >
        {{ item.label }}
      </u-option>
    </u-select>
    <h-switch v-model="isArrow"></h-switch>
    <span v-text="`isArrow:${isArrow}`"></span>
  </div>
</template>
<script>
export default {
  zhName: 'isArrow',
  data () {
    return {
      isArrow: true,
      cityList: [
        {
          value: 'beijing',
          label: '北京市'
        },
        {
          value: 'shanghai',
          label: '上海市'
        }
      ],
      model1: ''
    }
  }
}
</script>
