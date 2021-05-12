<template>
  <div>
    <h3>多选(选项独立展示)</h3>
    <div>
      <u-select-2
        ref="default"
        v-model="model10"
        multiple
        :maxTagCount="maxTagCount"
        style="width:300px"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        ></u-option>
        <u-option
          value="ellipsis"
          label="超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长"
        ></u-option>
        <u-option
          v-for="item in 12"
          :value="item + ''"
          :label="item + ''"
          :key="item"
        ></u-option>
      </u-select-2>
      <span>multHeadType="tag"</span>
    </div>
    <h3>多选(选项连续展示)</h3>
    <div>
      <u-select-2
        ref="textType"
        v-model="model10"
        multiple
        multHeadType="text"
        style="width:300px"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        ></u-option>
        <u-option
          value="ellipsis"
          label="超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长"
        ></u-option>
      </u-select-2>
      <span>multHeadType="text"</span>
    </div>
    <h3>maxTagCount:多选标签显示数量</h3>
    <div>
      <u-select-2
        ref="maxTagCount"
        v-model="model11"
        multiple
        :moreTagPopTipProps="{
          trigger:'click'
        }"
        :maxTagCount="maxTagCount"
        style="width:300px"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        ></u-option>
      </u-select-2>
      <span v-text="`maxTagCount:${maxTagCount}`"></span>
    </div>
    <h3>maxTagPlaceholder:自定义多选更多标签文本</h3>
    <div>
      <u-select-2
        v-model="model11"
        style="width:300px"
        multiple
        :maxTagCount="maxTagCount"
        :maxTagPlaceholder="`还有${model11.length - maxTagCount}`"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        ></u-option>
      </u-select-2>
      <span>maxTagPlaceholder is string</span>
    </div>
    <div>
      <u-select-2
        v-model="model11"
        multiple
        :maxTagCount="maxTagCount"
        :maxTagPlaceholder="customPlaceholder"
        style="width:300px"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        ></u-option>
      </u-select-2>
      <span>maxTagPlaceholder is function</span>
    </div>

    <h3>hideOptionCheckbox:隐藏多选下拉框option中的checkbox</h3>
    <div>
      <u-select-2
        v-model="model11"
        style="width:300px"
        multiple
        :maxTagCount="maxTagCount"
        :hideOptionCheckbox="hideOptionCheckbox"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        ></u-option>
      </u-select-2>
      <h-switch v-model="hideOptionCheckbox"></h-switch>
      <span v-text="`hideOptionCheckbox:${hideOptionCheckbox}`"></span>
    </div>

    <div>
      <h3>tagKey:tag中显示的值,默认为label,设为value</h3>
      <u-select-2
        v-model="model11"
        style="width:300px"
        multiple
        clearable
        tagKey="value"
        :maxTagCount="2"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        ></u-option>
      </u-select-2>
    </div>
    <div>
      <h3>
        valueKey:如果option value 类型为object,需要指定 value
        具体显示object的属性,默认值为value, 同样指定好 tagKey
      </h3>
      <u-select-2
        v-model="model11"
        style="width:300px"
        multiple
        clearable
        tagKey="value"
        valueKey="code"
        labelKey="city"
        :maxTagCount="maxTagCount"
      >
        <u-option v-for="data in cityList2" :value="data" :key="data.code"></u-option>
      </u-select-2>
    </div>

    <div>
      <h3>multipleNumber:表示用户在多选情况下，限制用户选择的个数</h3>
      <u-select-2
        v-model="model11"
        style="width:300px"
        multiple
        clearable
        tagKey="value"
        valueKey="code"
        labelKey="city"
        multipleNumber="2"
        :maxTagCount="maxTagCount"
      >
        <u-option v-for="data in cityList2" :value="data" :key="data.code"></u-option>
      </u-select-2>
    </div>

    <div>
      <h3>
        isBackClear: input输入框无值时是否可通过backspace按键清除选中项
        (仅多选有效),默认值为 true
      </h3>
      <u-select-2
        v-model="model10"
        multiple
        filterable
        :isBackClear="isBackClear"
        style="width:300px"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >{{ item.label }}</u-option>
      </u-select-2>
      <h-switch v-model="isBackClear"></h-switch>
      <span v-text="`isBackClear:${isBackClear}`"></span>
    </div>

    <div>
      <h3>isRadio: option 单选互斥</h3>
      <u-select-2
        v-model="model10"
        multiple
        filterable
        :maxTagCount="maxTagCount"
        style="width:300px"
      >
        <u-option isRadio value="isRadio" label="isRadio"></u-option>
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        ></u-option>
      </u-select-2>
      <h-switch v-model="isBackClear"></h-switch>
      <span v-text="`isBackClear:${isBackClear}`"></span>
    </div>
  </div>
</template>
<script>
export default {
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
      ],
      model10: ['hangzhou', 'chongqing'],
      model11: [
        'beijing',
        'shanghai',
        'shenzhen',
        'hangzhou',
        'nanjing',
        'chongqing'
      ],
      maxTagCount: 3,
      hideOptionCheckbox: true,
      isBackClear: true
    }
  },
  methods: {
    customPlaceholder () {
      return <div>test</div>
    }
  }
}
</script>
