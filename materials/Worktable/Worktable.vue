<template>
  <div :class="`${prefixCls}-wrap`">
    <grid-layout
      :layout.sync="layout"
      :col-num="12"
      :row-height="48"
      :is-draggable="isEdit"
      :is-resizable="isEdit"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[8, 8]"
      :use-css-transforms="true"
    >
      <grid-item
        :class="gridItemCls(item)"
        v-for="item in layout"
        :key="item.i"
        :i="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :min-w="item.minW"
        :min-h="item.minH"
        :isDraggable="item.draggable"
        :isResizable="item.resizable"
        :static="item.static"
        @resize="resize"
        @move="move"
        @resized="resized"
        @moved="moved"
      >
        <div
          v-if="item.title"
          :class="`${prefixCls}-grid-item-title`"
        ><span>{{item.title}}</span></div>
        <div
          v-if="item.componentName"
          :class="`${prefixCls}-grid-item-content`"
        >
          <component v-bind="item" :is="item.componentName" />
        </div>
        <div
          v-else
          :class="`${prefixCls}-grid-item-content`"
          v-html="item.html || '暂无内容'"
        ></div>
        <i
          v-show="item.closable && !item.static"
          :class="[`${prefixCls}-grid-item-icon-close`, ICON.close]"
          @click="delGridItem(item)"
        ></i>
      </grid-item>
    </grid-layout>

    <div :class="`${prefixCls}-ctrl`" v-show="isEdit || !isUnderLayout">
      <div
        v-if="!isUnderLayout"
        :class="`${prefixCls}-ctrl-item`"
        @click="editGridLayout"
        v-text="'修改'"
      ></div>
      <div
        v-text="'新增'"
        :class="[`${prefixCls}-ctrl-item`, { 'is-not-cansave': !isCanSave }]"
        @click="createGridItem"
      ></div>
      <div
        v-text="'确定'"
        :class="`${prefixCls}-ctrl-item`"
        @click="confirmGridLayout"
      ></div>
      <div
        v-text="'取消'"
        :class="`${prefixCls}-ctrl-item`"
        @click="recoverGridLayout"
      ></div>
    </div>
  </div>
