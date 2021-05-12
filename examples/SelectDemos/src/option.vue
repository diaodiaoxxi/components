<template>
  <div>
    <div>
      <h3>默认option条目-单选</h3>
      <h3>默认option条目-超长暂时不支持title提示</h3>
      <u-select-2 v-model="single" style="width:260px">
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        />
      </u-select-2>
    </div>

    <div>
      <h3>默认option条目-多选</h3>
      <u-select-2
        v-model="multiple"
        multiple
        :maxTagCount="2"
        style="width:260px"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        />
      </u-select-2>
    </div>

    <div>
      <h3>设置optionTexts-单选-显示两行-:optionTexts="['value', 'label']"</h3>
      <u-select-2 v-model="single" style="width:260px">
        <u-option
          v-for="item in cityList"
          :optionTexts="['value', 'label']"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        />
      </u-select-2>
    </div>

    <div>
      <h3>
        设置optionTexts-多选-更换label,value显示顺序-:optionTexts="['label',
        'value']"
      </h3>
      <u-select-2
        v-model="multiple"
        multiple
        :maxTagCount="2"
        style="width:260px"
      >
        <u-option
          v-for="item in cityList"
          :optionTexts="['label', 'value']"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        />
      </u-select-2>
    </div>

    <div>
      <h3>
        设置optionTexts-可配置在select上-:optionTexts="['label', 'value']"
      </h3>
      <u-select-2
        v-model="multiple"
        :maxTagCount="2"
        :optionTexts="['label', 'value']"
        style="width:260px"
      >
        <u-option label="test01" value="01"></u-option>
        <u-option label="test02" value="02"></u-option>
        <u-option label="test03" value="03"></u-option>
      </u-select-2>
    </div>

    <div>
      <h3>
        自定义options
      </h3>
      <u-select-2
        v-model="multiple"
        :maxTagCount="2"
        :optionTexts="['label', 'value']"
        style="width:260px"
      >
        <u-option
          v-for="item in cityList"
          :optionTexts="['label', 'value']"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        >
          <span>{{ Math.floor(Math.random() * (100)) + 1 }}</span>
          <span>{{ item.label }}</span>
        </u-option>
      </u-select-2>
    </div>

    <div>
      <h3>
        自定义作用域插槽options
      </h3>
      <u-select-2
        v-model="multiple"
        multiple
        :maxTagCount="2"
        :optionTexts="['label', 'value']"
        style="width:260px"
      >
        <u-option
          v-for="(item, i) in cityList"
          :optionTexts="['label', 'value']"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        >
          <template v-slot="slotProps">
            <div style="display:flex;justify-content:space-between;">
              <div>{{ i + 1 }}</div>
              <div
                style="max-width:40%;overflow:hidden;white-space: nowrap; text-overflow: ellipsis;"
              >
                {{ slotProps.label }}
              </div>
              <div v-if="slotProps.selected">✔</div>
              <div v-else></div>
            </div>
          </template>
        </u-option>
      </u-select-2>
    </div>

    <div>
      <h3>
        分组-option-group
      </h3>
      <u-select-2 v-model="multiple" style="width:260px" multiple filterable highLightQuery>
        <u-option-group label="分组1">
          <u-option value="beijing" label="北京"></u-option>
          <u-option value="shanghai" label="上海"></u-option>
          <u-option value="hangzhou" label="杭州"></u-option>
          <u-option value="shenzhen" label="深圳"></u-option>
        </u-option-group>

        <u-option-group label="分组2">
          <u-option value="shangjiaosuo" label="上期所"></u-option>
          <u-option value="yinghangjian" label="银行间"></u-option>
          <u-option value="zhengshangsuo" label="郑商所"></u-option>
          <u-option value="zhongjingsuo" label="中金所"></u-option>
        </u-option-group>
      </u-select-2>
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
        },
        {
          value: 'ellipsis',
          label:
            '超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长'
        },
        {
          value: 'ellipsis-en',
          label:
            'longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong'
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
      single: '',
      multiple: [],
      model10: ['hangzhou', 'chongqing'],
      model11: [
        'beijing',
        'shanghai',
        'shenzhen',
        'hangzhou',
        'nanjing',
        'chongqing'
      ],
      model12: [],
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
