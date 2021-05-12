<template >
    <div :class="_getCls('item')" @click="selectMenu">
        <span :class="_getCls('item-text')">{{data.label}}</span>
        <i v-if="_canFavour(data.originalValue)" :class="[ICON.star,_getCls('item-icon'),{
            'is-favour': data.originalValue.isFavour
        }]" @click.stop="toggleFavor"></i>
    </div>
</template>
<script>
const CONFIG = {
  PREFIX: 'h-layout',
  ICON: {
    star: 'layout-iconfont h-layout-icon-star'
  }
}
export default {
  name: 'LayoutSearchItem',
  inject: {
    CONFIG: { default: () => CONFIG },
    layout: {
      default: () => {
        return {}
      }
    },
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    } // options slot data
  },
  data () {
    this.ICON = this.CONFIG.ICON
    return {}
  },
  computed: {
    isInLayout () {
      return this.layout && this.layout._isVue
    }
  },
  methods: {
    _getCls (element = '') {
      const prefix = this.CONFIG.PREFIX
      return `${prefix}-search-${element}`
    },
    _canFavour (item = {}) {
      return item.canFavour || item.canFavour == undefined
    },
    toggleFavor (item) {
      const menu = this.data.originalValue
      if (this.isInLayout) {
        if (menu.isFavour) {
          this.layout.removeFavour(menu)
        } else {
          this.layout.addFavour(menu)
        }
      }
    },
    selectMenu () {
      const menu = this.data.originalValue
      if (this.isInLayout) {
        this.layout.sidebarSelect(menu)
      }
    }
  }
}
</script>
<style lang="scss">
// 搜索栏样式拆分
@import "~@hui/scss-utils";
$namespace: 'h';
@include b(layout-head-search-item){
    display: flex;
    justify-content: space-between;
    @include e(text){
        max-width: 80%;
        @include ellipsis();
    }

    @include e(icon){
        flex:none;
        color: #d9d9d9;
        @include when(favour){
            color:#ffc103;
        }
    }
}

</style>
