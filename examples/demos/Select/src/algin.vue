<template>
  <div>
    <div>
      <h3>无值</h3>
      <u-select v-model="model1" style="width:150px" :align="'left'">
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
      <u-select
        v-model="model1"
        style="width:150px"
        :align="'center'"

      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
      <u-select v-model="model1" style="width:150px" :align="'right'">
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
    </div>
    <div>
      <h3>有值</h3>

      <u-select value="beijing" style="width:150px" :align="'left'">
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
      <u-select
        value="beijing"
        style="width:150px"
        :align="'center'"

      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
      <u-select value="beijing" style="width:150px" :align="'right'">
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
    </div>

    <div>
      <h3>无值-多选</h3>

      <u-select multiple style="width:150px" :align="'left'">
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
      <u-select multiple style="width:150px" :align="'center'" >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
      <u-select multiple style="width:150px" :align="'right'">
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
  zhName: '',
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
        }
      ],
      model1: '',
      model2: []
    }
  }
}
</script>
