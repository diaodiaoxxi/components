<style lang="scss" scoped src="./login.scss"></style>
<template>
  <div id="login" class="wrapper">
    <img class="lottie" :src="lottie" alt srcset />
    <!-- full-items 涉及一个纯 ui 类型的条件判断，目的是为了避免表单项过多超出表单区域而破坏界面美观的问题 -->
    <div
      class="form"
      :class="{
        'full-items':
          isTenantEnabled && isCheckCodeEnabled && isMailboxVerificationEnabled,
      }"
    >
      <div class="logo-wrap">
      <img class="hundsun-logo" :src="hundsunLogo" alt srcset />
      </div>
      <p class="welcome">欢迎登录～</p>
      <p class="title" :style="setNameStyle(name)">{{ name }}</p>
      <!-- TODO 是否要处理表单的 enter 事件以取得与 tab 相似的功能 -->
      <h-form
        :model="form"
        autocomplete="off"
        label-position="left"
        @submit.native.prevent
        @keyup.enter.native.prevent="login"
      >
        <!-- 用户名 -->
        <h-form-item prop="user">
          <h-input ref="user" v-model="form.user" placeholder="用户名">
            <h-icon
              class="icon-u-a-login-user"
              name=""
              fontClass="frame1-iconfont"
              size="16"
              color="#87aaf5"
              slot="prepend"
            ></h-icon>
          </h-input>
          <verification-tip v-if="!isUserValid" :message="userTipMessage" />
        </h-form-item>
        <!-- 密码 -->
        <h-form-item prop="password">
          <h-input
            type="password"
            ref="password"
            v-model="form.password"
            placeholder="密码"
          >
            <h-icon
              class="icon-u-a-pwd"
              name=""
              fontClass="frame1-iconfont"
              size="16"
              color="#87aaf5"
              slot="prepend"
            ></h-icon>
          </h-input>
          <verification-tip
            v-if="!isPasswordValid"
            :message="passwordTipMessage"
          />
        </h-form-item>
        <!-- 租户 -->
        <h-form-item v-show="isTenantEnabled" prop="tenant">
          <h-input
            ref="tenant"
            v-model="form.tenant"
            placeholder="请选择租户"
            @on-focus="onTenantFocus"
            @keydown.up.native.prevent="onSelectLastTanant"
            @keydown.down.native.prevent="onSelectNextTanant"
            @keydown.enter.native.stop.prevent="onTenantEnter"
            @keydown.esc.native.prevent="onTenantEnter"
          >
            <h-icon
              name="person-stalker"
              size="16"
              color="#87aaf5"
              slot="prepend"
            ></h-icon>
          </h-input>
          <ul v-if="isTenantSelecting" class="tenant">
            <li
              v-for="tenant in tenantList"
              :key="tenant.tenant_id"
              :class="['option', { hover: tenantId === tenant.tenant_id }]"
              @click="selectTenant(tenant)"
            >
              {{ tenant.tenant_name }}
            </li>
          </ul>
          <verification-tip v-if="!isTenantValid" :message="tenantTipMessage" />
        </h-form-item>
        <!-- 验证码 -->
        <h-form-item v-if="isCheckCodeEnabled" prop="checkcode">
          <h-input
            ref="checkcode"
            v-model="form.checkcode"
            placeholder="验证码"
          >
            <h-icon
              class="icon-u-a-chk"
              name=""
              fontClass="frame1-iconfont"
              size="16"
              color="#87aaf5"
              slot="prepend"
            ></h-icon>
          </h-input>
          <div @click="refreshCheckCode" class="checkcode">
            <img :src="checkCodeUrl" title="刷新验证码" />
          </div>
          <verification-tip
            v-if="!isCheckcodeValid"
            :message="checkcodeTipMessage"
          />
        </h-form-item>
        <!-- 邮箱验证码 -->
        <h-form-item v-if="isMailboxVerificationEnabled" prop="emailcheckcode">
          <h-input
            ref="emailcheckcode"
            v-model="form.emailcheckcode"
            placeholder="邮箱验证码"
          >
            <h-icon
              class="icon-u-a-chk"
              name=""
              fontClass="frame1-iconfont"
              size="16"
              color="#87aaf5"
              slot="prepend"
            ></h-icon>
          </h-input>
          <div
            class="emailcheckcode"
            :style="{ backgroundColor: isMailboxReady ? '' : '#e7e9ec' }"
          >
            <p v-if="isMailboxReady" @click="sendMailAndCountdown">
              获取验证码
            </p>
            <p v-else style="color: #2f80fa;">{{ second }}秒后重新获取</p>
          </div>
          <verification-tip
            v-if="!isEmailCheckcodeValid"
            :message="emailCheckcodeTipMessage"
          />
        </h-form-item>
        <!-- 登录 -->
        <h-form-item class="submit">
          <h-button ref="login" type="primary" can-focus @click="login"
            >登录</h-button
          >
        </h-form-item>
      </h-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable camelcase */
