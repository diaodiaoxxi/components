<template>
  <div>
    <h3>多选isString</h3>
    <div v-text="tip" style="max-width:600px;"></div>
    <div>
      <u-select-2
        v-model="mode228"
        style="width:260px"
        multiple
        isString
        placeholder="配置了isString"
        @on-change="getvaluelabel"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        ></u-option>
      </u-select-2>
      <!-- <u-select-2
        v-model="mode229"
        style="width:260px"
        multiple
        placeholder="未配置isString"
        @on-change="getvaluelabel"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        ></u-option>
      </u-select-2>
    </div>
    <h3>非标准对象配置 valueKey,isString</h3>
    <div>
      <u-select-2
        v-model="mode230"
        style="width:260px"
        placeholder="配置isString,valueKey"
        multiple
        isString
        valueKey="code"
        labelKey="city"
        @on-change="getvaluelabel"
      >
        <u-option
          v-for="item in cityList2"
          :value="item"
          :key="item.value"
        ></u-option>
      </u-select-2> -->
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      mode228: 'beijing,shanghai',
      mode229: [],
      mode230: '',
      tip: '',
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
          value: 1,
          label: '南京市'
        },
        {
          value: 2,
          label: '重庆市'
        }
      ],
      cityList2: [
        {
          code: '100000',
          city: '北京市'
        },
        {
          code: '100001',
          city: '上海市'
        },
        {
          code: '100002',
          city: '深圳市'
        },
        {
          code: '100003',
          city: '杭州市'
        },
        {
          code: '100004',
          city: '南京市'
        },
        {
          code: '100005',
          city: '重庆市'
        }
      ]
    }
  },
  methods: {
    getvaluelabel: function (currentValue) {
      if (typeof currentValue == 'string') {
        const tip = (this.tip = [
          '未配置label-in-value时,onchange事件中返回值只包含value值为：',
          currentValue,
          ' | 类型为:',
          typeof currentValue
        ].join(''))
        console.log(tip)
        return
      }
      const tip = (this.tip = [
        '配置label-in-value时,onchange事件中返回值只包含value值为：',
        JSON.stringify(currentValue, '', '\t'),
        ' | 类型为:',
        typeof currentValue
      ].join(''))
      console.log(tip)
    }
  }
}
</script>
