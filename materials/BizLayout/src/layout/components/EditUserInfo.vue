<template>
  <!-- 修改个人资料 -->
  <h-msg-box
    v-model="show"
    :title="$t('hui.biz.editUser.modifyUserInfo')"
    :mask-closable="false"
    width="800"
    class="h-topbar-msgbox h-layout-msg-box h-biz-frame-layout-edit-user"
  >
    <h-form :model="setUser" :label-width="116" ref="setUserModi" cols="2" style="padding-right:40px">
      <h-form-item
        :label="$t('hui.biz.editUser.userName')"
        :labelTitle="$t('hui.biz.editUser.userName')"
        prop="userName"
        required
      >
        <h-input v-model="setUser.userName" :maxlength="16"></h-input>
      </h-form-item>
      <!-- 可以选择所属组织 -->
      <h-form-item
        :label="$t('hui.biz.editUser.relOrg')"
        :labelTitle="$t('hui.biz.editUser.relOrg')"
        prop="orgId"
        required
      >
        <h-input v-model="setUser.orgName" readonly></h-input>
      </h-form-item>
      <h-form-item
        :label="$t('hui.biz.editUser.mobile')"
        :labelTitle="$t('hui.biz.editUser.mobile')"
        prop="mobile"
        :validRules="['mobile']"
      >
        <h-input v-model="setUser.mobile"></h-input>
      </h-form-item>
      <h-form-item
        :label="$t('hui.biz.editUser.phone')"
        :labelTitle="$t('hui.biz.editUser.phone')"
        prop="phone"
        :validRules="['tel']"
      >
        <h-input v-model="setUser.phone"></h-input>
      </h-form-item>
      <h-form-item
        :label="$t('hui.biz.editUser.fax')"
        :labelTitle="$t('hui.biz.editUser.fax')"
        prop="fax"
        :validRules="userfaxRule"
      >
        <h-input v-model="setUser.fax" :maxlength="200"></h-input>
      </h-form-item>
      <h-form-item
        :label="$t('hui.biz.editUser.email')"
        :labelTitle="$t('hui.biz.editUser.email')"
        prop="email"
        :validRules="['email']"
      >
        <h-input v-model="setUser.email"></h-input>
      </h-form-item>
      <h-form-item
        :label="$t('hui.biz.editUser.certiType')"
        :labelTitle="$t('hui.biz.editUser.certiType')"
        prop="cIdentitytype"
      >
        <h-select v-model="setUser.cIdentitytype">
          <h-option v-for="item in BIZ_CIDENTTYPE" :value="item.code" :key="item.code">{{
            item.text
          }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item
        :label="$t('hui.biz.editUser.certiNum')"
        :labelTitle="$t('hui.biz.editUser.certiNum')"
        prop="cIdentityno"
        :validRules="userCIdentitynoRule"
      >
        <h-input v-model="setUser.cIdentityno" :maxlength="40"></h-input>
      </h-form-item>
      <h-form-item
        :label="$t('hui.biz.editUser.qualiCerti')"
        :labelTitle="$t('hui.biz.editUser.qualiCerti')"
        prop="cCredentials"
      >
        <h-input v-model="setUser.cCredentials" :maxlength="40"></h-input>
      </h-form-item>
      <h-form-item
        :label="$t('hui.biz.editUser.workStatus')"
        :labelTitle="$t('hui.biz.editUser.workStatus')"
        prop="workStatus"
      >
        <h-select v-model="setUser.workStatus">
          <h-option v-for="item in SYS_USER_WORK_STATE" :value="item.code" :key="item.code"
            >{{ item.code }}:{{ item.text }}</h-option
          >
        </h-select>
      </h-form-item>
      <h-form-item
        :label="$t('hui.biz.editUser.filterMsgType')"
        :labelTitle="$t('hui.biz.editUser.filterMsgType')"
        prop="msgType"
      >
        <h-checkbox-group v-model="setUser.msgType">
          <h-checkbox
            v-for="(item, index) in BIZ_MSG_TYPE"
            :value="item.code"
            :label="item.code"
            :key="index"
            style="margin-right:5px;margin-top:5px;"
            :disabled="item.code === '1'"
            >{{ item.text }}</h-checkbox
          >
        </h-checkbox-group>
      </h-form-item>
      <h-form-item
        :label="$t('hui.biz.editUser.comments')"
        :labelTitle="$t('hui.biz.editUser.comments')"
        cols="2"
        prop="remark"
        style="height:72px;"
      >
        <h-input
          v-model="setUser.remark"
          :maxlength="127"
          :canResize="false"
          type="textarea"
          style="height:72px;"
          class="h-topbar-userInfo-textarea"
        ></h-input>
      </h-form-item>
    </h-form>
    <template slot="footer">
      <h-button type="ghost" style="margin:0 8px" @click="userFormReset">{{
        $t('hui.common.reset')
      }}</h-button>
      <h-button type="primary" :loading="submitLoading" @click="submitUserInfo">{{
        $t('hui.common.commit')
      }}</h-button>
    </template>
  </h-msg-box>
</template>
<script>
import i18n from '../locales'
export default {
  i18n,
  name: 'BizEditUserInfo',
  props: {
    // 操作员中心接口类
    bizApi: {
      type: Object,
      default () {
        return {}
      },
    },
  },
  data () {
    this.userfaxRule = [
      {
        test: /^(\d{3,4}-)?\d{7,8}$/,
        trigger: 'blur',
        message: this.$t('hui.biz.editUser.validFaxNum'),
      },
    ]
    this.userCIdentitynoRule = [
      {
        test: /^[0-9a-zA-Z]*$/,
        trigger: 'blur',
        message: this.$t('hui.biz.editUser.validIdCard'),
      },
    ]
    return {
      BIZ_CIDENTTYPE: [],
      SYS_USER_WORK_STATE: [],
      BIZ_MSG_TYPE: [],
      show: false,
      submitLoading: false,
      setUser: {
        userId: '',
        userName: '',
        orgId: '',
        orgName: '',
        mobile: '',
        phone: '',
        fax: '',
        email: '',
        cIdentitytype: '',
        cIdentityno: '',
        cCredentials: '',
        remark: '',
        workStatus: '1',
        msgType: [],
      },
    }
  },
  methods: {
    // 提供打开弹窗 初始化操作
    async open () {
      // 获取字典数据
      const DICT_MAP = await this.bizApi.getDict()
      Object.assign(this.$data, DICT_MAP)
      this.show = true
      this.getUserInfo()
    },
    // 表单重置
    userFormReset () {
      this.$refs.setUserModi.resetFields()
      this.getUserInfo()
    },
    // 获取个人信息
    getUserInfo () {
      this.$refs.setUserModi.resetFields()
      // getCurrUser 接口数据导入到 data.setUser
      const userInfo = this.bizApi.store.userInfo
      Object.assign(this.setUser, userInfo)
      this.setUser.msgType = userInfo.filterMsgType.split(',').filter(name => !!name)
    },
    // 修改提交
    submitUserInfo () {
      if (this.submitLoading) {
        return
      }
      const validate = valid => {
        if (!valid) {
          return
        }
        this.submitLoading = true
        this.setUser.filterMsgType = this.setUser.msgType.join(',')
        this.bizApi
          .updateUserInfo(this.setUser)
          .then(res => {
            this.$hMessage.success(this.$t('hui.biz.editUser.modifySuccess'))
            this.show = false
          })
          .then(() => {
            this.bizApi.getCurrUser()
          })
          .catch(err => {
            if (err instanceof this.bizApi.Error) {
              this.$hMessage.error(err.message)
              return
            }
            this.$hMessage.error(this.$t('hui.ajax.error'))
          })
          .finally(() => {
            this.submitLoading = false
          })
      }
      this.$refs.setUserModi.validate(validate)
    },
  },
}
</script>
<style lang="css">
.h-layout-msg-box.h-biz-frame-layout-edit-user .h-modal-content .h-modal-body {
  height: 386px;
  padding: 24px 0;
}
</style>
