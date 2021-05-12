<template>
  <!-- <div v-tooltip="{
    show:true,
    autoHide:false,
    content: this.$t('hui.frameLayout.lockScreen')
  }" :class="`${prefix}-topbar-right-item ${prefix}-topbar-ctrl-icon`"> -->
  <div v-tooltip="$t('hui.frameLayout.lockScreen')" :class="`${prefix}-right-item ${prefix}-ctrl-icon`">
    <i :class="[isShow ? icon.lock : icon.unlock]" @click.stop="lockScreen('click')"></i>
    <h-msg-box
      ref="msgbox"
      v-model="isShow"
      class="h-layout-lockscreen"
      transfer
      width="400"
      height="112"
      :title="$t('hui.frameLayout.unlockScreen')"
      :closable="closable"
      :mask-closable="false"
      @submit.native.prevent
      @keyup.prevent.enter.native="lockValid"
    >
     <h-form ref="form" :model="form" >
       <h-form-item prop="password">

      <h-input
        v-model="form.password"
        class="h-layout-msg-input"
        type="password"
        autocomplete="new-password"
        :placeholder="$t('hui.frameLayout.unlockInputTip')"
      ></h-input>
       </h-form-item>
     </h-form>
      <h-button
        slot="footer"
        class="h-layout-msg-btn"
        type="primary"
        :disabled="disableConfirm"
        :loading="loading"
        @click="lockValid"
        >{{ $t('hui.common.sure') }}</h-button
      >
    </h-msg-box>
  </div>
</template>
<script>
import get from 'lodash/get'
import CONFIG from '../config'
export default {
  name: 'LayoutLockScreen',
  inject: {
    CONFIG: { default: () => CONFIG },
    layout: {},
    topbar: {},
  },
  props: {
    countdown: {
      type: Number,
      default: 1,
    },
    disableCountDown: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    this.icon = this.CONFIG.ICON
    this.prefix = 'h-layout-head'
    return {
      isShow: false,
      form: {
        password: '',
      },
      errorTip: '',
      closable: false,
      timer: null,
      loading: false,
    }
  },
  computed: {
    lockTimes () {
      return this.countdown * 60 * 1000
    },
    disableConfirm () {
      return !this.form.password
    }
  },
  methods: {
    lockTimer () {
      clearInterval(this.timer)
      if (this.isShow) {
        clearInterval(this.timer)
        return
      }
      const handle = () => {
        clearInterval(this.timer)
        if (this.disableCountDown) {
          return
        }
        this.$emit('debug:log', {
          restTime: lockTimes,
          countdown: this.lockTimes,
          type: 'trigger'
        })
        this.lockScreen()
      }
      let lockTimes = this.lockTimes
      this.timer = setInterval(() => {
        lockTimes = lockTimes - 1000
        if (lockTimes <= 0) {
          handle()
        }
        this.$emit('debug:log', {
          restTime: lockTimes,
          countdown: this.lockTimes,
          type: 'interval'
        })
      }, 1000)
    },
    lockScreen (source) {
      this.form.password = ''
      this.$refs.form && this.$refs.form.resetFields()
      this.isShow = true
      this.toggleGlassBackground()
      this.$emit('lock-screen', this.form.password)
    },
    lockValid () {
      if (this.disableConfirm) {
        return
      }
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.$emit('unlock-screen', this.form.password, () => {
          this.isShow = false
          this.toggleGlassBackground(false)
        })
      })
    },
    toggleGlassBackground (add = true) {
      const isSupportCss = (cssName) => {
        const dom = document.createElement('div')
        dom.style[cssName] = 'blur(5px)'
        document.body.appendChild(dom)
        const result = window.getComputedStyle(dom)[cssName] == 'blur(5px)'
        document.body.removeChild(dom)
        return result
      }
      // 如果css支持 backdrop-filter
      if (isSupportCss('backdropFilter') && add) {
        this.$nextTick(() => {
          const msgBoxDom = get(this, '$refs.msgbox.$el')
          if (!msgBoxDom) {
            return
          }
          const maskDom = msgBoxDom.querySelector('.h-modal-mask')
          if (!maskDom) {
            return
          }
          maskDom.style.backdropFilter = 'blur(5px)'
        })
      }
      // 如果css支持 filter
      if (isSupportCss('filter')) {
        const appDom = document.body.querySelector('#app')
        if (!appDom) {
          return
        }
        if (add) {
          appDom.style.filter = 'blur(2px)'
        } else {
          appDom.style.filter = null
        }
      }
      // TODO  IE 插入背景图片或 canvas 兼容
    },
  },
  created () {},
  mounted () {
    document.addEventListener('mousemove', this.lockTimer)
    document.addEventListener('mousedown', this.lockTimer)
  },
  beforeDestory () {
    document.removeEventListener('mousemove', this.lockTimer)
    document.removeEventListener('mousedown', this.lockTimer)
  },
}
</script>
