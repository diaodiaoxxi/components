<template>
  <div>
    <div style="margin-bottom:5px;">
      <u-radio-group v-model="theme">
        <u-radio label="default"></u-radio>
        <u-radio label="light"></u-radio>
        <u-radio label="dark"></u-radio>
        <u-radio label="primary"></u-radio>
      </u-radio-group>
    </div>
    <u-menu
      default-active="2"
      class="u-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
    >
      <u-submenu index="1">
        <template slot="title">
          <i class="iconfont icon-location" slot="icon"></i>
          <span slot="title">导航一</span>
        </template>
        <u-menu-item-group>
          <template slot="title">分组一</template>
          <u-menu-item index="1-1">选项1</u-menu-item>
          <u-menu-item index="1-2">选项2</u-menu-item>
        </u-menu-item-group>
        <u-menu-item-group title="分组2">
          <u-menu-item index="1-3">选项3</u-menu-item>
        </u-menu-item-group>
        <u-submenu index="1-4">
          <template slot="title">选项4</template>
          <u-menu-item index="1-4-1">选项1</u-menu-item>
        </u-submenu>
      </u-submenu>
      <u-menu-item index="2">
        <i class="u-icon-menu"></i>
        <span slot="title">导航二</span>
      </u-menu-item>
      <u-menu-item index="3" disabled>
        <i class="u-icon-document"></i>
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
  zhName: '侧边',
  data () {
    return {
      theme: 'default'
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
