<template>
  <div :class="`${drawerPrefix}-item`" @click="open(true)">
    <i :class="`${drawerPrefix}-item-icon ${icon.unlock}`"></i>
    <span :class="`${drawerPrefix}-item-title`" v-text="$t('hui.frameLayout.resetPwd.title')"></span>

    <h-msg-box
      v-model="showMsgbox"
      class="h-layout-resetpwd"
      transfer
      width="497"
      :title="$t('hui.frameLayout.resetPwd.pwdModify')"
      :closable="store.closable"
      :mask-closable="false"
      @on-close="handleCancle"
    >
      <span v-if="!store.closable" style="font-size: 14px;color: red;margin-left: 50px;">{{
        msgInfo
      }}</span>
      <h-form ref="setPassForm" class="h-layout-form" :model="setPassForm" :label-width="91">
        <h-form-item prop="oldPassword" :label="$t('hui.frameLayout.resetPwd.curPwd')" :required="enableValidate">
          <h-input
            class="h-layout-msg-input"
            type="password"
            v-model="setPassForm.oldPassword"
            :placeholder="$t('hui.frameLayout.resetPwd.enterCurPwd')"
          ></h-input>
        </h-form-item>
        <h-form-item prop="newPassword" :label="$t('hui.frameLayout.resetPwd.newPwd')" :required="enableValidate">
          <h-input
            class="h-layout-msg-input"
            type="password"
            v-model="setPassForm.newPassword"
            :placeholder="$t('hui.frameLayout.resetPwd.enterNewPwd')"
            @on-change="handleValidate"
          ></h-input>
        </h-form-item>
        <h-form-item
          prop="newPasswordCheck"
          :required="enableValidate"
          :label="$t('hui.frameLayout.resetPwd.newPwdConf')"
          :rules="enableValidate ? validNewPassCheck : {}"
        >
          <!--        <h-input-->
          <!--          class="h-layout-msg-input"-->
          <!--          type="password"-->
          <!--          v-model="setPassForm.newPasswordCheck"-->
          <!--          strengthTip-->
          <!--          :placeholder="$t('hui.frameLayout.resetPwd.enterNewPwdAgain')"-->
          <!--          :tipState="tipState"-->
          <!--          @keyup.enter.native="handleSetPassword"-->
          <!--        ></h-input>-->
          <h-input
            class="h-layout-msg-input"
            type="password"
            v-model="setPassForm.newPasswordCheck"
            :placeholder="$t('hui.frameLayout.resetPwd.enterNewPwdAgain')"
            @keyup.enter.native="handleSetPassword"
          ></h-input>
        </h-form-item>
      </h-form>
      <template slot="footer">
        <h-button v-if="store.closable" type="ghost" class="h-layout-pwd-btn" @click="handleCancle">{{
          $t('hui.frameLayout.resetPwd.cancle')
        }}</h-button>
        <h-button type="primary" class="h-layout-pwd-btn" @click="handleSetPassword">{{
          $t('hui.frameLayout.resetPwd.confirm')
        }}</h-button>
      </template>
    </h-msg-box>
  </div>
</template>
<script>
import CONFIG from '../config'
/* eslint-disable standard/no-callback-literal */

