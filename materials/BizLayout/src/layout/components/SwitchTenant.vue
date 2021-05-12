<template>
  <!--切换租户-->
  <h-msg-box
    v-model="show"
    class="h-biz-frame-layout-switch-tenant h-layout-msg-box"
    width="400"
    height="200"
    :title="$t('hui.biz.tenant.title')"
    :mask-closable="false"
  >
    <h-form style="width:100%" :mode="tenantData" :label-width="116" ref="setTenant" cols="1">
      <h-form-item :label="$t('hui.biz.tenant.choose')" :labelTitle="$t('hui.biz.tenant.choose')">
        <h-select v-model="tenantData.tenantId" label-in-value @on-change="selectTenant">
          <h-option v-for="item in tenantList" :value="item.code" :key="item.code"
            >{{ item.code }}:{{ item.text }}</h-option
          >
        </h-select>
      </h-form-item>
    </h-form>

    <template slot="footer">
      <h-button v-text="$t('hui.common.cancel')" type="ghost" @click="show = !show"></h-button>
      <h-button v-text="$t('hui.common.sure')" type="primary" @click="submitTenant"></h-button>
    </template>
  </h-msg-box>
</template>

<script>
import i18n from '../locales'
export default {
  i18n,
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
    return {
      show: false,
      tenantData: {
        tenantId: '',
        tenantName: '',
      },
    }
  },
  computed: {
    tenantList () {
      return this.bizApi.store.tenantList
    },
    userInfo () {
      return this.bizApi.store.userInfo
    },
  },
  watch: {
    userInfo (userInfo) {
      this.tenantData.tenantId = userInfo.tenantId
      this.tenantData.tenantName = userInfo.tenantName
    },
  },
  mounted () {
    this.tenantData.tenantId = this.userInfo.tenantId
    this.tenantData.tenantName = this.userInfo.tenantName
  },
  methods: {
    // 打开弹窗
    open () {
      this.show = true
      this.tenantData.tenantId = this.userInfo.tenantId
      this.tenantData.tenantName = this.userInfo.tenantName
      this.bizApi.getUserTenant()
    },
    selectTenant (param) {
      const tempTenantName = param.label
      this.tenantData.tenantId = param.value
      this.tenantData.tenantName =
        tempTenantName && tempTenantName.split(':')[1] ? tempTenantName.split(':')[1] : param.label
    },
    submitTenant () {
      const tenantId = this.tenantData.tenantId
      if (!tenantId) {
        this.$hMessage.error(this.$t('hui.biz.tenant.validTip'))
        return
      }
      this.bizApi
        .submitTenant(tenantId)
        .then(res => {
          this.$hMessage.success({
            content: this.$t('hui.biz.tenant.successMsg'),
            duration: 3,
            closable: true,
          })
          //  TODO 切换租户成功后刷新跳转到首页
          //  TODO menu 侧边栏展开信息
          //   this.$router.replace('/')
          //   let storedMenus = JSON.parse(
          //     window.sessionStorage.getItem('menus') || 'null'
          //   )
          //   if (Array.isArray(storedMenus) && storedMenus.length === 0) {
          //     window.sessionStorage.removeItem('menus')
          //   }
          this.$nextTick(() => {
            setTimeout(() => {
              location.reload()
            }, 500)
          })
        })
        .catch(err => {
          if (err instanceof this.bizApi.Error) {
            this.$hMessage.error({
              content: err.message,
              duration: 3,
              closable: true,
            })
            return
          }
          this.$hMessage.error(this.$t('hui.biz.tenant.failMsg'))
        })
    },
  },
}
</script>
<style lang="css">
.h-layout-msg-box.h-biz-frame-layout-switch-tenant .h-modal-content .h-modal-body {
  height: 250px;
  padding-right: 30px;
}
</style>