</template>
<script>
import PropTypes from '@hui/shared-utils/vue-types'
import { defaultsDeep, get, uuid, noop, cloneDeep } from '@hui/shared-utils/index'
import VueGridLayout from 'vue-grid-layout'
var defaultLayout = [
  { x: 0, y: 0, w: 2, h: 4, i: '0', title: '净值表现' },
  // { x: 2, y: 0, w: 2, h: 4, i: '1', title: '净值表现2', static: true },
  { x: 2, y: 0, w: 2, h: 4, i: '1', title: '净值表现' },
  { x: 4, y: 0, w: 2, h: 5, i: '2', title: '净值表现' },
  { x: 6, y: 0, w: 2, h: 3, i: '3', title: '净值表现' },
  { x: 8, y: 0, w: 2, h: 3, i: '4', title: '净值表现' },
  { x: 10, y: 0, w: 2, h: 3, i: '5', title: '净值表现' },
  { x: 0, y: 5, w: 2, h: 5, i: '6', title: '净值表现' },
  { x: 2, y: 5, w: 2, h: 5, i: '7', title: '净值表现' },
  { x: 4, y: 5, w: 2, h: 5, i: '8', title: '净值表现' },
  { x: 6, y: 3, w: 2, h: 4, i: '9', title: '净值表现' },
  { x: 8, y: 4, w: 2, h: 4, i: '10', title: '净值表现' },
  { x: 10, y: 4, w: 2, h: 4, i: '11', title: '净值表现' },
  { x: 0, y: 10, w: 2, h: 5, i: '12', title: '净值表现' },
  { x: 2, y: 10, w: 2, h: 5, i: '13', title: '净值表现' },
  { x: 4, y: 8, w: 2, h: 4, i: '14', title: '净值表现' },
  { x: 6, y: 8, w: 2, h: 4, i: '15', title: '净值表现' },
  { x: 8, y: 10, w: 2, h: 5, i: '16', title: '净值表现' },
  { x: 10, y: 4, w: 2, h: 2, i: '17', title: '净值表现' },
  { x: 0, y: 9, w: 2, h: 3, i: '18', title: '净值表现' },
  { x: 2, y: 6, w: 2, h: 2, i: '19', title: '净值表现' }
]
export default {
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  inject: {
    layoutInst: {
      from: 'layout',
      default: () => { return { } }
    }
  },
  props: {
    initGridData: PropTypes.array.def([]), // 点击重置恢复的数据源
    gridData: PropTypes.array.def(defaultLayout)
  },
  data () {
    // TODO layout 优化
    const initLayout = this.defaultFormatGridData(cloneDeep(this.gridData))
    this.prefixCls = 'h-worktable'
    this.ICON = {}
    this.ICON.close = 'layout-iconfont h-layout-icon-close'
    this.initLayout = cloneDeep(initLayout)
    return {
      layout: cloneDeep(initLayout),
      isCanSave: false, // 数据未改变时不可保存
      isEdit: true
    }
  },
  computed: {
    // 是否在 layout 框架下
    isUnderLayout () {
      const layoutInstName = get(this.layoutInst, '$options.name')
      const isUnderLayout = layoutInstName && layoutInstName == 'Layout'
      return isUnderLayout
    }
  },
  watch: {
    gridData (val) {
      const initLayout = this.defaultFormatGridData(cloneDeep(val))
      this.initLayout = cloneDeep(initLayout)
      this.layout = cloneDeep(initLayout)
    }
  },
  methods: {
    layoutCreatedEvent (newLayout) {
      // console.log("Created layout: ", newLayout)
    },
    layoutBeforeMountEvent (newLayout) {
      // console.log("beforeMount layout: ", newLayout)
    },
    layoutMountedEvent (newLayout) {
      // console.log("Mounted layout: ", newLayout)
    },
    layoutReadyEvent (newLayout) {
      // console.log("Ready layout: ", newLayout)
    },
    layoutUpdatedEvent (newLayout) {
      this.isCanSave = true
    },
    move (i, newX, newY) {
      // console.log("MOVE i=" + i + ", X=" + newX + ", Y=" + newY);
    },
    resize (i, newH, newW, newHPx, newWPx) {
      // console.log("RESIZE i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx);
    },
    moved (i, newX, newY) {
      // console.log("### MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
    },
    resized (i, newH, newW, newHPx, newWPx) {
      // console.log("### RESIZED i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx);
      this.layout.forEach((item, index) => {
        if (i == index) {
          item.width = Number(newWPx)
          item.height = Number(newHPx)
        }
      })
    },
    defaultFormatGridData (gridData) {
      return gridData.map(item =>
        defaultsDeep(
          {
            i: uuid(),
            minH: 2,
            minW: 2,
            closable: false,
          },
          item
        )
      )
    },
    editGridLayout () {
      this.layout.map(item => {
        item = Object.assign(item, {
          closable: true
        })
      })
      this.isEdit = true
      this.$emit('edit', cloneDeep(this.layout))
    },
    confirmGridLayout () {
      this.layout.map(item => {
        item = Object.assign(item, {
          closable: false
        })
      })
      this.isEdit = false
      this.$emit('confirm', cloneDeep(this.layout))
    },
    resetGridLayout () {
      this.layout = this.defaultFormatGridData(cloneDeep(this.initGridData))
      this.$emit('reset', cloneDeep(this.layout))
    },
    recoverGridLayout () {
      this.layout = cloneDeep(this.initLayout)
      this.isEdit = false
      this.$emit('recover', cloneDeep(this.layout))
    },
    gridItemCls (item) {
      return [`${this.prefixCls}-grid-item`, { 'is-has-title': item.title }]
    },
    createGridItem () {
      this.$emit('create-item')
    },
    delGridItem (gridItem) {
      const { i: gridUuid } = gridItem
      this.layout = this.layout.filter(item => item.i !== gridUuid)
      this.isCanSave = true
      this.$emit('delete-item', cloneDeep(gridItem), cloneDeep(this.layout))
    }
  },
  mounted () {
    if (this.isUnderLayout) {
      this.layoutInst.$on('reset-worktable', this.resetGridLayout)
      this.layoutInst.$on('edit-worktable', this.editGridLayout)
    }
  },
  beforeDestroy () {
    if (this.isUnderLayout) {
      this.layoutInst.$off('reset-worktable', this.resetGridLayout)
      this.layoutInst.$off('edit-worktable', this.editGridLayout)
    }
  }
}
</script>
<style lang="scss" scope>
@import "~@hui/scss-utils";
$prefixCls: ".h-worktable" !default;
$ctrl-width: 32px !default;
$ctrl-height: 35px !default;
$ctrl-border: 1px solid #dedede !default;
$ctrl-active: #3285ed !default;
$ctrl-bg: #fff !default;

