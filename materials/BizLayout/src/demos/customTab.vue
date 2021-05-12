<template>
  <div class="home">
    <div class="pt20">
      <h-button
        v-text="'添加但不激活自定义标签'"
        @click="onAddCustomTab"
      ></h-button>
      <h-button v-text="'删除自定义标签'" @click="onDelCustomTab"></h-button>
      <h-button
        v-text="'添加并激活自定义标签'"
        @click="onActiveCustomTab"
      ></h-button>
      <h-button
        v-text="'激活标签栏第一个标签'"
        @click="onActiveFirstTab"
      ></h-button>
    </div>

    <div class="pt20">
      <h-button v-text="'随机添加'" @click="onAddRandomCustomTab"></h-button>
      <h-button v-text="'添加固定页签'" @click="onAddPinCustomTab"></h-button>
      <h-button
        v-text="'删除当前激活的标签-并激活临近标签'"
        @click="onDelActiveCustomTab"
      ></h-button>
          <h-button
        v-text="'单个页签开启确认弹窗'"
        @click="onConfirmCustomTab"
      ></h-button>
    </div>

    <div class="pt20">
      <h-button
        v-text="'跳转到子应用自定义添加页签'"
        @click="onGo({ title: '子应用自定义添加页签', url: '/bizMenu' })"
      ></h-button>
      <h-button
        v-text="'跳转到子系统-bizMenu'"
        @click="onGo({ title: '子系统-bizMenu', url: '/bizMenu' })"
      ></h-button>
      <h-button
        v-text="'跳转到子系统-bizMenu-test'"
        @click="
          onGo({
            title: '子应用-bar-test',
            url: '/bizMenu/#test',
            systemName: '其他示例',
          })
        "
      ></h-button>
    </div>
  </div>
</template>

<script>
// 页面内自定义添加 skeleton 框架导航 标签栏 标签示例
// 监听的方法与缓存的数据可在 /layouts skeleton 中查看
export default {
  layout: 'skeleton',
  name: 'customTab',
  data () {
    const customTab = {
      uuid: this.$hCore.utils.uuid(),
      url: '/customTab',
      title: '自定义标签',
      // systemUuid: '9e4691b3-0267-4821-8b76-27aab67146bb', // 必须标记所属的系统，不然侧边栏数据找不到所属的系统，会被清空
      systemName: '其他示例', // systemUuid,systemName 任意传一个，如果systemName 可能存在重复的话，建议传 systemUuid ,不然将激活同名子系统中的第一个子系统
    }
    return {
      customTab,
      tabList: [],
    }
  },
  methods: {
    // 添加自定义标签
    onAddCustomTab () {
      this.$hCore.trigger('add-custom-tab', this.customTab)
    },
    // 删除自定义的标签
    onDelCustomTab () {
      this.$hCore.trigger('del-custom-tab', this.customTab)
    },
    // 激活自定义标签
    onActiveCustomTab () {
      this.$hCore.trigger('add-custom-tab', this.customTab)
      this.$hCore.trigger('active-custom-tab', this.customTab)
    },
    // 激活标签栏已有标签
    onActiveFirstTab () {
      this.$hCore.storage
        .getData({ key: 'bizStorage' })
        .then((bizStorage) => {
          bizStorage = JSON.parse(bizStorage)
          this.tabList = bizStorage.tabList
          this.$hCore.trigger('active-custom-tab', this.tabList[0])
        })
        .catch(e => {
          // 无需处理
          console.error(e)
        })
    },
    // 随机添加
    onAddRandomCustomTab () {
      const randomTab = Object.assign({}, this.customTab)
      randomTab.uuid = this.$hCore.utils.uuid()
      randomTab.title = `${
        this.customTab.title
      }-${this.$hCore.utils.uniqueId()}`
      this.$hCore.trigger('add-custom-tab', randomTab)
      this.$hCore.trigger('active-custom-tab', randomTab)
    },
    onAddPinCustomTab () {
      const pinTab = Object.assign({}, this.customTab)
      pinTab.uuid = 'c1441ac7-6c8d-4f0b-8c7d-f7eade140159'
      pinTab.title = '固定页签'
      pinTab.closable = false
      this.$hCore.trigger('add-custom-tab', pinTab)
      this.$hCore.trigger('active-custom-tab', pinTab)
    },
    onDelActiveCustomTab () {
      this.$hCore.trigger('del-custom-tab')
    },
    onConfirmCustomTab () {
      const pinTab = Object.assign({}, this.customTab)
      pinTab.uuid = 'c1441ac7-6c8d-4f0b-8c7d-f7eade140169'
      pinTab.title = '开启确认弹窗的页签'
      pinTab.enableConfirm = true
      this.$hCore.trigger('active-custom-tab', pinTab)
    },
    onGo (tab) {
      // this.$hCore.trigger('add-custom-tab', tab);
      this.$hCore.trigger('active-custom-tab', tab)
    },
  },
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  background-color: #ffffff;
  img {
    display: block;
    margin: 0 auto;
  }
}
.pt60 {
  padding-top: 60px;
}
.pt20 {
  padding: 20px;
}
</style>
