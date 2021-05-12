<template>
  <div>
    <div style="margin-bottom:5px;">
      <u-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
        <u-radio :label="false">展开</u-radio>
        <u-radio :label="true">收起</u-radio>
      </u-radio-group>
    </div>

    <u-menu
      class="u-menu-vertical-demo"
      style="background:pink;border-right:1px solid #333;"
      mode="vertical"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
    >
      <u-submenu index="1">
        <i class="iconfont icon-location" slot="icon"></i>
        <span slot="title">导航一</span>
        <u-menu-item-group>
          <span slot="title">分组一</span>
          <u-menu-item index="1-1">选项1</u-menu-item>
          <u-menu-item index="1-2">选项2</u-menu-item>
        </u-menu-item-group>
        <u-menu-item-group title="分组2">
          <u-menu-item index="1-3">选项3</u-menu-item>
        </u-menu-item-group>
        <u-submenu index="1-4">
          <span slot="title">选项4</span>
          <u-menu-item index="1-4-1">选项1</u-menu-item>
        </u-submenu>
      </u-submenu>
      <u-menu-item index="2">
        <i class="iconfont icon-setting" slot="icon"></i>
        <span slot="title">导航二</span>
      </u-menu-item>
      <u-menu-item index="3" disabled>
        <i class="iconfont icon-document" slot="icon"></i>
        <span slot="title">导航三</span>
      </u-menu-item>
      <u-menu-item index="4">
        <i class="iconfont icon-setting" slot="icon"></i>
        <span slot="title">导航四</span>
      </u-menu-item>
    </u-menu>
  </div>
</template>

<script>
export default {
  zhName: '可折叠',
  data () {
    return {
      isCollapse: true
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style>
.u-menu-vertical-demo:not(.u-menu-collapse) {
  width: 200px;
  min-height: 400px;
}

.u-menu-collapse{
  width: 64px;
}
</style>