$grid-item-bg: #fff;
$grid-item-space: 16px;
$grid-item-height: 14px + $grid-item-space * 2;
$grid-item-dot-color: #4686f2;
// $grid-item-dot-color: linear-gradient(180deg,#00c4ff 0,#0087ec 100%);

#{$prefixCls}-wrap {
  // 保证 layout 贴边
  width: calc(100% + 16px);
  overflow: hidden;
  margin: -8px;
  // .vue-grid-layout {
  // }

  // .vue-grid-item {
  //   background: pink;
  // }

  .vue-grid-item.vue-grid-placeholder {
    background: pink;
  }

  .vue-grid-item > .vue-resizable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: 0;
    right: 0;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAAH6Nf8rAAAAAXNSR0IArs4c6QAAAFtJREFUGBljYACCzYfPOzCCCIZ/DPtBAkChg+f/Q1joHLgoI4oauDBUPROyAE725kPnD2Cq/M9gjykINAOrIFZnMOK0ESoBcztWI7Fppr5CRpDnGYB+xWYdshgA+LEi69ozvGQAAAAASUVORK5CYII=);
    background-position: bottom right;
    padding: 0 3px 3px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: se-resize;
  }
}

#{$prefixCls}-grid-item {
  position: relative;
  padding: $grid-item-space;
  background: #fff;
  overflow: hidden;

  &.is-has-title {
    padding-top: $grid-item-height;
  }

  &-title {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 16px;
    color: #333;
    font-size: 12px;
    font-weight: bold;
    height: $grid-item-height;
    span {
      @include ellipsis();
    }

    &:before {
      content: "";
      width: 4px;
      height: 100%;
      background: $grid-item-dot-color;
      margin-right: 8px;
      flex:none;
    }
  }

  &-content {
    width: 100%;
    height: 100%;
    word-break: break-all;
    overflow: hidden;
    background: #f7f7f7;
    border-radius: 2px;
  }

  &-icon-close {
    position: absolute;
    right: 0;
    top: 0;
    color: #a1a1a1;
    cursor: pointer;
    &:hover {
      color: #4686f2;
    }
  }
}

#{$prefixCls}-ctrl {
  position: fixed;
  top: 50%;
  right: 8px;
  border: $ctrl-border;
  background: $ctrl-bg;
  box-shadow: 0 1px 6px 0 rgba(51, 51, 51, 0.15);
  &-item {
    height: $ctrl-height;
    line-height: $ctrl-height;
    width: $ctrl-width;
    text-align: center;
    border-bottom: $ctrl-border;
    user-select: none;
    cursor: pointer;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      color: $ctrl-active;
      border: 1px solid $ctrl-active;
    }

    &.is-not-cansave {
      cursor: not-allowed;
    }
  }
}
</style>
