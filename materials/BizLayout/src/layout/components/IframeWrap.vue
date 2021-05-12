<template>
  <div class="h-layout-iframe-wrap" data-hui-layout-iframe="true">
    <template v-if="KEEP_IFRAME_PAGE_ALIVE">
      <iframe
        ref="iframe"
        frameborder="0"
        scrolling="auto"
        v-for="item in keepAliveList"
        v-show="checkActive(item)"
        :key="item.uuid"
        :src="checkIframeUrl(item)"
      ></iframe>
    </template>

    <template v-else>
      <iframe ref="iframe" frameborder="0" scrolling="auto" :src="iframeSrc" :key="iframeSrc"></iframe>
    </template>
  </div>
</template>

<script>
import PropTypes from '@hui/shared-utils/vue-types'
import { get, isEmpty, qs } from '../../utils'
export default {
  name: 'LayoutFrameWrap',
  props: {
    // https://programmer.help/blogs/keep-alive-no-refresh-for-iframe-in-vue.html
    IFRAME_URL_PREFIX_MAP: PropTypes.any.def(get(window, ['FRAME_CONFIG', 'IFRAME_URL_PREFIX'], {})),
    KEEP_IFRAME_PAGE_ALIVE: PropTypes.any.def(get(window, ['FRAME_CONFIG', 'KEEP_IFRAME_PAGE_ALIVE'], false)),
  },
  inject: {
    bizLayout: { default () { return {} } }
  },
  data () {
    return {
      keepAliveList: [],
    }
  },
  computed: {
    activeMenuItem () {
      return this.bizLayout.activeMenuItem
    },
    iframeSrc () {
      return this.checkIframeUrl(this.activeMenuItem)
    },
    keepAliveUuidList () {
      return this.keepAliveList.map(item => item.uuid)
    }
  },
  watch: {
    activeMenuItem (val) {
      this.updateKeepList(val)
    }
  },
  methods: {
    toggleFrameTagToBody () {
      const classList = Array.from(document.body.classList)
      // 原 1.0 样式
      if (!classList.includes('bizframe')) {
        document.body.classList.add('bizframe')
      } else {
        document.body.classList.remove('bizframe')
      }
      if (!classList.includes('hui-biz-iframe')) {
        document.body.classList.add('hui-biz-iframe')
      } else {
        document.body.classList.remove('hui-biz-iframe')
      }
    },
    checkIframeUrl (menuItem) {
      // TODO iframe 前缀
      const IFRAME_URL_PREFIX_MAP = this.IFRAME_URL_PREFIX_MAP
      const url = menuItem.url
      const appCode = get(menuItem, 'originData.kind_code')
      const menuArg = get(menuItem, 'originData.menu_arg', '')
      const query = Object.assign(get(menuItem, 'query', {}), qs.parse(menuArg))
      const queryString = isEmpty(query) ? '' : '?' + qs.stringify(query)
      const appIframeApiPrefix = IFRAME_URL_PREFIX_MAP[appCode] || '//'
      // TODO URL 完整性校验
      const hasProtocol = /^http|https/.test(url)
      if (!hasProtocol) {
        return appIframeApiPrefix + url + queryString
      }
      return url + queryString
    },
    checkActive (item) {
      return item.uuid == this.activeMenuItem.uuid
    },
    updateKeepList (activeMenuItem) {
      // TODO tip
      if (!this.KEEP_IFRAME_PAGE_ALIVE) return
      if (get(activeMenuItem, 'originData.menu_type') !== 'iframe') return
      if (this.keepAliveUuidList.includes(activeMenuItem.uuid)) return
      this.keepAliveList.push(activeMenuItem)
    }
  },
  mounted () {
    this.updateKeepList(this.activeMenuItem)
    this.toggleFrameTagToBody()
  },
  beforeDestroy () {
    this.toggleFrameTagToBody()
  }

}
</script>

<style scoped>
.h-layout-iframe-wrap {
  font-size: 0;
}
.h-layout-iframe-wrap iframe{
  display: block;
  width: 100%;
  height: 100%;
}
</style>