// 操作员中心1.0 外框图标，目前只有登录页使用
import './assets/font/frame1-iconfont.css'
import lottie from './assets/lottie.png'
import hundsunLogo from './assets/hundsun-logo.png'
import BizSecurity from '../utils/BizSecurity'
export default {
  components: {
    // 表单提示信息。这种组件声明方式方式只适合逻辑简单，交互比较少的场景
    VerificationTip: {
      props: ['message'],
      template: `
        <div class="tip">
          <div class="arrow"></div>
          <p class="inner">{{ message }}</p>
        </div>
      `,
    },
  },
  data () {
    return {
      lottie,
      hundsunLogo,
      name: '操作员中心',
      form: {
        user: '',
        password: '',
        tenant: '',
        checkcode: '',
      },
      isUserValid: true, // 表单项 - 用户 - 是否有效
      userTipMessage: '', // 表单项 - 用户 - 提示信息
      isPasswordValid: true, // 表单项 - 密码 - 是否有效
      passwordTipMessage: '', // 表单项 - 密码 - 提示信息
      isTenantValid: true, // 表单项 - 租户 - 是否有效
      tenantTipMessage: '', // 表单项 - 租户 - 提示信息
      isCheckcodeValid: true, // 表单项 - 图片验证码 - 是否有效
      checkcodeTipMessage: '', // 表单项 - 图片验证码 - 提示信息
      isEmailCheckcodeValid: true, // 表单项 - 邮箱验证码 - 是否有效
      emailCheckcodeTipMessage: '', // 表单项 - 邮箱验证码 - 提示信息
      tenantList: [], // 租户列表
      tenantId: null, // 已选租户ID，默认是 null
      checkCodeUrl: '', // 验证码图片地址
      isTenantEnabled: false, // 启用租户
      isTenantSelecting: false, // 选择租户
      isCheckCodeEnabled: false, // 启用图片验证
      isMailboxVerificationEnabled: false, // 启用邮箱验证
      isMailboxReady: true, // 邮箱验证处于 ready 状态，此时允许点击获取发送邮箱验证码
      second: 60, // 倒计时发送邮箱验证码
    }
  },
  watch: {
    form: {
      handler () {
        // 重置表单用户项校验信息
        this.isUserValid = true
        this.userTipMessage = ''
        // 重置表单密码项校验信息
        this.isPasswordValid = true
        this.passwordTipMessage = ''
        // 重置表单租户项校验信息
        this.isTenantValid = true
        this.tenantTipMessage = ''
        // 重置表单图片验证码校验信息
        this.isCheckcodeValid = true
        this.checkcodeTipMessage = ''
        // 重置表单邮箱验证码校验信息
        this.isEmailCheckcodeValid = true
        this.emailCheckcodeTipMessage = ''
        // 租户为空时，重置表单租户项信息
        if (this.form.tenant === '') {
          this.tenant = null
          this.tenantId = null
        }
      },
      deep: true,
    },
  },
  methods: {
    /**
     * name 样式处理，规则来自 ued
     * 10个字内用28号字
     * 10个及10个以上用22号字，不能超过12个字
     */
    setNameStyle (appName = '') {
      if (appName.length < 10) {
        return { fontSize: '28px' }
      }
      return { fontSize: '22px', letterSpacing: '0' }
    },
    // 处理租户表单项的 focus 事件
    onTenantFocus () {
      this.isTenantSelecting = true
    },
    // 处理租户表单项的 blur 事件
    // 这个方法使用原生的方式绑定，可以带来更好的用户体验
    onTenantBlur () {
      // 如果没有这个延时，selectTenant 不会触发。如果你有更好的解决方案，请与我们分享
      setTimeout(() => {
        this.isTenantSelecting = false
      }, 200)
    },
    // 处理租户表单项绑定的键盘 up 事件
    onSelectLastTanant () {
      let inx = this.tenantList.findIndex(
        (item) => item.tenant_id === this.tenantId
      )
      // 初始状态，没有已选租户
      // 或者当前的已选租户是租户列表中的第一项
      if (inx < 1) {
        return false
      }
      // 选中上一项
      this.selectTenant(this.tenantList[--inx])
    },
    // 处理租户表单项绑定的键盘 down 事件
    onSelectNextTanant (e) {
      const length = this.tenantList.length
      let inx = this.tenantList.findIndex(
        (item) => item.tenant_id === this.tenantId
      )
      // 当前的已选租户是租户列表中的最后一项
      if (inx && inx >= length - 1) {
        return false
      }
      // 选中下一项
      this.selectTenant(this.tenantList[++inx])
    },
    // 处理租户表单项绑定的键盘 enter 事件
    onTenantEnter () {
      // 收起租户下拉面板
      this.$refs.tenant.blur()
      // 合理地设置焦点可以带来更好地用户体验
      this.$nextTick(() => {
        if (this.isCheckCodeEnabled) {
          return this.$refs.checkcode.focus()
        }
        if (this.isMailboxVerificationEnabled) {
          return this.$refs.emailcheckcode.focus()
        }
        this.$refs.login.focus()
      })
    },
    // 选择租户
    selectTenant (tenant) {
      const { tenant_id, tenant_name } = tenant
      this.tenant = tenant // 保存对当前已选租户的索引，方便调用
      this.tenantId = tenant_id
      this.form.tenant = tenant_name
    },
    // 刷新图片验证码
    async refreshCheckCode () {
      await this.$hCore.fetch
        .get('/getVerifyCode')
        .then((res) => {
          const { img, id } = res.data
          this.checkCodeUrl = `data:image/png;base64,${img}`
          this.checkCodeId = id
        })
        .catch((error) => {
          const { error_message } = error
          if (error_message) {
            return console.error(error_message)
          }
          return console.error(error)
        })
    },
    // 创建一个持久化的定时器，在发送邮箱验证码之后开启，或者在页面刷新之后开启
    createTimer (onClearTimer) {
      const timer = setInterval(() => {
        if (this.second > 0) {
          this.second -= 1
          this.$hCore.storage.setData({
            key: 'mailVerificationCountDownSecond',
            value: this.second,
          })
          return
        }
        clearInterval(timer)
        this.$hCore.storage.deleteData({
          key: 'mailVerificationCountDownSecond',
        })
        onClearTimer && onClearTimer()
      }, 1000)
    },
    // 发送邮箱验证码并开启倒计时
    sendMailAndCountdown () {
      this.$hCore.fetch
        .post('/getEmailVerificationCode', {
          operator_code: BizSecurity.DES.encrypt(
            this.form.user,
            'hs',
            'club',
            '33#44'
          ),
        })
        .then(() => {
          this.isMailboxReady = false
          this.createTimer(() => {
            this.isMailboxReady = true
          })
        })
        .catch((error) => {
          const { error_message } = error
          if (error_message) {
            return console.error(error_message)
          }
          return console.error(error)
        })
    },
    // 提交表单登录
    login () {
      this.$hCore.storage.deleteData({ key: 'bizStorage' }).catch(() => {})
      const { user, password, checkcode } = this.form

      // 表单项 - 用户 - 校验
      if (user === '') {
        this.isUserValid = false
        this.userTipMessage = '用户名不能为空'
        this.$refs.user.focus()
        return false
      }

      // 表单项 - 密码 - 校验
      if (password === '') {
        this.isPasswordValid = false
        this.passwordTipMessage = '密码不能为空'
        this.$refs.password.focus()
        return false
      }

      this.$hCore.fetch
        .post('/submitLogin', {
          operator_code: BizSecurity.DES.encrypt(user, 'hs', 'club', '33#44'), // 登录用户ID
          password: BizSecurity.DES.encrypt(password, 'hs', 'club', '33#44'), // 登录密码
          tenant_id: this.tenantId || '', // 租户ID
          kind_code: this.tenant ? this.tenant.kind_code : '',
          verify_code: checkcode, // 验证码
          uuid: this.checkCodeId || '', // 验证码 uuid
          email_verification_code: '',
        })
        .then(async (res) => {
          const { return_code, return_info } = res.data
          if (return_code === '0') {
            // 兼容操作员中心页面大量使用的 currUserId
            // 新系统建议直接使用 operator_code
            // TODO 合并 getCurrUser 接口的数据
            // TODO 登录后 user_token 需要加密 encryptParam
            // const userInfo = Object.assign(res.data, {
            //   currUserId: res.data?.operator_code
            // })
            await this.$hCore.storage.setData({ key: 'user', value: res.data })
            return this.$hCore.navigate('/home')
          }

          // 处理来自业务系统内的异常
          // 图片验证码异常
          if (['-5', '-6'].includes(return_code)) {
            this.isCheckcodeValid = false
            this.checkcodeTipMessage = return_info
            this.refreshCheckCode()
            // 焦点移动到表单项验证码上
            this.$refs.checkcode.focus()
            return false
          }
          // 其他类型的异常
          this.isUserValid = false
          this.userTipMessage = return_info
          // 焦点移动到表单项用户上
          this.$refs.user.focus()
        })
        .catch((error) => {
          const { error_message } = error
          if (error_message) {
            return console.error(error_message)
          }
          return console.error(error)
        })
    },
  },
  async created () {
    // 处理邮箱校验时设置的定时器
    this.$hCore.storage
      .getData({ key: 'mailVerificationCountDownSecond' })
      .then((second) => {
        if (second && second > 0) {
          this.isMailboxReady = false
          this.second = second
          this.createTimer(() => {
            this.isMailboxReady = true
          })
        }
      })
      // eslint-disable-next-line handle-callback-err
      .catch((error) => {
        // 没有定时器需要处理
      })

    // 处理系统配置
    const { IS_TENANT_ENABLED, IS_TWO_FACTOR_CHECK_ENABLED } = window.FRAME_CONFIG
    if (IS_TENANT_ENABLED) {
      this.isTenantEnabled = true
    }
    if (IS_TWO_FACTOR_CHECK_ENABLED) {
      this.isMailboxVerificationEnabled = true
    }
    // 在登录页面上，系统管理员 admin 不需要指定租户和邮箱
    // 实现这个逻辑需要部署对 form.user 的监听，因为涉及到租户和邮箱的开关控制
    // 在这里部署监听比较合适
    const {
      isTenantEnabled: rawIsTenantEnabled,
      isMailboxVerificationEnabled: rawIsMailboxVerificationEnabled,
    } = this
    this.$watch('form.user', (user) => {
      if (user === 'admin') {
        this.isTenantEnabled = false
        this.isMailboxVerificationEnabled = false
      } else {
        this.isTenantEnabled = rawIsTenantEnabled
        this.isMailboxVerificationEnabled = rawIsMailboxVerificationEnabled
      }
    })
  },
  mounted () {
    // 获取租户列表
    if (this.isTenantEnabled) {
      this.$hCore.fetch
        .get('/getTenantList')
        .then((res) => {
          this.tenantList = res.data
        })
        .catch((error) => {
          const { error_message } = error
          if (error_message) {
            return console.error(error_message)
          }
          return console.error(error)
        })
    }
    // 获取是否启用校验码的后台配置
    this.$hCore.fetch
      .get('/loginHasValidateCode')
      .then(async (res) => {
        const { result } = res.data
        if (result === 'true') {
          // 拿到验证码之后再设置表单项，避免出现图片加载失败的提示信息
          await this.refreshCheckCode()
          this.isCheckCodeEnabled = true
        }
      })
      .catch((error) => {
        const { error_message } = error
        if (error_message) {
          return console.error(error_message)
        }
        return console.error(error)
      })

    // 在这里处理租户的 blur 事件效果会好些
    this.$refs.tenant.$el.addEventListener('blur', this.onTenantBlur, true)
  },
  beforeDestroy () {
    // 在合适的时机取消事件监听
    this.$refs.tenant.$el.removeEventListener(
      'blur',
      this.onTenantBlur,
      true
    )
  },
}
</script>
