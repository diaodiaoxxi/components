<template>
  <div>
    <div>
      <h3>默认placeholder</h3>
      <u-select v-model="mode223" style="width:300px;" clearable>
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
      <h3>无filterable设置placeholder</h3>
      <u-select
        v-model="mode222"
        style="width:300px;"
        placeholder="新设置的默认文字"
        clearable
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

    <div>
      <h3>filterable设置placeholder</h3>
      <u-select
        v-model="mode222"
        style="width:300px;"
        filterable
        placeholder="新设置的默认文字"
        clearable
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

    <div>
      <h3>filterable超长显示title</h3>
      <u-select
        v-model="mode222"
        style="width:300px;"
        showTilte
        placeholder="新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字"
        clearable
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select>
      <u-select
        v-model="mode222"
        style="width:300px;"
        filterable
        placeholder="2新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字新设置的默认文字"
        clearable
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
  zhName: '',
  data () {
    return {
      mode222: '',
      mode223: '',
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
      ]
    }
  }
}
</script>
