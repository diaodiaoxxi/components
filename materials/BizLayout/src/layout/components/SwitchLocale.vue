<template>
  <h-dropdown class="h-topbar-lang" @on-click="changeLang">
    <i class="iconfont icon-earth"></i>
    <h-dropdown-menu slot="list">
      <h-dropdown-item
        v-text="'简体中文'"
        name="zh-CN"
        :selected="$i18n.locale === 'zh-CN'"
      ></h-dropdown-item>
      <h-dropdown-item
        v-text="'繁体中文'"
        name="zh-TW"
        :selected="$i18n.locale === 'zh-TW'"
      ></h-dropdown-item>
      <h-dropdown-item
        v-text="'English'"
        name="en-US"
        :selected="$i18n.locale === 'en-US'"
      ></h-dropdown-item>
    </h-dropdown-menu>
  </h-dropdown>
</template>

<script>
export default {
  name: 'LayoutSwitchLocale',
  methods: {
    changeLang (lang) {
      this.$emit('change-lang', lang)
    },
  },
}
</script>

<style lang="scss">
.h-topbar-lang {
  height: 100%;
  width: 100%;
  .h-dropdown-rel {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    .icon-earth{
      margin-bottom: -1px;
    }
  }
  .h-select-dropdown {
    width: 90px;
  }
}
</style>
