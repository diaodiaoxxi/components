<template>
  <div>
    <div>
      <h3>插槽-全选顶部</h3>
      <u-select v-model="model10" multiple maxTagCount="2" style="width:260px">
        <u-select-check-all
          class="is-head"
          slot="dropHead"
        ></u-select-check-all>
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        >
        </u-option>
      </u-select>
    </div>

    <div>
      <h3>插槽-全选底部</h3>
      <u-select v-model="model10" multiple maxTagCount="2" style="width:260px">
        <u-select-check-all slot="dropFoot"></u-select-check-all>
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        >
        </u-option>
      </u-select>
    </div>

    <div>
      <h3>插槽-全选过滤后数据</h3>
      <u-select
        v-model="model12"
        multiple
        maxTagCount="2"
        filterable
        style="width:260px"
      >
        <u-select-check-all
          :isSelectFilter="true"
          slot="dropFoot"
        ></u-select-check-all>
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        >
        </u-option>
      </u-select>
    </div>

    <!-- <div>
      <h3>插槽-创建新条目-单选</h3>
      <h3>创建新条目-创建新条目额外交互待讨论-暂不开放</h3>
      <u-select
        v-model="model12"
        multiple
        maxTagCount="2"
        filterable
        style="width:260px"
      >
        <u-select-add-option
          :isSelectFilter="true"
          slot="dropHead"
        ></u-select-add-option>
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        >
        </u-option>
      </u-select>
    </div> -->
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
