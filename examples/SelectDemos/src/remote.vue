<template>
  <div>
    <div>
      <h3>远程搜索:remote.loading = true</h3>
      <u-select-2
        v-model="model"
        :remote="{
          loading: true
        }"
        filterable
        clearable
      >
        <u-option
          v-for="option in options"
          :value="option.value"
          :key="option.value"
        >
          {{ option.label }}
        </u-option>
      </u-select-2>
    </div>
    <div>
      <h3>自定义加载提示文字:remote.loadingText</h3>
      <u-select-2
        v-model="model"
        :remote="{
          loading: true,
          loadingText: '自定义加载提示文字'
        }"
        filterable
        clearable
      >
        <u-option
          v-for="option in options"
          :value="option.value"
          :key="option.value"
        >
          {{ option.label }}
        </u-option>
      </u-select-2>
    </div>
    <div>
      <h3>自定义加载图标:remote.loadingText</h3>
      <u-select-2
        v-model="model"
        :remote="{
          loading: true,
          loadingText: '自定义加载图标',
          loadingIcon: 'u-icon iconfont icon-close u-icon-close'
        }"
        filterable
        clearable
      >
        <u-option
          v-for="option in options"
          :value="option.value"
          :key="option.value"
        >
          {{ option.label }}
        </u-option>
      </u-select-2>
    </div>
    <div>
      <h3>远程搜索示例</h3>
      <u-select-2 v-model="model" :remote="remote" filterable clearable>
        <u-option
          v-for="option in options"
          :value="option.value"
          :key="option.value"
        >
          {{ option.label }}
        </u-option>
      </u-select-2>
    </div>

    <div>
      <h3>远程搜索示例,初始化赋值</h3>
      <u-select-2 v-model="model2" :remote="remote" filterable clearable>
        <u-option label="test" value="123456"></u-option>
        <u-option
          v-for="option in options2"
          :value="option.value"
          :key="option.value"
        >
        </u-option>
      </u-select-2>
    </div>

    <div>
      <h3>下拉加载更多</h3>
      <h3>scrollDisabled:是否开启下拉加载更多</h3>
      <h3>scrollLoading:开启下拉加载更多loading 状态</h3>
      <h3>scrollNoMore: 为true 没有更多数据,显示没有更多数据提示</h3>
      <h3>scrollNoMoreText:没有更多数据文本替换</h3>
      <h3>scrollLoadMore:滚动到底部加载调用方法</h3>
      <h3>scrollImmediateCheck:初始化就调用scrollLoadMore</h3>
      <u-select-2 v-model="model3" :remote="remote3" filterable clearable>
        <u-option
          v-for="option in options3"
          :value="option.value"
          :key="option.value"
        >
          {{ option.label }}
        </u-option>
      </u-select-2>
    </div>
  </div>
</template>
<script>
import Mock from 'mockjs'
export default {
  data () {
    return {
      model: '',
      model2: '123456',
      model3: '',
      options: [],
      options2: [],
      options3: [],
      remote: {
        loading: false,
        method: this.remoteMethod
      },
      remote3: {
        loading: false,
        scrollDisabled: false,
        scrollLoading: false,
        scrollNoMore: false,
        scrollNoMoreText: '---------到底线了----------',
        scrollLoadMore: this.loadMore
      }
    }
  },
  methods: {
    initOptions (num = 50, dataKey = 'options') {
      const mockData = Mock.mock({
        [`array|${num}`]: [
          {
            label: () => Mock.Random.ctitle(),
            'value|100000-999999999': 1000,
            city: () => Mock.Random.ctitle()
          }
        ]
      }).array
      this[dataKey] = mockData
      console.log(`${dataKey} mount`, this[dataKey].length)
    },
    remoteMethod (query) {
      console.log('query', query)
      this.remote.loading = true
      const sleep = time => new Promise(resolve => setTimeout(resolve, time))
      sleep(2000).then(() => {
        this.remote.loading = false
        this.initOptions(3)
      })
    },
    loadMore () {
      console.log('start load more', this.options3.length)
      this.remote3.scrollLoading = false
      const mockData = Mock.mock({
        'array|20': [
          {
            label: () => Mock.Random.ctitle(),
            'value|100000-999999999': 1000,
            city: () => Mock.Random.ctitle()
          }
        ]
      }).array
      if (this.options3.length >= 60) {
        this.remote3.scrollNoMore = true
        return
      }
      this.remote3.scrollLoading = true
      const sleep = time => new Promise(resolve => setTimeout(resolve, time))
      sleep(3000).then(() => {
        this.remote3.scrollLoading = false
        this.options3 = this.options3.concat(mockData)
        console.log(`${'options3'} length`, this.options3.length)
      })
    }
  },
  created () {
    this.initOptions()
    this.initOptions(20, 'options3')
  }
}
</script>
