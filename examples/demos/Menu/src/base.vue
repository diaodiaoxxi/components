<template>
  <div>
    <u-menu
      class="u-menu-demo theme-dark"
      mode="horizontal"
      :data-theme="theme"
      :default-active="activeIndex"
      @select="handleSelect"
    >
      <u-menu-item index="1">处理中心</u-menu-item>
      <u-submenu index="2">
        <template slot="title">我的工作台</template>
        <u-menu-item index="2-1">选项1</u-menu-item>
        <u-menu-item index="2-2">选项2</u-menu-item>
        <u-menu-item index="2-3">选项3</u-menu-item>
        <u-submenu index="2-4">
          <template slot="title">选项4</template>
          <u-menu-item index="2-4-1">选项1</u-menu-item>
          <u-menu-item index="2-4-2">选项2</u-menu-item>
          <u-menu-item index="2-4-3">选项3</u-menu-item>
        </u-submenu>
      </u-submenu>
      <u-menu-item index="3" disabled>消息中心</u-menu-item>
      <u-menu-item index="4">订单管理</u-menu-item>
    </u-menu>

    <div class="line"></div>

    <u-radio-group v-model="theme">
      <u-radio label="default"></u-radio>
      <u-radio label="light"></u-radio>
      <u-radio label="dark"></u-radio>
      <u-radio label="primary"></u-radio>
    </u-radio-group>
  </div>
</template>
<script>
export default {
  zhName: '基础使用',
  data () {
    return {
      activeIndex: '1',
      theme: 'default'
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style>
.line {
  margin: 10px 0;
  border: 1px solid #ddd;
}
</style>
