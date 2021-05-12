<template>
  <h-msg-box
    v-model="showMsgbox"
    :class="_B()"
    transfer
    width="413"
    heigth="462"
    :title="$t('hui.frameLayout.sysSortTitle')"
    :mask-closable="false"
    @on-close="handleCancle"
  >
    <div :class="_B('table-wrap')">
      <div :class="_B('table')">
        <div :class="[_B('table-head'), _B('table-tr')]">
          <div :class="_B('table-td')" v-for="(s, i) in tableHead" :key="i" v-text="s"></div>
        </div>

        <h-layout-drag
          :value="systemList"
          :class="_B('table-body')"
          :setData="() => {}"
          :move="noop"
          @end="noop"
          @input="changeSystemList"
        >
          <!-- :handle="_B('table-ctrl')" -->
          <div :class="_B('table-tr')" v-for="(s, i) in systemList" :key="s.uuid || i">
            <div :class="_B('table-td')">{{ i + 1 }}</div>
            <div :class="_B('table-td')">{{ s.title }}</div>
            <div :class="[_B('table-td'), _B('table-ctrl')]">
              <i :class="[_B('table-td-drag'), icon.drag]"></i>
            </div>
          </div>
        </h-layout-drag>
      </div>
    </div>

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
</template>
<script>
import { cloneDeep } from '@hui/shared-utils'
import CONFIG from '../../config'

export default {
  name: 'LayoutSysSort',
  props: {
    systemList: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  inject: {
    layout: { default: () => {} },
    topbar: { default: () => {} },
    CONFIG: { default: () => CONFIG },
  },
  data () {
    this.prefix = 'h' || this.CONFIG.PREFIX
    this.block = `${this.prefix}-layout-sys-sort`
    this.icon = this.CONFIG.ICON
    // 缓存系统列表，取消时还原
    this.systemListCache = []
    return {
      showMsgbox: false,
      tableHead: ['序号', '子系统', '排序'],
    }
  },
  methods: {
    _B (element) {
      if (!element) {
        return this.block
      }
      return `${this.block}-${element}`
    },
    open () {
      this.showMsgbox = true
      this.systemListCache = cloneDeep(this.systemList)
    },
    handleCancle () {
      this.showMsgbox = false
      console.log('recover', this.systemListCache)
      this.$emit('update:systemList', this.systemListCache)
    },
    handleConfirm () {
      this.showMsgbox = false
    },
    noop () {},
    changeSystemList (newList) {
      this.$emit('update:systemList', newList)
    },
  },
  created () {},
  mounted () {},
}
</script>
<style lang="scss">
@import '~@hui/scss-utils';

$namespace: 'h';
$element-separator: '-';
$modifier-separator: '-';
$state-prefix: 'is-';

@include b(layout-sys-sort) {
  @include e(table) {
    width: 365px;

    position: relative;
    border: 1px solid #d7dde4;
    border-bottom: 0;
    border-right: 0;
  }

  @include e(table-head) {
    background: #f6f8fa;
    @include e(table-td) {
      border-right: 1px solid #d9d9d9;
      user-select: none;
    }
  }

  @include e(table-tr) {
    display: flex;
    width: 100%;
    &:nth-child(2n) {
      background-color: #f6f8fa;
    }
  }

  @include e(table-td) {
    flex: auto;
    height: 32px;
    line-height: 32px;
    box-sizing: border-box;
    text-align: left;
    font-size: 12px;
    vertical-align: middle;
    border-bottom: 1px solid #d9d9d9;
    padding: 0 8px;
    user-select: text;
    @include ellipsis();

    @include hui-when(border) {
      border-right: 1px solid #d9d9d9;
    }

    &:first-child {
      flex: none;
      width: 50px;
    }

    &:last-child {
      flex: none;
      width: 120px;
      border-right: 1px solid #d9d9d9;
      cursor: move;
    }
  }

  @include e(table-ctrl){
    &:hover{
      color:#4686F2
    }
  }

  .h-modal-content .h-modal-body {
    max-height: 370px;
    min-height: 250px;
    height: auto;
    padding: 20px;
    overflow: auto;
    display: block;
  }
}
</style>
