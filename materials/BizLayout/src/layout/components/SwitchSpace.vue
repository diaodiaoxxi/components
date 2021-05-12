<template>
  <!-- 切换空间 -->
  <h-msg-box
    v-model="show"
    class="h-biz-frame-layout-space h-layout-msg-box"
    :title="$t('hui.biz.space.validTip')"
    :mask-closable="false"
  >
    <h-tree
      ref="orgTreeModi"
      :data="spaceList"
      :show-checkbox="false"
      :style="{ height: '250px', overflow: 'auto' }"
      @on-select-change="selectSpace"
    >
    </h-tree>
    <template slot="footer">
      <h-button
        v-text="$t('hui.common.cancel')"
        type="ghost"
        @click="show = !show"
      ></h-button>
      <h-button
        v-text="$t('hui.common.sure')"
        type="primary"
        @click="submitSpace"
      ></h-button>
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
      spaceNodeList: [],
    }
  },
  computed: {
    spaceList () {
      return this.bizApi.store.spaceList
    },
    userInfo () {
      return this.bizApi.store.userInfo
    },
  },
  watch: {},
  mounted () {},
  methods: {
    // 打开弹窗
    open () {
      this.show = true
      this.bizApi.getUserSpace()
    },
    selectSpace (param) {
      this.spaceNodeList = param
    },

    submitSpace () {
      if (this.spaceNodeList && this.spaceNodeList.length == 0) {
        this.$hMessage.info({
          content: this.$t('hui.biz.space.validTip'),
          duration: 3,
          closable: true,
        })
        return false
      }
      this.bizApi
        .submitSpace(this.spaceNodeList[0])
        .then((res) => {
          this.$hMessage.success({
            content: this.$t('hui.biz.space.success'),
            duration: 3,
            closable: true,
          })
          this.$nextTick(() => {
            setTimeout(() => {
              location.reload()
            }, 500)
          })
        })
        .catch((err) => {
          if (err instanceof this.bizApi.Error) {
            this.$hMessage.error({
              content: err.message,
              duration: 3,
              closable: true,
            })
            return
          }
          this.$hMessage.error(this.$t('hui.ajax.error'))
        })
    },
  },
}
</script>
<style lang="css">
.h-layout-msg-box.h-biz-frame-layout-space .h-modal-content .h-modal-body {
  height: 250px;
  padding-right: 30px;
}
</style>