export default {
  name: 'LayoutResetPassword',
  props: {
    enableValidate: {
      type: Boolean,
      default: true,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    minLength: {
      type: [Number],
      default: 8,
    },
    kindLength: {
      type: [Number],
      default: 3,
    }
  },
  inject: {
    layout: { default: () => {} },
    topbar: { default: () => {} },
    CONFIG: { default: () => CONFIG },
  },
  computed: {
    pwdStandard () {
      const { minLength, kindLength } = this
      return { minLength, kindLength }
    }
  },
  watch: {
    pwdStandard (val) {
      this.store = val
    }
  },
  data () {
    this.prefix = 'h-layout-head' || this.CONFIG.PREFIX
    this.drawerPrefix = `${this.prefix}-user-drawer`
    this.icon = this.CONFIG.ICON
    // 新密码框校验
    // 确认密码框校验
    const validatePassCheck = function (rule, value, callback) {
      if (value === '') {
        callback(new Error(this.$t('hui.frameLayout.resetPwd.enterNewPwdAgain')))
        return
      }
      if (value !== this.setPassForm.newPassword) {
        callback(new Error(this.$t('hui.frameLayout.resetPwd.pwdNoEquals')))
        return
      }
      if (value.length < this.store.minLength) {
        callback(
          this.$t('hui.frameLayout.resetPwd.pwdEnterMsg1') +
            this.store.minLength +
            this.$t('hui.frameLayout.resetPwd.pwdEnterMsg2'),
        )
        return
      }
      if (this.validatePwd(value) < this.store.kindLength) {
        callback(
          this.$t('hui.frameLayout.resetPwd.pwdEnterMsg3') +
            this.store.kindLength +
            this.$t('hui.frameLayout.resetPwd.pwdEnterMsg4'),
        )
        return
      }
      callback()
    }.bind(this)
    return {
      showMsgbox: false,
      msgInfo: '',
      setPassForm: {
        oldPassword: '',
        newPassword: '',
        newPasswordCheck: '',
      },
      store: {
        closable: true,
        minLength: 8,
        kindLength: 3,
      },
      tipState: null,
      validNewPassCheck: {
        validator: validatePassCheck,
        trigger: 'blur',
      },
    }
  },
  methods: {
    open (closable = true) {
      this.store.closable = closable
      this.$refs.setPassForm.resetFields()
      this.$nextTick(() => {
        this.showMsgbox = true
      })
    },
    handleCancle () {
      this.showMsgbox = false
      this.msgInfo = this.$t('hui.frameLayout.resetPwd.defaultPwdMsg')
    },
    handleValidate () {
      this.validatePwd(this.setPassForm.newPassword)
    },
    // 验证密码强度
    validatePwd (s) {
      const len = s.length
      const bitCount = function (i) {
        let count = 0
        while (i) {
          ++count
          i &= i - 1
        }
        return count
      }
      let flag = 0
      for (let i = 0; i < len; i++) {
        const c = s.charAt(i)
        if ((c >= 'a') & (c <= 'z')) {
          // 包含a-z
          flag |= 0b0001
        } else if ((c >= 'A') & (c <= 'Z')) {
          // 包含A-Z
          flag |= 0b0010
        } else if ((c >= '0') & (c <= '9')) {
          // 包含0-9
          flag |= 0b0100
        } else if (
          (c >= '!') & (c <= '/') ||
          (c >= ':') & (c <= '@') ||
          (c >= '[') & (c <= '`') ||
          (c >= '{') & (c <= '~')
        ) {
          // 包含特殊字符
          flag |= 0b1000
        } else {
          return false
        }
      }
      this.tipState = bitCount(flag) === 1 ? 'weak' : bitCount(flag) === 2 ? 'general' : 'complex'
      return bitCount(flag)
    },
    handleSetPassword () {
      const success = () => {
        this.showMsgbox = false
        this.store.closable = true
        this.$hMessage.success(this.$t('hui.frameLayout.resetPwd.successModifyPwd'))
      }
      const error = () => {
        this.$hMessage.error(this.$t('hui.frameLayout.resetPwd.netError'))
      }
      if (!this.enableValidate) {
        this.$emit('reset-password', this.setPassForm, success, error)
        return
      }
      this.$refs.setPassForm.validate(valid => {
        if (!valid) {
          this.$hMessage.error(this.$t('hui.frameLayout.resetPwd.enterRightPwd'))
          return
        }
        this.$emit('reset-password', this.setPassForm, success, error)
      })
    },
  },
  created () {
    this.store = this.pwdStandard
  },
  mounted () {

  },
}
</script>
