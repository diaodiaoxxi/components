<template>
  <div>
    <div>
      <h3>单选过滤</h3>
      <u-select-2
        ref="select"
        v-model="model11"
        filterable
        @on-query-change="getquery"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select-2>
    </div>
    <div>
      <h3>自定义 filterMethod="all"</h3>
      <u-select-2
        ref="select"
        v-model="model11"
        filterable
        filterMethod="all"
        @on-query-change="getquery"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select-2>
    </div>
    <div>
      <h3>自定义 filterMethod="label"</h3>
      <u-select-2
        ref="select"
        v-model="model11"
        filterable
        filterMethod="label"
        @on-query-change="getquery"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select-2>
    </div>
    <div>
      <h3>自定义 filterMethod="value"</h3>
      <u-select-2
        ref="select"
        v-model="model11"
        filterable
        filterMethod="value"
        @on-query-change="getquery"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select-2>
    </div>
    <div>
      <h3>自定义 filterMethod="自定义函数"</h3>
      <u-select-2
        ref="select"
        v-model="model11"
        filterable
        :filterMethod="filterFn"
        @on-query-change="getquery"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select-2>
    </div>
    <div>
      <h3>高亮匹配字段 highLightQuery</h3>
      <u-select-2
        ref="select"
        v-model="model11"
        filterable
        filterMethod="all"
        highLightQuery
        @on-query-change="getquery"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select-2>
    </div>
    <div>
      <h3>输入框初始化选择为空时默认选择第一条 setDefSelect</h3>
      <u-select-2
        ref="select"
        v-model="model12"
        filterable
        setDefSelect
        filterMethod="all"
        highLightQuery
        @on-query-change="getquery"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select-2>
    </div>
    <div>
      <h3>
        多选时是否开启精确搜索，如果搜索时输入的信息完全匹配到value或者label的时候
        自动勾上 accuFilter <br />
        匹配方式受 filterMethod 控制
      </h3>
      <u-select-2
        ref="select"
        v-model="model13"
        filterable
        multiple
        accuFilter
        filterMethod="all"
        highLightQuery
        @on-query-change="getquery"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        >
        </u-option>
      </u-select-2>
    </div>
    <div>
      <h3>
        搜索时是否不将焦点放在第一搜索项 notAutoFocus
      </h3>
      <u-select-2
        ref="select"
        v-model="model13"
        notAutoFocus
        filterable
        multiple
        accuFilter
        filterMethod="all"
        highLightQuery
        @on-query-change="getquery"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        >
        </u-option>
      </u-select-2>
    </div>
    <div>
      <h3>
        搜索无匹配项时显示的文本 notFoundText
      </h3>
      <u-select-2
        ref="select"
        v-model="model13"
        notAutoFocus
        filterable
        multiple
        accuFilter
        filterMethod="all"
        highLightQuery
        notFoundText="oops！！！ 啥都没找到"
        @on-query-change="getquery"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        >
        </u-option>
      </u-select-2>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      cityList: [
        { value: 'beijing', label: '北京市' },
        { value: 'shanghai', label: '上海市' },
        { value: 'shenzhen', label: '深圳市' },
        { value: 'hangzhou', label: '杭州市' },
        { value: 'nanjing', label: '南京市' },
        { value: 'chongqing', label: '重庆市' }
      ],
      model11: '',
      model12: '',
      model13: []
    }
  },
  methods: {
    getquery (query) {},
    setQuery (name, text) {},
    filterFn (query, data) {
      return data.label.includes('京')
    }
  }
}
</script>
