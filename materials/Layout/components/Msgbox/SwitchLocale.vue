<template>
  <div :class="`${drawerPrefix}-item ${drawerPrefix}-locale`" @click="open(true)">
    <i :class="`${drawerPrefix}-item-icon ${icon.locale}`"></i>
    <span :class="`${drawerPrefix}-item-title`" v-text="$t('hui.frameLayout.localeTitle')"></span>

    <h-msg-box
      v-model="showMsgbox"
      class="h-layout-locale"
      transfer
      width="497"
      :title="$t('hui.frameLayout.localeTitle')"
      :mask-closable="false"
      @on-close="handleCancle"
    >
      <h-form ref="form" class="h-layout-form" :model="form" :label-width="90">
        <h-form-item prop="oldPassword" :label="$t('hui.frameLayout.localeTitle')">
          <h-radio-group v-model="form.lang">
            <h-radio label="zh-CN">
              <span>中文(简)</span>
            </h-radio>
            <h-radio label="zh-TW">
              <span>中文(繁)</span>
            </h-radio>
            <h-radio label="en-US">
              <span>English</span>
            </h-radio>
          </h-radio-group>
        </h-form-item>
      </h-form>
      <div slot="footer">
        <h-button
          v-text="$t('hui.common.cancel')"
          type="ghost"
          class="h-layout-pwd-btn"
          @click="handleCancle"
        ></h-button>
        <h-button
          v-text="$t('hui.common.sure')"
          type="primary"
          class="h-layout-pwd-btn"
          @click="handleConfirm"
        ></h-button>
      </div>
    </h-msg-box>
  </div>
</template>
<script>
import CONFIG from '../config'

export default {
  name: 'LayoutLocaleSwitch',
  props: {
    locale: {
      type: String,
      default: 'zh-CN',
      validate (v) {
        return ['zh-CN', 'zh-TW', 'en-US'].includes(v)
      }
    }
  },
  model: {
    prop: 'locale',
    event: 'submit'
  },
  inject: {
    layout: { default: () => {} },
    topbar: { default: () => {} },
    CONFIG: { default: () => CONFIG },
  },
  watch: {
    locale (val) {
      this.form.lang = val
    }
  },
  data () {
    this.prefix = 'h-layout-head' || this.CONFIG.PREFIX
    this.drawerPrefix = `${this.prefix}-user-drawer`
    this.icon = this.CONFIG.ICON
    return {
      showMsgbox: false,
      form: {
        lang: this.locale,
      }
    }
  },
  methods: {
    open () {
      this.showMsgbox = true
      this.form.lang = this.locale
    },
    handleCancle () {
      this.showMsgbox = false
    },
    handleConfirm () {
      this.showMsgbox = false
      this.$emit('submit', this.form.lang)
    },
  },
  created () {

  },
  mounted () {

  },
}
</script>
